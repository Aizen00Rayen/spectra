const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();

  const db = client.db(process.env.MONGODB_DB_NAME || 'spectra');
  cachedClient = client;
  cachedDb = db;

  console.log('Connected to MongoDB');
  return { client, db };
}

async function getCollection(name) {
  const { db } = await connectToDatabase();
  return db.collection(name);
}

module.exports = { connectToDatabase, getCollection };
