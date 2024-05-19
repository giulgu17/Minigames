var hostname = window.location.hostname;
function tp1(){
    window.location.href = "http://"+hostname+":3100";
}

function tp2(){
    window.location.href = "http://"+hostname+":3200";
}


function count(){
    fetch("http://"+hostname+":3100/plrcount")
        .then(response => response.json())
        .then(data => {
            document.getElementById("count1").innerHTML = data.count + " players connected";
        });

    fetch("http://"+hostname+":3200/plrcount")
        .then(response => response.json())
        .then(data => {
            document.getElementById("count2").innerHTML = data.count + " players connected";
        });
}


document.getElementById("image1").addEventListener("click", tp1);
document.getElementById("image2").addEventListener("click", tp2);
document.addEventListener("DOMContentLoaded", count);