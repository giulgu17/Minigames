var ws, nickname, opponent, game=true;
var lastSender;
var turn, gameId, win, hp=20;
/*var chat = document.getElementById("chat");
var text = document.getElementById("text");*/

function ready() {
    //TODO: login
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
                turn = msg.turn;
                document.getElementById("inick2").innerHTML = "<a>"+opponent+"</a>";
                //console.log("You are now playing against " + opponent);
                startGame();
                break;
            case "end":
                if(game){
                    if(msg.winner == nickname) {
                        alert("You won!");
                    } else {
                        alert(opponent + " won!");
                    }
                    game = false;
                }
                window.location.href = "/";
                break;
            //A player makes a move
            case "move":
                //console.log("Move received: ", msg)
                switch(msg.moveType){
                    case "report":
                        if(msg.user == nickname){
                            var box = document.getElementById("s"+msg.box);
                        } else {
                            var box = document.getElementById(msg.box);
                        }
                        
                        if(msg.hit){
                            box.classList.add("hit")
                            //TODO: add images
                        } else {
                            box.classList.add("miss")
                        }
                        break;
                    case "attack":
                        if(msg.target == nickname){
                            var box = document.getElementById("s"+msg.box);
                            if(box.classList.contains("ship")){
                                var move = {
                                    type: "move",
                                    moveType: "report",
                                    gameId: gameId,
                                    user: nickname,
                                    target: opponent,
                                    box: msg.box,
                                    hit: true
                                };
                                ws.send(JSON.stringify(move));
                                hp--;
                                if(hp == 0){
                                    var endmsg = {
                                        type: "end",
                                        gameId: gameId,
                                        user: nickname,
                                        target: opponent,
                                        winner: opponent
                                    };
                                    ws.send(JSON.stringify(endmsg));
                                }
                            } else {
                                var move = {
                                    type: "move",
                                    moveType: "report",
                                    gameId: gameId,
                                    user: nickname,
                                    target: opponent,
                                    box: msg.box,
                                    hit: false
                                };
                                ws.send(JSON.stringify(move));
                            }
                            turn = true;
                            addEventListeners();
                        }
                        break;
                }

                if(turn){
                    turn = false;
                    document.getElementById("info1").style="background-color: white;"
                    document.getElementById("info2").style="background-color: yellow;"
                    removeEventListeners();
                } else {
                    turn = true;
                    document.getElementById("info1").style="background-color: yellow;"
                    document.getElementById("info2").style="background-color: white;"
                    addEventListeners();
                }

                //document.getElementById(msg.box).style.backgroundImage = "url('images/"+msg.symbol+".png')";
                break;
            //The game is over
            case "end":
                if(game){
                    if(msg.winner == nickname) {
                        alert("You won!");
                    } else {
                        alert(opponent + " won!");
                    }
                    game = false;
                }
                window.location.href = "/";
                break;
            case "disconnect":
                alert("The opponent has disconnected. You win!");
                window.location.href = "/";
                break;
        }
    });
    ws.addEventListener("open", () => {
        console.log("Connected to the server");
        joinQueue();
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
