// server.js (Node.js + Express)
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://nathanlance.me', 'http://localhost:5500'], // Allow your domain and localhost
};


app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON bodies

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Route to get Firebase config securely
app.get('/config', (req, res) => {
  const allowedOrigin = 'https://nathanlance.me'; // Adjust if using HTTP or different domain
  
  // Check if the request origin matches
  if (req.get('origin') !== allowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  });
});

// Route to verify Firebase ID token
app.post('/verifyToken', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
