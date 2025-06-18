const player = {
    name: "You",
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    maxHp: 100,
    hp: 100,
    attackMin: 8,
    attackMax: 15,
    inventory: []
};

const enemy = {
    name: "Goblin",
    maxHp: 80,
    hp: 80,
    attackMin: 5,
    attackMax: 12
};

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

function updateUI() {
    playerHpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
    enemyHpBar.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
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
  if (enemy.hp <= 0) return;

  const damage = randomDamage(enemy.attackMin, enemy.attackMax);
  player.hp = Math.max(player.hp - damage, 0);
  log(`${enemy.name} hits you for ${damage} damage!`);
  updateUI();

  if (player.hp <= 0) {
    endBattle(false);
  }
}

function playerTurn() {
  const damage = randomDamage(player.attackMin, player.attackMax);
  enemy.hp = Math.max(enemy.hp - damage, 0);
  log(`You strike the ${enemy.name} for ${damage} damage!`);
  updateUI();

  if (enemy.hp <= 0) {
    log(`You defeated the ${enemy.name}!`);
    gainExp(50); // Gain experience for defeating the enemy
    inBattle=false;
    attackBtn.disabled=true;
    startBtn.disabled = false;
    endBattle(true);
    return;
  }

  setTimeout(enemyTurn, 600);
}
function endBattle(victory){
    inBattle=false;
    attackBtn.disabled = true;
    startBtn.disabled = false;
  if (victory) {
    log("🎉 You won! Press Start to fight again.");
  } else {
    log("💀 You lost! Press Start to try again.");
  }
}

function gainExp(amount){
    player.exp += amount;
    log(`You gained ${amount} EXP!`);

    while (player.exp >= player.expToNextLevel) {
        player.exp -= player.expToNextLevel;
        player.level++;
        player.expToNextLevel = Math.floor(player.expToNextLevel * 1.5);

        player.maxHp += 20;        // Increase max HP per level
        player.hp = player.maxHp;   // Heal to full on level up
        player.attackMin += 2;      // Increase attack range
        player.attackMax += 3;

        log(`🎉 You leveled up! You are now level ${player.level}.`);
    }

    updateUI();  // Update health bars and stats display
    updateLevelUI();
}

function updateLevelUI() {
    document.getElementById("player-level").textContent = player.level;
    document.getElementById("player-exp").textContent = player.exp;
    document.getElementById("player-exp-next").textContent = player.expToNextLevel;
}

function updateInventoryUI() {
    const inventoryList = document.getElementById("inventory-list");
    inventoryList.innerHTML = ""; // Clear existing items

    player.inventory.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => useItem(index));
        inventoryList.appendChild(li);
    });
}

function useItem(index){
    const item=player.inventory[index];
    if(!item) return;

    if(item.type==="heal"){
        player.hp=Math.min(player.hp+item.healAmount, player.maxHp);
        log('YOu used a ${item.name} and healed for ${item.healAmount} HP!');
        updateUI();
    }else if(item.type==="damage" && inBattle){
        enemy.hp=Math.max(enemy.hp-item.damageAmount, 0);
        log('You used a ${item.name} and dealt ${item.damageAmount} damage to the enemy!');
        updateUI();
    }else{
        log("You can't use this item right now!");
        return;
    }
    player.inventory.splice(index, 1); // Remove item from inventory
    updateInventoryUI(); // Update inventory display

    if(enemy.hp <= 0){
        log(`You defeated the ${enemy.name}!`);
        gainExp(50); // Gain experience for defeating the enemy
        inBattle = false;
        attackBtn.disabled = true;
        startBtn.disabled = false;
    }
})


//Listeners
startBtn.addEventListener("click", () => {
    // Reset stats
    player.hp = player.maxHp;
    enemy.hp = enemy.maxHp;
    updateUI();
    logBox.innerHTML = "";
    log("A wild Goblin appears!");

    inBattle = true;
    attackBtn.disabled = false;
    startBtn.disabled = true;
});

attackBtn.addEventListener("click", () => {
    if (!inBattle) return;
    playerTurn();
});

