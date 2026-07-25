# Deploy MiniStore to AWS (EC2 + Docker Compose)

One EC2 instance runs everything: the Next.js frontend, all 5 Spring Boot
services, a PostgreSQL container, and Caddy (automatic HTTPS). Real AWS practice
without the complexity of ECS/EKS.

```
Internet ── Route53 DNS ──► EC2 (Elastic IP)
                             └─ Caddy (:80/:443, HTTPS)
                                ├─ <domain>       → frontend:3000
                                ├─ api.<domain>   → api-gateway:8080
                                └─ auth.<domain>  → auth-service:8081
                                     └─ discovery / product / order / postgres (internal)
```

---

## 0. Prerequisites
- An **AWS account** (free tier). Set a **Billing → Budget alert** ($5–10) first.
- A **domain** you own (Route 53, Namecheap, etc.).
- Your **Google OAuth** client and **Stripe** keys.

## 1. Register a domain & plan the records
You'll point these at the server (step 5): the bare `<domain>` (frontend), plus
`api.<domain>` and `auth.<domain>`.

## 2. Launch an EC2 instance
- **AMI:** Ubuntu Server 24.04 LTS
- **Type:** **t3.small** (2 GB RAM) recommended — building 5 Java images needs memory.
  *(t2.micro/1 GB free-tier works only if you add swap — see Appendix A.)*
- **Storage:** 20 GB gp3.
- **Key pair:** create/download one for SSH.
- **Security group** — allow inbound:
  | Port | Source | Why |
  |------|--------|-----|
  | 22 | your IP | SSH |
  | 80 | 0.0.0.0/0 | HTTP (Caddy → HTTPS redirect + ACME) |
  | 443 | 0.0.0.0/0 | HTTPS |

## 3. Allocate an Elastic IP
EC2 → **Elastic IPs** → Allocate → **Associate** with your instance. This gives a
**stable public IP** for DNS.

## 4. Install Docker on the server
SSH in: `ssh -i your-key.pem ubuntu@<elastic-ip>`
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu && newgrp docker
```

## 5. Point DNS at the server
In your DNS provider, create **A records** (all → your Elastic IP):
```
<domain>       A   <elastic-ip>
api.<domain>   A   <elastic-ip>
auth.<domain>  A   <elastic-ip>
```
Wait until they resolve (`nslookup <domain>`).

## 6. Get the code & config onto the server
```bash
mkdir -p ~/ministore && cd ~/ministore
git clone <FRONTEND_REPO_URL> frontend      # this project (shop_front)
git clone <BACKEND_REPO_URL>  backend       # the 5-service backend repo

# bring the deploy files up to ~/ministore
cp frontend/deploy/docker-compose.yml .
cp frontend/deploy/Caddyfile .
cp frontend/deploy/postgres-init.sql .
cp frontend/deploy/.env.example .env
nano .env            # fill in real values (domain, DB pw, JWT, Google, Stripe)
```

## 7. Wire external services to production URLs
- **Google Cloud Console** → your OAuth client → **Authorized redirect URIs**, add:
  `https://auth.<domain>/login/oauth2/code/google`
- **Stripe** → Developers → **Webhooks** → add endpoint
  `https://api.<domain>/api/orders/stripe/webhook` → events `payment_intent.succeeded`,
  `payment_intent.payment_failed` → copy the `whsec_…` into `.env`.

## 8. Build & run
```bash
cd ~/ministore
docker compose up -d --build      # first build takes several minutes
docker compose ps                 # all should be "running"/"healthy"
docker compose logs -f api-gateway   # tail a service if needed
```
Caddy fetches TLS certs automatically once DNS resolves. Visit **https://<domain>**.

---

## ⚠️ Backend config to verify (may be hard-coded for localhost)
The compose passes production values as env vars, but confirm the backend
actually reads them (Spring relaxed-binding). Check these in the **backend repo**:

1. **api-gateway CORS** (`api-gateway/src/main/resources/application.yml`) —
   `allowedOrigins` may be hard-coded to `http://localhost:3000`. Change it to
   read `${FRONTEND_ORIGIN:http://localhost:3000}` (or set it to `https://<domain>`).
2. **auth-service redirect** — the `frontend-redirect-uri` property should read
   `${APP_FRONTEND_REDIRECT_URI:http://localhost:3000/account}`. Adjust the env
   key in `docker-compose.yml` to match the real property prefix if different.
3. **eureka** — services must accept `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`
   (standard). If yours pins a URL, make it `${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:...}`.

Redeploy after edits: `docker compose up -d --build <service>`.

---

## Updating later
```bash
cd ~/ministore/frontend && git pull      # or backend
cd ~/ministore && docker compose up -d --build frontend
```

## Appendix A — add swap (only if using a 1 GB t2.micro)
```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Appendix B — costs & teardown
- t3.small ≈ $15/mo; Elastic IP is free **while associated** (charged if left unassociated).
- To stop billing: `docker compose down`, then **Terminate** the instance and
  **Release** the Elastic IP in the console.

## Going live with Stripe
Trial everything with **test** keys first (works in production too). When ready
for real money, swap `.env` to `pk_live_/sk_live_/whsec_` (live), and switch the
Stripe webhook to the live endpoint. See the app README for the test → live notes.
