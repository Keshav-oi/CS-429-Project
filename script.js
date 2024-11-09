// script.js

// Constants for the game
const boardSize = 4; // Set board size to 4x4 or 5x5 as needed
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
let currentPlayer = 'X'; // Player starts as 'X'
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const cellSize = canvas.width / boardSize;

// Draw the initial empty board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the board
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (board[row][col]) {
                drawMarker(row, col, board[row][col]);
            }
        }
    }
}

// Draw a player's marker on the board
function drawMarker(row, col, player) {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
}

// Handle player click
canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    
    // Place player's marker if the cell is empty
    if (!board[y][x]) {
        board[y][x] = currentPlayer;
        drawBoard();
        
        if (checkWin(currentPlayer)) {
            document.getElementById('gameMessage').textContent = `${currentPlayer} wins!`;
            canvas.removeEventListener('click', arguments.callee); // End game
        } else if (isDraw()) {
            document.getElementById('gameMessage').textContent = "It's a draw!";
        } else {
            // Switch players
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('gameMessage').textContent = `${currentPlayer}'s turn`;
        }
    }
});

// Check for a win condition
function checkWin(player) {
    // Check rows and columns
    for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === player) ||
            board.map(row => row[i]).every(cell => cell === player)) {
            return true;
        }
    }

    // Check diagonals
    return (
        board.map((row, i) => row[i]).every(cell => cell === player) ||
        board.map((row, i) => row[boardSize - 1 - i]).every(cell => cell === player)
    );
}

// Check for draw condition
function isDraw() {
    return board.flat().every(cell => cell !== null);
}

// Initialize game on page load
window.onload = drawBoard;
