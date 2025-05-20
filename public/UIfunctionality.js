// --- Button click actions ---
function minimizeClicked(btn) {
  const parent = btn.closest('.collapsible');
  const content = parent.querySelector('.section-content, .card-content');
  if (content) {
    const willBeHidden = !content.classList.contains('hidden');
    minimizeAction(parent, willBeHidden);
  }
}

function checkboxClicked(checkbox) {
  const card = checkbox.closest('.card');
  const taskId = checkbox.getAttribute('data-task-id');
  if (!card || !taskId) return;

  card.classList.toggle('checked-off', checkbox.checked);
  minimizeAction(card, checkbox.checked);
  saveCardCheckedState(taskId, checkbox.checked);
  reorderCardsInSection(card.parentElement);
}

// --- Visual helpers ---
function minimizeAction(cardOrParent, shouldMinimize) {
  const content = cardOrParent.querySelector('.section-content, .card-content');
  const minimizeBtn = cardOrParent.querySelector('.minimize-btn');
  if (content) {
    if (shouldMinimize) {
      content.classList.add('hidden');
      if (minimizeBtn) minimizeBtn.textContent = '+';
    } else {
      content.classList.remove('hidden');
      if (minimizeBtn) minimizeBtn.textContent = '-';
    }
  }
}

// --- Data helpers ---
function saveCardCheckedState(taskId, checked) {
  const checkedState = JSON.parse(localStorage.getItem('checkedOffTasks') || '{}');
  checkedState[taskId] = checked;
  localStorage.setItem('checkedOffTasks', JSON.stringify(checkedState));
}
// -- Restore Checkboxes to where they were on last visit ---
function restoreAllCardCheckedStates() {
  const checkedState = JSON.parse(localStorage.getItem('checkedOffTasks') || '{}');
  document.querySelectorAll('.check-off').forEach(checkbox => {
    const card = checkbox.closest('.card');
    const taskId = checkbox.getAttribute('data-task-id');
    if (!card || !taskId) return;
    const checked = !!checkedState[taskId];
    checkbox.checked = checked;
    card.classList.toggle('checked-off', checked);
    minimizeAction(card, checked);
  });
}

// --- Card ordering ---
function reorderCardsInSection(cardsContainer) {
  const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
  const notDone = allCards.filter(c => !c.classList.contains('checked-off'));
  const done = allCards.filter(c => c.classList.contains('checked-off'));
  allCards.forEach(c => cardsContainer.removeChild(c));
  [...notDone, ...done].forEach(c => cardsContainer.appendChild(c));
}

// --- Main setup ---
export function setupUIFunctionality() {
  // Add Button Listeners
  document.querySelectorAll('.minimize-btn').forEach(btn => {
    btn.addEventListener('click', () => minimizeClicked(btn));
  });

  // Add Checkbox Listeners (NO restore logic here)
  document.querySelectorAll('.check-off').forEach(checkbox => {
    checkbox.addEventListener('change', () => checkboxClicked(checkbox));
  });

  // Restore state separately, if desired
  restoreAllCardCheckedStates();
  reorderCardsInSection(document.getElementById("weekly-tasks-cards"));
  reorderCardsInSection(document.getElementById("daily-tasks-cards"));
}


// Utility to reset checked-off state for all cards in a section
function clearCheckedOffTasksForSection(sectionCardsContainerId) {
  // Get all checkboxes in this section
  const cardsSection = document.getElementById(sectionCardsContainerId);
  if (!cardsSection) return;

  const checkboxes = cardsSection.querySelectorAll('.check-off');
  const checkedState = JSON.parse(localStorage.getItem('checkedOffTasks') || '{}');
  let changed = false;

  checkboxes.forEach(checkbox => {
    const taskId = checkbox.getAttribute('data-task-id');
    if (taskId && checkedState[taskId] !== undefined) {
      delete checkedState[taskId];
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem('checkedOffTasks', JSON.stringify(checkedState));
  }

  // Update UI
  restoreAllCardCheckedStates();
  reorderCardsInSection(cardsSection);
}

// Add event listeners to the buttons
document.getElementById("clear-daily").addEventListener("click", function() {
  clearCheckedOffTasksForSection("daily-tasks-cards");
});
document.getElementById("clear-weekly").addEventListener("click", function() {
  clearCheckedOffTasksForSection("weekly-tasks-cards");
});