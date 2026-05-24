# Deploying Spectra — Hostinger Node.js Hosting via GitHub

## How it works

```
git push to main
      ↓
GitHub Actions builds frontend (npm run build)
      ↓
Pushes a ready-to-run "production" branch to GitHub
      ↓
Hostinger hPanel pulls from "production" branch
      ↓
Live website ✅
```

---

## One-time setup

### Step 1 — Let GitHub Actions run once

Push any change to `main`. The **Actions** tab on GitHub will show a
`Build & Deploy to Production` job running. Wait for it to finish —
it creates the `production` branch automatically.

Verify at:
`https://github.com/Aizen00Rayen/spectra/tree/production`

---

### Step 2 — Hostinger hPanel configuration

1. Log into **hPanel → Hosting → Node.js**
2. Click **Create Application** (or manage existing)
3. Set these values:

| Field                  | Value                                              |
|------------------------|----------------------------------------------------|
| **Node.js version**    | 18 (or latest LTS)                                 |
| **Application root**   | `/` (project root)                                 |
| **Application URL**    | your domain                                        |
| **Application startup file** | `app.js`                                    |

4. Click **Save**

---

### Step 3 — Connect GitHub repository

Inside hPanel Node.js settings → **Git** tab:

1. Connect your GitHub account
2. Select repo: `Aizen00Rayen/spectra`
3. Branch: **`production`** ← important, NOT main
4. Click **Deploy**

hPanel will clone the `production` branch. This branch already has
the built `frontend/dist/` included, so no build step is needed
on the server.

---

### Step 4 — Set environment variables

In hPanel → **Environment Variables**, add:

| Key              | Value                                      |
|------------------|--------------------------------------------|
| `NODE_ENV`       | `production`                               |
| `JWT_SECRET`     | (any long random string, 32+ characters)   |
| `PORT`           | Leave empty — Hostinger injects this automatically |

---

### Step 5 — Install backend dependencies & seed admin

In hPanel → **Node.js** → **Terminal** (or SSH):

```bash
# Install backend dependencies
cd backend && npm install --omit=dev

# Create your admin account (run once)
ADMIN_EMAIL=you@yourdomain.com ADMIN_PASSWORD=YourStrongPassword node scripts/seed-admin.js
```

---

### Step 6 — Restart the app

In hPanel → Node.js → click **Restart Application**

Your site is now live at your domain! 🎉

---

## Automatic deploys (after setup)

Every time you push to `main`:
1. GitHub Actions builds the frontend
2. Updates the `production` branch
3. **hPanel auto-deploys** (if auto-deploy is enabled in Git settings)

Or manually: hPanel → Git → **Pull**

---

## Local development

```bash
# Backend
cd backend
cp .env.example .env   # set JWT_SECRET
npm run seed           # create admin user
npm run dev            # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm run dev            # http://localhost:3000
```

---

## Admin panel

URL: `https://yourdomain.com/admin/login`

Default credentials (from seed script):
- Email: `admin@spectra.dev`
- Password: `Spectra@2025!`

> ⚠️ Change these by passing your own ADMIN_EMAIL / ADMIN_PASSWORD when running seed.
