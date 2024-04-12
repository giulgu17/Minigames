//ws, nickname, opponent, turn;
var grid = [];
var symbol, usedSquares = [];

//Player joins the queue
function join(){
    nickname = document.getElementById("username").value;
    var msg = {
        type: "join",
        nick: nickname
    }
    console.log("Joined the queue for TicTacToe");
    ws.send(JSON.stringify(msg));
}

function startGame(){
    if(turn){
        addEventListeners();
        symbol = "X";
    } else {
        removeEventListeners();
        symbol = "O";
    }
}

function addEventListeners(){
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        if(!usedSquares.includes(squares[i].id)){
            squares[i].addEventListener("click", place);
            squares[i].style.cursor = "pointer";
        }
    }
}

function removeEventListeners(){
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", place);
        squares[i].style.cursor = "not-allowed";
    }
}

function place(){
    if(turn){
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
    else{
        window.location.href = "https://www.google.com/search?client=firefox-b-d&q=fuck+you"
    }
}

function check(){   //victory conditions

}