var express = require('express');
var router = express.Router();

var WebSocket = require('ws');
const socketServer = new WebSocket.Server({ port: 8080 });

connectedClients = 0;
queue = [];
socketServer.on("connection", ws => {
    connectedClients++;
    ws.id = connectedClients;
    console.log("A client has connected");
    socketServer.clients.forEach(function(client) {
        if(ws.id == client.id){
            client.send(JSON.stringify({ type: "idClient", id: ws.id }))
        }
    })

    ws.on("message", data => {
        msg = JSON.parse(data);
        console.log(msg);
        switch (msg.type){
            case "chat":
                socketServer.clients.forEach(function (client) {
                    client.send(JSON.stringify(msg));
                })
            case "join":
                console.log(msg.nick + " (" + msg.id + ") has joined the queue");
                queue.push(msg.id);
                console.log(queue);
                matchmaking();
                break;
        }
    });

    function matchmaking(){
        if(queue.length >= 2){
            newGame = [queue[0], queue[1]];
            queue.splice(0, 2);

            //TODO: passare anche il nickname dell'avversario
            socketServer.clients.forEach(function(client) {
                if(client.id == newGame[0]){
                    client.send(JSON.stringify({tipo: "game", otherId: newGame[1]}));
                } else if (client.id == newGame[1]){
                    client.send(JSON.stringify({tipo: "game", otherId: newGame[0]}));
                }
            });
        }
    }

    ws.on("close", () => {
        console.log("A client has disconnected");
    });
    ws.onerror = function () {
        console.error("Some weird ass error occurred");
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
    //TODO: Decidere se utilizzare più URL o uno unico
    //Se fare uno unico: forse utilizzare i messaggi con i websocket per fare i redirect?
});

module.exports = router;
