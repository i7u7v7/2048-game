const container = document.getElementById('game-container');
let board = [];

function createBoard() {
  board = Array(4).fill().map(() => Array(4).fill(0));
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  let empty = [];
  board.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val === 0) empty.push([r, c]);
    });
  });
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  container.innerHTML = '';
  board.forEach(row => {
    row.forEach(val => {
      const div = document.createElement('div');
      div.className = 'tile';
      div.textContent = val !== 0 ? val : '';
      div.setAttribute('data-value', val);
      container.appendChild(div);
    });
  });
}

function move(dir) {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let row = getLine(dir, i);
    let newRow = compress(row);
    if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true;
    setLine(dir, i, newRow);
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function getLine(dir, i) {
  return ['left', 'right'].includes(dir)
    ? board[i].slice()
    : board.map(row => row[i]);
}

function setLine(dir, i, arr) {
  if (dir === 'right' || dir === 'down') arr.reverse();
  if (['left', 'right'].includes(dir)) {
    board[i] = arr;
  } else {
    for (let r = 0; r < 4; r++) board[r][i] = arr[r];
  }
}

function compress(arr) {
  arr = arr.filter(x => x !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter(x => x !== 0).concat(Array(4 - arr.filter(x => x !== 0).length).fill(0));
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
  }
});

// TOUCH SWIPE SUPPORT
let touchStartX = 0, touchStartY = 0;

container.addEventListener('touchstart', e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

container.addEventListener('touchend', e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move('right');
    else if (dx < -30) move('left');
  } else {
    if (dy > 30) move('down');
    else if (dy < -30) move('up');
  }
}, { passive: true });

createBoard();
