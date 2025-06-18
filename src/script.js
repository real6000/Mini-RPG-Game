const player = {
    name: "You",
    maxHp: 100,
    hp: 100,
    attackMin: 8,
    attackMax: 15
};

const enemy = {
    name: "Goblin",
    maxHp: 80,
    hp: 80,
    attackMin: 5,
    attackMax: 12
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
        log("You have been defeated!");
        inBattle = false;
        attackBtn.disabled = true;
        startBtn.disabled = false;
    }
}

function playerTurn() {
    const damage = randomDamage(player.attackMin, player.attackMax);
    enemy.hp = Math.max(enemy.hp - damage, 0);
    log(`You strike the ${enemy.name} for ${damage} damage!`);
    updateUI();

    if (enemy.hp <= 0) {
        log(`You defeated the ${enemy.name}!`);
        inBattle = false;
        attackBtn.disabled = true;
        startBtn.disabled = false;
        return;
    }

    // Enemy attacks after small delay
    setTimeout(enemyTurn, 600);
}

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
