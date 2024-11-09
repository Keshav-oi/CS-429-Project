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
    // Calculate cell width and height
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the board before redrawing

    // Draw grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }

    // Draw current board state (X for Player, O for AI)
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col]) {
                ctx.fillText(board[row][col], col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
            }
        }
    }
}

// Handle the start button click event
startButton.addEventListener("click", () => {
    // Initialize or reset the game board
    board = Array(rows).fill().map(() => Array(cols).fill(null)); // Reset the game board
    turn = 'Player'; // Reset the turn to Player

    // Set canvas size dynamically based on the selected rows and columns
    canvas.width = 400;
    canvas.height = 400;

    // Adjust canvas size based on rows/cols if needed
    if (cols > rows) {
        canvas.width = 400;
        canvas.height = 400 * (rows / cols); // Adjust height for better scaling
    }

    // Set text font for the board
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the initial empty board
    drawBoard();

    // Update the status message
    document.getElementById("gameMessage").textContent = "Player's turn";
});

// Handle clicks on the canvas
canvas.addEventListener("click", (event) => {
    // Calculate cell width and height
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    // Calculate the column and row of the clicked cell
    const col = Math.floor(event.offsetX / cellWidth);
    const row = Math.floor(event.offsetY / cellHeight);

    // Debugging: Log row, col, and offset values
    console.log("Clicked at offsetX: " + event.offsetX + " offsetY: " + event.offsetY);
    console.log("Calculated cell - Row: " + row + " Col: " + col);

    // If the cell is empty, update the game state and redraw the board
    if (board[row][col] === null) {
        board[row][col] = turn === 'Player' ? 'X' : 'O';
        drawBoard();

        // Check for winner or change turn
        checkWinner(row, col);

        // Switch turns between Player and AI
        turn = (turn === 'Player') ? 'AI' : 'Player'; // Switch turn
        document.getElementById("gameMessage").textContent = `${turn}'s turn`;
    }
});

// A basic function to check if a player has won (you can improve it later with minimax)
function checkWinner(row, col) {
    // Placeholder function - you'll need to implement win logic later
    console.log(`${turn} clicked on (${row}, ${col})`);
}
