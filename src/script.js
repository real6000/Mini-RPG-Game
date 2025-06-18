const mapSize = 10;
const map = document.getElementById('map');
//player and enemy const
const playerHealthSpan = document.getElementById('player-health');
const playerAttackSpan = document.getElementById('player-attack');

const enemyStatsDiv = document.getElementById('enemy-stats');
const enemyHealthSpan = document.getElementById('enemy-health');
const enemyAttackSpan = document.getElementById('enemy-attack');

const startBtn = document.getElementById('start-encounter');
const attackBtn = document.getElementById('attack-btn');

const messageDiv = document.getElementById('message');
//end of const
const player={
    health: 100,
    attack: 10,
};
let playerPos = { x: 0, y: 0 };
let hp = 100;
let xp = 0;
let level = 1;
let enemy = null;

function createMap() {
  map.innerHTML = '';
  for(let y = 0; y < mapSize; y++) {
    for(let x = 0; x < mapSize; x++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if(x === playerPos.x && y === playerPos.y) {
        tile.classList.add('player');
        tile.textContent = '@';  // Player symbol
      }
      map.appendChild(tile);
    }
  }
}

function updateStats() {
  document.getElementById('hp').textContent = hp;
  document.getElementById('xp').textContent = xp;
  document.getElementById('level').textContent = level;
}

function updatePlayerStats(){
    playerHelathSpan.textContent = player.health;
    playerAttackSpan.textContent = player.attack;
}

function updateEnemyStats() {
    enemyHealthSpan.textContent = enemy.health;
    enemyAttackSpan.textContent = enemy.attack;
}

function createEnemy(){
    return {
        health: Math.floor(Math.random() * 50)+30,//30-79 hp
        attack: Math.floor(Math.random()*8)+5,//5-12 attack
    };
}

function startEncounter() {
    enemy =createEnemy();
    enemyStatsDiv.classList.remove('hidden');
    attackBtn.classList.remove('hidden');
    startBtn.disabled = true;
    messageDiv.textContent = 'An enemy has appeared!';
    updateEnemyStats();
}

function playerAttack() {
    enemy.health -= player.attack;
    if(enemy.health <= 0){
        enemy.health =0;
        messageDiv.textContent = 'You defeated the enemy! 🎉';
        enemyStatsDiv.classList.add('hidden');
        startBtn.disabled =false;
    }else{
        messageDiv.textContent = "You hit the enemy for " + player.attack + " damage!";
        updateEnemyStats();
        enemyAttack();
    }
}

function enemyAttack() {
    player.health -= enemy.attack;
    if(player.health <= 0) {
        player.health = 0;
        messageDiv.textContent = 'You have been defeated! 💀';
        attackBtn.classList.add('hidden');
        startBtn.disabled = false;
    } else {
        messageDiv.textContent += " The enemy hits you for " + enemy.attack + " damage!";
        updatePlayerStats();
    }
}

startBtn.addEventListener('click', startEncounter);
attackBtn.addEventListener('click', playerAttack);
updatePlayerStats();

document.addEventListener('keydown', (e) => {
  let moved = false;
  if(e.key === 'ArrowUp' && playerPos.y > 0) {
    playerPos.y--;
    moved = true;
  } else if(e.key === 'ArrowDown' && playerPos.y < mapSize - 1) {
    playerPos.y++;
    moved = true;
  } else if(e.key === 'ArrowLeft' && playerPos.x > 0) {
    playerPos.x--;
    moved = true;
  } else if(e.key === 'ArrowRight' && playerPos.x < mapSize - 1) {
    playerPos.x++;
    moved = true;
  }
  if(moved) {
    createMap();
  }
});

document.getElementById('attackBtn').addEventListener('click', () => {
  xp += 3;
  if(xp >= level * 10) {
    level++;
    hp = 100;
    alert('Level Up! You are now level ' + level);
  }
  updateStats();
});

createMap();
updateStats();