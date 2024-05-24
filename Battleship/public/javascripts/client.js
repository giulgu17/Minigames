var ws, nickname, opponent, game = true;
var lastSender;
var turn, gameId, win, hp = 20, spiedOn = 0;
/*var chat = document.getElementById("chat");
var text = document.getElementById("text");*/

function ready() {
    if (document.getElementById("login").value === "") {
        window.location.href = "/"
    }
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://" + hostname + ":8080");

    ws.addEventListener('message', function (event) {
        var msg = JSON.parse(event.data);
        console.log('Message received: ', msg);

        switch (msg.type) {
            //Chat message received
            case "message":
                if (lastSender != msg.id) {
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
                document.getElementById("inick2").innerHTML = "<a>" + opponent + "</a>";
                startGame();
                break;
            case "end":
                if (game) {
                    if (msg.winner == nickname) {
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
                switch (msg.moveType) {
                    case "report":
                    case "reportHE":
                        if (msg.user == nickname) {
                            var box = document.getElementById("s" + msg.box);
                            if (msg.hit == true) {
                                box.classList.add("hit")
                                if (msg.moveType == "report")
                                    notification({ type: "enemyAttackHit" });
                            } else if (msg.hit == false) {
                                box.classList.add("miss")
                                if (msg.moveType == "report")
                                    notification({ type: "enemyAttackMiss" });
                            } else if (msg.hit == "block") {
                                box.classList.remove("forcefield");
                                notification({ type: "enemyAttackBlock" });
                            }

                            if ((msg.attackType == "attack" || msg.attackType == "endMortar" || msg.attackType == "highexplosive") && !turn) {
                                turn = true;
                                document.getElementById("info1").style = "background-color: yellow;"
                                document.getElementById("info2").style = "background-color: white;"
                                activateAttack();
                                activatePowerups();
                                notification({ type: "turn" });
                            }
                        } else {
                            var box = document.getElementById(msg.box);
                            if (msg.hit == true) {
                                box.classList.add("hit")
                                if (msg.moveType == "report")
                                    notification({ type: "attackHit" });
                            } else if (msg.hit == false) {
                                box.classList.add("miss")
                                if (msg.moveType == "report")
                                    notification({ type: "attackMiss" });
                            } else if (msg.hit == "block") {
                                notification({ type: "attackBlock" });
                                usedSquares.splice(usedSquares.indexOf(msg.box), 1);
                            }

                            if ((msg.attackType == "attack" || msg.attackType == "endMortar" || msg.attackType == "highexplosive") && turn) {
                                turn = false;
                                document.getElementById("info1").style = "background-color: white;"
                                document.getElementById("info2").style = "background-color: yellow;"
                                removeAttack();
                                deactivatePowerups();
                                notification({ type: "enemyTurn" });
                            }
                        }
                        break;
                    case "attack":
                    case "double":
                    case "mortar":
                    case "endMortar":
                    case "highexplosive":
                        if (msg.target == nickname) {
                            var box = document.getElementById("s" + msg.box);
                            notification({ type: "enemyAttack", box: msg.box });
                            if (box.classList.contains("forcefield")) {
                                var move = {
                                    type: "move",
                                    moveType: "report",
                                    attackType: msg.moveType,
                                    gameId: gameId,
                                    user: nickname,
                                    target: opponent,
                                    box: msg.box,
                                    hit: "block"
                                };
                                ws.send(JSON.stringify(move));
                            } else {
                                if (box.classList.contains("ship")) {
                                    var move = {
                                        type: "move",
                                        moveType: "report",
                                        attackType: msg.moveType,
                                        gameId: gameId,
                                        user: nickname,
                                        target: opponent,
                                        box: msg.box,
                                        hit: true
                                    };
                                    ws.send(JSON.stringify(move));
                                    if (msg.moveType == "highexplosive") {
                                        notification({ type: "highExplosiveHit" });
                                        highExplosiveHit(msg.box);
                                    }
                                    hp--;
                                    if (hp == 0) {
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
                                        attackType: msg.moveType,
                                        gameId: gameId,
                                        user: nickname,
                                        target: opponent,
                                        box: msg.box,
                                        hit: false
                                    };
                                    ws.send(JSON.stringify(move));
                                }

                                if (box.classList.contains("trap")) {
                                    var msg1 = {
                                        type: "move",
                                        moveType: "trapTriggered",
                                        gameId: gameId,
                                        user: nickname,
                                        target: opponent,
                                    };
                                    ws.send(JSON.stringify(msg1));
                                    box.classList.remove("trap");
                                }
                            }
                        }
                        break;
                    case "trapTriggered":
                        if (msg.user == nickname) {
                            var ships = Array.from(document.getElementsByClassName("ship"));
                            ships.forEach((ship) => {
                                if (ship.classList.contains("hit")) {
                                    ships.splice(ships.indexOf(ship), 1);
                                }
                            });
                            var randomShip = Math.floor(Math.random() * ships.length);
                            var box = ships[randomShip];
                            ships.splice(randomShip, 1);
                            var msg = {
                                type: "move",
                                moveType: "trapReport",
                                gameId: gameId,
                                user: nickname,
                                target: opponent,
                                box: box.id.substring(1)
                            };
                            ws.send(JSON.stringify(msg));
                        }
                        break;
                    case "trapReport":
                        if (msg.user == nickname) {
                            var box = document.getElementById(msg.box);
                            box.classList.add("spotted");
                            notification({ type: "trapReport", box: msg.box });
                        }
                        break;
                    case "sonar":
                        if (msg.target == nickname) {
                            let countedShips = 0;
                            for (var i = -2; i <= 2; i++) {
                                for (var j = -2; j <= 2; j++) {
                                    var square = document.getElementById("s" + (rows[msg.box.substring(0, 1).charCodeAt() - 65 + i]) + (parseInt(msg.box.substring(1)) + j));
                                    if (square.classList.contains("ship") && !square.classList.contains("hit")) {
                                        countedShips++;
                                    }
                                }
                            }
                            notification({ type: "enemyScanArea" });
                            var move = {
                                type: "move",
                                moveType: "sonarReport",
                                gameId: gameId,
                                user: nickname,
                                target: opponent,
                                number: countedShips
                            };
                            ws.send(JSON.stringify(move));
                        }
                        break;
                    case "sonarReport":
                        if (msg.target == nickname) {
                            if (msg.number == 0) {
                                notification({ type: "scanNoShips" });
                            } else {
                                notification({ type: "scanReport", number: msg.number });
                            }
                        }
                        break;

                    case "spy":
                        if (msg.target == nickname) {
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
                        if (msg.target == nickname) {
                            switch (msg.news) {
                                case "money":
                                    //TODO: add money somewhere
                                    break;
                                case "forcefield":
                                    notification({ type: "spyReportForcefield", box: msg.box });
                                    break;
                                case "trap":
                                    notification({ type: "spyReportTrap", box: msg.box });
                                    break;

                            }
                        }
                        break;
                }
                break;
            //document.getElementById(msg.box).style.backgroundImage = "url('images/"+msg.symbol+".png')";
            //The game is over
            case "end":
                if (game) {
                    if (msg.winner == nickname) {
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

function highExplosiveHit(box) {
    var boxRow = box.substring(0, 1);
    console.log(box)
    console.log(boxRow)
    var boxCol = parseInt(box.substring(1));
    let clickedBox = [];
    clickedBox.push("s" + boxRow + (boxCol - 1), "s" + boxRow + (boxCol + 1), "s" + rows[(boxRow.charCodeAt() - 65) - 1] + boxCol, "s" + (rows[(boxRow.charCodeAt() - 65) + 1] + boxCol));
    for (let i = 0; i < clickedBox.length; i++) {
        try {
            let checkedBox = document.getElementById(clickedBox[i]);
            if (checkedBox.classList.contains("ship") && !checkedBox.classList.contains("hit")) {
                checkedBox.classList.add("hit");
                checkedBox.classList.remove("forcefield");
                checkedBox.classList.remove("trap");
                hp--;
                let msg = {
                    type: "move",
                    moveType: "reportHE",
                    gameId: gameId,
                    user: nickname,
                    target: opponent,
                    box: clickedBox[i].substring(1),
                    hit: true
                };
                ws.send(JSON.stringify(msg));
                highExplosiveHit(clickedBox[i].substring(1));
            }
        } catch (e) { }
    }
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
