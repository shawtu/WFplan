// JavaScript for Minimize and Check-Off Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Minimize functionality for sections and cards
  const minimizeButtons = document.querySelectorAll('.minimize-btn');
  minimizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.collapsible'); // Find the collapsible parent (section or card)
      const content = parent.querySelector('.section-content, .card-content'); // Target content
      if (content) {
        content.classList.toggle('hidden'); // Toggle visibility
        btn.textContent = content.classList.contains('hidden') ? '+' : '-'; // Update button symbol
      }
    });
  });

  // Check-off functionality for checkboxes
  const checkOffCheckboxes = document.querySelectorAll('.check-off');
  checkOffCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.card'); // Find the card containing the checkbox
      if (checkbox.checked) {
        card.classList.add('checked-off'); // Add opacity styling for completed tasks
      } else {
        card.classList.remove('checked-off'); // Remove opacity styling
      }
    });
  });
});
