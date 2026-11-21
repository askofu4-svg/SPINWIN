import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const initialProducts = [
  { id: 'soundcore-a20i', name: 'Soundcore A20i Earbuds', category: 'Electronics', price: 3499, stock: 18, description: 'Pocket-sized sound with 28 hours of playtime.', image: 'photo-1606220945770-b5b6c2c55bf1', label: 'BESTSELLER' },
  { id: 'everyday-tote', name: 'Everyday Canvas Tote', category: 'Accessories', price: 1450, stock: 25, description: 'A roomy, sturdy carry-all for everywhere you go.', image: 'photo-1544816155-12df9643f363', label: 'MADE FOR DAILY' },
  { id: 'ceramic-set', name: 'Stoneware Mug Set', category: 'Home Essentials', price: 2200, stock: 12, description: 'Two hand-finished mugs for slower mornings.', image: 'photo-1514228742587-6b1558fcca3d', label: 'SMALL BATCH' },
  { id: 'weekender-bag', name: 'The Weekender Bag', category: 'Fashion', price: 5800, stock: 7, description: 'A considered travel companion with room to spare.', image: 'photo-1553062407-98eeb64c6a62', label: 'POPULAR' },
  { id: 'smart-lamp', name: 'Aura Smart Lamp', category: 'Gadgets', price: 4200, stock: 9, description: 'Warm, adjustable light for a better wind-down.', image: 'photo-1507473885765-e6ed057f782c', label: 'NEW IN' },
  { id: 'wireless-charger', name: 'Foldable Wireless Stand', category: 'Electronics', price: 2800, stock: 16, description: 'A tidy, fast-charging home for your phone.', image: 'photo-1586953208448-b95a79798f07', label: 'CUSTOMER FAVOURITE' },
  { id: 'travel-bottle', name: 'Insulated Travel Bottle', category: 'Home Essentials', price: 1850, stock: 21, description: 'Keep your drink just right from commute to coast.', image: 'photo-1602143407151-7111542de6e8', label: 'EASY EVERYDAY' },
  { id: 'minimal-wallet', name: 'Minimal Card Wallet', category: 'Accessories', price: 1950, stock: 0, description: 'A slim profile that keeps the essentials close.', image: 'photo-1627123424574-724758594e93', label: 'JUST LANDED' },
];
const categories = [
  { name: 'Electronics', image: 'photo-1498049794561-7780e7231661', note: 'Good tech, made simple' },
  { name: 'Accessories', image: 'photo-1523275335684-37898b6baf30', note: 'The finishing touches' },
  { name: 'Home Essentials', image: 'photo-1600210492486-724fe5c67fb0', note: 'Make home feel more you' },
  { name: 'Fashion', image: 'photo-1483985988355-763728e1935b', note: 'Everyday, with intention' },
  { name: 'Gadgets', image: 'photo-1496171367470-9ed9a91ea931', note: 'Clever little upgrades' },
];
const testimonials = [
  { quote: 'My order arrived the next day, beautifully packed. It felt like shopping with a friend who just gets it.', name: 'Wanjiku M.', location: 'Nairobi' },
  { quote: 'Finally, an online shop where what you see is exactly what shows up. I’m already planning my next order.', name: 'Brian K.', location: 'Mombasa' },
  { quote: 'The little details made all the difference. Easy checkout, lovely products, and genuinely helpful support.', name: 'Amina O.', location: 'Kisumu' },
];
const counties = ['Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang’a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'];
const money = (value) => `KES ${Number(value || 0).toLocaleString('en-KE')}`;
const imageUrl = (image, width = 720) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
const load = (key, fallback) => {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : fallback; } catch { return fallback; }
};

function Icon({ name, size = 20 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const path = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };
  return <svg {...props}>{path[name]}</svg>;
}

function App() {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState(() => load('uc-products', initialProducts));
  const [cart, setCart] = useState(() => load('uc-cart', {}));
  const [orders, setOrders] = useState(() => load('uc-orders', []));
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentRequested, setPaymentRequested] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', county: '', town: '' });
  const [lastOrder, setLastOrder] = useState(() => load('uc-last-order', null));
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Electronics', price: '', stock: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const cartItems = useMemo(() => Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product), [cart, products]);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
  const total = subtotal + deliveryFee;
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  useEffect(() => { localStorage.setItem('uc-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('uc-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('uc-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { if (lastOrder) localStorage.setItem('uc-last-order', JSON.stringify(lastOrder)); }, [lastOrder]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!supabase) return undefined;
    const authorizeSession = async (user) => {
      if (!user) { setAdminUser(null); return; }
      const { data: role, error } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle();
      if (error) {
        setAdminUser(null);
        setAdminMessage(error.message);
      } else if (role?.role === 'admin') {
        setAdminUser(user);
      } else {
        setAdminUser(null);
        setAdminMessage('This account does not have administrator access.');
      }
    };
    supabase.auth.getSession().then(({ data }) => authorizeSession(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => { void authorizeSession(session?.user ?? null); }, 0);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.from('products').select('*').order('created_at', { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setToast(`Catalogue could not be loaded: ${error.message}`);
        return;
      }
      if (data) setProducts(data.map((product) => ({ ...product, price: Number(product.price) })));
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!supabase || !adminUser) return undefined;
    let active = true;
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: true }),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
    ]).then(([productResult, orderResult]) => {
      if (!active) return;
      if (productResult.error || orderResult.error) {
        setAdminMessage(productResult.error?.message || orderResult.error?.message || 'Admin data could not be loaded.');
        return;
      }
      setProducts((productResult.data || []).map((product) => ({ ...product, price: Number(product.price) })));
      setOrders((orderResult.data || []).map((order) => ({
        reference: order.order_reference,
        customer: order.customer,
        items: (order.order_items || []).map((item) => ({
          id: item.product_id,
          name: item.product_name,
          price: Number(item.unit_price),
          quantity: item.quantity,
        })),
        subtotal: Number(order.subtotal),
        delivery: Number(order.delivery_fee),
        total: Number(order.total),
        method: order.payment_method,
        status: order.order_status,
        createdAt: order.created_at,
      })));
    });
    return () => { active = false; };
  }, [adminUser]);

  const go = (nextPage) => { setPage(nextPage); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const showCategory = (name) => { setCategory(name); go('shop'); };
  const addToCart = (product) => {
    if (!product.stock) return;
    setCart((current) => ({ ...current, [product.id]: Math.min((current[product.id] || 0) + 1, product.stock) }));
    setToast(`${product.name} added to your bag`);
  };
  const adjustQuantity = (id, amount) => setCart((current) => {
    const quantity = (current[id] || 0) + amount;
    if (quantity <= 0) { const next = { ...current }; delete next[id]; return next; }
    const product = products.find((item) => item.id === id);
    return { ...current, [id]: Math.min(quantity, product?.stock || quantity) };
  });
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = products.filter((product) => (category === 'All' || product.category === category) && (!normalized || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized)));
    if (sortBy === 'price-low') matches.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') matches.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') matches.sort((a, b) => a.name.localeCompare(b.name));
    return matches;
  }, [products, category, query, sortBy]);

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!cartItems.length || submitting) return;
    setSubmitting(true);
    setAdminMessage('');
    let orderReference = `UC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    let orderTotal = total;
    let orderDelivery = deliveryFee;
    let status = paymentMethod === 'bank' ? 'Pending' : 'Demo Paid';
    try {
      if (supabase) {
        const { data, error } = await supabase.functions.invoke('create-order', {
          body: { customer, paymentMethod, items: cartItems.map(({ product, quantity }) => ({ productId: product.id, quantity })) },
        });
        if (error) throw error;
        orderReference = data.orderReference;
        orderTotal = data.total;
        orderDelivery = data.deliveryFee;
        status = 'Pending';
      }
      const order = {
        reference: orderReference, customer: { ...customer },
        items: cartItems.map(({ product, quantity }) => ({ ...product, quantity })),
        subtotal: orderTotal - orderDelivery, delivery: orderDelivery, total: orderTotal,
        method: paymentMethod, status, createdAt: new Date().toISOString(),
      };
      setOrders((current) => [order, ...current]);
      setLastOrder(order);
      setCart({});
      setPaymentRequested(false);
      go('confirmation');
    } catch (error) {
      setAdminMessage(error.message || 'We could not place your order. Please try again.');
    } finally { setSubmitting(false); }
  };
  const signInAdmin = async (event) => {
    event.preventDefault();
    setAdminMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
    if (error) { setAdminMessage(error.message); return; }
    const { data: role, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle();
    if (roleError || role?.role !== 'admin') {
      await supabase.auth.signOut();
      setAdminMessage(roleError?.message || 'This account does not have administrator access.');
      return;
    }
    setAdminUser(data.user);
  };
  const signOutAdmin = async () => { if (supabase) await supabase.auth.signOut(); setAdminUser(null); };
  const addProduct = async (event) => {
    event.preventDefault();
    const product = { ...newProduct, id: `custom-${Date.now()}`, price: Number(newProduct.price), stock: Number(newProduct.stock), image: 'photo-1523275335684-37898b6baf30', label: 'JUST ADDED' };
    if (supabase) {
      const { error } = await supabase.from('products').insert(product);
      if (error) { setAdminMessage(error.message); return; }
    }
    setProducts((current) => [product, ...current]);
    setNewProduct({ name: '', category: 'Electronics', price: '', stock: '', description: '' });
    setAdminMessage('');
    setToast('Product added to your catalogue');
  };
  const removeProduct = async (id) => {
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) { setAdminMessage(error.message); return; }
    }
    setProducts((current) => current.filter((item) => item.id !== id));
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };
  const updateOrderStatus = async (reference, status) => {
    if (supabase) {
      const { error } = await supabase.from('orders').update({ order_status: status }).eq('order_reference', reference);
      if (error) { setAdminMessage(error.message); return; }
    }
    setOrders((current) => current.map((order) => order.reference === reference ? { ...order, status } : order));
    setLastOrder((current) => current?.reference === reference ? { ...current, status } : current);
    setAdminMessage('');
  };

  const ProductCard = ({ product }) => <article className="product-card">
    <button className="product-image-button" type="button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}>
      <img className="product-image" src={imageUrl(product.image, 700)} alt={product.name} loading="lazy" />
      <span className="product-label">{product.label}</span><span className={`stock-dot ${product.stock ? '' : 'sold-out'}`}>{product.stock ? 'In stock' : 'Sold out'}</span>
    </button>
    <div className="product-info"><div className="product-category">{product.category}</div><h3>{product.name}</h3><p>{product.description}</p>
      <div className="product-buy"><strong>{money(product.price)}</strong><button type="button" className="add-button" onClick={() => addToCart(product)} disabled={!product.stock} aria-label={`Add ${product.name} to cart`}><Icon name="plus" size={17} /></button></div>
    </div>
  </article>;
  const ProductGrid = ({ items }) => items.length ? <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="empty-mark">○</span><h3>No pieces found</h3><p>Try another search or browse a different category.</p></div>;
  const Header = () => <>
    <div className="announcement"><Icon name="truck" size={15} /><span>Thoughtful finds, delivered across Kenya</span><span className="announcement-separator">•</span><span>Free delivery on orders over KES 5,000</span></div>
    <header className="site-header">
      <button className="brand" type="button" onClick={() => go('home')} aria-label="SPINWIN home"><span className="brand-mark">s<span>.</span></span><span className="brand-name">SPINWIN<span>KENYA</span></span></button>
      <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`} aria-label="Main navigation">
        <button className={page === 'home' ? 'active' : ''} onClick={() => go('home')}>Home</button><button className={page === 'shop' ? 'active' : ''} onClick={() => { setCategory('All'); go('shop'); }}>Shop</button><button onClick={() => go('about')}>About us</button><button onClick={() => go('contact')}>Contact</button><button onClick={() => go('account')}>My account</button><button className="mobile-admin-link" onClick={() => go('admin')}>Admin</button>
      </nav>
      <div className="header-actions">
        <form className={`search-box ${searchOpen ? 'search-open' : ''}`} onSubmit={(event) => { event.preventDefault(); setCategory('All'); setSearchOpen(false); go('shop'); }}><button type="button" className="search-toggle" aria-label="Show product search" onClick={() => setSearchOpen((open) => !open)}><Icon name="search" size={18} /></button><input aria-label="Search products" placeholder="Search for anything..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></form>
        <button className="cart-button" type="button" onClick={() => go('cart')} aria-label={`Shopping bag, ${cartCount} items`}><Icon name="bag" size={21} /><span className="cart-text">Bag</span>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
        <button className="menu-toggle" type="button" aria-label="Toggle menu" onClick={() => setMobileMenu((open) => !open)}><Icon name={mobileMenu ? 'close' : 'menu'} /></button>
      </div>
    </header>
  </>;
  const SectionHeading = ({ eyebrow, title, copy, action, onAction }) => <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
    {action && <button className="text-link" type="button" onClick={onAction}>{action}<Icon name="arrow" size={18} /></button>}
  </div>;
  const OrderTotals = ({ items = cartItems, order = null }) => {
    const sub = order ? order.subtotal : items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const delivery = order ? order.delivery : (sub === 0 || sub >= 5000 ? 0 : 250);
    return <div className="totals"><div><span>Subtotal</span><strong>{money(sub)}</strong></div><div><span>Delivery</span><strong>{delivery ? money(delivery) : 'Complimentary'}</strong></div><div className="total-line"><span>Total</span><strong>{money(order ? order.total : sub + delivery)}</strong></div></div>;
  };

  const renderHome = () => <main>
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line" /> A LITTLE MORE INTENTIONAL</span><h1>Shop Smarter.<br /><span>Get What You Need.</span></h1><p>Everyday essentials, thoughtful finds, and small upgrades that make a big difference — all in one place.</p><div className="hero-actions"><button className="button button-dark" onClick={() => { setCategory('All'); go('shop'); }}>Shop now <Icon name="arrow" size={18} /></button><button className="button button-quiet" onClick={() => go('about')}>Our story</button></div><div className="hero-proof"><div className="avatar-stack"><span>W</span><span>B</span><span>A</span><span>+</span></div><div><strong>Loved by 2,000+ shoppers</strong><small>Thoughtfully picked. Happily delivered.</small></div></div></div>
      <div className="hero-visual"><div className="hero-photo"><img src={imageUrl('photo-1490481651871-ab68de25d43d', 1100)} alt="A thoughtfully styled wardrobe of everyday essentials" /></div><div className="hero-note"><span className="note-icon">✳</span><div><strong>Good things,</strong><br /><span>just around the corner.</span></div></div><div className="hero-index">01 <span>/</span> 04</div><div className="hero-sticker"><span>GOOD<br />FINDS</span><span>↘</span></div></div>
    </section>
    <div className="benefit-strip"><div><span className="benefit-icon"><Icon name="truck" /></span><span><strong>Delivery, your way</strong><small>Across all 47 counties</small></span></div><div><span className="benefit-icon">↺</span><span><strong>Easy 7-day returns</strong><small>Changed your mind? No worries.</small></span></div><div><span className="benefit-icon"><Icon name="lock" /></span><span><strong>Checkout with confidence</strong><small>Safe, secure & straightforward</small></span></div></div>
    <section className="section categories-section"><SectionHeading eyebrow="FIND YOUR SOMETHING" title="A good place to start." copy="Little upgrades for wherever life takes you." action="Explore everything" onAction={() => { setCategory('All'); go('shop'); }} /><div className="category-grid">{categories.map((item, index) => <button className={`category-card category-card-${index + 1}`} type="button" key={item.name} onClick={() => showCategory(item.name)}><img src={imageUrl(item.image, 760)} alt="" loading="lazy" /><span className="category-shade" /><span className="category-copy"><small>{item.note}</small><strong>{item.name}</strong></span><span className="category-arrow"><Icon name="arrow" size={19} /></span></button>)}</div></section>
    <section className="section featured-section"><SectionHeading eyebrow="THE GOOD STUFF" title="Good things, picked for you." copy="Our little list of things worth making room for." action="Shop all finds" onAction={() => { setCategory('All'); go('shop'); }} /><ProductGrid items={products.filter((item) => item.stock > 0).slice(0, 4)} /></section>
    <section className="editorial"><div className="editorial-image"><img src={imageUrl('photo-1600210492486-724fe5c67fb0', 1050)} alt="A considered, comfortable home interior" loading="lazy" /><span className="editorial-stamp">MADE FOR<br />REAL LIFE</span></div><div className="editorial-copy"><span className="eyebrow">A BETTER KIND OF EVERYDAY</span><h2>Less scrolling.<br /><em>More finding.</em></h2><p>We believe the best things aren’t always the loudest. So we bring together useful, well-made finds you’ll reach for again and again — without the endless search.</p><button className="button button-dark" onClick={() => go('about')}>Get to know us <Icon name="arrow" size={18} /></button><span className="editorial-footnote">A small shop with a big heart, right here in Kenya.</span></div></section>
    <section className="section popular-section"><SectionHeading eyebrow="A GOOD PLACE TO BEGIN" title="The ones you keep coming back to." action="See all bestsellers" onAction={() => { setCategory('All'); go('shop'); }} /><ProductGrid items={products.filter((item) => item.stock > 0).slice(4, 8).concat(products.filter((item) => item.stock > 0).slice(0, 2))} /></section>
    <section className="testimonial-section"><div className="testimonial-heading"><span className="eyebrow">KIND WORDS, REAL PEOPLE</span><h2>Good things are<br />better shared.</h2><div className="rating"><span>★★★★★</span><strong>4.9 / 5</strong><small>from our lovely customers</small></div></div><div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><div className="quote-mark">“</div><p>{item.quote}</p><div className="testimonial-author"><span className="author-avatar">{item.name[0]}</span><span><strong>{item.name}</strong><small><Icon name="pin" size={13} /> {item.location}, Kenya</small></span><span className="author-stars">★★★★★</span></div></article>)}</div></section>
    <section className="newsletter"><div><span className="eyebrow">A GOOD EMAIL, NOW AND THEN</span><h2>A little something<br />for your inbox.</h2><p>New finds, thoughtful notes, and the occasional little treat. No noise, promise.</p></div><form onSubmit={(event) => { event.preventDefault(); setToast('You’re on the list — see you in your inbox!'); event.currentTarget.reset(); }}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button type="submit" className="button button-dark">Count me in <Icon name="arrow" size={18} /></button><small>By subscribing, you agree to our Privacy Policy.</small></form><span className="newsletter-flower">✳</span></section>
  </main>;

  const renderShop = () => <main className="page-main shop-page"><div className="page-intro"><span className="eyebrow">THE SPINWIN EDIT</span><h1>Find your next <em>favourite.</em></h1><p>Useful little upgrades and thoughtful finds for everyday life.</p></div><div className="shop-toolbar"><div className="category-pills"><button className={category === 'All' ? 'selected' : ''} onClick={() => setCategory('All')}>Everything <span>{products.length}</span></button>{categories.map((item) => <button key={item.name} className={category === item.name ? 'selected' : ''} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div><label className="sort-control">Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div>{query && <div className="search-result-label">Showing results for <strong>“{query}”</strong><button onClick={() => setQuery('')}>Clear search</button></div>}<ProductGrid items={filteredProducts} /><p className="catalogue-count">Showing {filteredProducts.length} of {products.length} thoughtfully picked finds</p></main>;

  const renderCart = () => <main className="page-main"><div className="page-intro compact-intro"><span className="eyebrow">YOUR LITTLE COLLECTION</span><h1>Your shopping bag<span className="heading-period">.</span></h1><p>Good choices. Let’s make them yours.</p></div>{!cartItems.length ? <div className="empty-state cart-empty"><span className="empty-mark"><Icon name="bag" size={32} /></span><h3>Your bag is taking a breather.</h3><p>Find something good to bring home.</p><button className="button button-dark" onClick={() => go('shop')}>Explore the shop <Icon name="arrow" size={18} /></button></div> : <div className="cart-layout"><div className="cart-list">{cartItems.map(({ product, quantity }) => <article className="cart-row" key={product.id}><img src={imageUrl(product.image, 360)} alt={product.name} /><div className="cart-item-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{money(product.price)}</p><span className="cart-stock">{product.stock} available</span></div><div className="cart-row-controls"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => adjustQuantity(product.id, -1)}><Icon name="minus" size={15} /></button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => adjustQuantity(product.id, 1)}><Icon name="plus" size={15} /></button></div><strong>{money(product.price * quantity)}</strong><button className="remove-button" onClick={() => adjustQuantity(product.id, -quantity)}>Remove</button></div></article>)}</div><aside className="order-card"><span className="eyebrow">THE IMPORTANT BITS</span><h2>Order summary</h2><OrderTotals /><p className="delivery-note"><Icon name="truck" size={17} />{subtotal >= 5000 ? 'You’ve unlocked complimentary delivery!' : `Add ${money(5000 - subtotal)} more for free delivery.`}</p><button className="button button-dark checkout-cta" onClick={() => go('checkout')}>Continue to checkout <Icon name="arrow" size={18} /></button><button className="continue-shopping" onClick={() => go('shop')}>Keep browsing</button><div className="secure-note"><Icon name="lock" size={15} /> Safe and secure checkout</div></aside></div>}</main>;

  const renderCheckout = () => <main className="page-main checkout-page"><div className="page-intro compact-intro"><span className="eyebrow">ALMOST YOURS</span><h1>Let’s get it to you<span className="heading-period">.</span></h1><p>Just the details we need to get your good things on their way.</p></div>{!cartItems.length ? <div className="empty-state cart-empty"><h3>Your bag is empty.</h3><button className="button button-dark" onClick={() => go('shop')}>Back to the shop</button></div> : <form className="checkout-layout" onSubmit={submitOrder}>
    <div className="checkout-fields"><section className="form-section"><div className="form-section-heading"><span className="form-step">01</span><div><h2>Who’s receiving the good stuff?</h2><p>We’ll only use these details for your order.</p></div></div><div className="form-grid">
      <label className="field full-field">Full name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="e.g. Wanjiku Mwangi" /></label>
      <label className="field">Phone number<input required type="tel" autoComplete="tel" pattern="[+0-9 \(\)\-]{9,20}" value={customer.phone} onChange={(event) => { setCustomer({ ...customer, phone: event.target.value }); if (!paymentPhone) setPaymentPhone(event.target.value); }} placeholder="+254 7XX XXX XXX" /></label>
      <label className="field">Email address<input required type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} placeholder="you@example.com" /></label>
      <label className="field full-field">Delivery address<input required autoComplete="street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="Building, street, estate or landmark" /></label>
      <label className="field">County<select required value={customer.county} onChange={(event) => setCustomer({ ...customer, county: event.target.value })}><option value="">Choose your county</option>{counties.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label className="field">Town / area<input required autoComplete="address-level2" value={customer.town} onChange={(event) => setCustomer({ ...customer, town: event.target.value })} placeholder="e.g. Westlands" /></label>
    </div></section>
    <section className="form-section payment-section"><div className="form-section-heading"><span className="form-step">02</span><div><h2>How would you like to pay?</h2><p>Demo payments only — no real money moves.</p></div></div><div className="payment-options">
      <label className={`payment-option ${paymentMethod === 'mpesa' ? 'payment-selected' : ''}`}><input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => { setPaymentMethod('mpesa'); setPaymentRequested(false); }} /><span className="payment-brand mpesa-brand">M</span><span><strong>M-Pesa</strong><small>Pay by mobile money</small></span><span className="radio-dot" /></label>
      <label className={`payment-option ${paymentMethod === 'card' ? 'payment-selected' : ''}`}><input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => { setPaymentMethod('card'); setPaymentRequested(false); }} /><span className="payment-brand card-brand">▰</span><span><strong>Debit / Credit card</strong><small>Visa · Mastercard · demo only</small></span><span className="radio-dot" /></label>
      <label className={`payment-option ${paymentMethod === 'bank' ? 'payment-selected' : ''}`}><input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => { setPaymentMethod('bank'); setPaymentRequested(false); }} /><span className="payment-brand bank-brand">▤</span><span><strong>Bank transfer</strong><small>Instructions after placing order</small></span><span className="radio-dot" /></label>
    </div>
    {paymentMethod === 'mpesa' && <div className="payment-detail"><label className="field">M-Pesa phone number<input type="tel" required pattern="[+0-9 \(\)\-]{9,20}" value={paymentPhone} onChange={(event) => setPaymentPhone(event.target.value)} placeholder="+254 7XX XXX XXX" /></label><div className="demo-payment-message"><span>AMOUNT PAYABLE</span><strong>{money(total)}</strong><p>This is a demo. No STK push or real payment request will be sent.</p></div><button type="button" className="button button-outline" onClick={() => { setPaymentRequested(true); setToast('Demo only — no payment request was sent.'); }}>{paymentRequested ? 'Demo request noted' : 'Send demo payment request'}</button></div>}
    {paymentMethod === 'card' && <div className="demo-card"><div className="demo-card-banner"><Icon name="lock" size={16} /><span>DEMO PAYMENT ONLY — no card processor connected</span></div><div className="demo-card-visual"><span>SPINWIN <small>DEMO CHECKOUT</small></span><span>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4242</span><span>DEMO CARD &nbsp; · &nbsp; NOT CHARGED</span></div><p>This preview uses a simulated card. Never enter real card numbers or security codes here.</p></div>}
    {paymentMethod === 'bank' && <div className="bank-demo"><strong>Bank transfer — demo</strong><p>Transfer instructions would appear here after your order. This demo does not initiate or verify any bank transfer.</p></div>}</section>
    {adminMessage && <div className="form-error" role="alert">{adminMessage}</div>}<div className="checkout-disclaimer"><Icon name="lock" size={16} /> Demo checkout. No real payment is collected.</div><button type="submit" className="button button-dark place-order-button" disabled={submitting}>{submitting ? 'Placing your order…' : `Place demo order · ${money(total)}`} {!submitting && <Icon name="arrow" size={18} />}</button></div>
    <aside className="order-card checkout-summary"><span className="eyebrow">THE IMPORTANT BITS</span><h2>Your order</h2><div className="mini-order-list">{cartItems.map(({ product, quantity }) => <div key={product.id}><img src={imageUrl(product.image, 180)} alt="" /><span><strong>{product.name}</strong><small>Qty {quantity} · {money(product.price)}</small></span><b>{money(product.price * quantity)}</b></div>)}</div><OrderTotals /><p className="delivery-note"><Icon name="truck" size={17} />{deliveryFee === 0 ? 'Complimentary delivery' : `Delivery to ${customer.county || 'your county'}`}</p></aside>
  </form>}</main>;

  const renderConfirmation = () => lastOrder ? <main className="page-main confirmation-page"><div className="confirmation-card"><div className="confirmation-icon"><Icon name="check" size={27} /></div><span className="eyebrow">THAT’S THE GOOD STUFF</span><h1>It’s in the bag.<br /><em>And on its way.</em></h1><p className="confirmation-lede">Thanks, {lastOrder.customer.name.split(' ')[0]}. Your order is in — and we’re so glad you found us.</p><div className="reference-box"><span>YOUR ORDER REFERENCE</span><strong>{lastOrder.reference}</strong><small>Keep this handy for tracking your order.</small></div><div className="confirmation-details"><div><span>ORDER STATUS</span><strong className={`status-pill ${lastOrder.status === 'Demo Paid' ? 'status-demo' : ''}`}>{lastOrder.status}</strong></div><div><span>PAYMENT METHOD</span><strong>{lastOrder.method === 'mpesa' ? 'M-Pesa' : lastOrder.method === 'card' ? 'Debit / Credit card' : 'Bank transfer'} <small className="demo-tag">DEMO</small></strong></div><div><span>DELIVERING TO</span><strong>{lastOrder.customer.town}, {lastOrder.customer.county}</strong></div><div><span>ORDER TOTAL</span><strong>{money(lastOrder.total)}</strong></div></div><div className="tracking-box"><div className="tracking-rail"><span className="tracking-step done"><i><Icon name="check" size={13} /></i><small>Order placed</small></span><span className="tracking-line" /><span className="tracking-step"><i>2</i><small>Getting ready</small></span><span className="tracking-line" /><span className="tracking-step"><i>3</i><small>On its way</small></span></div><p>We’ll be in touch at <strong>{lastOrder.customer.phone}</strong> with updates. Tracking shown here is a demo preview.</p></div><div className="confirmation-items">{lastOrder.items.map((item) => <div key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}</div><button className="button button-dark confirmation-continue" onClick={() => go('shop')}>Find something else <Icon name="arrow" size={18} /></button><button className="text-link track-order-button" onClick={() => go('account')}>View your order details <Icon name="arrow" size={17} /></button></div></main> : <main className="page-main"><div className="empty-state cart-empty"><h3>No order to show just yet.</h3><button className="button button-dark" onClick={() => go('shop')}>Back to the shop</button></div></main>;

  const renderAdmin = () => <main className="page-main admin-page"><div className="admin-heading"><div><span className="eyebrow">THE BACK ROOM</span><h1>Admin dashboard<span className="heading-period">.</span></h1><p>All the moving parts, in one place.</p></div><div className="admin-badge">{supabase ? (adminUser ? `Signed in · ${adminUser.email}` : 'Secure admin access') : 'Demo admin mode'}{adminUser && <button onClick={signOutAdmin}>Sign out</button>}</div></div>
    {supabase && !adminUser ? <section className="admin-login"><div className="admin-login-icon"><Icon name="lock" size={24} /></div><h2>Welcome back.</h2><p>Sign in with an administrator account to continue.</p><form onSubmit={signInAdmin}><label className="field">Email address<input type="email" required autoComplete="username" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} /></label><label className="field">Password<input type="password" required autoComplete="current-password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} /></label>{adminMessage && <p className="form-error" role="alert">{adminMessage}</p>}<button type="submit" className="button button-dark">Sign in <Icon name="arrow" size={18} /></button></form></section> : <>
      <div className="admin-demo-notice"><strong>{supabase ? 'Connected mode:' : 'Demo mode:'}</strong> {supabase ? 'Admin sign-in, catalogue, order records, and order updates use Supabase. Customer/order management is protected by database policies.' : 'Dashboard data is stored in this browser only. Connect Supabase and configure admin roles before using this for a real store.'}</div>
      {adminMessage && <p className="form-error" role="alert">{adminMessage}</p>}
      <div className="admin-stats"><article><span>Total orders</span><strong>{orders.length}</strong><small>All time</small></article><article><span>Total sales</span><strong>{money(orders.reduce((sum, order) => sum + order.total, 0))}</strong><small>Demo order volume</small></article><article><span>Pending orders</span><strong>{orders.filter((order) => order.status === 'Pending').length}</strong><small>Need a little attention</small></article><article><span>Completed</span><strong>{orders.filter((order) => order.status === 'Completed').length}</strong><small>Out in the world</small></article></div>
      <section className="admin-section"><div className="admin-section-heading"><div><span className="eyebrow">KEEP THINGS MOVING</span><h2>Order management</h2></div><span className="table-count">{orders.length} orders</span></div>{orders.length ? <div className="table-scroll"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>TOTAL</th><th>PAYMENT</th><th>STATUS</th></tr></thead><tbody>{orders.map((order) => <tr key={order.reference}><td><strong>{order.reference}</strong><small>{order.items.length} item{order.items.length > 1 ? 's' : ''}</small></td><td><strong>{order.customer.name}</strong><small>{order.customer.email}</small></td><td>{new Date(order.createdAt).toLocaleDateString('en-KE')}</td><td><strong>{money(order.total)}</strong></td><td>{order.method.toUpperCase()}</td><td><select className="status-select" value={order.status} onChange={(event) => updateOrderStatus(order.reference, event.target.value)}><option>Pending</option>{!supabase && <option>Demo Paid</option>}<option>Processing</option><option>Completed</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div> : <div className="admin-empty">Your orders will appear here once they start coming in.</div>}</section>
      <section className="admin-section product-management"><div className="admin-section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Product management</h2></div><span className="table-count">{products.length} products</span></div><form className="admin-product-form" onSubmit={addProduct}><label className="field">Product name<input required value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="e.g. Sunday Market Basket" /></label><label className="field">Category<select value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label className="field">Price (KES)<input required type="number" min="1" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} /></label><label className="field">Stock<input required type="number" min="0" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} /></label><label className="field description-field">Description<input required value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} placeholder="A short, lovely description" /></label><button className="button button-dark add-product-submit" type="submit">Add product <Icon name="plus" size={17} /></button></form><div className="admin-product-list">{products.map((product) => <div key={product.id}><img src={imageUrl(product.image, 180)} alt="" /><span><strong>{product.name}</strong><small>{product.category} · {money(product.price)}</small></span><span className={`stock-count ${product.stock === 0 ? 'out-of-stock' : ''}`}>{product.stock ? `${product.stock} in stock` : 'Out of stock'}</span><button className="delete-product" onClick={() => removeProduct(product.id)}>Remove</button></div>)}</div></section>
      <section className="admin-section customer-management"><div className="admin-section-heading"><div><span className="eyebrow">OUR COMMUNITY</span><h2>Customer list</h2></div><span className="table-count">{new Set(orders.map((order) => order.customer.email)).size} customers</span></div>{orders.length ? <div className="table-scroll"><table><thead><tr><th>NAME</th><th>EMAIL</th><th>PHONE</th><th>LOCATION</th><th>ORDERS</th></tr></thead><tbody>{Array.from(new Map(orders.map((order) => [order.customer.email, order.customer])).values()).map((person) => <tr key={person.email}><td><strong>{person.name}</strong></td><td>{person.email}</td><td>{person.phone}</td><td>{person.town}, {person.county}</td><td>{orders.filter((order) => order.customer.email === person.email).length}</td></tr>)}</tbody></table></div> : <div className="admin-empty">Customer details appear after a demo checkout is complete.</div>}</section>
    </>}</main>;

  const renderAccount = () => <main className="page-main account-page"><div className="page-intro compact-intro"><span className="eyebrow">YOUR SPINWIN</span><h1>A little corner of yours<span className="heading-period">.</span></h1><p>Your orders, all together. No account needed for this demo.</p></div>{lastOrder ? <div className="account-order-card"><div className="account-order-heading"><div><span className="eyebrow">YOUR LATEST ORDER</span><h2>{lastOrder.reference}</h2></div><span className="status-pill">{lastOrder.status}</span></div><p>{new Date(lastOrder.createdAt).toLocaleDateString('en-KE')} · {lastOrder.items.length} item{lastOrder.items.length > 1 ? 's' : ''} · {money(lastOrder.total)}</p><button className="text-link" onClick={() => go('confirmation')}>View order details <Icon name="arrow" size={18} /></button></div> : <div className="empty-state cart-empty"><span className="empty-mark"><Icon name="bag" size={32} /></span><h3>Your next favourite is out there.</h3><p>Your order details will show up here once you’ve placed an order.</p><button className="button button-dark" onClick={() => go('shop')}>Find your something <Icon name="arrow" size={18} /></button></div>}</main>;

  const renderAbout = () => <main className="page-main story-page"><div className="story-hero"><span className="eyebrow">A LITTLE ABOUT US</span><h1>Good finds.<br /><em>Good feeling.</em></h1><p>We’re SPINWIN: your neighbourhood kind of shop, with the whole internet at our fingertips.</p></div><img className="story-image" src={imageUrl('photo-1441986300917-64674bd600d8', 1400)} alt="A welcoming modern boutique shop" /><section className="story-copy"><div><span className="eyebrow">WHY WE’RE HERE</span><h2>Shopping should feel like finding, not searching.</h2></div><div><p>We started SPINWIN with a simple idea: everyday shopping could be a little more thoughtful. Fewer endless options, more useful things chosen with care.</p><p>We bring together quality essentials across home, tech, fashion and the little things in between — all from right here in Kenya. Good products, fair prices, a real person if you need a hand.</p><p>That’s our kind of shopping. We hope it feels like yours, too.</p><strong className="signature">Karibu, from the SPINWIN team ✳</strong></div></section><div className="story-values"><div><span>01</span><h3>Picked with purpose</h3><p>Useful, well-made things that earn their place in your everyday.</p></div><div><span>02</span><h3>Close to home</h3><p>Kenyan-owned, locally minded, and always happy to say hello.</p></div><div><span>03</span><h3>Good, honest service</h3><p>Clear prices, thoughtful help, and no surprises at checkout.</p></div></div></main>;
  const renderContact = () => <main className="page-main contact-page"><div className="page-intro compact-intro"><span className="eyebrow">WE’RE RIGHT HERE</span><h1>Let’s have a chat<span className="heading-period">.</span></h1><p>A question, a thought, or just want to say hi? We’d love to hear from you.</p></div><div className="contact-layout"><div className="contact-details"><div className="contact-detail"><span className="contact-icon"><Icon name="bag" /></span><div><strong>Customer care</strong><p>Real people, ready to help with your order.</p><a href="mailto:hello@spinwin.co.ke">hello@spinwin.co.ke</a></div></div><div className="contact-detail"><span className="contact-icon"><Icon name="pin" /></span><div><strong>Based in Nairobi</strong><p>Delivering thoughtful finds across Kenya.</p><span>Monday–Saturday, 8am–6pm EAT</span></div></div><div className="contact-detail"><span className="contact-icon">↺</span><div><strong>Returns & exchanges</strong><p>Something not quite right? Let’s make it right.</p><button className="text-link" onClick={() => setToast('Get in touch at hello@spinwin.co.ke for returns support.')}>Learn about returns <Icon name="arrow" size={16} /></button></div></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setToast('Thanks for reaching out — we’ll be in touch soon.'); event.currentTarget.reset(); }}><h2>Drop us a note.</h2><label className="field">Your name<input required placeholder="Name" /></label><label className="field">Email address<input required type="email" placeholder="you@example.com" /></label><label className="field">What’s on your mind?<textarea required rows="4" placeholder="Tell us a little more..." /></label><button type="submit" className="button button-dark">Send your message <Icon name="arrow" size={18} /></button><small>This is a demo contact form. No message is sent to a server.</small></form></div></main>;

  const pageContent = { home: renderHome, shop: renderShop, cart: renderCart, checkout: renderCheckout, confirmation: renderConfirmation, account: renderAccount, admin: renderAdmin, about: renderAbout, contact: renderContact };
  return <div className="app-shell"><Header />{(pageContent[page] || renderHome)()}<footer className="site-footer"><div className="footer-main">
    <div className="footer-brand"><button className="brand footer-logo" type="button" onClick={() => go('home')}><span className="brand-mark">s<span>.</span></span><span className="brand-name">SPINWIN<span>KENYA</span></span></button><p>Everyday essentials and thoughtful finds, picked with care and delivered with a little heart.</p><span className="footer-location"><Icon name="pin" size={15} /> Proudly Kenyan · Nairobi</span></div>
    <div className="footer-column"><strong>Come on in</strong><button onClick={() => { setCategory('All'); go('shop'); }}>Shop all</button>{categories.slice(0, 3).map((item) => <button key={item.name} onClick={() => showCategory(item.name)}>{item.name}</button>)}<button onClick={() => go('about')}>Our story</button></div>
    <div className="footer-column"><strong>Here to help</strong><button onClick={() => go('contact')}>Contact us</button><a href="mailto:hello@spinwin.co.ke">Customer support</a><button onClick={() => go('account')}>My account</button><button onClick={() => go('admin')}>Admin dashboard</button></div>
    <div className="footer-column"><strong>The fine print</strong><button onClick={() => setToast('Terms of service will be available before production launch.')}>Terms of service</button><button onClick={() => setToast('Privacy policy will be available before production launch.')}>Privacy policy</button><span>Safe, happy shopping</span><div className="payment-logos"><span>M-PESA</span><span>VISA</span><span>•••</span></div></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} SPINWIN. Made with care, right here.</span><span>Karibu. Find something good.</span></div></footer>
    {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={14} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16} /></button></div>}
  </div>;
}

export default App;
