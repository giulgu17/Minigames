var ws, nickname, opponent, game=true;
var lastSender;
var turn, gameId, win, hp=20;
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
                    chat.innerHTML += "<b>" + msg.nome + ":</b> ";
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
                switch(msg.moveType){
                    case "report":
                        if(msg.user == nickname){
                            var box = document.getElementById("s"+msg.box);
                            if(msg.hit){
                                box.classList.add("hit")
                                notification({type: "enemyAttackHit"});
                            } else {
                                box.classList.add("miss")
                                notification({type: "enemyAttackMiss"});
                            }
                        } else {
                            var box = document.getElementById(msg.box);
                            if(msg.hit){
                                box.classList.add("hit")
                                notification({type: "attackHit"});
                            } else {
                                box.classList.add("miss")
                                notification({type: "attackMiss"});
                            }
                        }
                        break;
                    case "attack":
                    case "endMortar":
                        if(turn){
                            turn = false;
                            document.getElementById("info1").style="background-color: white;"
                            document.getElementById("info2").style="background-color: yellow;"
                            removeAttack();
                            deactivatePowerups();
                        } else {
                            turn = true;
                            document.getElementById("info1").style="background-color: yellow;"
                            document.getElementById("info2").style="background-color: white;"
                            activateAttack();
                            activatePowerups();
                        }
                    case "double":
                    case "mortar":
                        if(msg.target == nickname){
                            var box = document.getElementById("s"+msg.box);
                            notification({type: "enemyAttack", box: msg.box});
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
                            
                            if(msg.moveType == "attack" || msg.moveType == "endMortar"){
                                turn = true;
                                activateAttack();
                            }
                        }
                        break;
                    case "forcefield":
                        if(msg.target == nickname){
                            var box = document.getElementById("s"+msg.box);
                            box.classList.add("forcefield");
                            if(spiedOn != 0){
                                var msg1 = {
                                    type: "move",
                                    moveType: "spyReport",
                                    news: "forcefield",
                                    gameId: gameId,
                                    user: nickname,
                                    target: opponent,
                                    box: msg.box
                                };
                                ws.send(JSON.stringify(msg1));
                            }
                        }                        
                        break;
                    case "spy":
                        if(msg.target == nickname){
                            spiedOn = 5;
                            var report = {
                                type: "move",
                                moveType: "spyReport",
                                news: "money",
                                money: money,
                                gameId: gameId,
                                user: nickname,
                                target: opponent,
                                box: msg.box
                            };
                            ws.send(JSON.stringify(report));
                        }
                    case "spyReport":
                        if(msg.target == nickname){
                            switch(msg.news){
                                case "money":
                                    //TODO: add money somewhere
                                    break;
                                case "forcefield":
                                    notification({type: "spyReportForcefield", box: msg.box});
                                    break;
                                case "trap":
                                    notification({type: "spyReportTrap", box: msg.box});
                                    break;
                                
                            }
                        }
                        break;
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
