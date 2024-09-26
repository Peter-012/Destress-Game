const board = document.querySelector('#board');

const boardSize = 4;
let boardArray = [];
let tileCoord = [];

for (let i=0; i<boardSize**2; i++) {
    boardArray.push(i);
}

for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
        tileCoord.push([j, i]);
    }
}

function loadImage(tile_id) {
    const tile_number = parseInt(tile_id.split("_")[1]) - 1;
    const tile = document.querySelector('#' + tile_id);
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

    
    

    

    // Draw tile image
    image.addEventListener("load", (e) => {
        // Partition the image
        let tileLength = Math.floor(sWidth / boardSize);
        [x,y] = tileCoord[tile_number];

        sx += tileLength * x;
        sy += tileLength * y;

        console.log("-----------------------");
        console.log("Coord: ",x,y);
        console.log("TileLength = ", tileLength);
        console.log("X Offset = ", tileLength * x);
        console.log("Y Offset = ", tileLength * y);
        console.log("Source Coord: ", sx,sy);

        ctx.drawImage(image, sx, sy, tileLength, tileLength, 0, 0, canvas.width, canvas.height);
    });
}

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
        board.append(tile);

        const canvas = document.createElement('canvas');
        canvas.classList.add('canvas');
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





