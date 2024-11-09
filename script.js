// Variables for grid size and game state
let rows = 4;
let cols = 4;
let board = [];
let turn = 'Player'; // Player starts the game

// Getting elements
const rowSlider = document.getElementById("rowSlider");
const colSlider = document.getElementById("colSlider");
const rowValue = document.getElementById("rowValue");
const colValue = document.getElementById("colValue");
const startButton = document.getElementById("startButton");
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// Update the displayed row and column values when sliders change
rowSlider.addEventListener("input", () => {
    rows = rowSlider.value;
    rowValue.textContent = rows;
});

colSlider.addEventListener("input", () => {
    cols = colSlider.value;
    colValue.textContent = cols;
});

// Draw the game board based on selected rows and columns
function drawBoard() {
    // Update the canvas size based on rows and columns
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the board before redrawing

    // Draw grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
}

// Handle the start button click event
startButton.addEventListener("click", () => {
    // Initialize or reset the game board
    board = Array(rows).fill().map(() => Array(cols).fill(null)); // Reset the game board
    turn = 'Player'; // Reset the turn to Player
    drawBoard(); // Draw the board with the selected size
    document.getElementById("gameMessage").textContent = "Player's turn";
});

// Drawing logic for player's and AI's moves (just simple markers for now)
canvas.addEventListener("click", (event) => {
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const col = Math.floor(event.offsetX / cellWidth);
    const row = Math.floor(event.offsetY / cellHeight);

    if (board[row][col] === null) {
        board[row][col] = turn === 'Player' ? 'X' : 'O';
        drawBoard();
        // Draw markers
        ctx.fillText(board[row][col], col * cellWidth + cellWidth / 3, row * cellHeight + cellHeight / 1.5);

        // Check for winner or change turn
        checkWinner(row, col);

        turn = (turn === 'Player') ? 'AI' : 'Player'; // Switch turn
        document.getElementById("gameMessage").textContent = `${turn}'s turn`;
    }
});

// A basic function to check if a player has won (you can improve it later with minimax)
function checkWinner(row, col) {
    // Placeholder function - you'll need to implement win logic later
    console.log(`${turn} clicked on (${row}, ${col})`);
}
