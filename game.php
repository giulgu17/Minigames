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
        <div id="1" class="box" onClick="place()"></div>
        <div id="2" class="box" onClick="place()"></div>
        <div id="3" class="box" onClick="place()"></div>
        <div id="4" class="box" onClick="place()"></div>
        <div id="5" class="box" onClick="place()"></div>
        <div id="6" class="box" onClick="place()"></div>
        <div id="7" class="box" onClick="place()"></div>
        <div id="8" class="box" onClick="place()"></div>
        <div id="9" class="box" onClick="place()"></div>
    </div>

    <?php       
        $connessione = new mysqli("localhost", "root", "", "tris");
        if ($connessione->connect_error) {
            die("Connessione fallita: " . $connessione->connect_error);
        }

        //Se $_POST["gameId"] non è settato, allora vuol dire che la partita non è cominciata
        if(!isset($_POST["gameId"])) {
            //Tento di trovare l'id della partita 
            $query = "SELECT id FROM partite WHERE stato = 'in attesa'";
            $stmt = $connessione->prepare($query);
            $stmt->execute();
            $stmt->bind_result($gameId);
            $stmt->fetch();
            $stmt->close();

            //Controllo se esiste la partita
            if($gameId == null) {   //Giocatore 1
                $query = "INSERT INTO partite (id, p1, p2, stato, vincitore, cas1, cas2, cas3, cas4, cas5, cas6, cas7, cas8, cas9)
                VALUES (NULL, '".$_POST["nickname"]."', NULL, 'in attesa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
                $stmt = $connessione->prepare($query);
                $stmt->execute();
                $stmt->close();
            } else {                //Giocatore 2
                $query = "UPDATE partite SET p2 = '".$_POST["nickname"]."' WHERE id = ".$gameId;
                $stmt = $connessione->prepare($query);
                $stmt->execute();
                $stmt->close();


                //Inizio partita
                $query = "SELECT p1 FROM partite WHERE id = ".$gameId;
                $stmt = $connessione->prepare($query);
                $stmt->execute();
                $stmt->bind_result($giocatore1);
                $stmt->fetch();
                $stmt->close();
                $query = "SELECT p2 FROM partite WHERE id = ".$gameId;
                $stmt = $connessione->prepare($query);
                $stmt->execute();
                $stmt->bind_result($giocatore2);
                $stmt->fetch();
                $stmt->close();

                //Creo il form iniziale per passare i dati
                echo("<form action='game.php' method='post' id='start'>
                    <input type='hidden' name='gameId' value='".$gameId."'>
                    <input type='hidden' name='giocatore1' value'".$giocatore1."'>
                    <input type='hidden' name='giocatore2' value'".$giocatore2."'>
                    <input type='hidden' name='giocatoreClient' value='".$_POST['nickname']."'>
                    <input type='hidden' name='stato' value='turno_p1'>
                </form>
                <script>
                    document.addEventListener('DOMContentLoaded', function(){
                        document.getElementById('start').submit();
                    });
                </script>
                ");
            }
        } else {
            //Partita in corso
            echo("<script src='game.js'></script>");
            $gameId = $_POST["gameId"];
            $giocatore1 = $_POST["giocatore1"];
            $giocatore2 = $_POST["giocatore2"];
            $stato = $_POST["stato"];

            $query = "UPDATE partite SET stato = ". $stato ."WHERE id = ".$gameId;
            $stmt = $connessione->prepare($query);
            $stmt->execute();
            $stmt->close();

            //Controllo del turno
            //TODO:
            if($stato == "turno_p1") {
                $stato = "turno_p2";
            } else {
                $stato = "turno_p1";
            }
        }
    ?>
</body>
</html>