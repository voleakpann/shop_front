# Setup Guide for Local Development

## Prerequisites
- Node.js 18+
- Docker & Docker Compose (for backend)
- Google OAuth2 credentials (from Google Cloud Console)

## Frontend Setup (shop_front/)

### 1. Install dependencies
```bash
cd shop_front
npm install
```

### 2. Create `.env.local` with secrets
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and set:
- `AUTH_SECRET` — Generate with: `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` — From Google Cloud Console OAuth2 credentials
- `AUTH_GOOGLE_SECRET` — From Google Cloud Console OAuth2 credentials
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional for payments)

**For local development** (using local Docker backend):
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- `NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:8081`

### 3. Start the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Backend Setup (shop_backend/)

### 1. Create `.env` file
```bash
cd shop_backend
cp .env.example .env
```

Then edit `.env` and set:
- `DB_USERNAME` & `DB_PASSWORD` — Database credentials (or use defaults)
- `JWT_SECRET` — Generate with: `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET` — Same Google OAuth2 credentials as frontend
- `FRONTEND_BASE_URL=http://localhost:3000` (for local dev)
- `MINISTORE_FRONTEND_REDIRECT_URI=http://localhost:3000/account` (for local dev, after OAuth login redirect)
- `AUTH_SECRET` — Generate with: `openssl rand -base64 32`

### 2. Start the backend stack
```bash
docker compose up --build
```

This starts:
- PostgreSQL (port 5432)
- Auth Service (port 8081)
- Product Service (port 1000)
- Order Service (port 9002)
- Comment Service (port 9003)
- API Gateway (port 8000)

---

## Verify Login Works

1. Navigate to http://localhost:3000/account
2. Click "Continue with Google"
3. Sign in with your Google account
4. Should redirect back to http://localhost:3000/account and show "My Account" with your profile

If login fails:
- Check that `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` are set in both `.env.local` (frontend) and `.env` (backend)
- Verify Google OAuth credentials are valid in Google Cloud Console
- Check that backend auth-service is running: `docker ps | grep auth-service`
- Check frontend is pointing to the right backend URLs in `.env.development.local`
