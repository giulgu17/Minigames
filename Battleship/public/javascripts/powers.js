/*Powerups:



DOUBLE SHOT:
Makes you shoot twice per turn.



Mortar:
Shoots 5 random squares in a 3x3, 5x5 or 7x7 area.



FORCEFIELD:
Places a forcefield on a square. The forcefield breaks after being shot once.
On hit:
    "The shell is blown up in mid-air. Looks like you hit a forcefield."
    "There was a forcefield on {Square} and the shell exploded on it."



SPOT TRAP:
Places a hidden trap on a square. When the enemy shoots it, the trap explodes and a random ship square gets marked on your map.
The enemy doesn't get notified of the trap.
On activation:
    "{Enemy} has activated a trap. A random ship square has been marked on your map."
    "Looks like {Enemy} has fallen into the trap, now you can see where one of their ships is."



HIGH-EXPLOSIVE SHELL:
A special shell designed to instantly sink a ship.
On hit:
    "It was a high explosive shell! it instantly sunk the ship!"



SPY:
Allows you to see the enemy's inventory and you get notified of every move they make. Lasts for 5 turns.
On activation:
    "You sent a spy to check on {Enemy}'s activies..."
    "{Enemy} is now under surveillance, let's see what they're up to..."
On enemy's move:
    "{Enemy} has placed a {Object} on {square}"
    "The spy reports that {Enemy} put down a {Object} on {square}"
On deactivation:
    "The spy is retreating before {Enemy} notices them."
    "The spy is back. {Enemy} is no longer under surveillance."




SONAR:
Allows you to scan a 5x5 area to see how many ships are present.
On activation:
    "You activated the sonar. Scanning the area..."
    "The sonar is scanning the area..."
On success:
    "{Number} of squares in the area are occupied by ships."
    "The sonar detected {Number} of ships in the area."
On failure:
    "The sonar didn't detect any ships in the area."
    "Looks like there are no ships in the area."


    
JAMMER:
Temporarily disables the enemy's vision. Lasts for 3 turns.
On activation:
    "You activated the jammer. The enemy's vision is now disabled."
    "The jammer is now active. Now the enemy can't see your board."
*/

function activatePowerups() {
    document.getElementById("double").addEventListener("click", activateDouble);
    document.getElementById("mortar").addEventListener("click", activateMortar);
    document.getElementById("forcefield").addEventListener("click", activateForcefield);
    document.getElementById("trap").addEventListener("click", activateSpotTrap);
    document.getElementById("he").addEventListener("click", activateHE);
    document.getElementById("spy").addEventListener("click", activateSpy);
    document.getElementById("sonar").addEventListener("click", activateSonar);
    document.getElementById("jammer").addEventListener("click", activateJammer);
}

function deactivatePowerups() {
    document.getElementById("double").removeEventListener("click", activateDouble);
    document.getElementById("mortar").removeEventListener("click", activateMortar);
    document.getElementById("forcefield").removeEventListener("click", activateForcefield);
    document.getElementById("trap").removeEventListener("click", activateSpotTrap);
    document.getElementById("he").removeEventListener("click", activateHE);
    document.getElementById("spy").removeEventListener("click", activateSpy);
    document.getElementById("sonar").removeEventListener("click", activateSonar);
    document.getElementById("jammer").removeEventListener("click", activateJammer);
    var buttons = document.getElementsByClassName("powerup");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.cursor = "not-allowed";
        buttons[i].disabled = true;
    }
    resetAttack();
}

function resetAttack() {
    attackType = "attack";
    var squares = document.getElementsByClassName("box");
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("mouseout", resetHover);
            squares[i].removeEventListener("click", mortarFunction);
            squares[i].removeEventListener("mouseover", mortarHoverFunction);
            squares[i].removeEventListener("click", activateForcefieldFunction);
            squares[i].removeEventListener("click", placeForcefield);
            squares[i].removeEventListener("click", activateTrapFunction);
            squares[i].removeEventListener("click", placeTrapFunction);
            squares[i].removeEventListener("click", activateSonar);
            squares[i].removeEventListener("mouseover", sonarHoverFunction);
        }

    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.cursor = "not-allowed";
        squares[i].classList.remove("previewForcefield");
        squares[i].classList.remove("previewTrap");
    }

    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if(!usedSquares.includes(squares[i].id)){
            squares[i].classList.remove("previewHE");
            squares[i].addEventListener("click", clicked);
            squares[i].style.cursor = "pointer";
        } else {
            squares[i].style.cursor = "not-allowed";
        }
    }
}

function resetHover() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].classList.remove("previewMortar");
            squares[i].classList.remove("previewSonar");
        }
    }
}

function activateDouble() {
    if(attackType != "double"){
        resetAttack();
        notification({ type: "activateDouble" });
        attackType = "double";
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
    }
}

function activateMortar() {
    var squares = document.getElementsByClassName("enemy");
    if (attackType != "mortar") {
        resetAttack();
        notification({ type: "activateMortar" });
        attackType = "mortar";
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", clicked);
            squares[i].addEventListener("click", mortarFunction);
            squares[i].addEventListener("mouseover", mortarHoverFunction);
            squares[i].addEventListener("mouseout", resetHover);
            squares[i].style.cursor = "pointer";
        }
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
        activateAttack();
    }
}   

var mortarFunction = function(e){ mortar(e.target) }
var mortarHoverFunction = function (e) { mortarHover(e.target) }

function mortarHover(box) {
    var hoveredRow = box.id.substring(0, 1);
    var hoveredColumn = parseInt(box.id.substring(1));
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            try {
                square = document.getElementById((rows[hoveredRow.charCodeAt() - 65 + i]) + (hoveredColumn + j));
                square.classList.add("previewMortar");
            } catch (e) { }
        }
    }
}

function mortar(box) {
    var selSquares = [];
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var square = document.getElementById((rows[box.id.substring(0, 1).charCodeAt() - 65 + i]) + (parseInt(box.id.substring(1)) + j));
            if(square.classList.contains("enemy") && !usedSquares.includes(square.id)){
                selSquares.push(square);
            }
        }
    }

    notification({ type: "startMortar" });
    for (var i = 0; i < 4; i++) {
        var random = Math.floor(Math.random() * selSquares.length);
        if(i != 3 && selSquares.length != 1){
            notification({ type: "shotMortar", box: selSquares[random].id });
        } else {
            notification({ type: "endMortar", box: selSquares[random].id });
            attackType = "endMortar";
        }
        attack(selSquares[random]);
        selSquares.splice(random, 1);
        if(selSquares.length == 0){
            break;
        }
    }
    resetAttack();
    resetHover();
}

function activateForcefield() {
    var squares = document.getElementsByClassName("self");
    if (attackType != "forcefield") {
        resetAttack();
        notification({ type: "activateForcefield" });
        attackType = "forcefield";
        for (var i = 0; i < squares.length; i++) {
            if (!squares[i].classList.contains("hit") && !squares[i].classList.contains("miss") && !squares[i].classList.contains("forcefield")) {
                squares[i].addEventListener("click", activateForcefieldFunction);
                squares[i].style.cursor = "pointer";
                squares[i].classList.add("usable");
                squares[i].classList.add("previewForcefield");
            }
        }
        removeAttack();
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
        activateAttack();
    }
}

var activateForcefieldFunction = function(e){ placeForcefield(e.target) };

function placeForcefield(box) {
    if (spiedOn != 0) {
        var msg1 = {
            type: "move",
            moveType: "spyReport",
            news: "forcefield",
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(msg1));
    }
    box.classList.add("forcefield");
    notification({ type: "placeForcefield", box: box.id });

    resetAttack();
    activateAttack();
}

function activateSpotTrap() {
    var squares = document.getElementsByClassName("self");
    if (attackType != "trap") {
        resetAttack();
        notification({ type: "activateTrap" });
        attackType = "trap";
        for (var i = 0; i < squares.length; i++) {
            if (!squares[i].classList.contains("hit") && !squares[i].classList.contains("miss") && !squares[i].classList.contains("trap")) {
                squares[i].addEventListener("click", activateTrapFunction);
                squares[i].style.cursor = "pointer";
                squares[i].classList.add("usable");
                squares[i].classList.add("previewTrap");
            }
        }
        removeAttack();
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
        activateAttack();
    }
}

var activateTrapFunction = function(e){ placeTrap(e.target) };

function placeTrap(box) {
    if (spiedOn != 0) {
        var msg1 = {
            type: "move",
            moveType: "spyReport",
            news: "trap",
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(msg1));
    }
    box.classList.add("trap");
    notification({ type: "placeTrap", box: box.id });

    resetAttack();
    activateAttack();
}

var placeTrapFunction = function(e){ placeTrap(e.target) };

function activateHE() {
    activateAttack();
    if (attackType != "highexplosive") {
        resetAttack();
        notification({ type: "activateHE" });
        attackType = "highexplosive";
        let squares = Array.from(document.getElementsByClassName("enemy"));
        squares.forEach(square => {
            square.classList.add("previewHE");
        });
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
    }
}

function activateSpy() {
    var move = {
        type: "move",
        moveType: "spy",
        gameId: gameId,
        user: nickname,
        target: opponent
    };
    ws.send(JSON.stringify(move));
}

function activateSonar() {
    var squares = document.getElementsByClassName("enemy");
    if (attackType != "sonar") {
        resetAttack();
        notification({ type: "activateSonar" });
        attackType = "sonar";
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", clicked);
            squares[i].addEventListener("click", sonarFunction);
            squares[i].addEventListener("mouseover", sonarHoverFunction);
            squares[i].addEventListener("mouseout", resetHover);
            squares[i].style.cursor = "pointer";
        }
    } else {
        notification({ type: "resetAttack" })
        resetAttack();
        activateAttack();
    }
}

var sonarFunction = function(e){ scanArea(e.target) }
var sonarHoverFunction = function (e) { sonarHover(e.target) }

function sonarHover(box) {
    var hoveredRow = box.id.substring(0, 1);
    var hoveredColumn = parseInt(box.id.substring(1));
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            try {
                square = document.getElementById((rows[hoveredRow.charCodeAt() - 65 + i]) + (hoveredColumn + j));
                square.classList.add("previewSonar");
            } catch (e) { }
        }
    }
}

function scanArea(box) {
    var move = {
        type: "move",
        moveType: "sonar",
        gameId: gameId,
        user: nickname,
        target: opponent,
        box: box.id
    };
    ws.send(JSON.stringify(move));
}

function activateJammer() {
    var move = {
        type: "move",
        moveType: "jammer",
        gameId: gameId,
        user: nickname,
        target: opponent
    };
    ws.send(JSON.stringify(move));
}