var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var usedSquares = [];
var code;
var attackType;

//Player joins the queue
function joinQueue() {
    var code = document.getElementById("code").value;
    console.log(code);
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.id = "s" + rows[i] + j;
            document.getElementById("selfGrid").appendChild(square);
            if (code[i * 10 + j - 1] == 1) {
                square.classList.add("ship");
            }
        }
    }

    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("enemy");
            square.id = rows[i] + j;
            document.getElementById("enemyGrid").appendChild(square);
        }
    }

    nickname = document.getElementById("username").value;
    var msg = {
        type: "join",
        nick: nickname
    }
    console.log("Joined the queue for Battleship");
    ws.send(JSON.stringify(msg));
}

function startGame() {
    notification({type: "start"});
    attackType = "attack";
    if (turn) {
        document.getElementById("info1").style = "background-color: yellow;";
        document.getElementById("info2").style = "background-color: white;";
        activateAttack();
        activatePowerups();
        notification({type: "turn"});
    } else {
        document.getElementById("info1").style = "background-color: white;";
        document.getElementById("info2").style = "background-color: yellow;";
        removeAttack();
        deactivatePowerups();
        notification({type: "enemyTurn"});
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

function clicked(){
    attack(this);
}

function attack(box) {
    if (turn) {
        usedSquares.push(box.id);
        var move = {
            type: "move",
            moveType: attackType,
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(move));
        if (attackType == "double") {
            attackType = "attack";
            deactivatePowerups();
        } else if (attackType == "attack") {
            notification({type: "attack", box: box.id});
        }
    }
}

function notification(msg) {
    var notifbox = document.getElementById("notif");
    switch (msg.type) {
        case "start":
            notifbox.innerHTML += "You are now playing against " + opponent + ".<br>";
            break;
        case "turn":
            var random = Math.floor(Math.random() * 3);
            switch (random){
                case 0:
                    notifbox.innerHTML += "It is now your turn.<br>";
                    break;
                case 1:
                    notifbox.innerHTML += "It's your turn.<br>";
                    break;
                case 2:
                    notifbox.innerHTML += "It's your turn to move.<br>";
                    break;
            }
            break;

        case "attack":
            var random = Math.floor(Math.random() * 3);
            switch (random){
                case 0:
                    notifbox.innerHTML += "You try shooting in " + msg.box + "...<br>";
                    break;
                case 1:
                    notifbox.innerHTML += "You aim at " + msg.box + ".<br>";
                    break;
                case 2:
                    notifbox.innerHTML += "You shoot in " + msg.box + ".<br>";
                    break;  
            }
            break;
        case "attackHit":
            var random = Math.floor(Math.random() * 3);
            switch (random){
                case 0:
                    notifbox.innerHTML += "You hit a ship!<br>";
                    break;
                case 1:
                    notifbox.innerHTML += "A ship has been hit!<br>";
                    break;
                case 2:
                    notifbox.innerHTML += "It's a hit!<br>";
                    break;
            }
            break;
        case "attackMiss":
            var random = Math.floor(Math.random() * 3);
            switch (random){
                case 0:
                    notifbox.innerHTML += "It's a miss.<br>";
                    break;
                case 1:
                    notifbox.innerHTML += "No ship has been hit.<br>";
                    break;
                case 2:
                    notifbox.innerHTML += "You missed.<br>";
                    break;
            }
            break;


        case "resetAttack":
            notifbox.innerHTML += "Unequipping power.<br>";
            break;
        case "activateDouble":
            notifbox.innerHTML += "Equipping Double Shot!<br>";
            break;
        case "activateMortar":
            notifbox.innerHTML += "Equipping Mortar!<br>";
            break;
        case "startMortar":
            notifbox.innerHTML += "Shooting Mortar...<br>The mortar shot in ";
            break;
        case "shotMortar":
            notifbox.innerHTML += msg.box + ", ";
            break;
        case "endMortar":
            notifbox.innerHTML += "and " + msg.box + ".<br>";
            break;
        case "activateForcefield":
            notifbox.innerHTML += "Equipping Forcefield!<br>";
            break;
        case "placeForcefield":
            notifbox.innerHTML += "Forcefield placed in " + msg.box + ".<br>";
            break;
        case "activateTrap":
            notifbox.innerHTML += "Equipping Trap!<br>";
            break;
        

        case "enemyTurn":
            notifbox.innerHTML += "It's the enemy's turn.<br>";
            break;
        case "enemyAttack":
            notifbox.innerHTML += "The enemy shot in " + msg.box + ".<br>";
            break;
        case "enemyAttackHit":
            notifbox.innerHTML += "They hit a ship!<br>";
            break;
        case "enemyAttackMiss":
            notifbox.innerHTML += "They missed.<br>";
            break;

        case "win":
            notifbox.innerHTML += "You won!<br>";
            break;
        case "lose":
            notifbox.innerHTML += "You lost!<br>";
            break;
    }
    notifbox.scrollTop =notifbox.scrollHeight;
}