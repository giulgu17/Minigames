var ws, nickname, opponent, game=true;
var lastSender;
var turn, gameId, win;
/*var chat = document.getElementById("chat");
var text = document.getElementById("text");*/

function ready() {
    //TODO: login
    /*if(document.getElementById("login").value === ""){
        window.location.href = "/"
    }*/
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
                switch(msg.moveType){
                    case "attack":
                        if(target == nickname){
                            var box = document.getElementById("s"+msg.box);
                        } else {
                            var box = document.getElementById(msg.box);
                        }

                        if(msg.hit){        //TODO: fix this condition (first add ships tho)
                            box.classList.add("hit")
                            //TODO: add images
                        } else {
                            box.classList.add("miss")
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
                
                checkWin();
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
