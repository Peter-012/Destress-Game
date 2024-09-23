boardArray = [];

function printBoardArray() {
    output = ""
    for (i=0; i<boardArray.length; i++) {
        output += boardArray[i] + " ";
    }
    console.log(output);
}

// Set up the board
const board = document.querySelector('.board');

function createTile(number) {
    boardArray.push(number);

    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.id = "tile_" + number;
    tile.textContent = number;
    board.append(tile);
}

for (let i=1; i<16; i++) {
    createTile(i);
}
createTile(0);











function adjacentTiles() {
    // Only run once, save the position afterwards
    tile0idx = boardArray.indexOf(0);
}




// Determine which tiles can be selected (tiles around #tile_0)
// arr[X*(cols)+Y]



/*
Left: -1
Right: +1
Up: -width
Down: +width


Restrictions

No Left:
1  -> 0  + 1
5  -> 4  + 1
9  -> 8  + 1
13 -> 12 + 1

Multiples of width + 1

No Right:
4
8
12
16

Multiples of width

No Up:
1
2
3
4

range(1, width+1)

No Down:

13
14
15
16

16 = 4x4 -> width x width

13 = 16 - 4 + 1 -> (width x width) - width + 1
range(13, 16+1)

*/











// Swap tiles with #tile_0
function swapTiles(tile) {
    number = tile.id.slice(-1);

    printBoardArray();

    // check location of chosen tiles. Will only check max 4 compared to O(n) for Array.find()
    
    // locate and store number of clicked tile
    // swap click tile with 0 using "insertBefore(newNode, referenceNode)"
}

// Enable selection for tile
const moveableTile = document.querySelector('#tile_0');

moveableTile.addEventListener('click', function() {
    swapTiles(moveableTile);
});
moveableTile.addEventListener('mouseover', function() {
    moveableTile.style.cursor = "pointer";
});
moveableTile.addEventListener('mouseout', function() {
    moveableTile.style.cursor = "default";
});
