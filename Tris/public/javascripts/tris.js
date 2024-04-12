//ws, nickname, opponent, turn;
var grid = [[],[],[]];
var symbol;


//Player joins the queue
function join(){
    nickname = document.getElementById("username").value;
    var msg = {
        type: "joinTicTacToe",
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
    console.log("turn: "+turn);
}

function addEventListeners(){
    /*for(let i=1; i<=9; i++){
        let square = document.getElementById(i);
        square.addEventListener("click", place);
        square.style = "cursor: pointer";
    }*/

    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", place);
        squares[i].style = "cursor: pointer";
    }
}

function removeEventListeners(){
    /*for(let i=1; i<=9; i++){
        let square = document.getElementById(i);
        square.removeEventListener("click", place);
        square.style = "cursor: not-allowed";
    }*/

    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", place);
        squares[i].style = "cursor: not-allowed";
    }
}

function place(){
    //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O". Questo lo si può controllare da chi ha il turn.
    //Il problema è fare in modo che chi non ha il turn NON possa cliccare. Lo dovrò gestire dal lato client.
    //Se il giocatore locale == giocatore1 e il turn è di giocatore 1 allora ottiene gli eventListener.
    //Al click, togliere gli eventListener
    //TODO: invia dati al database facendo un fetch ad un file php dedicato a leggere i dati ricevuti e a scriverli nel database
    
    if(turn){
        let box = this;
        console.log(box.id);

        var mossa = {type: "move", gameId: gameId, user: nickname, target: opponent, box: box.id, symbol: symbol};
        ws.send(JSON.stringify(mossa));
    }
    else{
        
    }
}

//TODO: Quando ci sono due giocatori connessi, allora avvia la funzione start
//document.addEventListener("DOMContentLoaded", start);