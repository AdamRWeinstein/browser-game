/*----- constants -----*/
const COLORS = {
    '0': "white",
    '1': "purple",
    '-1': "orange"
};

/*----- state variables -----*/
let board; // 2D array
let turn; // 1 or -1
let winner; // null = no winner, 1 or -1, T for tie

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const buttonEl = document.querySelector("button");
const markerEls = document.querySelectorAll("#markers > div");
const markers = [...markerEls];

/*----- event listeners -----*/
document.getElementById("markers").addEventListener("click", handleDrop);
buttonEl.addEventListener("click", init);

/*----- functions -----*/
init();


function init() {
    // Initialize all state variables, then call render()
    board = Array(7).fill().map(() => Array(6).fill(0));
    console.log(board);
    turn = 1;
    winner = null;
    render();
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach((array, colIndex) => {
        array.forEach((cell, rowIndex) => {
            const cellId = `c${colIndex}r${rowIndex}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cell]
        })
    });
}

function renderMessage() {
    if(winner === 'T') {
        msgEl.innerText = "It's a Tie!";
    } else if(winner){
        msgEl.innerHTML = `<span style="color:${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span> Wins!`;
    } else {
        msgEl.innerHTML = `<span style="color:${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s turn`;
    }
}

function renderControls() {
    buttonEl.style.visibility = winner ? "visible" : "hidden"
    markerEls.forEach((markerEl, colIndex) => {
        const hideMarker = !board[colIndex].includes(0) || winner;
        markerEl.style.visibility = hideMarker ? "hidden" : "visible"
    })
}

function handleDrop(event) {
    const colIndex = markers.indexOf(event.target);
    if(colIndex === -1) {
        return;
    }
    const rowIndex = board[colIndex].indexOf(0);
    board[colIndex][rowIndex] = turn;
    winner = checkForWinner(colIndex, rowIndex, turn);
    if(!winner) turn *= -1;
    render();
}

function checkForWinner(colIndex, rowIndex, turn) {
    console.log(colIndex, rowIndex, turn)
    // Vertical Check
    if(checkAdjacent("S", colIndex, rowIndex, turn) >= 4) {
        console.log("bp1");
        return true;
    }
    // Horizontal Check
    if(checkAdjacent("W", colIndex, rowIndex, turn) 
    + checkAdjacent("E", colIndex, rowIndex, turn) - 1 >= 4) {
        return true;
    }
    // Diagonal Check /
    if(checkAdjacent("NE", colIndex, rowIndex, turn) 
    + checkAdjacent("SW", colIndex, rowIndex, turn) - 1 >= 4) {
        console.log("bp3");
        return true;
    }
    // Diagonal Check \
    if(checkAdjacent("NW", colIndex, rowIndex, turn) 
    + checkAdjacent("SE", colIndex, rowIndex, turn) - 1 >= 4) {
        console.log("bp4");
        return true;
    }
    return false;
}

function checkAdjacent(direction, colIndex, rowIndex, value) {
    if(value !== board[colIndex][rowIndex]) return 0;
    let nextColIndex = 
        ["NE", "E", "SE"].includes(direction) ? colIndex + 1 :
        ["SW", "W", "W"].includes(direction) ? colIndex - 1 : colIndex;
    let nextRowIndex = 
        ["NW", "N", "NE"].includes(direction) ? rowIndex + 1 :
        ["SW", "S", "SE"].includes(direction) ? rowIndex - 1 : rowIndex;
    if(nextColIndex > 6 || nextColIndex < 0 || nextRowIndex > 5 || nextRowIndex < 0) return 1;
    console.log("again")
    return 1 + checkAdjacent(direction, nextColIndex, nextRowIndex, value);
}