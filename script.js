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

// Reset the game
function resetGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    currentPlayer = 'red';
    renderBoard();
}

// Toggle the instructions display
function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
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

// Handle AI Move Logic
function aiMove(difficulty) {
    let col;
    if (difficulty === 'easy') {
        col = getRandomMove();
    } else if (difficulty === 'medium') {
        col = getBlockingMove() || getRandomMove();
    } else if (difficulty === 'hard') {
        col = getBestMove();
    }

    if (col !== null && !isColumnFull(col)) {
        makeMove(col, 'yellow');
        if (checkWinCondition('yellow')) {
            setTimeout(() => alert('YELLOW (AI) wins!'), 10);
        } else {
            currentPlayer = 'red';
        }
    } else {
        console.error("AI couldn't find a valid move!");
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

// Minimax Algorithm
function minimax(board, depth, isMaximizing, alpha, beta) {
    if (checkWinCondition('yellow')) return 100 - depth; // Prioritize quicker wins
    if (checkWinCondition('red')) return -100 + depth;  // Devalue quicker losses
    if (depth === 0 || boardIsFull()) return heuristic(board);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let col = 0; col < columns; col++) {
            if (!isColumnFull(col)) {
                for (let row = rows - 1; row >= 0; row--) {
                    if (!board[row][col]) {
                        board[row][col] = 'yellow';
                        let eval = minimax(board, depth - 1, false, alpha, beta);
                        board[row][col] = null;
                        maxEval = Math.max(maxEval, eval);
                        alpha = Math.max(alpha, eval);
                        if (beta <= alpha) break; // Prune
                        break;
                    }
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let col = 0; col < columns; col++) {
            if (!isColumnFull(col)) {
                for (let row = rows - 1; row >= 0; row--) {
                    if (!board[row][col]) {
                        board[row][col] = 'red';
                        let eval = minimax(board, depth - 1, true, alpha, beta);
                        board[row][col] = null;
                        minEval = Math.min(minEval, eval);
                        beta = Math.min(beta, eval);
                        if (beta <= alpha) break; // Prune
                        break;
                    }
                }
            }
        }
        return minEval;
    }
}

// Ensure AI Doesn't Freeze on Empty Columns
function getBestMove() {
    let depthLimit = 6; // Adjusted depth for "hard" AI
    let bestScore = -Infinity;
    let bestCol = null;

    for (let col = 0; col < columns; col++) {
        if (!isColumnFull(col)) {
            for (let row = rows - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    board[row][col] = 'yellow';
                    let score = minimax(board, depthLimit, false, -Infinity, Infinity);
                    board[row][col] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestCol = col;
                    }
                    break;
                }
            }
        }
    }

    return bestCol;
}

function heuristic(board) {
    let score = 0;

    // Center column heuristic - prioritize center for strategic advantage
    const centerColumn = Math.floor(columns / 2);
    for (let row = 0; row < rows; row++) {
        if (board[row][centerColumn] === 'yellow') score += 3;
        else if (board[row][centerColumn] === 'red') score -= 3;
    }

    // Add other heuristics for rows, columns, and diagonals
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] === 'yellow') score += 1; // Add points for yellow positions
            else if (board[row][col] === 'red') score -= 1; // Subtract points for red positions
        }
    }

    return score;
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

