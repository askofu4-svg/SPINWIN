import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization) return response({ error: "Authorization is required." }, 401);

  try {
    const body = await request.json();
    const { customer, paymentMethod, items } = body ?? {};
    if (!customer || typeof customer !== "object" || Array.isArray(customer)) {
      return response({ error: "Customer details are required." }, 400);
    }
    const customerFields = ["name", "phone", "email", "address", "county", "town"];
    const safeCustomer: Record<string, string> = {};
    for (const field of customerFields) {
      if (typeof customer[field] !== "string" || !customer[field].trim()) {
        return response({ error: `A valid ${field} is required.` }, 400);
      }
      safeCustomer[field] = customer[field].trim();
    }
    if (!["mpesa", "card", "bank"].includes(paymentMethod)) {
      return response({ error: "Choose a supported demo payment method." }, 400);
    }
    if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
      return response({ error: "Your order must contain between 1 and 30 products." }, 400);
    }
    const safeItems = items.map((item) => {
      if (
        !item
        || typeof item.productId !== "string"
        || !/^[a-z0-9-]{1,80}$/.test(item.productId)
        || !Number.isInteger(item.quantity)
        || item.quantity < 1
        || item.quantity > 20
      ) {
        throw new Error("An item in your order is invalid.");
      }
      return { productId: item.productId, quantity: item.quantity };
    });

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("Order service is not configured.");

    const client = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data, error } = await client.rpc("create_order_atomic", {
      p_customer: safeCustomer,
      p_items: safeItems,
      p_payment_method: paymentMethod,
    });
    if (error) {
      console.error("create_order_atomic failed", error.message);
      return response({ error: error.message }, 400);
    }
    return response(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process this order.";
    return response({ error: message }, 400);
  }
});
