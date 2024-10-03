let board = document.querySelector('#board');

const imagePath = "https://mdn.github.io/shared-assets/images/examples/rhino.jpg";
//const imagePath = "assets/imgdestress.jpg"
//const imagePath = "C:/Users/Peter L/Desktop/Github/Destress-Game/assets/imgdestress.jpg"

let boardSize = 4;
let boardArray = [];
let tileCoord = [];

const scrambleIteration = 250;
let scrambleEnabled = false;
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
    const tile = document.querySelector('#' + tile_id);
    
    if (tile_number === boardArray.length - 1) {
        // Add textContent to prevent dimension issues with empty tile
        tile.textContent = "";
        return;
    }

    const canvas = tile.firstChild;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imagePath;
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
    const tile = document.querySelector('#' + tile_id);

    if (tile_number === boardArray.length - 1) {
        // Add textContent to prevent dimension issues with empty tile
        tile.textContent = "";
        return;
    }

    tile.textContent = tile_number + 1;
    tile.style.backgroundColor = 'rgba(145, 6, 110, 0.434)';
    tile.style.border = '1px solid'
}

// Print board array [For debugging]
function printBoardArray() {
    let output = ""
    for (i=0; i<boardArray.length; i++) {
        if (boardArray[i] === 15)
            output += "_" + " ";
        else
            output += (boardArray[i] + 1) + " ";
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

        // Canvas used to load image tiles
        const canvas = document.createElement('canvas');
        canvas.classList.add('canvas');
        tile.append(canvas);

        if (enableImageTiles) {
            loadImage(tile.id);
        } else {
            loadNumber(tile.id);
        }

        tile.addEventListener('click', function() {
            clickedTile = parseInt(tile.id.split("_")[1]) - 1;
            clickedTileIndex = boardArray.indexOf(clickedTile);
            swapTiles(clickedTileIndex);
        });
        tile.addEventListener('mouseover', function() {
            tile.style.cursor = "pointer";
        });
        tile.addEventListener('mouseout', function() {
            tile.style.cursor = "default";
        });
        
        tile.style.pointerEvents = 'none';
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

    //console.log("Left:", leftTile, "Right:", rightTile, "Up:", upTile, "Down:", downTile);

    return [leftTile, rightTile, upTile, downTile];
}

// Enable click function for movable adjacent tiles
function enableTiles(moves) {
    for (i=0;i<moves.length;i++) {
        // Ignore invalid moves
        if (moves[i] == -1) continue;

        let tile_id = '#tile_' + (boardArray[moves[i]] + 1);
        const moveableTile = document.querySelector(tile_id);
        moveableTile.style.pointerEvents = 'auto';
    }
}

// If tile is selected, swap tile with blank tile space
function swapTiles(clickedTileIndex) {
    let emptyTileIndex = boardArray.indexOf(boardArray.length - 1);

    [boardArray[emptyTileIndex], boardArray[clickedTileIndex]] = 
        [boardArray[clickedTileIndex], boardArray[emptyTileIndex]];

    //printBoardArray();

    if (scrambleEnabled) return;

    resetTileEvents();
}

function checkSolved() {
    let emptyTileIndex = boardArray.indexOf(boardArray.length - 1);
    if (emptyTileIndex != (boardArray.length - 1)) return;

    for (let tileNumber=0; tileNumber<boardArray.length; tileNumber++) {
        if (tileNumber != boardArray[tileNumber]) {
            return false;
        }
    }
    
    return true;
}

function resetTileEvents() {
    refreshBoard();

    if (checkSolved()) {
        console.log("Puzzle Solved");
    }

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
    resetTileEvents();
}
main();

// Notes:
// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]




//TODO:
//Fix formating of tiles - too long on las row
//Lazy loading
//Event listener cannot reset
