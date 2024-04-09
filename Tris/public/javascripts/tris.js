//ws, player_self, player_opponent;
var grid = [[],[],[]];


//Player joins the queue
function join(){
    self_nickname = document.getElementById("inputnick").value;
    var msg = {
        type: "join",
        game: "tictactoe",
        nick: self_nickname
    };
    ws.send(JSON.stringify(msg));
    //window.location.href = "/game";
}

function start(){
    
    update();
}

function update(){
    //Controlliamo il turn
    let turnStato = document.getElementById("stato").value;
    console.log(turnStato);

    //Controllo chi è il giocatore
    

    //Controlliamo se il client ha il turn o no
    if(turnStato=="turn_p1" && giocatoreClient == 1 || turnStato=="turn_p2" && giocatoreClient == 2){
        turn=true;
        addEventListeners();
    }
    else if (turnStato=="turn_p2" && giocatoreClient == 1 || turnStato=="turn_p1" && giocatoreClient == 2){
        turn=false;
        removeEventListeners();
    }
    else{
        console.error("Errore inaspettato: stato del turn non riconosciuto");
    }
}

function addEventListeners(){
    for(let i=1; i<=9; i++){
        let casella = document.getElementById(i);
        casella.addEventListener("click", place);
        casella.style = "cursor: pointer";
    }
}

function removeEventListeners(){
    for(let i=1; i<=9; i++){
        let casella = document.getElementById(i);
        casella.removeEventListener("click", place);
        casella.style = "cursor: not-allowed";
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
        if(giocatoreClient == 1){
            box.style.backgroundImage = "url('images/X.png')";

        } else {
            box.style.backgroundImage = "url('images/O.png')";

        }

        //mandiamo i dati in post a input.php per inserirli nel database
        var mossa = {id: gameId, box: box.id, giocatore: giocatoreClient};
        console.log(mossa);
        fetch("/update", {
            method: "POST",
            body: JSON.stringify(mossa)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Risposta dal server:', data);
        })
        .catch(error => {
            console.error('Errore durante la richiesta:', error);
        });

        update();
    }
    else{
        console.error("EH, VOLEVI");
    }
}

document.addEventListener("DOMContentLoaded", start);