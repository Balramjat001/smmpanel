# SocialBoost Panel

A responsive SMM order-management panel with a React/Vite client, Express API, Prisma/PostgreSQL data model, JWT authentication, wallet-safe order/payment workflows, admin controls, and demo-mode provider fulfillment.

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Run locally

```powershell
npm run install:all
Copy-Item backend/.env.example backend/.env
# Set DATABASE_URL and JWT_SECRET in backend/.env
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```

Frontend: http://localhost:5173  |  API: http://localhost:4000

Demo admin: `admin` / `admin123` (change this before production).

With `DEMO_MODE=true`, email verification codes are logged by the API, provider fulfillment uses a deterministic demo provider, and pending payments can be approved from the admin panel. Demo payment approval is never automatic.

## Production notes

Use a managed PostgreSQL database, HTTPS-only cookies, a strong JWT secret, a real SMTP transport, a compliant provider API, a supported payment gateway, and object storage for QR uploads. Never commit `.env`, provider keys, or SMTP credentials. The backend uses Decimal columns and Prisma transactions for wallet mutations.

For a Render deployment, create the backend and frontend services separately because this repository does not contain a Render blueprint. Set these environment variables in the backend service:

- `DATABASE_URL`: the PostgreSQL connection string supplied by Render PostgreSQL; it must not contain `localhost`.
- `FRONTEND_URL`: the exact deployed frontend origin, including `https://` and no trailing slash. Multiple origins may be comma-separated.
- `JWT_SECRET`: a long random production secret.

Set `VITE_API_URL` in the frontend service before its Vite build to the deployed backend origin, including `https://` and no `/api` suffix. The frontend build command is `npm install && npm run build` from the `frontend` directory, with `frontend/dist` as the publish directory. Local development continues to default to `http://localhost:4000`.
