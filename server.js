const express = require('express');
// const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint
app.get('/proxy/looter', async (req, res) => {
  const endpoint = 'https://api.warframe.market/v1/items/looter/orders';
  try {
    const resp = await fetch(endpoint, { headers: { 'accept-language': 'en' } });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// (Optional) Handle SPA fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'syndicate.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});