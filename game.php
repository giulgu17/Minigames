<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style2.css">
    <title>Tris</title>
</head>
<body>
    <div id="info">
        <div id="giocatore1">Giocatore1: </div>
        <div id="giocatore2">Giocatore2: </div><br>
        <div id="stato"></div>
    </div>
    <section id="tris">
        <div id="1" class="box" onClick="piazza()"></div>
        <div id="2" class="box" onClick="piazza()"></div>
        <div id="3" class="box" onClick="piazza()"></div>
        <div id="4" class="box" onClick="piazza()"></div>
        <div id="5" class="box" onClick="piazza()"></div>
        <div id="6" class="box" onClick="piazza()"></div>
        <div id="7" class="box" onClick="piazza()"></div>
        <div id="8" class="box" onClick="piazza()"></div>
        <div id="9" class="box" onClick="piazza()"></div>
    </div>

    <?php       
        $connessione = new mysqli("localhost", "root", "", "tris");
        if ($connessione->connect_error) {
            die("Connessione fallita: " . $connessione->connect_error);
        }

        $query = "SELECT id FROM partite WHERE stato = 'in attesa'";
        $stmt = $connessione->prepare($query);
        $stmt->execute();
        $stmt->bind_result($gameId);
        $stmt->fetch();
        $stmt->close();

        //Controllo c'è una persona in attesa
        if($gameId != null) {
            $query = "UPDATE partite SET p2 = '".$_POST["nickname"]."' WHERE id = ".$gameId;
            $stmt = $connessione->prepare($query);
            $stmt->execute();
            $stmt->close();

            $query = "UPDATE partite SET stato = 'in corso'";
        } else {
            $query = "INSERT INTO partite (id, p1, p2, stato, vincitore, cas1, cas2, cas3, cas4, cas5, cas6, cas7, cas8, cas9)
            VALUES (NULL, '".$_POST["nickname"]."', NULL, 'in attesa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
        }
        $stmt = $connessione->prepare($query);
        $stmt->execute();
        $stmt->close();
    ?>

    <script>
        function info(){
            //TODO: Fetch informazioni dal database
            var giocatore1 = "<?php echo $_POST["nickname"]; ?>";
            var giocatore2 = "";
        }

        function piazza(){
            //TODO: Se giocatore1 ha cliccato = "X". Se giocatore 2 = "O".
            //TODO: invia dati al database in un qualche modo
        }
    </script>
</body>
</html>