export default function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle POST request
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // Check credentials
    if (username === "admin" && password === "admin123") {
      res.status(200).json({ 
        success: true, 
        message: "Login successful!" 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
