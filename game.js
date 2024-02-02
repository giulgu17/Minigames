var turno;
var giocatoreClient = document.getElementById("giocatoreClient").value;
var giocatore1 = document.getElementById("giocatore1").value;
var giocatore2 = document.getElementById("giocatore2").value;

function update(){
    //Controlliamo il turno
    var giocatoreClient = document.getElementById("giocatoreClient").value;
    let turnoStato = document.getElementById("stato").value;
    console.log(turnoStato);
    if(turnoStato=="turno_p1"){
        turno=1;
    }
    else if (turnoStato=="turno_p2"){
        turno=2;
    }
    else{
        console.error("Errore inaspettato: stato del turno non riconosciuto");
    }

    //Controlliamo il giocatore e aggiungiamo o rimuoviamo gli evenetListener a seconda di chi è il turno
    if(giocatoreClient==giocatore1){
        if(turno==1){
            addEventListeners();
        }
        else{
            removeEventListeners();
        }
    }
    else if(giocatoreClient==giocatore2){
        if(turno==2){
            addEventListeners();
        }
        else{
            removeEventListeners();
        }
    }
    else{
        console.error("Errore inaspettato: giocatore non riconosciuto");
    }
}

function addEventListeners(){
    for(let i=0; i<caselle.length; i++){
        let casella = document.getElementsById(i)
        casella.addEventListener("click", place());
        casella.style = "cursor: pointer"
    }
}

function removeEventListeners(){
    let caselle = document.getElementsByClassName("casella");
    for(let i=0; i<caselle.length; i++){
        caselle[i].removeEventListener("click", place());
        caselle[i].style = "cursor: not-allowed"
    }
}

function place(){
    //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O". Questo lo si può controllare da chi ha il turno.
    //Il problema è fare in modo che chi non ha il turno NON possa cliccare. Lo dovrò gestire dal lato client.
    //Se il giocatore locale == giocatore1 e il turno è di giocatore 1 allora ottiene gli eventListener.
    //Al click, togliere gli eventListener
    //TODO: invia dati al database facendo un fetch ad un file php dedicato a leggere i dati ricevuti e a scriverli nel database
    

    
}

document.addEventListener("DOMContentLoaded", update());