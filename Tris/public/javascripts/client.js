var ws, nickname, opponent;
var lastSender;
var turn, gameId;
/*var chat = document.getElementById("chat");
var text = document.getElementById("text");*/

function ready() {
    if(document.getElementById("login").value === ""){
        window.location.href = "/"
    }
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://"+hostname+":8080");
    
    ws.addEventListener('message', function (event) {
        var msg1 = JSON.parse(event.data);
        console.log('Message received: ', msg1);
        
        switch(msg1.type){
            //Chat message received
            case "message":
                if(lastSender != msg1.id){
                    chat.innerHTML += "<br><b>" + msg1.nome + "</b><br>";
                }
                chat.innerHTML += msg1.text + "<br>";
                chat.scrollTop = chat.scrollHeight;
                lastSender = msg1.id; 
                break;
            //Start a game against another player
            case "game":
                gameId = msg1.gameId;
                opponent = msg1.opponent;
                console.log("You are now playing against " + opponent);
                turn = msg1.turn;
                document.getElementById("inick2").innerHTML = "<a>"+opponent+"</a>";
                startGame();
                break;
            case "move":    //TODO: handle opponent's moves
                
                break;
        }
    });
    ws.addEventListener("open", () => {
        console.log("Connected to the server");
        join();
    });
}

//Player sends a chat message
function sendChatMessage() {
    var msg = {
        type: "chat",
        nickname: nickname,
        text: document.getElementById("text").value
    };
    console.log("Messagge: " + msg.text);
    ws.send(JSON.stringify(msg));
    text.value = "";
}


document.addEventListener("DOMContentLoaded", ready);
