import { buildCardData } from './cardDataBuilder.js';
import { renderCards } from './cards.js';
import { setupUIFunctionality } from './UIfunctionality.js';
import { startResetTimers } from './resetTimers.js';

document.addEventListener('DOMContentLoaded', async () => {
  const cardData = await buildCardData();
  renderCards(cardData.specialImportance, "special-importance-cards");
  renderCards(cardData.weeklyTasks, "weekly-tasks-cards");
  renderCards(cardData.dailyTasks, "daily-tasks-cards");
  renderCards(cardData.timeSensitive, "time-sensitive-cards");
  setupUIFunctionality();
  startResetTimers(); // <-- Add this!
});