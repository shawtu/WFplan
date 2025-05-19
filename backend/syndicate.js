async function fetchSyndicateMissions() {
  try {
    // Fetch data from the Warframe API
    const response = await fetch('https://api.warframestat.us/pc');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract syndicate missions
    const syndicateMissions = data.syndicateMissions || [];
    console.log("Syndicate Missions Data:", syndicateMissions);

    // Log details of each syndicate mission
    syndicateMissions.forEach((mission, index) => {
      console.log(`Mission ${index + 1}:`, mission);
    });
  } catch (error) {
    console.error("Error fetching syndicate missions:", error);
  }
}

// Call the function to fetch and log syndicate missions
fetchSyndicateMissions();