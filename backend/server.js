require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── Security ────────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: isProd ? undefined : false,
  })
);

// ── CORS (dev only — in prod the same server serves the frontend) ───────────
if (!isProd) {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    })
  );
}

// ── Rate limiting on auth ───────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ── Body / Cookie parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/portfolio', portfolioRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Serve React build in production ─────────────────────────────────────────
if (isProd) {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ── 404 (dev only) ──────────────────────────────────────────────────────────
if (!isProd) {
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\nSpectra Backend → http://localhost:${PORT}`);
  console.log(`Mode: ${isProd ? 'production' : 'development'}\n`);
});

module.exports = app;
