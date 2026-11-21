# SPINWIN

A mobile-first React storefront with a fully interactive local demo mode and an optional Supabase backend for catalogue data, admin authentication, and server-validated order creation. Demo checkouts never collect card details or contact a payment provider.

## Run locally

```sh
npm install
npm run dev
```

Without Supabase settings, products, cart contents, and demo orders are saved in the current browser's local storage. The admin screen is intentionally marked as demo-only in this mode.

## Supabase setup

1. Create a Supabase project and apply `supabase/migrations/202611210001_urbancart.sql`.
2. Deploy `supabase/functions/create-order` with JWT verification enabled (the default).
3. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.example`. The anon key is public; never place a service-role key in frontend variables.
4. Create an administrator through Supabase Auth, then assign that user's UUID to `public.user_roles` with role `admin` using the Supabase SQL editor.
5. Add the project URL and anon key to your deployment's frontend environment.

The Edge Function calls a restricted database function using the server-side service role. The database function locks catalogue rows, checks current stock, calculates prices and delivery from database values, and inserts the order and item snapshots atomically. Customers cannot read order records. Admin catalogue/order access is protected by RLS and the `user_roles` check. The dashboard reads and manages Supabase catalogue/orders after an authorized admin sign-in.

Supabase mode records orders as **Pending**. It does not charge or confirm a payment. An approved payment provider must be integrated server-side before treating any order as paid. Do not collect card numbers, CVVs, or payment credentials in this demo.

## Production checklist

- Replace demo contact, returns, terms, and privacy copy with the store's verified details and policies.
- Connect an approved payment provider through a separate server-side payment adapter and verify provider callbacks before changing payment status.
- Set up delivery operations and real order-tracking events.
- Add rate limits / abuse monitoring to the public order endpoint and configure the intended production site origin for CORS.
- Review privacy, retention, taxes, and consumer-protection requirements for the operating business.
