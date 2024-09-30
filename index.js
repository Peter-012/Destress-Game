const board = document.querySelector('#board');

const boardSize = 4;
let boardArray = [];
let tileCoord = [];

const enableImageTiles = true;

for (let i=0; i<boardSize**2; i++) {
    boardArray.push(i);
}

for (let i=0; i<boardSize; i++) {
    for (let j=0; j<boardSize; j++) {
        tileCoord.push([j, i]);
    }
}

function loadImage(tile_id) {
    const tile_number = parseInt(tile_id.split("_")[1]) - 1;
    if (tile_number === boardArray.length - 1) return;

    const tile = document.querySelector('#' + tile_id);
    tile.style.margin = '1px'

    const canvas = tile.firstChild;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = "https://mdn.github.io/shared-assets/images/examples/rhino.jpg";
    let imageWidth = image.width;
    let imageHeight = image.height;

    // Fit full image to the board
    let cropDiff = 0
    let sx = 0; sy = 0; sWidth = 0; sHeight = 0;
    if (imageWidth > imageHeight) {
        cropDiff = imageWidth - imageHeight;
        sx = Math.floor(cropDiff / 2);
        sWidth = imageHeight;
        sHeight = imageHeight;
    } else {
        cropDiff = imageHeight - imageWidth;
        sy = Math.floor(cropDiff / 2);
        sWidth = imageWidth;
        sHeight = imageWidth;
    }

    // Partition the image
    let tileLength = Math.floor(sWidth / boardSize);
    [x,y] = tileCoord[tile_number];

    sx += tileLength * x;
    sy += tileLength * y;

    // Draw tile image
    ctx.drawImage(image, sx, sy, tileLength, tileLength, 0, 0, canvas.width, canvas.height);
}

function loadNumber(tile_id) {
    const tile_number = parseInt(tile_id.split("_")[1]) - 1;
    if (tile_number === boardArray.length - 1) return;

    const tile = document.querySelector('#' + tile_id);
    tile.textContent = tile_number;
    tile.style.backgroundColor = 'rgba(145, 6, 110, 0.434)';
    tile.style.border = '1px solid'
    tile.style.margin = '1px'
}


function printBoardArray() {
    let output = ""
    for (i=0; i<boardArray.length; i++) {
        output += boardArray[i] + " ";
    }
    console.log(output);
}

function refreshBoard() {
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    for (i=0;i<boardArray.length;i++) {
        let number = parseInt(boardArray[i]) + 1;
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = "tile_" + number;
        board.append(tile);

        const canvas = document.createElement('canvas');
        canvas.classList.add('canvas');
        tile.append(canvas);

        if (enableImageTiles) {
            loadImage(tile.id);
        } else {
            loadNumber(tile.id);
        }
    }
}

function adjacentTiles() {
    let emptyTileIndex = boardArray.indexOf(boardArray.length - 1);

    let upTile = emptyTileIndex - boardSize;
    if (upTile < 0) {
        upTile = -1;
    }

    let downTile = emptyTileIndex + boardSize;
    if (downTile >= boardSize**2) {
        downTile = -1;
    }

    let leftTile = emptyTileIndex - 1;
    if ((leftTile + 1) % boardSize == 0) {
        leftTile = -1;
    }

    let rightTile = emptyTileIndex + 1;
    if (rightTile % boardSize == 0) {
        rightTile = -1;
    }

    return [leftTile, rightTile, upTile, downTile];
}

function enableTiles(moves) {
    for (i=0;i<boardSize;i++) {
        if (moves[i] == -1) continue;

        let tile_id = '#tile_' + (parseInt(moves[i]) + 1);
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

function swapTiles(tile) {
    let clickedTile = tile.id.split("_")[1];
    let clickedTleIndex = boardArray.indexOf(parseInt(clickedTile) - 1);
    let emptyTileIndex = boardArray.indexOf(boardArray.length - 1);
    
    [boardArray[emptyTileIndex], boardArray[clickedTleIndex]] = 
        [boardArray[clickedTleIndex], boardArray[emptyTileIndex]];
    printBoardArray();
    resetTiles();
}

function resetTiles() {
    refreshBoard();
    enableTiles(adjacentTiles());
}

resetTiles();

// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]





