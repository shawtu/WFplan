import { timerIcon, diamondIcon } from './icons.js';
import { truncateReward } from './utils.js';

// Main Card Renderer (handles normal & mission-list cards)
export function createCard({ task, taskInfo, reward, estTime, missions, rewardMaxLen = 14 }) {
  // Create a unique/sanitized ID for this task
  const taskId = task.replace(/\W+/g, '_');
  return `
    <div class="card collapsible">
      <div class="card-header">
        <input type="checkbox" class="check-off" data-task-id="${taskId}" />
        <h3>${task}</h3>
      </div>
      <div class="card-summary">
        <div class="card-summary-row">
          <div class="card-summary-main">
            <span class="summary-est-time">
              <span class="icon-timer">${timerIcon}</span>
              <span class="summary-est-value">${estTime || ""}</span>
            </span>
            <span class="summary-reward">
              <span class="icon-diamond">${diamondIcon}</span>
              <span class="summary-reward-value">${truncateReward(reward || "", rewardMaxLen)}</span>
            </span>
          </div>
          <button class="minimize-btn" aria-label="Expand details">+</button>
        </div>
      </div>
      <div class="card-content hidden">
        ${taskInfo ? `<p>${taskInfo}</p>` : ""}
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