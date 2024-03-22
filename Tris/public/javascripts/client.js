var ws, clientID, displayName, otherID, lastSender;
var chat = document.getElementById("chat");
var text = document.getElementById("text");

function ready() {
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://"+hostname+":8080");
    
    ws.addEventListener('message', function (event) {
        var msg1 = JSON.parse(event.data);
        console.log('Message from server ', msg1.id);
        
        switch(msg1.type){
            case "message":
                if(lastSender != msg1.id){
                    chat.innerHTML += "<br><b>" + msg1.nome + "</b><br>";
                }
                chat.innerHTML += msg1.text + "<br>";
                chat.scrollTop = chat.scrollHeight;
                lastSender = msg1.id;
                break;
            case "idClient":
                clientID = msg1.id;
                displayName = "Customer";
                console.log("Il tuo id è: " + clientID);
                break;
        }
    });
    ws.addEventListener("open", () => {
        console.log("Waiting for an opponent...");
    });
}

function join(){
    displayName = document.getElementById("inputnick").value;
}

function sendChatMessage() {
    var msg = {
        type: "chat",
        text: document.getElementById("text").value,
        id: clientID,
        displayName: displayName,
    };
    console.log("Messagge: " + msg.text);
    ws.send(JSON.stringify(msg));
    text.value = "";
}



document.addEventListener("DOMContentLoaded", ready);
document.getElementById("buttonnick").addEventListener("click",join)