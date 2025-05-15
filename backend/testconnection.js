async function testConnection() {
  try {
    const response = await fetch('https://api.warframestat.us/pc');
    const data = await response.json();

    console.log('Connection successful! Here is some sample data:');
    console.log('Timestamp:', data.timestamp);
    console.log('News:', data.news[0]?.message || 'No news available');
    console.log('Current Alerts:', data.alerts.length);

    // Add more debug logs if needed
  } catch (error) {
    console.error('Error connecting to the API:', error);
  }
}

testConnection();