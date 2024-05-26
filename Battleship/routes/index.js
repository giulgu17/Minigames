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

const session = require('express-session');
const app = express();

app.use(session({
    secret: 'rf[aly+54ert#812au765gfì@ò<ew',
    resave: false,
    saveUninitialized: true
}));

router.use(session({
    secret: 'rf[aly+54ert#812au765gfì@ò<ew',
    resave: false,
    saveUninitialized: true
}));

connectedClients = 0;
queue = [];
const database = client.db("minigames");
const collection = database.collection("battleship");
socketServer.on("connection", ws => {
    connectedClients++;
    console.log("A client has connected");

    ws.on("message", data => {
        msg = JSON.parse(data);
        /*console.log("Message: ")
        console.log(msg);*/
        switch (msg.type) {
            //ON CHAT MESSAGE
            case "chat":
                socketServer.clients.forEach(function (client) {
                    client.send(JSON.stringify(msg));
                })
                break;
            //ON JOIN
            case "join":
                var valid = true;
                if (msg.nick == "" || msg.nick == null) {
                    console.log("Invalid username");
                    valid = false;
                    break;
                }
                for (let i = 0; i < queue.length; i++) {
                    if (queue[i] == msg.nick) {
                        console.log(msg.nick + " is already connected");
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    ws.username = msg.nick;
                    console.log(msg.nick + " has joined the queue for Battleship");
                    queue.push(msg.nick);
                    console.log(queue)
                    matchmaking();
                }
                break;
            //ON MOVE
            case "move":
                socketServer.clients.forEach(function (client) {
                    if (client.username == msg.user || client.username == msg.target) {
                        client.send(JSON.stringify(msg));
                    }
                })
                break;
            case "end":
                socketServer.clients.forEach(function (client) {
                    if (client.username == msg.user || client.username == msg.target) {
                        client.send(JSON.stringify(msg));
                    }
                })
                break;
        }
    });

    function matchmaking() {
        if (queue.length >= 2) {
            newGame = [queue[0], queue[1]];
            queue.splice(0, 2);

            var turn = Math.floor(Math.random() * 2);

            if (turn == 0) {
                var turn0 = true;
                var turn1 = false;
            } else {
                var turn0 = false;
                var turn1 = true;
            }

            socketServer.clients.forEach(function (client) {
                if (client.username == newGame[0]) {
                    client.send(JSON.stringify({ type: "game", opponent: newGame[1], turn: turn0 }));
                    ws.opponent = newGame[1];
                } else if (client.username == newGame[1]) {
                    client.send(JSON.stringify({ type: "game", opponent: newGame[0], turn: turn1 }));
                    ws.opponent = newGame[0];
                }
            });
        }
    }

    ws.on("close", () => {
        console.log(ws.username + " has disconnected");
        connectedClients--;
        if (queue.includes(ws.username)) {
            queue.splice(queue.indexOf(ws.username), 1);
        }
        socketServer.clients.forEach(function (client) {
            if (client.username == ws.opponent) {
                client.send(JSON.stringify({ type: "disconnect" }));
            }
        });
    });
    ws.onerror = function () {
        console.error("Some weird error occurred");
    }
});

router.get('/', function (req, res, next) {
    //TODO: if login = true -> redirect to homepage
    res.render('index', { title: 'Home' });
});
router.post('/login2', function (req, res, next) {
    req.session.username = req.body.username;
    req.session.code = req.body.code;
    req.session.login = "true";

    res.redirect("/battleship")
});

router.get('/battleship', function (req, res, next) {
    res.render('battleship', { title: 'Battleship', login: req.session.login, username: req.session.username, code: req.session.code });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/plrcount', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", " GET, POST, PUT, PATCH, POST, DELETE, OPTIONS");
    res.json({ count: connectedClients });
});
module.exports = router;
