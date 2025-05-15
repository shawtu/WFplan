const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Warframe Backend! Use /api/rotations to fetch rotational data.');
});

// Rotational Data Route
app.get('/api/rotations', async (req, res) => {
  try {
    const response = await fetch('https://api.warframestat.us/pc');
    const data = await response.json();

    const rotations = {
      baro: {
        nextArrival: data.baro.startString,
        items: data.baro.inventory.map(item => item.item),
      },
      tenetMelee: {
        currentItem: data.tenetCycle.weapon,
        nextRotation: data.tenetCycle.expiry,
      },
    };

    res.json(rotations);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});