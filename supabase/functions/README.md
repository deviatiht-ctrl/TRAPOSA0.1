# TRAPOSA — Supabase Edge Functions

## create-payment-intent

Creates a Stripe PaymentIntent server-side and returns the `client_secret` to the frontend.

### Deploy steps

```bash
# 1. Install Supabase CLI (if not already)
npm install -g supabase

# 2. Login
supabase login

# 3. Link to your project
supabase link --project-ref oqjovwqmuulduuxhcnkc

# 4. Set the Stripe secret key (server-side — NEVER expose in frontend)
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY

# 5. Deploy the function
supabase functions deploy create-payment-intent
```

### Environment variables required

| Variable           | Description                                   |
|--------------------|-----------------------------------------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |

> Set via: Supabase Dashboard → Settings → Edge Functions → Secrets
> OR via: `supabase secrets set STRIPE_SECRET_KEY=sk_...`

### Request / Response

**POST** `/functions/v1/create-payment-intent`

Headers:
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

Body:
```json
{
  "amount": 1000,
  "currency": "usd",
  "donor_email": "test@example.com",
  "donor_name": "Marie B.",
  "cause_name": "Edikasyon Timoun"
}
```

Response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```
