let water = 0;
let waterPerClick = 1;
let progress = 0;
let timeLeft = 60;
let gameOver = false;
let timerInterval = null;
let actionHistory = [];

let costs = {
  bucket: 10,
  cart: 25,
  pump: 50,
  well: 100,
  filter: 150
};

const waterCount = document.getElementById("waterCount");
const waterPerClickText = document.getElementById("waterPerClickText");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const factBox = document.getElementById("factBox");
const npcBox = document.getElementById("npcBox");
const timerText = document.getElementById("timerText");
const winPanel = document.getElementById("winPanel");
const losePanel = document.getElementById("losePanel");
const buttonZone = document.getElementById("buttonZone");
const actionLog = document.getElementById("actionLog");

const collectBtn = document.getElementById("collectBtn");
const bucketUpgrade = document.getElementById("bucketUpgrade");
const cartUpgrade = document.getElementById("cartUpgrade");
const pumpUpgrade = document.getElementById("pumpUpgrade");
const wellUpgrade = document.getElementById("wellUpgrade");
const filterUpgrade = document.getElementById("filterUpgrade");
const restartBtn = document.getElementById("restartBtn");
const retryBtn = document.getElementById("retryBtn");

const bucketCost = document.getElementById("bucketCost");
const cartCost = document.getElementById("cartCost");
const pumpCost = document.getElementById("pumpCost");
const wellCost = document.getElementById("wellCost");
const filterCost = document.getElementById("filterCost");

const facts = [
  "Every drop counts. Many communities still spend hours collecting water.",
  "Access to clean water improves health, hygiene, and daily life.",
  "Reliable water systems reduce time spent on long water trips.",
  "Communities with safe water can focus more on school, work, and growth.",
  "Clean water changes everything."
];

function addAction(message) {
  actionHistory.unshift(message);
  actionHistory = actionHistory.slice(0, 3);
  renderActionLog();
}

function renderActionLog() {
  actionLog.innerHTML = "";

  if (actionHistory.length === 0) {
    actionLog.innerHTML = "<li>No actions yet.</li>";
    return;
  }

  actionHistory.forEach(action => {
    const li = document.createElement("li");
    li.textContent = action;
    actionLog.appendChild(li);
  });
}

function showFloatingText(text) {
  const float = document.createElement("div");
  float.className = "floating-text";
  float.textContent = text;
  buttonZone.appendChild(float);

  setTimeout(() => {
    float.remove();
  }, 800);
}

function updateBackgroundStage() {
  document.body.classList.remove("stage-0", "stage-1", "stage-2", "stage-3", "stage-4");

  if (progress >= 100) {
    document.body.classList.add("stage-4");
  } else if (progress >= 75) {
    document.body.classList.add("stage-3");
  } else if (progress >= 50) {
    document.body.classList.add("stage-2");
  } else if (progress >= 25) {
    document.body.classList.add("stage-1");
  } else {
    document.body.classList.add("stage-0");
  }
}

function updateFactBox() {
  if (progress >= 100) {
    factBox.textContent = facts[4];
  } else if (progress >= 70) {
    factBox.textContent = facts[3];
  } else if (progress >= 40) {
    factBox.textContent = facts[2];
  } else if (progress >= 20) {
    factBox.textContent = facts[1];
  } else {
    factBox.textContent = facts[0];
  }
}

function updateNpcMessage() {
  if (progress >= 90) {
    npcBox.textContent = "Guide: Just a little more. The whole village is counting on you.";
  } else if (progress >= 70) {
    npcBox.textContent = "Guide: The filtration system is making a huge difference.";
  } else if (progress >= 50) {
    npcBox.textContent = "Guide: The village is improving. Keep building momentum.";
  } else if (progress >= 30) {
    npcBox.textContent = "Guide: The well is almost repaired. Stay focused.";
  } else if (waterPerClick >= 4) {
    npcBox.textContent = "Guide: Better tools mean faster water collection. Smart move.";
  } else {
    npcBox.textContent = "Guide: Start gathering water and invest in tools that help the whole village.";
  }
}

function updateButtons() {
  if (gameOver) {
    collectBtn.disabled = true;
    bucketUpgrade.disabled = true;
    cartUpgrade.disabled = true;
    pumpUpgrade.disabled = true;
    wellUpgrade.disabled = true;
    filterUpgrade.disabled = true;
    return;
  }

  bucketUpgrade.disabled = water < costs.bucket;
  cartUpgrade.disabled = water < costs.cart;
  pumpUpgrade.disabled = water < costs.pump;
  wellUpgrade.disabled = water < costs.well;
  filterUpgrade.disabled = water < costs.filter;
}

function updateUI() {
  waterCount.textContent = water;
  waterPerClickText.textContent = waterPerClick;
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  timerText.textContent = timeLeft;

  bucketCost.textContent = costs.bucket;
  cartCost.textContent = costs.cart;
  pumpCost.textContent = costs.pump;
  wellCost.textContent = costs.well;
  filterCost.textContent = costs.filter;

  updateFactBox();
  updateNpcMessage();
  updateBackgroundStage();
  updateButtons();
  renderActionLog();
}

function saveGame() {
  const saveData = {
    water,
    waterPerClick,
    progress,
    timeLeft,
    costs,
    actionHistory,
    gameOver
  };
  localStorage.setItem("dropQuestSave", JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem("dropQuestSave");
  if (!saved) return;

  const data = JSON.parse(saved);

  water = data.water ?? 0;
  waterPerClick = data.waterPerClick ?? 1;
  progress = data.progress ?? 0;
  timeLeft = data.timeLeft ?? 60;
  costs = data.costs ?? {
    bucket: 10,
    cart: 25,
    pump: 50,
    well: 100,
    filter: 150
  };
  actionHistory = data.actionHistory ?? [];
  gameOver = data.gameOver ?? false;

  if (progress >= 100) {
    winPanel.classList.remove("hidden");
  }

  if (timeLeft <= 0 && progress < 100) {
    losePanel.classList.remove("hidden");
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function endGame(win) {
  gameOver = true;
  stopTimer();

  if (win) {
    winPanel.classList.remove("hidden");
    addAction("Victory! The village now has full clean water access.");
  } else {
    losePanel.classList.remove("hidden");
    addAction("Challenge failed. Time ran out before the village was fully supplied.");
  }

  updateUI();
  saveGame();
}

function startTimer() {
  stopTimer();

  timerInterval = setInterval(() => {
    if (gameOver) return;

    timeLeft--;
    updateUI();
    saveGame();

    if (timeLeft <= 0 && progress < 100) {
      timeLeft = 0;
      endGame(false);
    }
  }, 1000);
}

function resetGame() {
  water = 0;
  waterPerClick = 1;
  progress = 0;
  timeLeft = 60;
  gameOver = false;
  actionHistory = [];

  costs = {
    bucket: 10,
    cart: 25,
    pump: 50,
    well: 100,
    filter: 150
  };

  winPanel.classList.add("hidden");
  losePanel.classList.add("hidden");

  addAction("New challenge started.");
  updateUI();
  saveGame();
  startTimer();
}

collectBtn.addEventListener("click", () => {
  if (gameOver) return;

  water += waterPerClick;
  showFloatingText(`+${waterPerClick}`);
  addAction(`Collected ${waterPerClick} water.`);
  updateUI();
  saveGame();
});

bucketUpgrade.addEventListener("click", () => {
  if (water >= costs.bucket && !gameOver) {
    water -= costs.bucket;
    waterPerClick += 1;
    addAction("Bought Better Bucket.");
    costs.bucket += 15;
    updateUI();
    saveGame();
  }
});

cartUpgrade.addEventListener("click", () => {
  if (water >= costs.cart && !gameOver) {
    water -= costs.cart;
    waterPerClick += 2;
    addAction("Bought Water Cart.");
    costs.cart += 25;
    updateUI();
    saveGame();
  }
});

pumpUpgrade.addEventListener("click", () => {
  if (water >= costs.pump && !gameOver) {
    water -= costs.pump;
    progress += 10;
    if (progress > 100) progress = 100;
    addAction("Repaired part of the water pump.");
    costs.pump += 30;
    updateUI();
    saveGame();

    if (progress >= 100) {
      endGame(true);
    }
  }
});

wellUpgrade.addEventListener("click", () => {
  if (water >= costs.well && !gameOver) {
    water -= costs.well;
    progress += 20;
    if (progress > 100) progress = 100;
    addAction("Built a community well.");
    costs.well += 40;
    updateUI();
    saveGame();

    if (progress >= 100) {
      endGame(true);
    }
  }
});

filterUpgrade.addEventListener("click", () => {
  if (water >= costs.filter && !gameOver) {
    water -= costs.filter;
    progress += 30;
    if (progress > 100) progress = 100;
    addAction("Installed a filtration system.");
    costs.filter += 50;
    updateUI();
    saveGame();

    if (progress >= 100) {
      endGame(true);
    }
  }
});

restartBtn.addEventListener("click", resetGame);
retryBtn.addEventListener("click", resetGame);

loadGame();
updateUI();

if (!gameOver && progress < 100 && timeLeft > 0) {
  if (actionHistory.length === 0) {
    addAction("Loaded saved progress.");
  }
  startTimer();
}
