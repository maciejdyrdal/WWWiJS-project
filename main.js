import { createBoard, playMove } from "./game.js";

function sendMoves(board, directions, attack, confirm, websocket) {
    const event = {
        type: "play",
        column: "",
        row: "",
        direction: "",
        attack: "",
    };

    board.addEventListener("click", ({ target }) => {
        const column = target.dataset.column;
        const row = target.dataset.row;
        if (column === undefined || row === undefined) {
            return;
        }
        event.column = parseInt(column, 10);
        event.row = parseInt(row, 10);
        // For debugging:
        console.log(event);
    });
    
    directions.addEventListener("click", ({ target }) => {
        const direction = target.dataset.direction;
        if (direction === undefined) {
            return;
        }
        event.direction = direction;
        // For debugging:
        console.log(event);
    });
    
    attack.addEventListener("click", ({ target }) => {
        const is_attacking = target.dataset.attack;
        if (is_attacking === undefined) {
            return;
        }
        event.attack = is_attacking;
        // For debugging:
        console.log(event);
    });

    confirm.addEventListener("click", ({ target }) => {
        if (event.column === undefined || event.row === undefined || event.direction === undefined || event.attack === undefined) {
            showMessage("Incomplete move.")
        } else {
            websocket.send(JSON.stringify(event));
        }        
        // For debugging:
        console.log(event);
    })
}

function showMessage(message) {
    window.setTimeout(() => window.alert(message), 50);
}
  
function receiveMoves(board, websocket) {
    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "init":
                document.querySelector(".join").href = "?join=" + event.join;
                break;
            case "play":
                playMove(board, event.player, event.column, event.row, event.direction, event.attack);
                break;
            case "win":
                showMessage(`Player ${event.player} wins!`);
                websocket.close(1000);
                break;
            case "error":
                showMessage(event.message);
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}.`);
        }
    });
}

function initGame(websocket) {
    websocket.addEventListener("open", () => {
        const params = new URLSearchParams(window.location.search);
        let event = { type: "init" };
        if (params.has("join")) {
            event.join = params.get("join");
        } else {


        }

        websocket.send(JSON.stringify(event));
    })
}

window.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".board");
    createBoard(board);

    const directions = document.querySelector(".directions");
    const attack = document.querySelector(".attack");
    const websocket = new WebSocket("ws://localhost:8001/");
    const confirm = document.querySelector(".confirm");
    initGame(websocket);
    receiveMoves(board, websocket);
    sendMoves(board, directions, attack, confirm, websocket);
});