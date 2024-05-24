const nrows = 10;
const ncols = 10;
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var selected;
var selectMode = false;
var placedShips = 0;
localStorage.clear();

function ready() {
    let username = getCookie("username");
    if(username != ""){
        document.getElementById("inputnick").value = username;
    } else {
        document.getElementById("inputnick").value = "";
    }
    let code = getCookie("code");
    if (code != "") {
        for (var i = 0; i < 10; i++) {
            for (var j = 1; j <= 10; j++) {
                var square = document.createElement("div");
                square.className = "box";
                square.classList.add("self");
                square.id = rows[i] + j;
                document.getElementById("placegrid").appendChild(square);
                if (code[i * 10 + j - 1] == 1) {
                    square.classList.add("ship");
                }
            }
        }
        placedShips = 8;
        var joinbtn = document.getElementById("join");
        joinbtn.cursor = "pointer";
        joinbtn.disabled = false;
        joinbtn.addEventListener("click", join);
    } else {
        grid = document.getElementById("placegrid");
        for (var i = 1; i <= 8; i++) {
            var unship = document.createElement("div");
            unship.classList.add("unShip");
            unship.classList.add("hor");
            if (i <= 3) {
                unship.id = "s2" + i;
                document.getElementById("carriers").appendChild(unship);
            } else if (3 < i && i < 7) {
                unship.id = "s3" + i;
                document.getElementById("battleships").appendChild(unship);
            } else if (i == 7) {
                unship.id = "s1" + i;
                document.getElementById("other").appendChild(unship);
            } else if (i == 8) {
                unship.id = "s4" + i;
                document.getElementById("other").appendChild(unship);
            }
        }

        for (var i = 0; i < 10; i++) {
            for (var j = 1; j <= 10; j++) {
                var square = document.createElement("div");
                square.className = "box";
                square.classList.add("self");
                square.style.cursor = "pointer";
                square.id = rows[i] + j;
                document.getElementById("placegrid").appendChild(square);
            }
        }

        var ships = document.getElementsByClassName("unShip");
        for (var i = 0; i < ships.length; i++) {
            ships[i].addEventListener("click", select);
        }
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

    selected.style.backgroundColor = "lime";
    for (var i = 0; i < nrows; i++) {
        for (var j = 1; j <= ncols; j++) {
            var square = document.getElementById(rows[i] + j);
            square.style.cursor = "pointer";
            square.addEventListener("click", place);
            square.addEventListener("mouseover", function (e) { preview(e.target) });
            square.addEventListener("mouseout", resetPreview);
        }
    }
}

document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case "r":
            selected.classList.toggle("ver");
            selected.classList.toggle("hor");
            if (selected.classList.contains("ver")) {
                selected.style.height = selected.id.substring(1, 2) * 30 + "px";
                selected.style.width = "30px";
            } else {
                selected.style.width = selected.id.substring(1, 2) * 30 + "px";
                selected.style.height = "30px";
            }
            var lastHovered = document.getElementsByClassName("hovered");
            localStorage.setItem("lastHovered", lastHovered[0].id);
            resetPreview();
            preview(document.getElementById(localStorage.getItem("lastHovered")));
            break;
        case "enter":
            join();
    }
});

function place() {
    var clicked = this;
    var clickedRow = clicked.id.substring(0, 1);
    var clickedColumn = parseInt(clicked.id.substring(1));
    var shipLength = parseInt(selected.id.substring(1, 2));
    var direction = selected.classList.contains("ver") ? "vertical" : "horizontal";

    function check() {
        if (selectMode) {
            try {
                for (var i = 0; i < shipLength; i++) {
                    if (direction == "vertical") {
                        var checkedSquare = document.getElementById(rows[clickedRow.charCodeAt() - 65 + i] + clickedColumn);
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
            } catch (e) {
                //console.log(e);
            }
        }
    }
    var confirm = check();

    if (confirm) {
        selectMode = false;
        if (direction == "vertical") {
            for (var i = 0; i < shipLength + 2; i++) {
                for (var j = clickedColumn - 1; j <= clickedColumn + 1; j++) {
                    try {
                        var checkedSquare = document.getElementById(rows[clickedRow.charCodeAt() - 66 + i] + j);
                        checkedSquare.classList.add("unavailable");
                        if (j == clickedColumn && i != 0 && i != shipLength + 1) {
                            checkedSquare.classList.add("ship");
                        }
                    } catch (e) {
                        //console.error(e);
                    }
                }
            }
        } else {
            for (var j = clickedRow.charCodeAt() - 66; j <= clickedRow.charCodeAt() - 64; j++) {
                for (var i = clickedColumn - 1; i <= clickedColumn + shipLength; i++) {
                    try {
                        var checkedSquare = document.getElementById(rows[j] + i);
                        checkedSquare.classList.add("unavailable");
                        if (j == clickedRow.charCodeAt() - 65 && i != clickedColumn - 1 && i != clickedColumn + shipLength) {
                            checkedSquare.classList.add("ship");
                        }
                    } catch (e) {
                        //console.error(e);
                    }
                }
            }
        }

        resetPreview();
        selected.remove();

        placedShips++;
        if (placedShips == 8) {
            var joinbtn = document.getElementById("join");
            joinbtn.cursor = "pointer";
            joinbtn.disabled = false;
            joinbtn.addEventListener("click", join);
        }
    }
}


function preview(hovered) {
    hovered.classList.add("hovered");
    var hoveredRow = hovered.id.substring(0, 1);
    var hoveredColumn = parseInt(hovered.id.substring(1));
    var shipLength = parseInt(selected.id.substring(1, 2));
    var direction = selected.classList.contains("ver") ? "vertical" : "horizontal";

    function view() {
        if (selectMode) {
            if (direction == "vertical") {
                for (var i = 0; i < shipLength; i++) {
                    try {
                        var checkHovSquare = document.getElementById(rows[hoveredRow.charCodeAt() - 65 + i] + (hoveredColumn));
                        if (hoveredRow.charCodeAt() - 65 <= ncols - shipLength) {
                            checkHovSquare.style.backgroundColor = checkHovSquare.classList.contains("unavailable") ? "#ff000085" : "#00ff0085";
                        } else {
                            checkHovSquare.style.backgroundColor = "#ff000085";
                        }
                    } catch (e) { }
                }
            } else {
                for (var i = 0; i < shipLength; i++) {
                    try {
                        var checkHovSquare = document.getElementById(rows[hoveredRow.charCodeAt() - 65] + (hoveredColumn + i));
                        if (hoveredColumn <= ncols - shipLength + 1) {
                            checkHovSquare.style.backgroundColor = checkHovSquare.classList.contains("unavailable") ? "#ff000085" : "#00ff0085";
                        } else {
                            checkHovSquare.style.backgroundColor = "#ff000085";
                        }
                    } catch (e) { }
                }
            }
        }
    }
    view();
}

function resetPreview() {
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById(rows[i] + j);
            if (square.classList.contains("ship")) {
                square.style.backgroundColor = "blue";
            } else {
                square.style.backgroundColor = square.classList.contains("unavailable") ? "#b8b8b8" : "white";
            }
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById(rows[i] + j);
            if (square.classList.contains("hovered")) {
                square.classList.remove("hovered");
            }
        }
    }
}

function clear() {
    /*for (var i = 0; i < 10; i++) {
        for (var j = 1; j <= 10; j++) {
            var square = document.getElementById(rows[i] + j);
            square.classList.remove("unavailable");
            square.classList.remove("ship");
            square.style.backgroundColor = "white";
        }
    }
    var ships = document.getElementsByClassName("ship");
    for (var i = 0; i < ships.length; i++) {
        ships[i].classList.remove("ship");
    }
    var unShips = document.getElementsByClassName("unShip");
    for (var i = 0; i < unShips.length; i++) {
        unShips[i].classList.remove("selected");
        unShips[i].style.backgroundColor = "yellow";
    }
    localStorage.clear();*/
    document.cookie = "code=;"
    window.location.reload();
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function join() {
    document.getElementById("inputnick").value = document.getElementById("inputnick").value.trim()
    document.getElementById("inputnick").value = document.getElementById("inputnick").value.replace(/\s/g, '');
    if(document.getElementById("inputnick").value != ""){
        var hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "code";
        document.getElementById("form").appendChild(hidden);

        var code = getCookie("code");
        if(code != "") {
            document.cookie = 'username=; code=; Max-Age=0; path=/; domain=' + location.hostname;
        }
        for (var i = 0; i < 10; i++) {
            for (var j = 1; j <= 10; j++) {
                var square = document.getElementById(rows[i] + j);
                code = square.classList.contains("ship") ? 1 : 0;
                hidden.value += code;
            }
        }
        document.cookie = "username=" + document.getElementById("inputnick").value;
        document.cookie = "code=" + hidden.value;

        document.getElementById("form").submit();
    }
}

document.addEventListener("DOMContentLoaded", ready);
document.getElementById("clear").addEventListener("click", clear);