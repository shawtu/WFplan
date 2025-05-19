// Main Card Renderer (handles normal & mission-list cards)
export function createCard({ task, reward, estTime, missions }) {
  return `
    <div class="card collapsible">
      <div class="card-header">
        <button class="minimize-btn">-</button>
        <h3>${task}</h3>
        <input type="checkbox" class="check-off" />
      </div>
      <div class="card-content">
        ${reward ? `<p><strong>Reward:</strong> ${reward}</p>` : ""}
        ${estTime ? `<p><strong>Est. Time:</strong> ${estTime}</p>` : ""}
        ${missions && missions.length
          ? missions.map(createMissionCard).join('')
          : ""
        }
      </div>
    </div>
  `;
}

// Mission Card Renderer
export function createMissionCard({ missionTitle, tier, planet, difficulty, timeLeft }) {
  return `
    <div class="mission-card">
      <h4>${missionTitle}</h4>
      <p><strong>Tier:</strong> ${tier}</p>
      <p><strong>Planet:</strong> ${planet}</p>
      <p><strong>Difficulty:</strong> ${difficulty}</p>
      <p><strong>Time Left:</strong> ${timeLeft}</p>
    </div>
  `;
}


// Render cards into a container
export function renderCards(cards, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = cards.map(createCard).join('');
}