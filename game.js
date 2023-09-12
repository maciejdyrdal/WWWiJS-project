const PLAYER1 = "red";

const PLAYER2 = "yellow";

function createBoard(board) {
    // Inject stylesheet.
    const linkElement = document.createElement("link");
    linkElement.href = import.meta.url.replace(".js", ".css");
    linkElement.rel = "stylesheet";
    document.head.append(linkElement);
    
    // Generate board.
    for (let column = 0; column < 6; column++) {
        const columnElement = document.createElement("div");
        columnElement.className = "column";
        columnElement.dataset.column = column;
        
        for (let row = 0; row < 7; row++) {
            const cellElement = document.createElement("div");
            //0 - path
            cellElement.className = "cell empty"
            
            // 1 - BM
            if (column >= 2 && column <= 4 && row == 6){
                cellElement.className = "cell forbidden bottomMid"
            }
            // 2 - TM
            else if (column >= 1 && column <= 3 && row == 0){
                cellElement.className = "cell forbidden topMid"
            }
            // 3 - R
            else if ((column == 5 && row <= 5 && row >= 3) || (column == 4 && row == 1)){
                cellElement.className = "cell forbidden right"
            }
            // 4 - L
            else if ((column == 0 && row <= 3 && row >= 1) || (column == 1 && row == 5)){
                cellElement.className = "cell forbidden left"
            }
            // 5 - WP
            else if ((column == 2 && row == 2) || (column == 3 && row == 4)){
                cellElement.className = "cell forbidden wallPillar"
            }
            // 6 - BR
            else if (column == 1 && row == 4){
                cellElement.className = "cell forbidden bottomRight"
            }
            // 7 - TL
            else if (column == 4 && row == 2){
                cellElement.className = "cell forbidden topLeft"
            }
            // 8 - X
            //1
            else if (column == 0 && row == 0){
                cellElement.className = "cell forbidden x1"
            }
            //2
            else if ((column == 4 && row == 0) || (column == 5 && row == 2)){
                cellElement.className = "cell forbidden x2"
            }
            //3
            else if ((column == 0 && row == 4) || (column == 1 && row == 6)){
                cellElement.className = "cell forbidden x3"
            }
            //4
            else if (column == 5 && row == 6){
                cellElement.className = "cell forbidden x4"
            }
            //justWall
            else if ((column == 0 && row >= 5 && row <= 6) || (column == 5 && row >= 0 && row <= 1)){
                cellElement.className = "cell forbidden justWall"
            }

            
            if (column == 1 && row == 1) {
                cellElement.className = ("cell " + PLAYER1);
            } else if (column == 4 && row == 5) {
                cellElement.className = ("cell " + PLAYER2);
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
        throw new RangeError("Column must be between 1 and 4.");
    }
    const cellElement = columnElement.querySelectorAll(".cell")[row];
    if (cellElement === undefined) {
        throw new RangeError("Row must be between 1 and 5.");
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
