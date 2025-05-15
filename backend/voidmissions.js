async function fetchVoidFissures() {
  try {
    const response = await fetch('https://api.warframestat.us/pc');
    const data = await response.json();

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

    // Log categorized missions
    console.log('Speedy Relic Cracking Missions:');
    logMissions(speedyCracking);

    console.log('\nArgon Crystal Farming Missions:');
    logMissions(argonCrystalFarming);

    console.log('\nKuva Farming Missions (Survival in Kuva Fortress):');
    logMissions(kuvaFarming);

    console.log('\nLich Key Cracking Missions (Spy in Kuva Fortress):');
    logMissions(lichKeyCracking);
  } catch (error) {
    console.error('Error fetching data from the API:', error);
  }
}

// Helper function to log missions with difficulty information
function logMissions(missions) {
  if (missions.length === 0) {
    console.log('No missions found for this category.');
    return;
  }

  missions.forEach((mission) => {
    console.log('---------------------------');
    console.log(`Mission Type: ${mission.missionType}`);
    console.log(`Tier: ${mission.tier}`);
    console.log(`Expiry: ${mission.expiry}`);
    console.log(`Location: ${mission.node}`);
    console.log(`Difficulty: ${mission.isHard ? 'Steel Path' : 'Regular'}`);
  });
}

fetchVoidFissures();