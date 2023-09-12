const PLAYER1 = "red";

const PLAYER2 = "yellow";

function createBoard(board) {
    // Inject stylesheet.
    const linkElement = document.createElement("link");
    linkElement.href = import.meta.url.replace(".js", ".css");
    linkElement.rel = "stylesheet";
    document.head.append(linkElement);
    // Generate board.
    for (let column = 0; column < 4; column++) {
        const columnElement = document.createElement("div");
        columnElement.className = "column";
        columnElement.dataset.column = column;
        for (let row = 0; row < 5; row++) {
            const cellElement = document.createElement("div");
            if ((column == 0 && row >= 3) || (column == 3 && row <= 1) || (column == 1 && row == 1) || (column == 2 && row == 3)) {
                cellElement.className = "cell forbidden";
            } else if (column == 0 && row == 0) {
                cellElement.className = ("cell " + PLAYER1);
            } else if (column == 3 && row == 4) {
                cellElement.className = ("cell " + PLAYER2);
            } else {
                cellElement.className = "cell empty";
            }
            cellElement.dataset.column = column;
            cellElement.dataset.row = row;
            columnElement.append(cellElement);
        }
        board.append(columnElement);
    }
}

function playMove(board, player, column, row, direction) {
    // Check values of arguments.
    if (player !== PLAYER1 && player !== PLAYER2) {
        throw new Error(`Player must be ${PLAYER1} or ${PLAYER2}.`);
    }
    const columnElement = board.querySelectorAll(".column")[column];
    if (columnElement === undefined) {
        throw new RangeError("Column must be between 0 and 3.");
    }
    const cellElement = columnElement.querySelectorAll(".cell")[row];
    if (cellElement === undefined) {
        throw new RangeError("Row must be between 0 and 4.");
    }
    if (cellElement.className == "cell forbidden") {
        throw new RangeError("Cannot move to a forbidden cell.");
    }

    if (cellElement.classList.contains("forbidden") || (player == PLAYER1 && cellElement.classList.contains(PLAYER2)) || (player == PLAYER2 && cellElement.classList.contains(PLAYER1))) {
        throw new Error("cell must be empty.");
    }

    // Place checker in cell.
    // console.log(board.querySelectorAll(".column")[0].children[0]);
    // console.log(board.querySelectorAll(".cell"));

    for (let i = 0; i < board.querySelectorAll(".cell").length; i++) {
        // console.log(board.querySelectorAll(".cell")[i].className);
        if (board.querySelectorAll(".cell")[i].className == ("cell " + player)) {
            board.querySelectorAll(".cell")[i].classList.replace(player, "empty");
        }
    }
    cellElement.classList.replace("empty", player);
}

export { PLAYER1, PLAYER2, createBoard, playMove };
