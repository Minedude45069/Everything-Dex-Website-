const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Hardcoded admin credentials (change these later!)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'secret123';

// Middleware
app.use(express.json());
app.use(express.static('public')); // still serves /public if you have it

// Paths
const cardsFile = path.join(__dirname, 'data', 'cards.json');
const adminPanelFile = path.join(__dirname, 'adminpanel.html');

// Route to serve adminpanel.html from root
app.get('/adminpanel', (req, res) => {
  res.sendFile(adminPanelFile);
});

// API: Get all cards
app.get('/api/cards', (req, res) => {
  try {
    const cards = JSON.parse(fs.readFileSync(cardsFile));
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read cards.json' });
  }
});

// API: Add a new card
app.post('/api/cards', (req, res) => {
  const newCard = req.body;

  try {
    const cards = JSON.parse(fs.readFileSync(cardsFile));
    cards.push(newCard);
    fs.writeFileSync(cardsFile, JSON.stringify(cards, null, 2));
    res.json({ success: true, message: 'Card added!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write to cards.json' });
  }
});

// API: Admin login check
app.post('/api/adminlogin', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Dashboard running at http://localhost:${PORT}`);
});