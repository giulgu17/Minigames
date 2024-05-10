var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

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
    selected.classList.toggle("selected");
    selected.style.backgroundColor = selected.classList.contains("selected") ? "lime" : "yellow";
    console.log(selected.style.backgroundColor);
}
/*function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log("Target: " + ev.target.id + " Data: " + data) //Data = Element being dragged

    document.getElementById(ev.target.id).classList.add("ship")
    var ship = document.createElement("div");
    ship.className = "ship";
    
    //TODO: Add type of ship
    //Horrizontal ships have .hor class, vertical have .ver
}*/

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