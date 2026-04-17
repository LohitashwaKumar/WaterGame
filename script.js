let water = 0;
let waterPerClick = 1;
let progress = 0;

let costs = {
  bucket: 10,
  cart: 25,
  pump: 50,
  well: 100,
  filter: 150
};

const waterCount = document.getElementById("waterCount");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const factBox = document.getElementById("factBox");
const winPanel = document.getElementById("winPanel");

const collectBtn = document.getElementById("collectBtn");
const bucketUpgrade = document.getElementById("bucketUpgrade");
const cartUpgrade = document.getElementById("cartUpgrade");
const pumpUpgrade = document.getElementById("pumpUpgrade");
const wellUpgrade = document.getElementById("wellUpgrade");
const filterUpgrade = document.getElementById("filterUpgrade");
const restartBtn = document.getElementById("restartBtn");

const bucketCost = document.getElementById("bucketCost");
const cartCost = document.getElementById("cartCost");
const pumpCost = document.getElementById("pumpCost");
const wellCost = document.getElementById("wellCost");
const filterCost = document.getElementById("filterCost");

const facts = [
  "Every drop counts. Many communities still spend hours collecting water.",
  "Access to clean water can improve health and daily life.",
  "Reliable water systems reduce time lost to long water journeys.",
  "Water access supports education, hygiene, and community growth.",
  "Clean water changes everything."
];

function updateUI() {
  waterCount.textContent = water;
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;

  bucketCost.textContent = costs.bucket;
  cartCost.textContent = costs.cart;
  pumpCost.textContent = costs.pump;
  wellCost.textContent = costs.well;
  filterCost.textContent = costs.filter;

  bucketUpgrade.disabled = water < costs.bucket;
  cartUpgrade.disabled = water < costs.cart;
  pumpUpgrade.disabled = water < costs.pump;
  wellUpgrade.disabled = water < costs.well;
  filterUpgrade.disabled = water < costs.filter;

  if (progress >= 20) factBox.textContent = facts[1];
  if (progress >= 40) factBox.textContent = facts[2];
  if (progress >= 70) factBox.textContent = facts[3];
  if (progress >= 100) {
    factBox.textContent = facts[4];
    winPanel.classList.remove("hidden");
    collectBtn.disabled = true;
    bucketUpgrade.disabled = true;
    cartUpgrade.disabled = true;
    pumpUpgrade.disabled = true;
    wellUpgrade.disabled = true;
    filterUpgrade.disabled = true;
  }
}

collectBtn.addEventListener("click", () => {
  water += waterPerClick;
  updateUI();
});

bucketUpgrade.addEventListener("click", () => {
  if (water >= costs.bucket) {
    water -= costs.bucket;
    waterPerClick += 1;
    costs.bucket += 15;
    updateUI();
  }
});

cartUpgrade.addEventListener("click", () => {
  if (water >= costs.cart) {
    water -= costs.cart;
    waterPerClick += 2;
    costs.cart += 25;
    updateUI();
  }
});

pumpUpgrade.addEventListener("click", () => {
  if (water >= costs.pump) {
    water -= costs.pump;
    progress += 10;
    if (progress > 100) progress = 100;
    costs.pump += 30;
    updateUI();
  }
});

wellUpgrade.addEventListener("click", () => {
  if (water >= costs.well) {
    water -= costs.well;
    progress += 20;
    if (progress > 100) progress = 100;
    costs.well += 40;
    updateUI();
  }
});

filterUpgrade.addEventListener("click", () => {
  if (water >= costs.filter) {
    water -= costs.filter;
    progress += 30;
    if (progress > 100) progress = 100;
    costs.filter += 50;
    updateUI();
  }
});

restartBtn.addEventListener("click", () => {
  water = 0;
  waterPerClick = 1;
  progress = 0;

  costs = {
    bucket: 10,
    cart: 25,
    pump: 50,
    well: 100,
    filter: 150
  };

  collectBtn.disabled = false;
  winPanel.classList.add("hidden");
  updateUI();
});

updateUI();
