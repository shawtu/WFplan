export function setupUIFunctionality() {
  // Minimize functionality for sections and cards
  const minimizeButtons = document.querySelectorAll('.minimize-btn');
  minimizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.collapsible');
      const content = parent.querySelector('.section-content, .card-content');
      if (content) {
        content.classList.toggle('hidden');
        btn.textContent = content.classList.contains('hidden') ? '+' : '-';
      }
    });
  });

  // Check-off functionality for checkboxes
  const checkOffCheckboxes = document.querySelectorAll('.check-off');
  checkOffCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.card');
      if (checkbox.checked) {
        card.classList.add('checked-off');
      } else {
        card.classList.remove('checked-off');
      }
    });
  });
}