const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const endBtn = document.getElementById('end');
const startGameBtn = document.getElementById('startGame');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const modeRadios = document.getElementsByName('mode');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');

let player1Name = "Player 1";
let player2Name = "Player 2";
let currentPlayer = 'X';
let gameActive = false;
let isVsAI = false;
let cells = Array(9).fill("");
let player1Wins = 0;
let player2Wins = 0;

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill("");
  currentPlayer = 'X';
  gameActive = true;
  updateStatus();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function updateStatus() {
  const name = currentPlayer === 'X' ? player1Name : player2Name;
  status.textContent = `Now it's ${name}'s turn (${currentPlayer})`;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index] || (isVsAI && currentPlayer === 'O')) return;

  makeMove(index, currentPlayer);
  if (checkGameEnd()) return;

  switchTurn();

  if (isVsAI && currentPlayer === 'O' && gameActive) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  board.children[index].textContent = player;
}

function switchTurn() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
}

function checkWinner() {
  return winningCombos.some(([a, b, c]) => {
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function checkGameEnd() {
  if (checkWinner()) {
    const winner = currentPlayer === 'X' ? player1Name : player2Name;
    status.textContent = `${winner} wins! 🎉`;
    gameActive = false;

    if (currentPlayer === 'X') {
      player1Wins++;
    } else {
      player2Wins++;
    }
    updateScore();
    return true;
  } else if (cells.every(cell => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function aiMove() {
  const empty = cells.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  makeMove(move, 'O');
  if (!checkGameEnd()) switchTurn();
}

function updateScore() {
  score1.textContent = `${player1Name}: ${player1Wins}`;
  score2.textContent = `${player2Name}: ${player2Wins}`;
}

// Handle Mode toggle
modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'ai') {
      player2Input.classList.add('hidden');
    } else {
      player2Input.classList.remove('hidden');
    }
  });
});

// Start Game
startGameBtn.addEventListener('click', () => {
  isVsAI = [...modeRadios].find(r => r.checked).value === 'ai';

  player1Name = player1Input.value.trim() || "Player 1";
  player2Name = isVsAI ? "AI" : (player2Input.value.trim() || "Player 2");

  player1Wins = 0;
  player2Wins = 0;
  updateScore();

  player2Input.classList.toggle('hidden', isVsAI);
  homeScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  createBoard();
});

// Reset
resetBtn.addEventListener('click', () => {
  createBoard();
});

// End Game
endBtn.addEventListener('click', () => {
  homeScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  player1Input.value = '';
  player2Input.value = '';
  status.textContent = '';
  score1.textContent = '';
  score2.textContent = '';
});
