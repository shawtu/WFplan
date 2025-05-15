// Basic JavaScript for fetching and displaying rotational items
document.addEventListener("DOMContentLoaded", () => {
  const rotationalItems = [
    { name: "Baro Ki'Teer", next: "May 20, 2025" },
    { name: "Tenet Melee Rotation", next: "May 16, 2025" },
    { name: "SP Vendor (Umbra Forma)", next: "May 21, 2025" }
  ];

  const rotationalList = document.getElementById("rotational-list");

  rotationalItems.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name}: Next Rotation on ${item.next}`;
    rotationalList.appendChild(listItem);
  });
});