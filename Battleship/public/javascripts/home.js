var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var selectMode = false;

function ready() {
    grid = document.getElementById("homegrid");
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.style.cursor = "pointer";
            square.id = "s" + (i * 10 + j);
            document.getElementById("homegrid").appendChild(square);
        }
    }


}

function select() {
    var selected = this;
    selectMode = true;
    selected.classList.toggle("selected");
    selected.style.backgroundColor = selected.classList.contains("selected") ? "lime" : "yellow";
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById("s" + (i * 10 + j));
            square.style.cursor = "pointer";
            //TODO: show preview onHover (check Conway's Game of Life project)
            square.addEventListener("click", place());
        }
    }
}

function place(){
    var clicked = this;
    document.getElementById(this.id).classList.add("ship");
    //TODO: add ship types and direction
    //TODO: check if a ship is already there or next to it (check minesweeper project)
    for(i=0;i<10;i++){

    }
    //TODO: then remove the outside ship
}

function join() {
    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "code";
    document.getElementById("form").appendChild(hidden);

    var code;
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById("s" + i * 10 + j);
            code = square.classList.contains("ship") ? 1 : 0;
            hidden.value += code;
        }
    }
    
    document.getElementById("form").submit();
}

document.addEventListener("DOMContentLoaded", ready);
document.getElementById("test").addEventListener("click", select);
document.getElementById("test2").addEventListener("click", select);
document.getElementById("join").addEventListener("click", join);