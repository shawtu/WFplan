async function fetchAndDisplaySyndicateMissions() {
  try {
    // Fetch data from the Warframe API
    const response = await fetch("https://api.warframestat.us/pc");
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract syndicate missions
    const syndicateMissions = data.syndicateMissions || [];
    console.log("Syndicate Missions Data:", syndicateMissions);

    // Display syndicate missions in a readable format
    syndicateMissions.forEach((mission) => {
      const { syndicate, nodes, jobs, eta } = mission;

      // Log syndicate name and ETA
      console.log(`Syndicate: ${syndicate}`);
      console.log(`Time Left: ${eta}`);

      // Log nodes
      if (nodes && nodes.length > 0) {
        console.log("Nodes:");
        nodes.forEach((node) => console.log(`  - ${node}`));
      } else {
        console.log("No active nodes.");
      }

      // Log jobs
      if (jobs && jobs.length > 0) {
        console.log("Jobs:");
        jobs.forEach((job, index) => {
          console.log(`  Job ${index + 1}:`);
          console.log(`    Type: ${job.type}`);
          console.log(`    Rewards: ${job.rewardPool.join(", ")}`);
          console.log(`    Enemy Levels: ${job.enemyLevels.join(" - ")}`);
          console.log(`    Standing: ${job.standingStages.join(", ")}`);
        });
      } else {
        console.log("No active jobs.");
      }

      console.log("-------------------------");
    });
  } catch (error) {
    console.error("Error fetching syndicate missions:", error);
  }
}

// Call the function
fetchAndDisplaySyndicateMissions();