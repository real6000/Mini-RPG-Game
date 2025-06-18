const mapSize = 10;
const map = document.getElementById('map');
let playerPos = { x: 0, y: 0 };
let hp = 100;
let xp = 0;
let level = 1;

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