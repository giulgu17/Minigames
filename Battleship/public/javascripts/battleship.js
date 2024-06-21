var columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var usedSquares = [];
var code;
var attackType;

//Player joins the queue
function joinQueue() {
    var code = document.getElementById("code").value;
    //console.log(code)
    for (var i = 1; i <= 10; i++) {
        for (var j = 0; j < 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.id = "s" + columns[j] + i;
            document.getElementById("selfGrid").appendChild(square);
            if (code[(i - 1) * 10 + j] == 1) {
                square.classList.add("ship");
            }
        }
    }

    for (var i = 1; i <= 10; i++) {
        for (var j = 0; j < 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("enemy");
            square.id = columns[j] + i;
            document.getElementById("enemyGrid").appendChild(square);
        }
    }

    nickname = document.getElementById("username").value;
    update();

    document.getElementById("double").value += doubleCost;
    document.getElementById("mortar").value += mortarCost;
    document.getElementById("forcefield").value += forcefieldCost;
    document.getElementById("trap").value += trapCost;
    document.getElementById("he").value += heCost;
    document.getElementById("sonar").value += sonarCost;
    document.getElementById("spy").value += spyCost;
    document.getElementById("jammer").value += jammerCost;

    ws.send(JSON.stringify({ type: "join", nick: nickname }));
    console.log("Joined the queue for Battleship");
    document.getElementById("inick2").innerHTML = "Waiting for an opponent...";
}

function startGame() {
    notification({ type: "start" });
    attackType = "attack";
    if (turn) {
        document.getElementById("info1").style = "background-color: yellow;";
        document.getElementById("info2").style = "background-color: white;";
        deactivatePowerups();
        activatePowerups();
        activateAttack();
        notification({ type: "turn" });
    } else {
        document.getElementById("info1").style = "background-color: white;";
        document.getElementById("info2").style = "background-color: yellow;";
        deactivatePowerups();
        removeAttack();
        notification({ type: "enemyTurn" });
    }
}

function activateAttack() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", clicked);
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
            squares[i].classList.add("previewAttack");
        }
    }
}

function removeAttack() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", clicked);
        squares[i].style.cursor = "not-allowed";
        squares[i].classList.remove("usable");
        squares[i].classList.remove("previewAttack");
    }
}

function clicked() {
    attack(this);
}

function attack(box) {
    if (turn) {
        usedSquares.push(box.id);
        var move = {
            type: "move",
            moveType: attackType,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(move));
        removeAttack();

        if (attackType == "double") {
            attackType = "endDouble";
            money -= doubleCost;
            deactivatePowerups();
            activateAttack();
        } else if (attackType == "attack") {
            removeAttack();
        }

        if (attackType != "mortar" && attackType != "endMortar") {
            notification({ type: "attack", box: box.id });
        }

        box.classList.remove("markedForcefield");
        box.classList.remove("markedTrap");
    }
}

function highExplosiveHit(box) {
    hp++;   //TODO: temporary solution: make a better one when refactoring
    var boxRow = box.substring(0, 1);
    var boxCol = parseInt(box.substring(1));
    let clickedBox = [];
    clickedBox.push("s" + boxRow + (boxCol - 1),
    "s" + boxRow + (boxCol + 1),
    "s" + columns[(boxRow.charCodeAt() - 65) - 1] + boxCol,
    "s" + (columns[(boxRow.charCodeAt() - 65) + 1] + boxCol));
    for (let i = 0; i < clickedBox.length; i++) {
        try {
            let checkedBox = document.getElementById(clickedBox[i]);
            if (checkedBox.classList.contains("ship") && !checkedBox.classList.contains("hit")) {
                checkedBox.classList.add("hit");
                checkedBox.classList.remove("forcefield");
                checkedBox.classList.remove("trap");
                hp--;
                let msg = {
                    type: "reportHE",
                    user: nickname,
                    target: opponent,
                    box: clickedBox[i].substring(1),
                    hit: true
                };
                ws.send(JSON.stringify(msg));
                highExplosiveHit(clickedBox[i].substring(1));
                hp--;
            }
        } catch (e) { }
    }
}

function cycle() {
    if (spiedOn > 0) {
        spiedOn--;
        if (spiedOn == 0) {
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
            var msg = {
                type: "move",
                moveType: "jammerEnd",
                user: nickname,
                target: opponent
            };
            ws.send(JSON.stringify(msg));
        }
    }
    if (doubleCooldown > 0) {
        doubleCooldown--;
        if (doubleCooldown == 0 && money >= doubleCost)
            document.getElementById("double").classList.remove("btn-disabled");
    }
    if (mortarCooldown > 0) {
        mortarCooldown--;
        if (mortarCooldown == 0 && money >= mortarCost)
            document.getElementById("mortar").classList.remove("btn-disabled");
    }
    if (forcefieldCooldown > 0) {
        forcefieldCooldown--;
        if (forcefieldCooldown == 0 && money >= forcefieldCost)
            document.getElementById("forcefield").classList.remove("btn-disabled");
    }
    if (trapCooldown > 0) {
        trapCooldown--;
        if (trapCooldown == 0 && money >= trapCost)
            document.getElementById("trap").classList.remove("btn-disabled");
    }
    if (heCooldown > 0) {
        highExplosiveCooldown--;
        if (heCooldown == 0 && money >= heCost)
            document.getElementById("he").classList.remove("btn-disabled");
    }
    if (sonarCooldown > 0) {
        sonarCooldown--;
        if (sonarCooldown == 0 && money >= sonarCost)
            document.getElementById("sonar").classList.remove("btn-disabled");
    }
    if (jammerCooldown > 0) {
        jammerCooldown--;
        if (jammerCooldown == 0 && money >= jammerCost)
            document.getElementById("jammer").classList.remove("btn-disabled");
    }
    if (spyCooldown > 0) {
        spyCooldown--;
        if (spyCooldown == 0 && money >= spyCost)
            document.getElementById("spy").classList.remove("btn-disabled");
    }
}

function update() {
    if (jammed == 0) {
        document.getElementById("money").innerHTML = money;
        document.getElementById("hp").innerHTML = hp;
        document.getElementById("enemyHp").innerHTML = enemyHp;
    } else {
        document.getElementById("money").innerHTML = "[ERROR]";
        document.getElementById("money").color = "red";
        document.getElementById("hp").innerHTML = "[ERROR]";
        document.getElementById("hp").color = "red";
        document.getElementById("enemyHp").innerHTML = "[ERROR]";
        document.getElementById("enemyHp").color = "red";
        if (document.getElementById("money1").innerHTML != "")
            document.getElementById("money2").innerHTML = "[ERROR]";
            document.getElementById("money2").color = "red";
    }
}

function spyMoney() {
    //If the player is spied on this function activates and says how much money the player has
    if (spiedOn > 0) {
        var report = {
            type: "move",
            moveType: "spyReport",
            news: "money",
            money: money,
            user: nickname,
            target: opponent,
        };
        ws.send(JSON.stringify(report));
    }
}