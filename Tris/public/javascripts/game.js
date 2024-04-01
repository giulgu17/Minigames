var turno, giocatoreClient;
var griglia = [[],[],[]]
var nickname = document.getElementById("infonick").value;
var player_self = document.getElementById("player1").value;
var player_opponent = document.getElementById("player2").value;

function start(){
    if(nickname==giocatore1){
        giocatoreClient = 1;
    } else if(nickname==giocatore2){
        giocatoreClient = 2;
    } else {
        console.log("Who tf are you")
    }

    update();
}

function update(){
    //Controlliamo il turno
    let turnoStato = document.getElementById("stato").value;
    console.log(turnoStato);

    //Controllo chi è il giocatore
    

    //Controlliamo se il client ha il turno o no
    if(turnoStato=="turno_p1" && giocatoreClient == 1 || turnoStato=="turno_p2" && giocatoreClient == 2){
        turno=true;
        addEventListeners();
    }
    else if (turnoStato=="turno_p2" && giocatoreClient == 1 || turnoStato=="turno_p1" && giocatoreClient == 2){
        turno=false;
        removeEventListeners();
    }
    else{
        console.error("Errore inaspettato: stato del turno non riconosciuto");
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
    //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O". Questo lo si può controllare da chi ha il turno.
    //Il problema è fare in modo che chi non ha il turno NON possa cliccare. Lo dovrò gestire dal lato client.
    //Se il giocatore locale == giocatore1 e il turno è di giocatore 1 allora ottiene gli eventListener.
    //Al click, togliere gli eventListener
    //TODO: invia dati al database facendo un fetch ad un file php dedicato a leggere i dati ricevuti e a scriverli nel database
    
    if(turno){
        console.log("Hai cliccato");
        turno = false;
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