var ws, nickname, opponent, game = true;
var lastSender;
var turn, win;
var money = 650, enemyMoney, hp = 20, enemyHp = 20, spiedOn = 0, jammed = 0;
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
        update();

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
            case "report":
            case "reportHE":
                if (msg.user == nickname) {     //User was attacked and sent report:
                    var box = document.getElementById("s" + msg.box);
                    if (msg.hit == true) {
                        box.classList.add("hit")
                        if (msg.type == "report")
                            notification({ type: "enemyAttackHit" });
                        money += damageEarnings;
                    } else if (msg.hit == false) {
                        box.classList.add("miss")
                        if (msg.type == "report")
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
                } else {        //User attacked opponent and received report:
                    var box = document.getElementById(msg.box);
                    if (msg.hit == true) {
                        box.classList.add("hit")
                        //FIXME: enemyHp decreasing one too many times when highexplosivehit function is called
                        enemyHp--;

                        if (msg.type == "report")
                            notification({ type: "attackHit" });

                        if (msg.attackType == "attack")
                            money += attackEarnings;
                        else if (msg.attackType == "double" || msg.attackType == "endDouble")
                            money += doubleEarnings;
                        else if (msg.attackType == "mortar" || msg.attackType == "endMortar")
                            money += mortarEarnings;
                        else if (msg.attackType == "highexplosive")
                            money += heEarnings;

                    } else if (msg.hit == false) {
                        box.classList.add("miss")
                        if (msg.type == "report")
                            notification({ type: "attackMiss" });
                        if (msg.attackType == "attack")
                            money += missAttackEarnings;
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
                    spyMoney();
                }
                break;
            //A player makes a move
            case "move":
                switch (msg.moveType) {
                    //Attack:
                    case "attack":
                    case "double":
                    case "endDouble":
                    case "mortar":
                    case "endMortar":
                    case "highexplosive":
                        spyMoney();
                        //User was attacked:
                        var box = document.getElementById("s" + msg.box);
                        notification({ type: "enemyAttack", box: msg.box });
                        if (box.classList.contains("forcefield")) {
                            var move = {
                                type: "report",
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
                                    type: "report",
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
                                }
                                hp--;
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
                                    type: "report",
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
                        break;
                    case "trapTriggered":
                        try {
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
                        } catch (e) { }
                        //FIXME: put this somewhere else
                        /*if (spiedOn > 0) {
                            var report = {
                                type: "move",
                                moveType: "spyReport",
                                news: "trapTriggered",
                                user: nickname,
                                target: opponent
                            };
                            ws.send(JSON.stringify(report));
                        }*/
                        break;
                    case "trapReport":
                        var box = document.getElementById(msg.box);
                        box.classList.add("spotted");
                        notification({ type: "trapTriggered", box: msg.box });
                        notification({ type: "trapReport", box: msg.box });
                        break;
                    case "sonar":
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
                        break;
                    case "sonarReport":
                        if (msg.number == 0) {
                            notification({ type: "scanNoShips" });
                        } else {
                            notification({ type: "scanReport", number: msg.number });
                        }
                        break;
                    case "jammer":
                        notification({ type: "enemyJammer" });
                        jammed = 3;
                        var squares = Array.from(document.getElementsByClassName("box"));
                        squares.forEach((square) => {
                            square.classList.add("jammed");
                        });
                        break;
                    case "jammerEnd":
                        document.getElementById("jammer").classList.remove("btn-active");
                        document.getElementById("jammer").classList.remove("btn-info");
                        document.getElementById("jammer").classList.add("btn-disabled");

                        notification({ type: "jammerEnd" });
                        break;
                    case "spy":
                        spiedOn = 5;
                        spyMoney();
                    case "spyReport":
                        if (jammed == 0) {
                            enemyMoney = msg.money;
                            document.getElementById("money2").innerHTML = enemyMoney;
                            switch (msg.news) {
                                case "money":
                                    document.getElementById("money1").innerHTML = "Coins: ";
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
                        document.getElementById("money1").innerHTML = "";
                        document.getElementById("money2").innerHTML = "";
                        document.getElementById("spy").classList.remove("btn-active");
                        document.getElementById("spy").classList.remove("btn-info");
                        document.getElementById("spy").classList.add("btn-disabled");
                        notification({ type: "spyEnd" });
                        break;
                }
                break;
            //document.getElementById(msg.box).style.backgroundImage = "url('images/"+msg.symbol+".png')";
            //The game is over
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
            case "disconnect":
                alert("The opponent has disconnected. You win!");
                window.location.href = "/";
                break;
        }
        update();
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
