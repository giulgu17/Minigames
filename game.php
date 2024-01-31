<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css"/>
    <title>Tris</title>
</head>
<body>
    <section id="game">
        <div id="tris">
            <div id="1" class="box"></div>
            <div id="2" class="box"></div>
            <div id="3" class="box"></div>
            <div id="4" class="box"></div>
            <div id="5" class="box"></div>
            <div id="6" class="box"></div>
            <div id="7" class="box"></div>
            <div id="8" class="box"></div>
            <div id="9" class="box"></div>
        </div>
    </section>
    <?php       
        $connessione = new mysqli("localhost", "root", "", "tris");
        if ($connessione->connect_error) {
            die("Connessione fallita: " . $connessione->connect_error);
        }
        //TODO: controllo se è in corso una partita o se crearne una nuova
        //Nuova partita: giocatore1 non esistente, quindi creo una nuova partita e inserisco giocatore1

        $query = "SELECT * FROM partite WHERE giocatore1 = '".$_POST["nickname"]."'";
        $stmt = $connessione->prepare($query);
        $stmt->execute();
        $stmt->bind_result($idclasse);
        $stmt->fetch();
        if(){
            $query = "UPDATE partite SET giocatore2 = '".$_POST["nickname"]."'";
        } else {
            $query = "INSERT INTO partite (giocatore1) VALUES ('".$_POST["nickname"]."')";
        }
        $stmt = $connessione->prepare($query);
        $stmt->execute();
        $stmt->close();
        

    ?>
</body>
</html>