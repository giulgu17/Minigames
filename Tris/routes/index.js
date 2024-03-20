var express = require('express');
var router = express.Router();

var WebSocket = require('ws');
const socketServer = new WebSocket.Server({ port: 8080 });

connectedClients = 0;
socketServer.on("connection", ws => {
    connectedClients++;
    ws.id = connectedClients;


    ws.on("message", data => {
        dato = JSON.parse(data);
        socketServer.clients.forEach(function (client) {
            if (client.id != dato.id) {
                client.send(JSON.stringify(dato));
            }
        })
    });
    ws.on("close", () => {
        console.log("A client has disconnected");
    });
    ws.onerror = function () {
        console.error("Some weird ass error occurred")
    }
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
