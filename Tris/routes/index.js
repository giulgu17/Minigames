var express = require('express');
var router = express.Router();

var WebSocket = require('ws');
const socketServer = new WebSocket.Server({ port: 8080 });

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const bodyParser = require('body-parser');
var parsebody = bodyParser.urlencoded({ extended: true });

connectedClients = 0;
queue = [];
socketServer.on("connection", ws => {
    connectedClients++;
    console.log("A client has connected");

    ws.on("message", data => {
        msg = JSON.parse(data);
        console.log(msg);
        switch (msg.type) {
            case "chat":
                socketServer.clients.forEach(function (client) {
                    client.send(JSON.stringify(msg));
                })
            case "join":
                var found = false;
                for (let i = 0; i < queue.length; i++) {
                    if (queue[i] == msg.nick) {
                        console.log(msg.nick + " is already in the queue")
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    ws.nick = msg.nick;
                    console.log(msg.nick + " has joined the queue");
                    queue.push(msg.nick);
                    console.log(queue);
                    matchmaking();
                }
                break;
        }
    });

    function matchmaking() {
        if (queue.length >= 2) {
            newGame = [queue[0], queue[1]];
            queue.splice(0, 2);

            socketServer.clients.forEach(function (client) {
                if (client.nick == newGame[0]) {
                    client.send(JSON.stringify({ type: "game", otherNick: newGame[1] }));
                } else if (client.nick == newGame[1]) {
                    client.send(JSON.stringify({ type: "game", otherNick: newGame[0] }));
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

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
    //TODO: Decidere se utilizzare più URL o uno unico
    //Se fare uno unico: forse utilizzare i messaggi con i websocket per fare i redirect?
});

router.get('/game', function (req, res, next) {
    res.render('game', { title: 'Game'});
});

module.exports = router;
