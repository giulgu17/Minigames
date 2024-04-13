var ws, nickname, opponent;
var lastSender;
var turn, gameId, win;
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
        //console.log('Message received: ', msg);
        
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
                turn = msg.turn;
                document.getElementById("inick2").innerHTML = "<a>"+opponent+"</a>";
                //console.log("You are now playing against " + opponent);
                startGame();
                break;
            //A player makes a move
            case "move":
                usedSquares.push(msg.box);
                if(msg.box%3 == 0){
                    grid[Math.floor(msg.box/3-1)][2] = msg.symbol;
                } else {
                    grid[Math.floor(msg.box/3-0.1)][msg.box%3-1] = msg.symbol;
                }

                if(turn){
                    turn = false;
                    removeEventListeners();
                } else {
                    turn = true;
                    addEventListeners();
                }

                document.getElementById(msg.box).style.backgroundImage = "url('images/"+msg.symbol+".png')";
                
                checkWin();
                break;
            //The game is over
            case "end":
                if(msg.win == "draw"){
                    alert("It's a draw!");
                } else if(symbol == win) {
                    alert("You won!");
                } else {
                    alert(opponent + " won!");
                }
                window.location.href = "/";
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
