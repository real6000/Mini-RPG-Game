const player = {
  name: "You",
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  maxHp: 100,
  hp: 100,
  attackMin: 8,
  attackMax: 15,
  inventory: [] // Starting items
};

const enemyTypes = [
  { name: "Goblin", maxHp: 80, attackMin: 5, attackMax: 12 },
  { name: "Orc", maxHp: 120, attackMin: 10, attackMax: 18 },
  { name: "Troll", maxHp: 150, attackMin: 15, attackMax: 25 }
];

let currentEnemy = null;

const introDialogues = [
  { enemy: "You dare challenge me?", player: "I’ve fought worse before breakfast." },
  { enemy: "This will be your grave!", player: "Try me." },
  { enemy: "Flee while you can, mortal!", player: "I’m staying. Let’s finish this." }
];

const midFightDialogues = [
  { enemy: "You’re tougher than you look!", player: "Still standing, aren’t I?" },
  { enemy: "I’ll crush you!", player: "You’re welcome to try." },
  { enemy: "Bleed for me!", player: "You first." },
  { enemy: "You fight well... for a worm.", player: "You talk too much." }
];

const items = {
  potion: { name: "Healing Potion", type: "heal", healAmount: 30 },
  bomb: { name: "Bomb", type: "damage", damageAmount: 25 }
};

let inBattle = false;

const startBtn = document.getElementById("start-btn");
const attackBtn = document.getElementById("attack-btn");
const logBox = document.getElementById("log");
const playerHpBar = document.getElementById("player-hp");
const enemyHpBar = document.getElementById("enemy-hp");

addItem('potion');
addItem('bomb');

function showDialogue(message) {
  // Removed dialogueBox because you reverted to single log box only
  // Instead just log dialogue too
  log(message);
}

function updateUI() {
  playerHpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
  enemyHpBar.style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;

  document.getElementById("player-health").textContent = `${player.hp} / ${player.maxHp}`;

  const avgAttack = Math.floor((player.attackMin + player.attackMax) / 2);
  document.getElementById("player-attack").textContent = avgAttack;
}

function startNewEnemy() {
  const randomIndex = Math.floor(Math.random() * enemyTypes.length);
  const enemyTemplate = enemyTypes[randomIndex];
  currentEnemy = {
    ...enemyTemplate,
    hp: enemyTemplate.maxHp,
  };
}

function addItem(itemKey) {
  player.inventory.push(items[itemKey]);
  log(`You received a ${items[itemKey].name}!`);
  updateInventoryUI();
}

function log(message) {
  logBox.innerHTML = `<p>${message}</p>` + logBox.innerHTML;
}

function randomDamage(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function enemyTurn() {
  if (currentEnemy.hp <= 0) return;

  const damage = randomDamage(currentEnemy.attackMin, currentEnemy.attackMax);
  player.hp = Math.max(player.hp - damage, 0);
  log(`${currentEnemy.name} hits you for ${damage} damage!`);
  setTimeout(() => {
    showDialogue(`${currentEnemy.name}: "Is that all you've got?"`);
  }, 300);

  if (Math.random() < 0.2) {
    const line = midFightDialogues[Math.floor(Math.random() * midFightDialogues.length)];
    setTimeout(() => {
      log(`${currentEnemy.name}: "${line.enemy}"`);
      setTimeout(() => log(`${player.name}: "${line.player}"`), 400);
    }, 500);
  }

  updateUI();

  if (player.hp <= 0) {
    endBattle(false);
  }
}

function playerTurn() {
  const damage = randomDamage(player.attackMin, player.attackMax);
  currentEnemy.hp = Math.max(currentEnemy.hp - damage, 0);
  log(`You strike the ${currentEnemy.name} for ${damage} damage!`);
  setTimeout(() => {
    showDialogue(`You: "Take this!"`);
  }, 300);

  if (Math.random() < 0.2) {
    const line = midFightDialogues[Math.floor(Math.random() * midFightDialogues.length)];
    setTimeout(() => {
      log(`${currentEnemy.name}: "${line.enemy}"`);
      setTimeout(() => log(`${player.name}: "${line.player}"`), 400);
    }, 500);
  }

  updateUI();

  if (currentEnemy.hp <= 0) {
    log(`You defeated the ${currentEnemy.name}!`);
    gainExp(50);
    inBattle = false;
    attackBtn.disabled = true;
    startBtn.disabled = false;
    endBattle(true);
    return;
  }

  setTimeout(enemyTurn, 600);
}

function endBattle(victory) {
  inBattle = false;
  attackBtn.disabled = true;
  startBtn.disabled = false;

  if (victory) {
    log("🎉 You won! Press Start to fight again.");
    log(`${currentEnemy.name}: "This... can't be..."`);
    showDialogue(`You: "That was easy."`);
    setTimeout(() => log(`${player.name}: "Told you not to mess with me."`), 400);
  } else {
    log("💀 You lost! Press Start to try again.");
    showDialogue(`${currentEnemy.name}: "Better luck next time, weakling."`);
    setTimeout(() => log(`${player.name}: "Ugh... not... done yet..."`), 400);
  }
}

function gainExp(amount) {
  player.exp += amount;
  log(`You gained ${amount} EXP!`);

  while (player.exp >= player.expToNextLevel) {
    player.exp -= player.expToNextLevel;
    player.level++;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.5);

    player.maxHp += 30;
    player.hp = player.maxHp;
    player.attackMin += 2;
    player.attackMax += 3;

    log(`🎉 You leveled up! You are now level ${player.level}. Max HP increased!`);
  }

  updateUI();
  updateLevelUI();
}

function updateLevelUI() {
  document.getElementById("player-level").textContent = player.level;
  document.getElementById("player-exp").textContent = player.exp;
  document.getElementById("player-exp-next").textContent = player.expToNextLevel;
}

function updateInventoryUI() {
  const inventoryList = document.getElementById("inventory-list");
  inventoryList.innerHTML = "";

  player.inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => useItem(index));
    inventoryList.appendChild(li);
  });
}

function useItem(index) {
  const item = player.inventory[index];
  if (!item) return;

  if (item.type === "heal") {
    player.hp = Math.min(player.hp + item.healAmount, player.maxHp);
    log(`You used a ${item.name} and healed for ${item.healAmount} HP!`);
    updateUI();
  } else if (item.type === "damage" && inBattle) {
    currentEnemy.hp = Math.max(currentEnemy.hp - item.damageAmount, 0);
    log(`You used a ${item.name} and dealt ${item.damageAmount} damage to the enemy!`);
    updateUI();
  } else {
    log("You can't use this item right now!");
    return;
  }
  player.inventory.splice(index, 1);
  updateInventoryUI();

  if (currentEnemy.hp <= 0) {
    log(`You defeated the ${currentEnemy.name}!`);
    gainExp(50);
    inBattle = false;
    attackBtn.disabled = true;
    startBtn.disabled = false;
  }
}

// Listeners
startBtn.addEventListener("click", () => {
  startNewEnemy();

  player.hp = player.maxHp;
  updateUI();

  logBox.innerHTML = "";
  // dialogueBox removed, so no clearing here

  log(`A wild ${currentEnemy.name} appears!`);

  // Enemy taunt
  showDialogue(`${currentEnemy.name}: "You dare challenge me?"`);

  inBattle = true;
  attackBtn.disabled = false;
  startBtn.disabled = true;
});

attackBtn.addEventListener("click", () => {
  if (!inBattle) return;
  playerTurn();
});
