var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var shipSquares = [];

function ready() {
    grid = document.getElementById("homegrid");
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.style.cursor = "pointer";
            square.addEventListener("drop", drop);
            square.addEventListener("dragover", allowDrop);
            square.id = "s" + rows[i] + j;
            document.getElementById("homegrid").appendChild(square);
        }
    }


}


function drag(ev) {
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
    shipSquares.push(ev.target.id)
    //TODO: Add type of ship
}

function join() {
    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "code";

    var code;
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById("s" + rows[i] + j);
            code = square.classList.contains("ship") ? 1 : 0;
        }
    }
    document.getElementById("code").value = code;
    document.getElementById("form").submit();
}

document.addEventListener("DOMContentLoaded", ready);
document.getElementById("join").addEventListener("click", join);