const nrows = 10;
const ncols = 10;
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var selected;
var selectMode = false;

function ready() {
    grid = document.getElementById("homegrid");
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.createElement("div");
            square.className = "box";
            square.classList.add("self");
            square.style.cursor = "pointer";
            square.id = rows[i] + j;
            document.getElementById("homegrid").appendChild(square);
        }
    }

    var ships = document.getElementsByClassName("unShip");
    for (var i = 0; i < ships.length; i++) {
        ships[i].addEventListener("click", select);
    }
}



function select() {
    unShips = document.getElementsByClassName("unShip");
    for (var i = 0; i < unShips.length; i++) {
        unShips[i].classList.remove("selected");
        unShips[i].style.backgroundColor = "yellow";
    }

    selected = this;
    selectMode = true;
    selected.classList.toggle("selected");
    var shipLength = parseInt(selected.id.substring(1, 2));
    var direction = selected.classList.contains("ver") ? "vertical" : "horizontal";
    console.log("Selected ship length: " + shipLength + " Direction: " + direction)

    selected.style.backgroundColor = "lime";
    for (var i = 0; i < nrows; i++) {
        for (var j = 1; j <= ncols; j++) {
            var square = document.getElementById(rows[i] + j);
            square.style.cursor = "pointer";
            //TODO: show preview onHover
            square.addEventListener("click", place);
            square.addEventListener("mouseover", preview);
            square.addEventListener("mouseout", resetPreview);
        }
    }
}

function place() {
    var clicked = this;
    var clickedRow = clicked.id.substring(0, 1);
    var clickedColumn = parseInt(clicked.id.substring(1));
    var shipLength = parseInt(selected.id.substring(1, 2));
    var direction = selected.classList.contains("ver") ? "vertical" : "horizontal";

    function check() {
        if (selectMode) {
            try{
                //TODO: exclude corners?
                for (var i = 0; i < shipLength; i++) {
                    if (direction == "vertical") {
                        var checkedSquare = document.getElementById(rows[clickedRow.charCodeAt() - 65 + i] + clickedColumn);
                        console.log(checkedSquare.id)
                        if (checkedSquare.classList.contains("unavailable")) {
                            return false;
                        }
                    } else {
                        var checkedSquare = document.getElementById(rows[clickedRow.charCodeAt() - 65] + (clickedColumn + i));
                        if (checkedSquare.classList.contains("unavailable")) {
                            return false;
                        }
                    }
                }
                return true;
            } catch(e){
                //console.log(e);
            }
        }
    }
    var confirm = check();
    console.log(confirm)

    if (confirm) {
        if (direction == "vertical") {
                for (var i = 0; i < shipLength + 2; i++) {
                    for (var j = clickedColumn - 1; j <= clickedColumn + 1; j++) {
                        try{
                            var checkedSquare = document.getElementById(rows[clickedRow.charCodeAt() - 66 + i] + j);
                            checkedSquare.classList.add("unavailable");
                            if (j == clickedColumn && i != 0 && i != shipLength + 1) {
                                checkedSquare.classList.add("ship");
                            }
                        } catch(e){
                            //console.error(e);
                        }
                    }
                }
        } else {
                for (var j = clickedRow.charCodeAt() - 66; j <= clickedRow.charCodeAt() - 64; j++) {
                    for (var i = clickedColumn - 1; i <= clickedColumn + shipLength; i++) {
                        try{
                            var checkedSquare = document.getElementById(rows[j] + i);
                            checkedSquare.classList.add("unavailable");
                            if (j == clickedRow.charCodeAt() - 65 && i != clickedColumn - 1 && i != clickedColumn + shipLength) {
                                checkedSquare.classList.add("ship");
                            }
                        } catch(e){
                            //console.error(e);
                        }
                    }
                }
        }

        selected.remove();
    }
}


//TODO: do this thing
function preview() {
    var hovered = this;
    var hoveredRow = hovered.id.substring(0, 1);
    var hoveredColumn = parseInt(hovered.id.substring(1));
    var shipLength = parseInt(selected.id.substring(1, 2));
    var direction = selected.classList.contains("ver") ? "vertical" : "horizontal";

    function view(){
        if (selectMode) {
            if(direction == "vertical"){
                for (var i = 0; i < shipLength; i++) {
                    if (direction == "vertical") {
                        var hoveredSquare = document.getElementById(rows[hoveredRow.charCodeAt() - 65 + i] + hoveredColumn);
                        hoveredSquare.classList.add("preview");
                    } else {
                        var hoveredSquare = document.getElementById(rows[hoveredRow.charCodeAt() - 65] + (hoveredColumn + i));
                        hoveredSquare.classList.add("preview");
                    }
                }
            }
        }
    }
    
}

function resetPreview(){
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById(rows[i] + j);
            square.classList.remove("preview");
        }
    }
}





function join() {
    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "code";
    document.getElementById("form").appendChild(hidden);

    var code;
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById(rows[i] + j);
            code = square.classList.contains("ship") ? 1 : 0;
            hidden.value += code;
        }
    }

    document.getElementById("form").submit();
}

document.addEventListener("DOMContentLoaded", ready);
document.getElementById("join").addEventListener("click", join);