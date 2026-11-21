create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('Electronics', 'Accessories', 'Home Essentials', 'Fashion', 'Gadgets')),
  price numeric(12, 2) not null check (price > 0),
  stock integer not null default 0 check (stock >= 0),
  description text not null,
  image text not null,
  label text not null default 'JUST ADDED',
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin'))
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer jsonb not null,
  payment_method text not null check (payment_method in ('mpesa', 'card', 'bank')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'demo_paid', 'paid', 'failed', 'refunded')),
  order_status text not null default 'Pending' check (order_status in ('Pending', 'Processing', 'Completed', 'Cancelled')),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  delivery_fee numeric(12, 2) not null check (delivery_fee >= 0),
  total numeric(12, 2) not null check (total = subtotal + delivery_fee),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price > 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.products enable row level security;
alter table public.user_roles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Anyone can read the product catalogue"
  on public.products for select to anon, authenticated using (true);
create policy "Admins can manage products"
  on public.products for all to authenticated
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'))
  with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
create policy "Users can read their own role"
  on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "Admins can read orders"
  on public.orders for select to authenticated
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
create policy "Admins can update orders"
  on public.orders for update to authenticated
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'))
  with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
create policy "Admins can read order items"
  on public.order_items for select to authenticated
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.user_roles to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;

create or replace function public.create_order_atomic(
  p_customer jsonb,
  p_items jsonb,
  p_payment_method text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_order_id uuid := gen_random_uuid();
  v_reference text := 'UC-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  v_subtotal numeric(12, 2) := 0;
  v_delivery numeric(12, 2);
  v_quantity integer;
  v_snapshots jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(p_customer) <> 'object'
    or nullif(trim(p_customer->>'name'), '') is null
    or nullif(trim(p_customer->>'phone'), '') is null
    or nullif(trim(p_customer->>'email'), '') is null
    or nullif(trim(p_customer->>'address'), '') is null
    or nullif(trim(p_customer->>'county'), '') is null
    or nullif(trim(p_customer->>'town'), '') is null then
    raise exception 'Complete all customer and delivery details.';
  end if;
  if p_payment_method not in ('mpesa', 'card', 'bank') then
    raise exception 'Choose a supported demo payment method.';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 30 then
    raise exception 'Your order must contain between 1 and 30 products.';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item->'quantity') <> 'number' then
      raise exception 'Invalid product quantity.';
    end if;
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity < 1 or v_quantity > 20 then
      raise exception 'Product quantity must be between 1 and 20.';
    end if;

    select * into v_product
      from public.products
      where id = v_item->>'productId'
      for update;
    if not found then
      raise exception 'A product in your order is no longer available.';
    end if;
    if v_product.stock < v_quantity then
      raise exception 'There is not enough stock for %.', v_product.name;
    end if;

    update public.products set stock = stock - v_quantity where id = v_product.id;
    v_subtotal := v_subtotal + v_product.price * v_quantity;
    v_snapshots := v_snapshots || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'quantity', v_quantity,
      'unit_price', v_product.price
    ));
  end loop;

  v_delivery := case when v_subtotal >= 5000 then 0 else 250 end;
  insert into public.orders (id, order_reference, customer, payment_method, payment_status, order_status, subtotal, delivery_fee, total)
    values (v_order_id, v_reference, p_customer, p_payment_method, 'pending', 'Pending', v_subtotal, v_delivery, v_subtotal + v_delivery);

  insert into public.order_items (order_id, product_id, product_name, quantity, unit_price)
    select v_order_id, item->>'product_id', item->>'product_name',
      (item->>'quantity')::integer, (item->>'unit_price')::numeric
    from jsonb_array_elements(v_snapshots) as snapshot(item);

  return jsonb_build_object(
    'orderReference', v_reference,
    'subtotal', v_subtotal,
    'deliveryFee', v_delivery,
    'total', v_subtotal + v_delivery
  );
end;
$$;

revoke all on function public.create_order_atomic(jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function public.create_order_atomic(jsonb, jsonb, text) to service_role;

insert into public.products (id, name, category, price, stock, description, image, label) values
  ('soundcore-a20i', 'Soundcore A20i Earbuds', 'Electronics', 3499, 18, 'Pocket-sized sound with 28 hours of playtime.', 'photo-1606220945770-b5b6c2c55bf1', 'BESTSELLER'),
  ('everyday-tote', 'Everyday Canvas Tote', 'Accessories', 1450, 25, 'A roomy, sturdy carry-all for everywhere you go.', 'photo-1544816155-12df9643f363', 'MADE FOR DAILY'),
  ('ceramic-set', 'Stoneware Mug Set', 'Home Essentials', 2200, 12, 'Two hand-finished mugs for slower mornings.', 'photo-1514228742587-6b1558fcca3d', 'SMALL BATCH'),
  ('weekender-bag', 'The Weekender Bag', 'Fashion', 5800, 7, 'A considered travel companion with room to spare.', 'photo-1553062407-98eeb64c6a62', 'POPULAR'),
  ('smart-lamp', 'Aura Smart Lamp', 'Gadgets', 4200, 9, 'Warm, adjustable light for a better wind-down.', 'photo-1507473885765-e6ed057f782c', 'NEW IN'),
  ('wireless-charger', 'Foldable Wireless Stand', 'Electronics', 2800, 16, 'A tidy, fast-charging home for your phone.', 'photo-1586953208448-b95a79798f07', 'CUSTOMER FAVOURITE'),
  ('travel-bottle', 'Insulated Travel Bottle', 'Home Essentials', 1850, 21, 'Keep your drink just right from commute to coast.', 'photo-1602143407151-7111542de6e8', 'EASY EVERYDAY'),
  ('minimal-wallet', 'Minimal Card Wallet', 'Accessories', 1950, 0, 'A slim profile that keeps the essentials close.', 'photo-1627123424574-724758594e93', 'JUST LANDED')
on conflict (id) do nothing;
