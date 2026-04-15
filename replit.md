# CycleCare

A period tracking and women's health web application built with React + Vite (frontend) and Express (backend), using Replit's built-in PostgreSQL database.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite, served on port 5000 in development
- **Backend**: Express 5 on port 4000, proxied via Vite in development
- **Database**: PostgreSQL (Replit built-in, via `pg` package)
- **Auth**: JWT + bcryptjs; email OTP via Resend (optional)
- **Styling**: Tailwind CSS v3 + PostCSS

## Project Structure

```
├── backend/
│   ├── config/db.js          # PostgreSQL pool + DB initialization
│   ├── controllers/          # Business logic
│   ├── middleware/auth.js    # JWT verification
│   ├── models/               # DB query functions
│   ├── routes/               # Express routers
│   └── server.js             # Entry point (port 4000)
├── src/                      # React frontend
│   ├── api/client.ts         # API client (uses relative /api URLs)
│   ├── components/
│   ├── pages/
│   ├── store/AppContext.tsx
│   └── main.tsx
├── start.sh                  # Dev startup: backend + vite
└── vite.config.ts            # Port 5000, proxy /api → 4000
```

## Development

The `Start application` workflow runs `bash start.sh` which starts both the Express backend and Vite dev server concurrently.

- Frontend: http://localhost:5000
- Backend API: http://localhost:4000 (proxied via /api in Vite)

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (set by Replit)
- `JWT_SECRET` — JWT signing secret
- `PORT` — Backend port (default 4000)
- `RESEND_API_KEY` — Optional: Resend API key for OTP emails

## Deployment

Configured for autoscale deployment:
- Build: `npm run build` (builds frontend to `dist/`)
- Run: `node backend/server.js` (serves API + static frontend from dist/)

## Key Notes

- Migrated from MySQL to PostgreSQL for Replit compatibility
- Vite proxies `/api` requests to the Express backend in dev
- Frontend uses relative `/api` URLs (no hardcoded ports)
- OTP email via Resend is optional; registration flow requires it if configured
