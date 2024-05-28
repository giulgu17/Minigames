const doubleCost = 125,
    mortarCost = 275,
    forcefieldCost = 150,
    trapCost = 200,
    heCost = 250,
    spyCost = 350,
    sonarCost = 150,
    jammerCost = 300;

const doubleSetCooldown = 0,
    mortarSetCooldown = 0,
    forcefieldSetCooldown = 0,
    trapSetCooldown = 0,
    heSetCooldown = 0,
    spySetCooldown = 12,
    sonarSetCooldown = 0,
    jammerSetCooldown = 7;

const spyDuration = 7,
    jammerDuration = 3;

const attackEarnings = 75,
    doubleEarnings = 40,
    mortarEarnings = 30,
    heEarnings = 15,
    missAttackEarnings = 25,
    damageEarnings = 35;

let doubleCooldown = 0, mortarCooldown = 0, forcefieldCooldown = 0, trapCooldown = 0, heCooldown = 0, spyCooldown = 0, sonarCooldown = 0, jammerCooldown = 0;



function activatePowerups() {
    var buttons = Array.from(document.getElementsByClassName("powers"));
    buttons.forEach(button => {
        switch(button.id) {
            case "double":
                if(money >= doubleCost && doubleCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateDouble);
                }
                break;
            case "mortar":
                if(money >= mortarCost && mortarCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateMortar);
                }
                break;
            case "forcefield":
                if(money >= forcefieldCost && forcefieldCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateForcefield);
                }
                break;
            case "trap":
                if(money >= trapCost && trapCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateSpotTrap);
                }
                break;
            case "he":
                if(money >= heCost && heCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateHE);
                }
                break;
            case "spy":
                if(money >= spyCost && spyCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateSpy);
                }
                break;
            case "sonar":
                if(money >= sonarCost && sonarCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateSonar);
                }
                break;
            case "jammer":
                if(money >= jammerCost && jammerCooldown == 0) {
                    button.style.cursor = "pointer";
                    button.classList.remove("btn-disabled");
                    button.addEventListener("click", activateJammer);
                }
                break;
        }
    });
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
    var buttons = Array.from(document.getElementsByClassName("powers"));
    buttons.forEach(button => {
        button.style.cursor = "not-allowed";
        button.classList.add("btn-disabled");
    });
    resetAttack();
}

function resetAttack() {
    attackType = "attack";
    var squares = Array.from(document.getElementsByClassName("box"));
    squares.forEach(square => {
        square.removeEventListener("mouseout", resetHover);
        square.removeEventListener("click", mortarFunction);
        square.removeEventListener("mouseover", mortarHoverFunction);
        square.removeEventListener("click", activateForcefieldFunction);
        square.removeEventListener("click", placeForcefield);
        square.removeEventListener("click", activateTrapFunction);
        square.removeEventListener("click", placeTrapFunction);
        square.removeEventListener("click", activateSonar);
        square.removeEventListener("mouseover", sonarHoverFunction);
        square.removeEventListener("click", sonarFunction);
    });

    var squares = Array.from(document.getElementsByClassName("self"));
    squares.forEach(square => {
        square.style.cursor = "not-allowed";
        square.classList.remove("previewForcefield");
        square.classList.remove("previewTrap");
    });

    var squares = Array.from(document.getElementsByClassName("enemy"));
    squares.forEach(square => {
        if (!usedSquares.includes(square.id)) {
            square.classList.remove("previewMortar");
            square.classList.remove("previewHE");
            square.classList.remove("previewSonar");
            square.addEventListener("click", clicked);
            square.style.cursor = "pointer";
        } else {
            square.style.cursor = "not-allowed";
        }
    });
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
    if (money >= doubleCost) {
        if (attackType != "double") {
            deactivatePowerups();
            activatePowerups();
            notification({ type: "activateDouble" });
            attackType = "double";
        } else {
            notification({ type: "resetAttack" })
            activatePowerups();
        }
    }
}

function activateMortar() {
    if (money >= mortarCost) {
        var squares = document.getElementsByClassName("enemy");
        if (attackType != "mortar") {
            activatePowerups();
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
            activatePowerups();
            activateAttack();
        }
    }
}

var mortarFunction = function (e) { mortar(e.target) }
var mortarHoverFunction = function (e) { mortarHover(e.target) }

function mortarHover(box) {
    var hoveredColumn = box.id.substring(0, 1);
    var hoveredRow = parseInt(box.id.substring(1));
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            try {
                square = document.getElementById((columns[hoveredColumn.charCodeAt() - 65 + i]) + (hoveredRow + j));
                square.classList.add("previewMortar");
            } catch (e) { }
        }
    }
}

function mortar(box) {
    money -= mortarCost;
    document.getElementById("money").innerHTML = money;
    var selSquares = [];
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var square = document.getElementById((columns[box.id.substring(0, 1).charCodeAt() - 65 + i]) + (parseInt(box.id.substring(1)) + j));
            if (square.classList.contains("enemy") && !usedSquares.includes(square.id)) {
                selSquares.push(square);
            }
        }
    }

    notification({ type: "startMortar" });
    for (var i = 0; i < 4; i++) {
        var random = Math.floor(Math.random() * selSquares.length);
        if (i != 3 && selSquares.length != 1) {
            notification({ type: "shotMortar", box: selSquares[random].id });
        } else {
            notification({ type: "endMortar", box: selSquares[random].id });
            attackType = "endMortar";
        }
        attack(selSquares[random]);
        selSquares.splice(random, 1);
        if (selSquares.length == 0) {
            break;
        }
    }
    activatePowerups();
    resetHover();
}

function activateForcefield() {
    if (money >= forcefieldCost && forcefieldCooldown == 0) {
        var squares = document.getElementsByClassName("self");
        if (attackType != "forcefield") {
            activatePowerups();
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
            activatePowerups();
            activateAttack();
        }
    }
}

var activateForcefieldFunction = function (e) { placeForcefield(e.target) };

function placeForcefield(box) {
    money -= forcefieldCost;
    document.getElementById("money").innerHTML = money;
    if (spiedOn != 0) {
        var msg1 = {
            type: "move",
            moveType: "spyReport",
            news: "forcefield",
            money: money,
            user: nickname,
            target: opponent,
            box: box.id.substring(1)
        };
        ws.send(JSON.stringify(msg1));
    }
    box.classList.add("forcefield");
    notification({ type: "placeForcefield", box: box.id.substring(1) });

    deactivatePowerups();
    activatePowerups();
    activateAttack();
}

function activateSpotTrap() {
    if (money >= trapCost && trapCooldown == 0) {
        var squares = document.getElementsByClassName("self");
        if (attackType != "trap") {
            activatePowerups();
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
            activatePowerups();
            activateAttack();
        }
    }
}

var activateTrapFunction = function (e) { placeTrap(e.target) };

function placeTrap(box) {
    money -= trapCost;
    document.getElementById("money").innerHTML = money;
    if (spiedOn != 0) {
        var msg1 = {
            type: "move",
            moveType: "spyReport",
            news: "trap",
            money: money,
            user: nickname,
            target: opponent,
            box: box.id.substring(1)
        };
        ws.send(JSON.stringify(msg1));
    }
    box.classList.add("trap");
    notification({ type: "placeTrap", box: box.id.substring(1) });

    deactivatePowerups();
    activatePowerups();
    activateAttack();
}

var placeTrapFunction = function (e) { placeTrap(e.target) };

function activateHE() {
    if (money >= heCost) {
        activateAttack();
        if (attackType != "highexplosive") {
            activatePowerups();
            notification({ type: "activateHE" });
            attackType = "highexplosive";
            let squares = Array.from(document.getElementsByClassName("enemy"));
            squares.forEach(square => {
                square.classList.add("previewHE");
            });
        } else {
            notification({ type: "resetAttack" })
            activatePowerups();
        }
    }
}

function activateSpy() {
    if (money >= spyCost && spyCooldown == 0) {
        money -= spyCost;
        document.getElementById("money").innerHTML = money;
        spyCooldown = spySetCooldown;
        document.getElementById("spy").classList.add("btn-disabled");
        notification({ type: "activateSpy" });
        var move = {
            type: "move",
            moveType: "spy",
            user: nickname,
            target: opponent
        };
        ws.send(JSON.stringify(move));
    }
}

function activateSonar() {
    if (money >= sonarCost) {
        var squares = document.getElementsByClassName("enemy");
        if (attackType != "sonar") {
            activatePowerups();
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
            activatePowerups();
            activateAttack();
        }
    }
}

var sonarFunction = function (e) { scanArea(e.target) }
var sonarHoverFunction = function (e) { sonarHover(e.target) }

function sonarHover(box) {
    var hoveredColumn = box.id.substring(0, 1);
    var hoveredRow = parseInt(box.id.substring(1));
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            try {
                square = document.getElementById((columns[hoveredColumn.charCodeAt() - 65 + i]) + (hoveredRow + j));
                square.classList.add("previewSonar");
            } catch (e) { }
        }
    }
}

function scanArea(box) {
    money -= sonarCost;
    document.getElementById("money").innerHTML = money;
    var move = {
        type: "move",
        moveType: "sonar",
        user: nickname,
        target: opponent,
        box: box.id
    };
    ws.send(JSON.stringify(move));
    notification({ type: "scan", box: box.id });

    if(spiedOn > 0) {
        var msg1 = {
            type: "move",
            moveType: "spyReport",
            news: "sonar",
            money: money,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(msg1));
    }

    deactivatePowerups();
    activatePowerups();
    activateAttack();
}

function activateJammer() {
    if (money >= jammerCost) {
        money -= jammerCost;
        document.getElementById("money").innerHTML = money;
        jammerCooldown = jammerSetCooldown;
        document.getElementById("jammer").classList.add("btn-disabled");
        var move = {
            type: "move",
            moveType: "jammer",
            user: nickname,
            target: opponent
        };
        ws.send(JSON.stringify(move));
        notification({ type: "activateJammer" });
    }
}