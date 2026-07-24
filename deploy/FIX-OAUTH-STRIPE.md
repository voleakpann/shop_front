# Fix Google OAuth login & Stripe checkout on the hosted backend

The backend at `http://52.201.50.44` (services on `:1000` product, `:9001` auth,
`:9002` order, gateway `:8000`) was deployed **without real secrets**, so:

- **Login is broken** — the Google OAuth redirect shows `client_id=placeholder`
  and a `redirect_uri` pointing at the internal Docker hostname
  (`http://73a4896ba5c7:9001/...`), which Google and the internet can't reach.
- **Checkout is broken** — Stripe keys are also placeholders, and checkout is
  gated behind login anyway.

Everything below runs **on the server** (SSH to `52.201.50.44`) plus a little
config in Google/Stripe consoles. **Never commit real secrets; keep them in
`.env` only.**

> When you later add a domain + HTTPS, replace every `http://52.201.50.44:8000`
> below with `https://api.<your-domain>` and redo the Google redirect URI and
> Stripe webhook with the HTTPS URL.

---

## Fix 1 — Google OAuth login

### A. Get real Google credentials
1. https://console.cloud.google.com → **APIs & Services → Credentials**
2. Create/open an **OAuth 2.0 Client ID** → type **Web application**
3. **Authorized redirect URIs** → add exactly:
   ```
   http://52.201.50.44:8000/login/oauth2/code/google
   ```
4. Copy the **Client ID** and **Client secret**

### B. Put secrets in the server `.env`
```dotenv
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>
JWT_SECRET=<long-random-base64>     # shared by auth + product + order services
```
Generate the JWT secret:
```bash
openssl rand -base64 32
```

### C. Fix the redirect URI (the Docker-hostname bug)
The auth-service must emit the **public gateway** callback, not its internal host.

In the auth-service configuration:
```properties
spring.security.oauth2.client.registration.google.redirect-uri=http://52.201.50.44:8000/login/oauth2/code/google
server.forward-headers-strategy=framework
```
Confirm the API gateway forwards `X-Forwarded-*` headers (Spring Cloud Gateway
does by default).

---

## Fix 2 — Stripe checkout

### A. Get Stripe keys
https://dashboard.stripe.com → **Developers → API keys**. Use **test** keys
first (`sk_test_…`, `pk_test_…`).

### B. Server `.env`
```dotenv
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### C. Webhook
Stripe → **Developers → Webhooks → Add endpoint**:
```
http://52.201.50.44:8000/api/orders/stripe/webhook
```
Events: `payment_intent.succeeded`, `payment_intent.payment_failed`.
Copy the generated `whsec_…` into `STRIPE_WEBHOOK_SECRET`.

### D. Frontend publishable key (safe, browser-side)
In the frontend `.env.local` (local dev) or the frontend deploy build arg:
```dotenv
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## Redeploy on the server
```bash
cd ~/ministore              # wherever the deploy files live
nano .env                   # add all the values above
docker compose up -d --build auth-service order-service frontend
docker compose logs -f auth-service   # watch for a clean start
```

---

## Verify
After redeploy, the OAuth start should show your **real** client_id and a
**reachable** redirect_uri:
```bash
curl -si "http://52.201.50.44:8000/oauth2/authorization/google" | grep -i location
# client_id should NOT be "placeholder"
# redirect_uri should be http://52.201.50.44:8000/login/oauth2/code/google
```
Then test login and checkout in the browser at the frontend URL.

---

## Notes
- **Keep `.env` out of git.**
- HTTP + raw IP is fine for testing only. For production: add a domain + HTTPS
  (see `DEPLOY-AWS.md`), then update the Google redirect URI, the Stripe webhook
  URL, and the frontend's `NEXT_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_AUTH_BASE_URL`
  to the `https://` domain.
- Current working state: **product browsing works** against the hosted gateway
  (`http://52.201.50.44:8000`); login/checkout need the fixes above.
