var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var usedSquares = [];
var code;

//Player joins the queue
function joinQueue() {
    var code = document.getElementById("code").value;
    console.log(code)
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.id = "s" + rows[i] + j;
            document.getElementById("selfGrid").appendChild(square);
            if(code[i*10+j-1]==1){
                square.classList.add("ship");
            }
        }
    }

    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("enemy");
            square.id = i * 10 + j;
            document.getElementById("enemyGrid").appendChild(square);
        }
    }

    nickname = document.getElementById("username").value;
    var msg = {
        type: "join",
        nick: nickname
    }
    console.log("Joined the queue for Battleship");
    ws.send(JSON.stringify(msg));
}

function startGame() {
    if (turn) {
        document.getElementById("info1").style = "background-color: yellow;";
        document.getElementById("info2").style = "background-color: white;";
        addEventListeners();
    } else {
        document.getElementById("info1").style = "background-color: white;";
        document.getElementById("info2").style = "background-color: yellow;";
        removeEventListeners();
    }
}

function addEventListeners() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", attack);
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
        }
    }
}

function removeEventListeners() {
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", attack);
        squares[i].classList.remove("usable");
        squares[i].style.cursor = "not-allowed";
    }
}

function attack() {
    if (turn) {
        let box = this.id;
        usedSquares.push(box.id);
        var move = {
            type: "move",
            moveType: "attack",
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box
        };
        ws.send(JSON.stringify(move));
    }
}





function checkWin() {

}