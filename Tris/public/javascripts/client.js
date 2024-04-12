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
        var msg = JSON.parse(event.data);
        console.log('Message received: ', msg);
        
        switch(msg.type){
            //Chat message received
            case "message":
                if(lastSender != msg.id){
                    chat.innerHTML += "<br><b>" + msg.nome + "</b><br>";
                }
                chat.innerHTML += msg.text + "<br>";
                chat.scrollTop = chat.scrollHeight;
                lastSender = msg.id; 
                break;
            //Start a game against another player
            case "game":
                gameId = msg.gameId;
                opponent = msg.opponent;
                console.log("You are now playing against " + opponent);
                turn = msg.turn;
                document.getElementById("inick2").innerHTML = "<a>"+opponent+"</a>";
                startGame();
                break;
            case "move":
                //FIXME: non funziona l'img
                if(msg.symbol == "X"){
                    document.getElementById(msg.box).style.backgroundImage = "url('images/X.png')";
                } else {
                    document.getElementById(msg.box).style.backgroundImage = "url('images/O.png')";
                }

                if(turn){
                    turn = false;
                    removeEventListeners();
                } else {
                    turn = true;
                    addEventListeners()
                }
                console.log("turn: "+turn);
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
