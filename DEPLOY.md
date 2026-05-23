# Deploying Spectra to Hostinger

## Stack
- **Frontend**: Vite + React (builds to static files in `frontend/dist/`)
- **Backend**: Node.js + Express (serves the API + the frontend static files in production)
- **Storage**: JSON files in `backend/data/` (no database needed)

---

## Project Structure

```
spectra-agency-website/
├── frontend/          ← Vite + React app
│   ├── src/
│   ├── public/
│   └── dist/          ← generated after `npm run build`
└── backend/           ← Express API server
    ├── data/          ← JSON data files (portfolio, messages, admin)
    ├── routes/
    └── server.js
```

---

## Local Development

```bash
# 1. Set up backend
cd backend
cp .env.example .env       # fill JWT_SECRET (any long random string)
npm run seed               # creates data/admin.json with default credentials
npm run dev                # starts API on http://localhost:5000

# 2. Start frontend (separate terminal)
cd frontend
npm run dev                # starts on http://localhost:3000
```

Open `http://localhost:3000` — API calls are proxied to port 5000 automatically.

Admin panel: `http://localhost:3000/admin/login`

---

## Production Build & Deploy (Hostinger)

### Step 1 — Build the React frontend

```bash
cd frontend
npm run build
# outputs to frontend/dist/
```

### Step 2 — Upload to Hostinger

Upload the following to your Hostinger Node.js hosting directory:

```
backend/           (everything in backend/)
frontend/dist/     (the built React app)
```

The folder layout on the server should be:

```
/home/user/domains/yourdomain.com/
├── backend/
│   ├── server.js
│   ├── data/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── node_modules/
└── frontend/
    └── dist/
```

### Step 3 — Configure Hostinger hPanel

1. Go to **hPanel → Hosting → Node.js**
2. Set:
   - **Entry point**: `backend/server.js`
   - **Node version**: 18 or higher
3. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000               (or whatever Hostinger assigns)
   JWT_SECRET=your_secret
   ```
4. Click **Restart App**

### Step 4 — Install dependencies on server

```bash
cd backend && npm install --omit=dev
```

### Step 5 — Seed admin (run once)

```bash
cd backend
ADMIN_EMAIL=you@yourdomain.com ADMIN_PASSWORD=YourStrongPass node scripts/seed-admin.js
```

---

## Admin Credentials (defaults)

| Field    | Default               |
|----------|-----------------------|
| Email    | admin@spectra.dev     |
| Password | Spectra@2025!         |

> ⚠️ Change these by editing `backend/.env` before seeding, or delete `backend/data/admin.json` and re-run `npm run seed` with new values.

---

## Data Files

All data lives in `backend/data/`:

| File             | Contents                        |
|------------------|---------------------------------|
| `portfolio.json` | Array of portfolio projects     |
| `messages.json`  | Array of contact form messages  |
| `admin.json`     | Single admin user (hashed)      |

Back these files up regularly — they are your entire database.
