async function fetchVoidStormMissions() {
  try {
    const response = await fetch('https://api.warframestat.us/pc');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Filter for Railjack Void Storm missions
    const voidStormMissions = data.fissures.filter((fissure) => fissure.isStorm);

    if (voidStormMissions.length === 0) {
      console.log('No Void Storm missions available right now.');
    } else {
      console.log('All Void Storm Missions:');
      voidStormMissions.forEach((mission) => {
        const { missionType, node, tier, isHard, eta } = mission; // Use isHard for difficulty
        const [location, planet] = node.split(' (');
        const difficulty = isHard ? 'Steel Path' : 'Regular'; // Determine Steel Path or Regular
        console.log(`- Type: ${missionType}`);
        console.log(`  Location: ${location.trim()}, Planet: ${planet?.replace(')', '').trim()}`);
        console.log(`  Tier: ${tier}`);
        console.log(`  Difficulty: ${difficulty}`);
        console.log(`  Time Left: ${eta}`);
        console.log('--------------------------------');
      });

      // Filter for the best missions for Holokey farming
      const bestHolokeyMissions = voidStormMissions.filter((mission) => {
        const { missionType, node } = mission;
        return (
          (missionType === 'Skirmish' || missionType === 'Extermination') && // Include Extermination instead of Capture
          (node.includes('Pluto') || node.includes('Veil')) // Use "Veil" instead of "Veil Proxima"
        );
      });

      if (bestHolokeyMissions.length === 0) {
        console.log('No ideal Holokey farming missions available right now.');
      } else {
        console.log('Best Holokey Farming Missions:');
        bestHolokeyMissions.forEach((mission) => {
          const { missionType, node, tier, isHard, eta } = mission;
          const [location, planet] = node.split(' (');
          const difficulty = isHard ? 'Steel Path' : 'Regular';
          console.log(`- Type: ${missionType}`);
          console.log(`  Location: ${location.trim()}, Planet: ${planet?.replace(')', '').trim()}`);
          console.log(`  Tier: ${tier}`);
          console.log(`  Difficulty: ${difficulty}`);
          console.log(`  Time Left: ${eta}`);
          console.log('--------------------------------');
        });
      }
    }
  } catch (error) {
    console.error('Error fetching Void Storm missions:', error);
  }
}

// Run the function
fetchVoidStormMissions();