function getInfo(){
    //TODO: Fetch informazioni dal database
    fetch("info.php",{method: "POST", body: document.getElementById("gameId").value})
        .then(res => {
            res.json()
        })
        .then(data => {
            document.getElementById("giocatore1").innerHTML = "Giocatore1: " + data.p1;
            document.getElementById("giocatore2").innerHTML = "Giocatore2: " + data.p2;
            document.getElementById("stato").innerHTML = "Stato: " + data.stato;
        })

}

function place(){
    //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O". Questo lo si può controllare da chi ha il turno.
    //Il problema è fare in modo che chi non ha il turno NON possa cliccare. Lo dovrò gestire dal lato client.
    //Se il giocatore locale == giocatore1 e il turno è di giocatore 1 allora ottiene gli eventListener.
    //Al click, togliere gli eventListener
    //TODO: invia dati al database facendo un fetch ad un file php dedicato a leggere i dati ricevuti e a scriverli nel database

}

function test(){
    console.log("test")
}

document.addEventListener("DOMContentLoaded", test());