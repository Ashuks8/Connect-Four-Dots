document.addEventListener('DOMContentLoaded', () => {
    const ROWS = 6;
    const COLUMNS = 7;
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');

    let board = [];
    let currentPlayer = 'red';
    let gameOver = false;

    // Initialize the game board
    function initializeBoard() {
        board = Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(null));
        boardElement.innerHTML = '';

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }

        currentPlayer = 'red';
        gameOver = false;
        statusElement.textContent = "Red's turn";
    }

    // Handle cell click event
    function handleCellClick(e) {
        if (gameOver) return;

        const col = parseInt(e.target.dataset.col);

        // Find the lowest empty row in the clicked column
        const row = findAvailableRow(col);
        if (row === null) return;

        // Update the board state
        board[row][col] = currentPlayer;

        // Update the UI
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.classList.add(currentPlayer);

        // Check for win or draw
        if (checkWin(row, col)) {
            statusElement.textContent = `${capitalize(currentPlayer)} wins!`;
            gameOver = true;
        } else if (checkDraw()) {
            statusElement.textContent = "It's a draw!";
            gameOver = true;
        } else {
            // Switch players
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            statusElement.textContent = `${capitalize(currentPlayer)}'s turn`;
        }
    }

    // Find the lowest available row in a column
    function findAvailableRow(col) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                return row;
            }
        }
        return null;
    }

    // Check for a win condition
    function checkWin(row, col) {
        return (
            checkDirection(row, col, 0, 1) + checkDirection(row, col, 0, -1) >= 3 || // Horizontal
            checkDirection(row, col, 1, 0) + checkDirection(row, col, -1, 0) >= 3 || // Vertical
            checkDirection(row, col, 1, 1) + checkDirection(row, col, -1, -1) >= 3 || // Diagonal /
            checkDirection(row, col, 1, -1) + checkDirection(row, col, -1, 1) >= 3    // Diagonal \
        );
    }

    // Check a specific direction for matching discs
    function checkDirection(row, col, rowDir, colDir) {
        let count = 0;
        let r = row + rowDir;
        let c = col + colDir;

        while (
            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLUMNS &&
            board[r][c] === currentPlayer
        ) {
            count++;
            r += rowDir;
            c += colDir;
        }

        return count;
    }

    // Check for a draw condition
    function checkDraw() {
        return board.every(row => row.every(cell => cell !== null));
    }

    // Capitalize player name
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Reset game on button click
    resetButton.addEventListener('click', initializeBoard);

    // Start the game
    initializeBoard();
});
