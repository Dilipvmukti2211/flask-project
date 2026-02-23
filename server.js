// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

// --- Basic Auth Middleware ---
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required.');
  }

  const base64 = authHeader.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');

  if (user === 'admin' && pass === 'vmukti@123') {
    return next(); // ✅ auth success
  }

  res.setHeader('WWW-Authenticate', 'Basic');
  return res.status(401).send('Access denied.');
};

// 🔐 Protect everything
app.use(auth);

// 🌐 Serve public folder after auth
app.use(express.static('public'));

// 📊 Serve JSON status
app.get('/status', (req, res) => {
  fs.readFile('./status.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read status file' });
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🌐 Secure Server running at http://localhost:${PORT}`);
});

