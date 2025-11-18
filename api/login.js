import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // Connect to database
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Find user
      const user = await usersCollection.findOne({ username, password });
      
      if (user) {
        res.status(200).json({ 
          success: true, 
          message: "Login successful!",
          user: { username: user.username, email: user.email }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
