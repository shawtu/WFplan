const express = require('express');
const https = require('https'); // Use the HTTPS module for fetch-like functionality
const app = express();
const PORT = 3000;

// Serve static files (like index.html) from the public folder
app.use(express.static('public'));

// Helper function to perform the HTTPS GET request
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      // Collect data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve promise on end
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'];
          if (contentType && contentType.includes('application/json')) {
            resolve(JSON.parse(data));
          } else {
            console.error('Unexpected response:', data);
            reject(new Error('Received non-JSON response from the API.'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Helper function to log categorized missions to the console
function logMissionsToConsole(categoryName, missions) {
  console.log(`${categoryName}:`);
  if (missions.length === 0) {
    console.log('No missions found for this category.');
  } else {
    missions.forEach((mission) => {
      console.log('---------------------------');
      console.log(`Mission Type: ${mission.missionType}`);
      console.log(`Tier: ${mission.tier}`);
      console.log(`Expiry: ${mission.expiry}`);
      console.log(`Location: ${mission.node}`);
      console.log(`Difficulty: ${mission.isHard ? 'Steel Path' : 'Regular'}`);
    });
  }
  console.log('');
}

// API Endpoint to fetch categorized Void Fissures
app.get('/api/voidmissions', async (req, res) => {
  try {
    const data = await fetchData('https://api.warframestat.us/pc');

    if (!data || !data.fissures || data.fissures.length === 0) {
      res.json({ speedyCracking: [], argonCrystalFarming: [], kuvaFarming: [], lichKeyCracking: [] });
      return;
    }

    const speedyCracking = [];
    const argonCrystalFarming = [];
    const kuvaFarming = [];
    const lichKeyCracking = [];

    // Categorize missions based on criteria
    data.fissures.forEach((fissure) => {
      const { missionType, tier, node, isHard } = fissure;

      // Speedy Relic Cracking
      if (
        missionType === 'Capture' || 
        (missionType === 'Exterminate' && !isHard && (tier === 'Lith' || tier === 'Meso'))
      ) {
        speedyCracking.push(fissure);
      }

      // Argon Crystal Farming
      if (node.includes('Void')) {
        argonCrystalFarming.push(fissure);
      }

      // Kuva Farming (Survival in Kuva Fortress)
      if (node.includes('Kuva Fortress') && missionType === 'Survival') {
        kuvaFarming.push(fissure);
      }

      // Cracking Lich Keys (Spy in Kuva Fortress)
      if (node.includes('Kuva Fortress') && missionType === 'Spy') {
        lichKeyCracking.push(fissure);
      }
    });

    // Respond with categorized data
    res.json({ speedyCracking, argonCrystalFarming, kuvaFarming, lichKeyCracking });

    // Log categorized missions to the console
    logMissionsToConsole('Speedy Relic Cracking Missions', speedyCracking);
    logMissionsToConsole('Argon Crystal Farming Missions', argonCrystalFarming);
    logMissionsToConsole('Kuva Farming Missions (Survival in Kuva Fortress)', kuvaFarming);
    logMissionsToConsole('Lich Key Cracking Missions (Spy in Kuva Fortress)', lichKeyCracking);
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    res.status(500).send('Error fetching data from the API');
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  // Fetch and log missions on server startup
  try {
    const data = await fetchData('https://api.warframestat.us/pc');

    if (!data || !data.fissures || data.fissures.length === 0) {
      console.log('No active Void Fissures found.');
      return;
    }

    const speedyCracking = [];
    const argonCrystalFarming = [];
    const kuvaFarming = [];
    const lichKeyCracking = [];

    // Categorize missions based on criteria
    data.fissures.forEach((fissure) => {
      const { missionType, tier, node, isHard } = fissure;

      // Speedy Relic Cracking
      if (
        missionType === 'Capture' || 
        (missionType === 'Exterminate' && !isHard && (tier === 'Lith' || tier === 'Meso'))
      ) {
        speedyCracking.push(fissure);
      }

      // Argon Crystal Farming
      if (node.includes('Void')) {
        argonCrystalFarming.push(fissure);
      }

      // Kuva Farming (Survival in Kuva Fortress)
      if (node.includes('Kuva Fortress') && missionType === 'Survival') {
        kuvaFarming.push(fissure);
      }

      // Cracking Lich Keys (Spy in Kuva Fortress)
      if (node.includes('Kuva Fortress') && missionType === 'Spy') {
        lichKeyCracking.push(fissure);
      }
    });

    // Log categorized missions to the console
    logMissionsToConsole('Speedy Relic Cracking Missions', speedyCracking);
    logMissionsToConsole('Argon Crystal Farming Missions', argonCrystalFarming);
    logMissionsToConsole('Kuva Farming Missions (Survival in Kuva Fortress)', kuvaFarming);
    logMissionsToConsole('Lich Key Cracking Missions (Spy in Kuva Fortress)', lichKeyCracking);
  } catch (error) {
    console.error('Error fetching data from the API during startup:', error);
  }
});