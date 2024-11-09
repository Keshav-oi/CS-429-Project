let rows = 6;
let columns = 7;
let board;
let currentPlayer = 'red';
let gameMode = 'multiplayer';
let difficulty = 'easy';
const gameBoard = document.getElementById('game-board');

// Initialize the game based on user input
function initializeGame() {
    rows = parseInt(document.getElementById('rows').value);
    columns = parseInt(document.getElementById('columns').value);
    gameMode = document.getElementById('mode').value;
    difficulty = document.getElementById('difficulty').value;
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    currentPlayer = 'red';
    renderBoard();
}

// Render the game board
function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    const cellSize = Math.min(80 / columns, 80 / rows) + 'vmin';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize;
            cell.style.height = cellSize;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col);

    if (!isColumnFull(col)) {
        makeMove(col, currentPlayer);
        if (checkWinCondition(currentPlayer)) {
            setTimeout(() => alert(`${currentPlayer.toUpperCase()} wins!`), 10);
            return;
        }
        switchTurns();
    }
}

// Make a move in a column
function makeMove(col, player) {
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = player;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add(player);
            break;
        }
    }
}

// Switch turns between players or activate AI
function switchTurns() {
    if (gameMode === 'multiplayer') {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    } else if (gameMode === 'ai' && currentPlayer === 'red') {
        currentPlayer = 'yellow';
        setTimeout(() => aiMove(difficulty), 500);
    } else {
        currentPlayer = 'red';
    }
}

// Check if a column is full
function isColumnFull(col) {
    return board[0][col] !== null;
}

// AI Move based on difficulty
function aiMove(difficulty) {
    let col;
    if (difficulty === 'easy') {
        col = getRandomMove();
    } else if (difficulty === 'medium') {
        col = getBlockingMove() || getRandomMove();
    } else if (difficulty === 'hard') {
        col = getBestMove();
    }
    if (!isColumnFull(col)) {
        makeMove(col, 'yellow');
        if (checkWinCondition('yellow')) {
            setTimeout(() => alert('YELLOW (AI) wins!'), 10);
        } else {
            currentPlayer = 'red';
        }
    }
}

// Easy mode - random column
function getRandomMove() {
    let col;
    do {
        col = Math.floor(Math.random() * columns);
    } while (isColumnFull(col));
    return col;
}

// Medium mode - block player if about to win
function getBlockingMove() {
    for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = 'red';
                if (checkWinCondition('red')) {
                    board[row][col] = null;
                    return col;
                }
                board[row][col] = null;
                break;
            }
        }
    }
    return null;
}

// Hard mode - Minimax
function getBestMove() {
    let bestScore = -Infinity;
    let bestCol;
    for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = 'yellow';
                let score = minimax(board, 4, false);
                board[row][col] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestCol = col;
                }
                break;
            }
        }
    }
    return bestCol;
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    if (checkWinCondition('yellow')) return 100;
    if (checkWinCondition('red')) return -100;
    if (depth === 0 || boardIsFull()) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let col = 0; col < columns; col++) {
            for (let row = rows - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    board[row][col] = 'yellow';
                    let eval = minimax(board, depth - 1, false);
                    board[row][col] = null;
                    maxEval = Math.max(maxEval, eval);
                    break;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let col = 0; col < columns; col++) {
            for (let row = rows - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    board[row][col] = 'red';
                    let eval = minimax(board, depth - 1, true);
                    board[row][col] = null;
                    minEval = Math.min(minEval, eval);
                    break;
                }
            }
        }
        return minEval;
    }
}

// Check if a player has won
function checkWinCondition(player) {
    // Check horizontal, vertical, and both diagonal directions
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (
                checkDirection(row, col, 1, 0, player) || // Horizontal
                checkDirection(row, col, 0, 1, player) || // Vertical
                checkDirection(row, col, 1, 1, player) || // Diagonal right
                checkDirection(row, col, 1, -1, player)   // Diagonal left
            ) {
                return true;
            }
        }
    }
    return false;
}

// Helper function to check for four consecutive pieces
function checkDirection(row, col, rowDir, colDir, player) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === player) {
            count++;
        } else {
            break;
        }
    }
    return count === 4;
}

// Check if board is full
function boardIsFull() {
    return board[0].every(cell => cell !== null);
}
