//ws, nickname, opponent_nickname, turn;
var grid = [[],[],[]];
var symbol;


//Player joins the queue
function join(){
    nickname = document.getElementById("username").value;
    /*var msg = {
        type: "join",
        game: "tictactoe",
        nick: nickname
    };*/
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

    update();
}

function update(){
    console.log(turn);
}

function addEventListeners(){
    for(let i=1; i<=9; i++){
        let square = document.getElementById(i);
        square.addEventListener("click", place);
        square.style = "cursor: pointer";
    }
}

function removeEventListeners(){
    for(let i=1; i<=9; i++){
        let square = document.getElementById(i);
        square.removeEventListener("click", place);
        square.style = "cursor: not-allowed";
    }
}

function place(){
    //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O". Questo lo si può controllare da chi ha il turn.
    //Il problema è fare in modo che chi non ha il turn NON possa cliccare. Lo dovrò gestire dal lato client.
    //Se il giocatore locale == giocatore1 e il turn è di giocatore 1 allora ottiene gli eventListener.
    //Al click, togliere gli eventListener
    //TODO: invia dati al database facendo un fetch ad un file php dedicato a leggere i dati ricevuti e a scriverli nel database
    
    if(turn){
        console.log("Hai cliccato");
        turn = false;
        removeEventListeners();

        let box = this;
        console.log(box.id);
        if(symbol == "X"){
            box.style.backgroundImage = "url('images/X.png')";
        } else {
            box.style.backgroundImage = "url('images/O.png')";
        }

        //FIXME: gameId is not defined you idiot
        //send the move as a message to the server, which gets sent to the opponent's client
        var mossa = {id: gameId, user: nickname, target: opponent_nickname, box: box.id, symbol: symbol};
        console.log(mossa);
        /*fetch("/update", {
            method: "POST",
            body: JSON.stringify(mossa)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Risposta dal server:', data);
        })
        .catch(error => {
            console.error('Errore durante la richiesta:', error);
        });*/

        update();
    }
    else{
        console.error("bro how the fu");
    }
}

//TODO: Quando ci sono due giocatori connessi, allora avvia la funzione start
//document.addEventListener("DOMContentLoaded", start);