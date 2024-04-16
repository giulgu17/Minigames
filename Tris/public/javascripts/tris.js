//ws, nickname, opponent, turn;
var grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
var symbol, usedSquares = [];

//Player joins the queue
function join() {
    nickname = document.getElementById("username").value;
    var msg = {
        type: "join",
        nick: nickname
    }
    console.log("Joined the queue for TicTacToe");
    ws.send(JSON.stringify(msg));
}

function startGame() {
    if (turn) {
        addEventListeners();
        symbol = "X";
    } else {
        removeEventListeners();
        symbol = "O";
    }
}

function addEventListeners() {
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", place);
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
        }
    }
}

function removeEventListeners() {
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", place);
        squares[i].classList.remove("usable");
        squares[i].style.cursor = "not-allowed";
    }
}

function place() {
    if (turn) {
        let box = this;
        var move = {
            type: "move",
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box.id,
            symbol: symbol
        };
        ws.send(JSON.stringify(move));
    }
    else {
        window.location.href = "https://www.google.com/search?client=firefox-b-d&q=nuh+uh"
    }
}

function checkWin() {
    var count = 0;
    win = "draw";
    var check_symbol = "X";

    for (var j = 0; j < 2; j++){
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (grid[r][c] == check_symbol) {
                    count++;
                    if (count == 3) {
                        win = check_symbol;
                        break;
                    }
                } else {
                    count = 0;
                }
            }
            count = 0;
        }

        for (var c = 0; c < 3; c++) {
            for (var r = 0; r < 3; r++) {
                if (grid[r][c] == check_symbol) {
                    count++;
                    if (count == 3) {
                        win = check_symbol;
                        break;
                    }
                } else {
                    count = 0;
                }
            }
            count = 0;
        }

        for (var i = 0; i < 3; i++) {
            if (grid[i][i] == check_symbol) {
                count++;
                if (count == 3) {
                    win = check_symbol;
                    break;
                }
            } else {
                count = 0;
            }
        }

        for (var i = 0; i < 3; i++) {
            if (grid[i][2-i] == check_symbol) {
                count++;
                if (count == 3) {
                    win = check_symbol;
                    break;
                }
            } else {
                count = 0;
            }
        }

        check_symbol = "O";
    }

    if(win == "X" || win == "O" || usedSquares.length == 9){
        if(win == symbol){
            var winner = nickname;
        } else if(win == "draw"){
            var winner = "draw";
        } else {
            var winner = opponent;
        }
        var msg = {
            type: "end",
            gameId: gameId,
            winner: winner,
            user: nickname,
            target: opponent
        }
        ws.send(JSON.stringify(msg));
    }
}