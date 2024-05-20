/*Powerups:



DOUBLE SHOT:
Makes you shoot twice per turn.



Barrage:
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
    document.getElementById("barrage").addEventListener("click", activateBarrage);
    document.getElementById("forcefield").addEventListener("click", activateForcefield);
    document.getElementById("trap").addEventListener("click", activateSpotTrap);
    document.getElementById("he").addEventListener("click", activateHE);
    document.getElementById("spy").addEventListener("click", activateSpy);
    document.getElementById("sonar").addEventListener("click", activateSonar);
    document.getElementById("jammer").addEventListener("click", activateJammer);
}

function deactivatePowerups() {
    document.getElementById("double").removeEventListener("click", activateDouble);
    document.getElementById("barrage").removeEventListener("click", activateBarrage);
    document.getElementById("forcefield").removeEventListener("click", activateForcefield);
    document.getElementById("trap").removeEventListener("click", activateSpotTrap);
    document.getElementById("he").removeEventListener("click", activateHE);
    document.getElementById("spy").removeEventListener("click", activateSpy);
    document.getElementById("sonar").removeEventListener("click", activateSonar);
    document.getElementById("jammer").removeEventListener("click", activateJammer);
    resetAttack();
}

function resetAttack() {
    attackType = "attack";
    var squares = document.getElementsByClassName("box");
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", barrageFunction);
            squares[i].removeEventListener("mouseover", barrageFunctionHover);
            squares[i].removeEventListener("mouseout", resetHover);
            squares[i].removeEventListener("click", activateForcefieldFunction);
            squares[i].removeEventListener("click", placeForcefieldFunction);
            squares[i].removeEventListener("click", activateTrapFunction);
            squares[i].removeEventListener("click", placeTrapFunction);
            squares[i].removeEventListener("click", scanAreaFunction);

        }
}

function activateDouble() {
    if(attackType != "double"){
        notification({ type: "activateDouble" });
        attackType = "double";
    } else {
        notification({ type: "normalAttack" })
        resetAttack();
    }
}

function activateBarrage() {
    if (attackType != "barrage") {
        notification({ type: "activateBarrage" });
        attackType = "barrage";
        var squares = document.getElementsByClassName("enemy");
        for (var i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", function barrageFunction(e) { barrage(e.target) });
            squares[i].addEventListener("mouseover", function barrageFunctionHover(e) { barrageHover(e.target) });
            squares[i].addEventListener("mouseout", resetHover);
        }
    } else {
        notification({ type: "normalAttack" })
        resetAttack()
    }

}

function barrageHover(box) {
    var hoveredRow = box.id.substring(0, 1);
    var hoveredColumn = parseInt(box.id.substring(1));
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            try {
                square = document.getElementById((rows[hoveredRow.charCodeAt() - 65 + i]) + (hoveredColumn + j));
                square.style.backgroundColor = "rgba(255, 255, 0, 0.651)"
            } catch (e) { }
        }
    }
}

function barrage(box) {
    var square = box;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            while (square.classList.contains("miss" || square.classList.contains("hit"))) {
                square = document.getElementById((rows[box.id.substring(0, 1).charCodeAt() - 65 + i]) + (parseInt(box.id.substring(1)) + j));
                attack(box);
            }
        }
    }
}

function resetHover() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains("usable")) {
            squares[i].style.backgroundColor = "white";
            squares[i].classList.remove("hoveredBarrage");
        }
    }
}

function activateForcefield() {
    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", function activateForcefieldFunction(e) { placeForcefield(e.target) });
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
            squares[i].classList.add("previewForcefield");
        }
    }
}

function placeForcefield(box) {
    var move = {
        type: "move",
        moveType: "forcefield",
        gameId: gameId,
        user: nickname,
        target: opponent,
        box: box.id
    };
    ws.send(JSON.stringify(move));

    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", function placeForcefieldFunction(e) { placeForcefield(e.target) });
        squares[i].classList.remove("usable");
        squares[i].style.cursor = "not-allowed";
        squares[i].classList.remove("previewForcefield");
    }
}

function activateSpotTrap() {
    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", function activateTrapfunction(e) { placeTrap(e.target) });
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
            squares[i].classList.add("previewTrap");
        }
    }
}

function placeTrap(box) {
    var move = {
        type: "move",
        moveType: "trap",
        gameId: gameId,
        user: nickname,
        target: opponent,
        box: box.id
    };
    ws.send(JSON.stringify(move));

    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", function placeTrapFunction(e) { placeTrap(e.target) });
        squares[i].classList.remove("usable");
        squares[i].style.cursor = "not-allowed";
    }
}


function activateHE() {
    attackType = "highexplosive";
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
    var squares = document.getElementsByClassName("self");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", function activateSonarFunction(e) { scanArea(e.target) });
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
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