const boardSize = 4;
boardArray = [];

for (let i=0; i<boardSize**2; i++) {
    boardArray.push(i);
}

function printBoardArray() {
    output = ""
    for (i=0; i<boardArray.length; i++) {
        output += boardArray[i] + " ";
    }
    console.log(output);
}

function refreshBoard() {
    const board = document.querySelector('.board');

    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    for (i=0;i<boardArray.length;i++) {
        number = parseInt(boardArray[i]) + 1;
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = "tile_" + number;
        tile.textContent = number;
        board.append(tile);
    }
}

function adjacentTiles() {
    emptyTileIndex = boardArray.indexOf(15);
    moves = [-1, -1, -1, -1];

    upTile = emptyTileIndex - boardSize;
    if (upTile < 0) {
        upTile = -1;
    }

    downTile = emptyTileIndex + boardSize;
    if (downTile >= boardSize**2) {
        downTile = -1;
    }

    leftTile = emptyTileIndex - 1;
    if ((leftTile + 1) % boardSize == 0) {
        leftTile = -1;
    }

    rightTile = emptyTileIndex + 1;
    if (rightTile % boardSize == 0) {
        rightTile = -1;
    }

    console.log(leftTile)
    return [leftTile, rightTile, upTile, downTile];
}

function enableTiles(moves) {
    for (i=0;i<4;i++) {
        if (moves[i] == -1) continue;

        tile_id = '#tile_' + (parseInt(moves[i]) + 1);
        const moveableTile = document.querySelector(tile_id);

        moveableTile.addEventListener('click', function() {
            swapTiles(moveableTile);
        });
        moveableTile.addEventListener('mouseover', function() {
            moveableTile.style.cursor = "pointer";
        });
        moveableTile.addEventListener('mouseout', function() {
            moveableTile.style.cursor = "default";
        });
    }
}

function resetTiles() {
    refreshBoard();
    enableTiles(adjacentTiles());
}

function swapTiles(tile) {
    clickedTile = tile.id.split("_")[1];
    clickedTleIndex = boardArray.indexOf(parseInt(clickedTile) - 1);
    emptyTileIndex = boardArray.indexOf(16 - 1);

    console.log(clickedTile);
    
    [boardArray[emptyTileIndex], boardArray[clickedTleIndex]] = 
        [boardArray[clickedTleIndex], boardArray[emptyTileIndex]];
    printBoardArray();
    resetTiles();
}



resetTiles();

// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]





