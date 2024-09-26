const board = document.querySelector('#board');

const boardSize = 4;
let boardArray = [];

for (let i=0; i<boardSize**2; i++) {
    boardArray.push(i);
}

function loadImage(tile_id) {
    const tile = document.querySelector('#' + tile_id);
    const canvas = tile.firstChild;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = "https://mdn.github.io/shared-assets/images/examples/rhino.jpg";
    let imageWidth = image.width;
    let imageHeight = image.height;

    let cropDiff = 0
    let sx = 0; sy = 0; sWidth = 0; sHeight = 0;
    if (imageWidth > imageHeight) {
        cropDiff = imageWidth - imageHeight;
        sx = cropDiff / 2;
        sWidth = imageHeight;
        sHeight = imageHeight;
    } else {
        cropDiff = imageHeight - imageWidth;
        sy = cropDiff / 2;
        sWidth = imageWidth;
        sHeight = imageWidth;
    }

    // console.log(sx);
    // console.log(sy);
    // console.log(sWidth);
    // console.log(cropDiff);

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    image.addEventListener("load", (e) => {
        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    });
}
//loadImage();


//resize to match size of puzzle
//crop by focusing at center
//partition to small images in tiles



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
        // tile.textContent = number;
        board.append(tile);

        const canvas = document.createElement('canvas');
        canvas.classList.add('canvas');
        // canvas.width = tile.offsetWidth;
        // canvas.height = tile.offsetWidth;
        tile.append(canvas);
        loadImage(tile.id);
    }
}

function adjacentTiles() {
    let emptyTileIndex = boardArray.indexOf(15);

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
    for (i=0;i<4;i++) {
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

function resetTiles() {
    refreshBoard();
    enableTiles(adjacentTiles());
}

function swapTiles(tile) {
    let clickedTile = tile.id.split("_")[1];
    let clickedTleIndex = boardArray.indexOf(parseInt(clickedTile) - 1);
    let emptyTileIndex = boardArray.indexOf(16 - 1);
    
    [boardArray[emptyTileIndex], boardArray[clickedTleIndex]] = 
        [boardArray[clickedTleIndex], boardArray[emptyTileIndex]];
    printBoardArray();
    resetTiles();
}



resetTiles();

// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]





