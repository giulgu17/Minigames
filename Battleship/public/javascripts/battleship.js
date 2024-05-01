/*Powerups:



DOUBLE SHOT:
Makes you shoot twice per turn.



SCATTERSHOT:
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



HIGH-EXPLOSIVE INCENDIARY SHELL:
A special shell designed to cause set enemy's ships on fire. The shell explodes on impact, setting all adjacent squares on fire.
Squares on fire have a chance to spread to adjacent squares (33%) or to go out on their own (33%). If the whole ship is on fire, the ship is destroyed.
On hit:
    "That was a high-explosive shell! The ship is on fire!"
    "The shell exploded, setting the ship on fire!"
Fire spreading:
    "The fire on {square} is spreading!"
    "The fire on {square} is getting out of control!"
Fire dying out:
    "The fire on {square} is dying out."
    "The fire on {square} went out."
Fire taking down a ship:
    "The {Ship} was overwhelmed by the fire and sunk."
    "The fire on {Ship} spread too much and destroyed it."



SPY:
Allows you to see the enemy's inventory and you get notified of every move they make. Lasts for 5 turns.
HIDDEN PERK: you become immune to spies, but the enemy becomes aware of it.
On activation:
    "You sent a spy to check on {Enemy}'s activies..."
    "{Enemy} is now under surveillance, let's see what they're up to..."
On activation (failure):
    "You sent a spy to check on {Enemy}'s activies... but before they could do anything they were caught!" "Looks like {Enemy} was aware of it somehow..."
    "{Enemy} is now under surveilance... not. Your spy was immediately caught." "How could they have known?..."
On enemy's move:
    "{Enemy} has placed a {Object} on {square}"
    "The spy reports that {Enemy} put down a {Object} on {square}"
    "{Enemy} tried to send a spy on you, but you were prepared and caught them immediately."
On enemy using repair kits:
    "Looks like {Enemy} has repaired a ship square."
    "The spy reports that {Enemy} repaired a ship square."
    "Looks like {Enemy} has put out a fire."
    "The spy reports that {Enemy} put out a fire.
On enemy using turbo engine:
    "Looks like has {Enemy} moved a ship. Great, now you can't even trust your own map"
    "The spy reports that {Enemy} has moved a ship. That has to be cheating right?"
On deactivation:
    "The spy is retreating before {Enemy} notices them."
    "The spy is back. {Enemy} is no longer under surveillance."



REPAIR KIT:
Allows you to repair an existing ship square once. Also used for taking out fires.
On use:
    "You successfully repaired a ship square."
    "You put out the fire on your ship."



TURBO ENGINE:
Allows you to move a ship square to an adjacent square. The square must empty.
You can only move the ship in the direction it's facing or in the opposite direction.
On use:
    "You moved the {ship}. How evil!"
    "The {ship} has been moved. They're never gonna see this one coming!"
*/

var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var unSquares = [];

//Player joins the queue
function join() {
    for(var i=0; i<10; i++){
        for(var j=1; j<=10; j++){
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.id = "s"+rows[i]+j;
            document.getElementById("selfGrid").appendChild(square);
        }
    }

    for(var i=0; i<10; i++){
        for(var j=1; j<=10; j++){
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("enemy");
            square.id = rows[i]+j;
            document.getElementById("enemyGrid").appendChild(square);
        }
    }

    nickname = document.getElementById("username").value;       //TODO: add test page for usernames (or something idk)
    var msg = {
        type: "join",
        nick: nickname
    }
    console.log("Joined the queue for Battleship");
    ws.send(JSON.stringify(msg));
}

function startGame(){
    if (turn) {
        addEventListeners();
    } else {
        removeEventListeners();
    }
}

function addEventListeners() {
    var squares = document.getElementsByClassName("enemy");
    for (var i = 0; i < squares.length; i++) {
        if (!usedSquares.includes(squares[i].id)) {
            squares[i].addEventListener("click", attack);
            squares[i].style.cursor = "pointer";
            squares[i].classList.add("usable");
        }
    }
    console.log("added event listeners");
}

function removeEventListeners() {
    var squares = document.getElementsByClassName("box");
    for (var i = 0; i < squares.length; i++) {
        squares[i].removeEventListener("click", attack);
        squares[i].classList.remove("usable");
        squares[i].style.cursor = "not-allowed";
    }
    console.log("removed event listeners");
}

function attack() {
    if (turn) {
        let box = this;
        var move = {
            type: "move",
            movetype: "attack",
            gameId: gameId,
            user: nickname,
            target: opponent,
            box: box.id
        };
        ws.send(JSON.stringify(move));
    }
    else {
        window.location.href = "https://www.google.com/search?client=firefox-b-d&q=nuh+uh"
    }
}





function checkWin(){
    
}