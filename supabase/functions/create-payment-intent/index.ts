// @ts-nocheck
// Supabase Edge Function — create-payment-intent
// Creates a Stripe PaymentIntent server-side and returns client_secret to the frontend.
// Deploy: supabase functions deploy create-payment-intent
// Env var needed: STRIPE_SECRET_KEY (set in Supabase Dashboard → Settings → Edge Functions)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_API        = "https://api.stripe.com/v1";

// Zero-decimal currencies (Stripe requires no multiplication by 100)
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif","clp","djf","gnf","jpy","kmf","krw","mga","pyg","rwf","ugx","vnd","vuv","xaf","xof","xpf",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS pre-flight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!STRIPE_SECRET_KEY) {
    return json({ error: "STRIPE_SECRET_KEY not configured on server" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const {
    amount,
    currency     = "usd",
    donor_email,
    donor_name,
    cause_name,
  } = body as {
    amount: number;
    currency?: string;
    donor_email?: string;
    donor_name?: string;
    cause_name?: string;
  };

  if (!amount || Number(amount) <= 0) {
    return json({ error: "Montant invalid / Invalid amount" }, 400);
  }

  const currencyLower = String(currency).toLowerCase();

  // Convert to Stripe smallest unit
  const stripeAmount = ZERO_DECIMAL_CURRENCIES.has(currencyLower)
    ? Math.round(Number(amount))
    : Math.round(Number(amount) * 100);

  // Build PaymentIntent form params
  const params = new URLSearchParams();
  params.set("amount",   stripeAmount.toString());
  params.set("currency", currencyLower);
  params.set("automatic_payment_methods[enabled]", "true");
  params.set("description", `Don TRAPOSA${cause_name ? ` — ${cause_name}` : ""}`);

  if (donor_email) params.set("receipt_email",          String(donor_email));
  if (donor_name)  params.set("metadata[donor_name]",   String(donor_name));
  if (cause_name)  params.set("metadata[cause_name]",   String(cause_name));
  params.set("metadata[source]", "TRAPOSA Website");

  // Call Stripe API
  const stripeRes = await fetch(`${STRIPE_API}/payment_intents`, {
    method: "POST",
    headers: {
      "Authorization":  `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type":   "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-04-10",
    },
    body: params.toString(),
  });

  const pi = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error("Stripe error:", pi);
    return json({ error: pi?.error?.message ?? "Stripe error" }, 400);
  }

  return json({
    clientSecret:    pi.client_secret,
    paymentIntentId: pi.id,
  });
});

// ─── helpers ────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
