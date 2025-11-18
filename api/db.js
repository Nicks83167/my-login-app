import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
  if (db) return db;
  
  try {
    await client.connect();
    db = client.db('loginapp'); // database name
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
