var ws;
function ready() {
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://"+hostname+":8080");
    ws.addEventListener('message', function (event) {
        var msg1 = JSON.parse(event.data);
        console.log('Message from server ', msg1.id);
        
        
    });
    ws.addEventListener("open", () => {
        console.log("We are connected");
    });
}

function sendText() {
    clientID = "Giulio";
    var msg = {
        tipo: "messaggio",
        text: document.getElementById("testo").value,
        id: clientID,
        data: Date.now()
    };
    console.log("Messaggio: " + msg.text);
    ws.send(JSON.stringify(msg));
}



document.addEventListener("DOMContentLoaded", ready);