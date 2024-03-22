var ws, clientID, nickname, otherID, lastSender;
var chat = document.getElementById("chat");
var text = document.getElementById("text");

function ready() {
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://"+hostname+":8080");
    
    ws.addEventListener('message', function (event) {
        var msg1 = JSON.parse(event.data);
        console.log('Message from server ', msg1.id);
        
        switch(msg1.type){
            //Chat message
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
                console.log("Your id is " + clientID);
                break;
            case "game":
                otherID = msg1.otherId;
                console.log("You are playing against " + otherID);
                break;
        }
    });
    ws.addEventListener("open", () => {
        console.log("Connected to the server");
    });
}

//Player joins the queue
function join(){
    nickname = document.getElementById("inputnick").value;
    var msg = {
        type: "join",
        id: clientID,
        nick: nickname
    };
    ws.send(JSON.stringify(msg));
}

//Player sends a chat message
function sendChatMessage() {
    var msg = {
        type: "chat",
        text: document.getElementById("text").value,
        id: clientID,
        nickname: nickname,
    };
    console.log("Messagge: " + msg.text);
    ws.send(JSON.stringify(msg));
    text.value = "";
}



document.addEventListener("DOMContentLoaded", ready);
document.getElementById("buttonnick").addEventListener("click",join)