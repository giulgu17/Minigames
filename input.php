<?php
if(isset($_POST)){
    $data = file_get_contents("php://input");
    $data2 = json_decode($data, true);
    echo($data2["gameId"]);
}



/*$gameId = $_POST["gameId"];
$box = $_POST["box"];
$giocatore = $_POST["giocatore"];
if($giocatore == 1) {
    $tessera = "X";
} else {
    $tessera = "O";
}

$connessione = new mysqli("localhost", "root", "", "tris");
if ($connessione->connect_error) {
    die("Connessione fallita: " . $connessione->connect_error);
}

query = "UPDATE partite SET box".$box." = '".$tessera."' WHERE id = ".$gameId;
$stmt = $connessione->prepare($query);
$stmt->execute();
$stmt->close();
