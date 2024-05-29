var ws, nickname, opponent, game = true;
var lastSender;
var turn, win;
var money = 650, opponentMoney, hp = 20, spiedOn = 0, jammed = 0;
var spotted = [];
/*var chat = document.getElementById("chat");
var text = document.getElementById("text");*/

function ready() {
    if ((document.getElementById("login").value == "" || document.getElementById("login").value == null) || sessionStorage.getItem("is_connected") == "true") {
        sessionStorage.clear();
        window.location.href = "/"
    }
    var hostname = window.location.hostname;
    ws = new WebSocket("ws://" + hostname + ":8080");

    ws.addEventListener('message', function (event) {
        var msg = JSON.parse(event.data);
        //console.log('Message received: ', msg);
        document.getElementById("money").innerHTML = money;

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
                opponent = msg.opponent;
                turn = msg.turn;
                document.getElementById("inick2").innerHTML = "<a>" + opponent + "</a>";
                //sessionStorage.setItem("is_connected", "true");
                startGame();
                break;
            case "end":
                if (game) {
                    var squares = Array.from(document.getElementsByClassName("box"));
                    squares.forEach(square => {
                        square.classList.remove("jammed");
                    });

                    if (msg.winner == nickname) {
                        alert("You won!");
                    } else {
                        alert(opponent + " won!");
                    }
                    game = false;
                }
                window.location.href = "/";
                sessionStorage.clear();
                break;
            //A player makes a move
            case "move":
                switch (msg.moveType) {
                    case "report":
                    case "reportHE":
                        if (msg.user == nickname) {     //The player attacked:
                            var box = document.getElementById("s" + msg.box);
                            if (msg.hit == true) {
                                box.classList.add("hit")
                                if (msg.moveType == "report")
                                    notification({ type: "enemyAttackHit" });
                                money += damageEarnings;
                                document.getElementById("money").innerHTML = money;
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

                                if (msg.attackType == "attack")
                                    money += attackEarnings;
                                else if (msg.attackType == "double" || msg.attackType == "endDouble")
                                    money += doubleEarnings;
                                else if (msg.attackType == "mortar" || msg.attackType == "endMortar")
                                    money += mortarEarnings;
                                else if (msg.attackType == "highexplosive")
                                    money += heEarnings;

                                document.getElementById("money").innerHTML = money;
                            } else if (msg.hit == false) {
                                box.classList.add("miss")
                                if (msg.moveType == "report")
                                    notification({ type: "attackMiss" });
                                if (msg.attackType == "attack")
                                    money += missAttackEarnings;
                                document.getElementById("money").innerHTML = money;
                            } else if (msg.hit == "block") {
                                notification({ type: "attackBlock" });
                                usedSquares.splice(usedSquares.indexOf(msg.box), 1);
                            }

                            box.classList.remove("markedForcefield");
                            box.classList.remove("markedTrap");
                            box.classList.remove("spotted");

                            if ((msg.attackType == "attack" || msg.attackType == "endMortar" || msg.attackType == "highexplosive") && turn) {
                                turn = false;
                                document.getElementById("info1").style = "background-color: white;"
                                document.getElementById("info2").style = "background-color: yellow;"
                                removeAttack();
                                deactivatePowerups();
                                notification({ type: "enemyTurn" });
                                cycle();
                            }
                        }

                        if (spiedOn > 0) {
                            var report = {
                                type: "move",
                                moveType: "spyReport",
                                news: "money",
                                money: money,
                                user: nickname,
                                target: opponent,
                                box: msg.box
                            };
                            ws.send(JSON.stringify(report));
                        }
                        break;
                    case "attack":
                    case "double":
                    case "endDouble":
                    case "mortar":
                    case "endMortar":
                    case "highexplosive":
                        if (spiedOn > 0) {
                            var report = {
                                type: "move",
                                moveType: "spyReport",
                                news: "money",
                                money: money,
                                user: nickname,
                                target: opponent,
                                box: msg.box
                            };
                            ws.send(JSON.stringify(report));
                        }
                        if (msg.target == nickname) {
                            var box = document.getElementById("s" + msg.box);
                            notification({ type: "enemyAttack", box: msg.box });
                            if (box.classList.contains("forcefield")) {
                                var move = {
                                    type: "move",
                                    moveType: "report",
                                    attackType: msg.moveType,
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
                                        user: nickname,
                                        target: opponent,
                                        box: msg.box,
                                        hit: true
                                    };
                                    ws.send(JSON.stringify(move));
                                    if (msg.moveType == "highexplosive") {
                                        notification({ type: "highExplosiveHit" });
                                        highExplosiveHit(msg.box);
                                    } else {
                                        hp--;
                                    }
                                    console.log(hp)
                                    if (hp == 0) {
                                        var endmsg = {
                                            type: "end",
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
                        if (msg.target == nickname) {
                            /*var ships = Array.from(document.getElementsByClassName("ship"));
                            console.log(ships);
                            ships.forEach((ship) => {
                                console.log(ship);
                                console.log(ship.classList.contains("hit"));
                                if (ship.classList.contains("hit")) {
                                    console.log("hit");
                                    ships.splice(ships.indexOf(ship), 1);
                                }
                            });*/
                            try{
                                var boxes = Array.from(document.getElementsByClassName("box"));
                                var ships = boxes.filter((box) => box.classList.contains("ship") && !box.classList.contains("hit"));
                                var randomShip = Math.floor(Math.random() * ships.length);
                                var selShip = ships[randomShip];
                                ships.splice(randomShip, 1);

                                var msg = {
                                    type: "move",
                                    moveType: "trapReport",
                                    user: nickname,
                                    target: opponent,
                                    box: selShip.id.substring(1)
                                };
                                ws.send(JSON.stringify(msg));
                            } catch(e){}
                            if(spiedOn > 0){
                                var report = {
                                    type: "move",
                                    moveType: "spyReport",
                                    news: "trapTriggered",
                                    user: nickname,
                                    target: opponent
                                };
                                ws.send(JSON.stringify(report));
                            }
                        }
                        break;
                    case "trapReport":
                        if (msg.target == nickname) {
                            var box = document.getElementById(msg.box);
                            box.classList.add("spotted");
                            notification({ type: "trapTriggered", box: msg.box });
                            notification({ type: "trapReport", box: msg.box });
                        }
                        break;
                    case "sonar":
                        if (msg.target == nickname) {
                            let countedShips = 0;
                            for (var i = -2; i <= 2; i++) {
                                for (var j = -2; j <= 2; j++) {
                                    try {
                                        var square = document.getElementById("s" + (columns[msg.box.substring(0, 1).charCodeAt() - 65 + i]) + (parseInt(msg.box.substring(1)) + j));
                                        if (square.classList.contains("ship") && !square.classList.contains("hit")) {
                                            countedShips++;
                                        }
                                    } catch (e) { }
                                }
                            }
                            notification({ type: "enemyScanArea" });
                            var move = {
                                type: "move",
                                moveType: "sonarReport",
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
                    case "jammer":
                        if (msg.target == nickname) {
                            notification({ type: "enemyJammer" });
                            jammed = 3;
                            var squares = Array.from(document.getElementsByClassName("box"));
                            squares.forEach((square) => {
                                square.classList.add("jammed");
                            });
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
                                    opponentMoney = msg.money;
                                    document.getElementById("money1").innerHTML = "Coins: ";
                                    document.getElementById("money2").innerHTML = opponentMoney;
                                    break;
                                case "forcefield":
                                    notification({ type: "spyReportForcefield", box: msg.box });
                                    document.getElementById(msg.box).classList.add("markedForcefield");
                                    break;
                                case "trap":
                                    notification({ type: "spyReportTrap", box: msg.box });
                                    document.getElementById(msg.box).classList.add("markedTrap");
                                    break;
                                case "trapTriggered":
                                    notification({ type: "spyReportTrapTriggered" });
                                    break;
                                case "spy":
                                    notification({ type: "spyReportSpy", box: msg.box });
                                    break;
                                case "scan":
                                    notification({ type: "spyReportScan", box: msg.box });
                                    break;
                            }
                        }
                        break;
                    case "spyEnd":
                        if (msg.target == nickname) {
                            document.getElementById("money1").innerHTML = "";
                            document.getElementById("money2").innerHTML = "";
                            notification({ type: "spyEnd" });
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
    var boxCol = parseInt(box.substring(1));
    let clickedBox = [];
    clickedBox.push("s" + boxRow + (boxCol - 1), "s" + boxRow + (boxCol + 1), "s" + columns[(boxRow.charCodeAt() - 65) - 1] + boxCol, "s" + (columns[(boxRow.charCodeAt() - 65) + 1] + boxCol));
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

function cycle() {
    if (spiedOn > 0){
        spiedOn--;
        if(spiedOn == 0){
            var report = {
                type: "move",
                moveType: "spyEnd",
                user: nickname,
                target: opponent
            };
            ws.send(JSON.stringify(report));
            notification({ type: "enemySpyEnd" });
        }
    }
    if (jammed > 0) {
        jammed--;
        if (jammed == 0) {
            var squares = Array.from(document.getElementsByClassName("box"));
            squares.forEach(square => {
                square.classList.remove("jammed");
            });
            notification({ type: "enemyJammerEnd" });
        }
    }
    if (doubleCooldown > 0) {
        doubleCooldown--;
        if (doubleCooldown == 0)
            document.getElementById("double").classList.remove("btn-disabled");
    }
    if (mortarCooldown > 0) {
        mortarCooldown--;
        if (mortarCooldown == 0)
            document.getElementById("mortar").classList.remove("btn-disabled");
    }
    if (forcefieldCooldown > 0) {
        forcefieldCooldown--;
        if (forcefieldCooldown == 0)
            document.getElementById("forcefield").classList.remove("btn-disabled");
    }
    if (trapCooldown > 0) {
        trapCooldown--;
        if (trapCooldown == 0)
            document.getElementById("trap").classList.remove("btn-disabled");
    }
    if (heCooldown > 0) {
        highExplosiveCooldown--;
        if (heCooldown == 0)
            document.getElementById("he").classList.remove("btn-disabled");
    }
    if (sonarCooldown > 0) {
        sonarCooldown--;
        if (sonarCooldown == 0)
            document.getElementById("sonar").classList.remove("btn-disabled");
    }
    if (jammerCooldown > 0) {
        jammerCooldown--;
        if (jammerCooldown == 0)
            document.getElementById("jammer").classList.remove("btn-disabled");
    }
    if (spyCooldown > 0) {
        spyCooldown--;
        if (spyCooldown == 0)
            document.getElementById("spy").classList.remove("btn-disabled");
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
