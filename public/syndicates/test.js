// test.js
// Standalone: Run with Node.js to test important name extraction and market price lookup
// Place this file in the same folder as CephalonSimaris.csv

import fs from 'fs/promises';

const CSV_FILE = './CephalonSimaris.csv';

// Fetch all warframe.market item names and url_names
async function getMarketItems() {
  const resp = await fetch('https://api.warframe.market/v1/items');
  const data = await resp.json();
  return data.payload.items;
}

// Parse CSV, return array of important item names
async function getImportantNames(csvPath) {
  const text = await fs.readFile(csvPath, 'utf-8');
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  let important = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim());
    const item = {};
    headers.forEach((h, idx) => {
      let val = values[idx] ?? '';
      if (h.toLowerCase() === "important") val = val.toLowerCase() === "true";
      item[h] = val;
    });
    if (item.Important === true) important.push(item.Name);
  }
  return important;
}

// Find the url_name for a given display name, with fallback to substring match
function getUrlNameForItem(itemName, marketItems) {
  // Exact match
  let found = marketItems.find(
    entry => entry.item_name.toLowerCase() === itemName.toLowerCase()
  );
  if (found) return found.url_name;
  // Substring match
  found = marketItems.find(
    entry => entry.item_name.toLowerCase().includes(itemName.toLowerCase())
  );
  return found ? found.url_name : null;
}

// Get lowest 5 in-game prices for a url_name

async function getLowestPrices(urlName, count = 5) {
  const endpoint = `https://api.warframe.market/v1/items/${urlName}/orders`;
  console.log("Fetching market endpoint:", endpoint);
  try {
    const resp = await fetch(endpoint, { headers: { 'accept-language': 'en' } });
    if (!resp.ok) {
      const body = await resp.text();
      console.log("Non-OK response body:", body);
      throw new Error("Not found");
    }
    const data = await resp.json();
    const orders = data.payload.orders;
    // Filter for sell orders where user is online or ingame
    const sellOrders = orders.filter(
      o =>
        o.order_type === "sell" &&
        (o.user.status === "online" || o.user.status === "ingame")
    );
    sellOrders.sort((a, b) => a.platinum - b.platinum);

    // Show 5 lowest sell prices, with user status
    console.log(`Lowest ${Math.min(count, sellOrders.length)} sell orders (online or ingame):`);
    sellOrders.slice(0, count).forEach((o, idx) => {
      console.log(`${idx + 1}. ${o.platinum}p - ${o.user.status}`);
    });
    // Return as array for further use if needed
    return sellOrders.slice(0, count).map(o => o.platinum);
  } catch (e) {
    console.log('Error during fetch or processing:', e);
    return [];
  }
}

// Main test logic
async function main() {
  console.log(`Reading important names from ${CSV_FILE}...`);
  const important = await getImportantNames(CSV_FILE);
  if (!important.length) {
    console.log('No important items found!');
    return;
  }
  console.log('Important item names:');
  important.forEach((name, idx) => console.log(`${idx + 1}. ${name}`));

  const first = important[0];
  console.log('\nFetching market url_name for:', first);
  const marketItems = await getMarketItems();
  const urlName = getUrlNameForItem(first, marketItems);

  if (!urlName) {
    console.log('Not found on warframe.market');
    return;
  }
  console.log('Market url_name:', urlName);

  console.log(`Fetching lowest 5 in-game prices for ${first} (${urlName})...`);
  const prices = await getLowestPrices(urlName, 5);
  if (!prices.length) {
    console.log('No in-game prices found.');
  } else {
    console.log('Lowest 5 in-game prices:', prices.join(', '));
  }
}

// Polyfill fetch for Node 18+ or use node-fetch for older
if (typeof fetch === 'undefined') {
  globalThis.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

main();