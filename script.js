window.addEventListener('load', () => {
    const boardElement = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restart-btn');

    const gridSize = 4;
    let board = [];
    let score = 0;
    let isGameOver = false;
    let isMoving = false;
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

    function startGame() {
        board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        score = 0;
        isGameOver = false;
        isMoving = false;
        updateScore();
        boardElement.innerHTML = '';

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            boardElement.appendChild(cell);
        }

        addRandomTile();
        addRandomTile();
        drawBoard();
        handleGameOver();
    }

    function drawBoard() {
        const existingTiles = new Map();

        for (const tile of boardElement.querySelectorAll('.tile')) {
            const id = tile.dataset.id;
            existingTiles.set(id, tile);
        }

        for(let r = 0; r < gridSize; r++){
            for(let c = 0; c < gridSize; c++){
                if(board[r][c] !== 0) {
                    const value = board[r][c].value;
                    const id = board[r][c].id;
                    const boardWidth = boardElement.clientWidth;
                    const gap = parseFloat(window.getComputedStyle(boardElement).gap);
                    const cellSize = (boardWidth - gap * (gridSize + 1)) / gridSize;

                    if(existingTiles.has(id)){
                        const tile = existingTiles.get(id);

                        tile.style.width = `${cellSize}px`;
                        tile.style.height = `${cellSize}px`;
                        tile.style.top = `${r * (cellSize + gap) + gap}px`;
                        tile.style.left = `${c * (cellSize + gap) + gap}px`;

                        if (tile.dataset.value != value) {
                            tile.dataset.value = value;
                            tile.textContent = value;
                            tile.classList.add('tile-merged');
                        }
                        existingTiles.delete(id);
                    } else {
                        const tile = document.createElement('div');
                        tile.classList.add('tile', 'tile-new');
                        tile.dataset.id = id;
                        tile.dataset.value = value;
                        tile.textContent = value;
                        tile.style.width = `${cellSize}px`;
                        tile.style.height = `${cellSize}px`;
                        tile.style.top = `${r * (cellSize + gap) + gap}px`;
                        tile.style.left = `${c * (cellSize + gap) + gap}px`;
                        boardElement.appendChild(tile);
                    }
                }
            }
        }

        for (const tile of existingTiles.values()) {
            tile.remove();
        }

        setTimeout(() => {
            for (const tile of boardElement.querySelectorAll('.tile')) {
                tile.classList.remove('tile-new', 'tile-merged');
            }
        }, 150);
    }

    let tileIdCounter = 1;
    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            board[r][c] = { value, id: (tileIdCounter++).toString() };
        }
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function slide(row) {
        let arr = row.filter(cell => cell !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].value === arr[i+1].value) {
                arr[i].value *= 2;
                score += arr[i].value;
                arr[i+1].value = 0; // Mark for removal
            }
        }

        arr = arr.filter(cell => cell.value !== 0);

        while (arr.length < gridSize) arr.push(0);
        return arr;
    }

    function move(direction) {
        if (isMoving || isGameOver) return;
        isMoving = true;
        let moved = false;

        const tempBoard = JSON.parse(JSON.stringify(board));
        const vectors = { up: { r: -1, c: 0 }, down: { r: 1, c: 0 }, left: { r: 0, c: -1 }, right: { r: 0, c: 1 } };
        const vector = vectors[direction];

        const buildTraversals = (vector) => {
            const traversals = { r: [], c: [] };
            for(let pos = 0; pos < gridSize; pos++) {
                traversals.r.push(pos);
                traversals.c.push(pos);
            }
            if (vector.r === 1) traversals.r = traversals.r.reverse();
            if (vector.c === 1) traversals.c = traversals.c.reverse();
            return traversals;
        };

        const traversals = buildTraversals(vector);

        traversals.r.forEach(r => {
            traversals.c.forEach(c => {
                if (tempBoard[r][c] !== 0) {
                    let current_r = r, current_c = c;
                    let next_r = r + vector.r, next_c = c + vector.c;

                    while (next_r >= 0 && next_r < gridSize && next_c >= 0 && next_c < gridSize) {
                        if (tempBoard[next_r][next_c] === 0) {
                            current_r = next_r;
                            current_c = next_c;
                        } else if (tempBoard[next_r][next_c].value === tempBoard[r][c].value) {
                            current_r = next_r;
                            current_c = next_c;
                            break;
                        } else {
                            break;
                        }
                        next_r += vector.r;
                        next_c += vector.c;
                    }

                    if (current_r !== r || current_c !== c) {
                        if (tempBoard[current_r][current_c] !== 0) {
                            tempBoard[current_r][current_c].value *= 2;
                            score += tempBoard[current_r][current_c].value;
                        } else {
                            tempBoard[current_r][current_c] = tempBoard[r][c];
                        }
                        tempBoard[r][c] = 0;
                        moved = true;
                    }
                }
            });
        });

        if (moved) {
            board = tempBoard;
            addRandomTile();
            drawBoard();
            updateScore();
            if(checkGameOver()) {
                isGameOver = true;
                setTimeout(handleGameOver, 500);
            }
        }

        setTimeout(() => { isMoving = false; }, 150);
    }

    function canMove() {
            for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) return true;
                if (r < gridSize - 1 && board[r + 1][c] !== 0 && board[r][c].value === board[r + 1][c].value) return true;
                if (c < gridSize - 1 && board[r][c + 1] !== 0 && board[r][c].value === board[r][c + 1].value) return true;
            }
        }
        return false;
    }

    function checkGameOver() { return !canMove(); }

    function handleGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        if (isGameOver) {
            if (!overlay) {
                const newOverlay = document.createElement('div');
                newOverlay.id = 'game-over-overlay';
                newOverlay.innerHTML = `<h2>Game Over!</h2>`;
                boardElement.appendChild(newOverlay);
                newOverlay.style.display = 'flex';
            } else {
                overlay.style.display = 'flex';
            }
        } else {
            if (overlay) overlay.remove();
        }
    }

    function handleInput(e) {
        switch(e.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    }

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) return;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            move(deltaX > 0 ? 'right' : 'left');
        } else {
            move(deltaY > 0 ? 'down' : 'up');
        }
    }

    window.addEventListener('keydown', handleInput);
    restartButton.addEventListener('click', startGame);
    boardElement.addEventListener('touchstart', handleTouchStart, false);
    boardElement.addEventListener('touchend', handleTouchEnd, false);
    window.addEventListener('resize', () => drawBoard());

    startGame();
});