let board = document.querySelector('#board');

let boardSize = 3;
let boardArray = [];
let tileCoord = [];

let scrambleEnabled = true;
const scrambleIteration = 250;
let enableImageTiles = true;

function scrambleBoard() {
    for (let i=0; i<scrambleIteration; i++) {
        let moves = adjacentTiles();
        let validMoves = [];

        for (let i=0; i<moves.length; i++) {
            if (moves[i] != (-1)) {
                validMoves.push(moves[i]);
            }
        }

        let moveIndex = Math.floor(Math.random() * validMoves.length);
        swapTiles(validMoves[moveIndex]);
    }
}

// Use image tiles rather than numbers
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

// Use number tiles instead of images for tiles
function loadNumber(tile_id) {
    const tile_number = parseInt(tile_id.split("_")[1]) - 1;
    if (tile_number === boardArray.length - 1) return;

    const tile = document.querySelector('#' + tile_id);
    tile.textContent = tile_number + 1;
    tile.style.backgroundColor = 'rgba(145, 6, 110, 0.434)';
    tile.style.border = '1px solid'
    tile.style.margin = '1px'
}

// Print board array [For debugging]
function printBoardArray() {
    let output = ""
    for (i=0; i<boardArray.length; i++) {
        output += boardArray[i] + " ";
    }
    console.log(output);
}

function refreshBoard() {
    // Remove all event listeners
    // let newBoard = board.cloneNode(true);
    // board.parentNode.replaceChild(newBoard, board);
    // board = newBoard;

    // Delete all tiles from the board
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    // From the record of boardArray, redraw the tiles
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

// Determine which tiles are valid to select
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

    console.log("Left:", leftTile, "Right:", rightTile, "Up:", upTile, "Down:", downTile);

    return [leftTile, rightTile, upTile, downTile];
}

// Enable click function for movable adjacent tiles
function enableTiles(moves) {
    for (i=0;i<boardSize;i++) {
        // Ignore invalid moves
        if (moves[i] == -1) continue;

        let tile_id = '#tile_' + (parseInt(moves[i]) + 1);
        const moveableTile = document.querySelector(tile_id);

        moveableTile.addEventListener('click', function() {
            clickedTile = parseInt(moveableTile.id.split("_")[1]) - 1;
            clickedTileIndex = boardArray.indexOf(clickedTile);
            console.log(clickedTile, clickedTileIndex);
            swapTiles(clickedTileIndex);
        });
        moveableTile.addEventListener('mouseover', function() {
            moveableTile.style.cursor = "pointer";
        });
        moveableTile.addEventListener('mouseout', function() {
            moveableTile.style.cursor = "default";
        });
    }
}

// If tile is selected, swap tile with blank tile space
function swapTiles(clickedTileIndex) {
    let emptyTileIndex = boardArray.indexOf(boardArray.length - 1);
    
    console.log("Empty:", emptyTileIndex, "Clicked:", clickedTileIndex);

    [boardArray[emptyTileIndex], boardArray[clickedTileIndex]] = 
        [boardArray[clickedTileIndex], boardArray[emptyTileIndex]];

    printBoardArray();

    if (scrambleEnabled) return;

    resetTiles();
}

function resetTiles() {
    refreshBoard();
    moves = adjacentTiles();
    enableTiles(moves);
}

function main() {
    // CSS - Set dimension of puzzle
    document.querySelector(':root').style.setProperty('--tile-length-count', boardSize);

    // Set board tiles
    for (let i=0; i<boardSize**2; i++) {
        boardArray.push(i);
    }
    
    // Set coordinates for board to reference off of
    for (let i=0; i<boardSize; i++) {
        for (let j=0; j<boardSize; j++) {
            tileCoord.push([j, i]);
        }
    }

    if (scrambleEnabled) {
        scrambleBoard();
        scrambleEnabled = false;
    }
    resetTiles();
}
main();

// Notes:
// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]
