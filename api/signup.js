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
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        res.status(400).json({ 
          success: false, 
          message: "All fields are required" 
        });
        return;
      }
      
      // Connect to database
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Check if username exists
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        res.status(400).json({ 
          success: false, 
          message: "Username already taken" 
        });
        return;
      }
      
      // Check if email exists
      const existingEmail = await usersCollection.findOne({ email });
      if (existingEmail) {
        res.status(400).json({ 
          success: false, 
          message: "Email already registered" 
        });
        return;
      }
      
      // Insert new user
      await usersCollection.insertOne({
        username,
        email,
        password, // In production, hash this with bcrypt!
        createdAt: new Date()
      });
      
      res.status(200).json({ 
        success: true, 
        message: "Account created successfully!" 
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
