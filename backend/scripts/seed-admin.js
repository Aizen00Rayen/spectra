require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../data');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@spectra.dev';
  const password = process.env.ADMIN_PASSWORD || 'Spectra@2025!';

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(ADMIN_FILE)) {
    console.log('Admin already exists. Delete data/admin.json to re-seed.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = { email: email.toLowerCase(), password: hashed, createdAt: new Date().toISOString() };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2), 'utf8');

  console.log('\nAdmin created successfully!');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log('\n⚠️  Change the password after first login!\n');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
