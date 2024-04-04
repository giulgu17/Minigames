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

// Configurazione del middleware di sessione
app.use(session({
    secret: 'rf[aly+54ert#812au765gfì@ò<ew',
    resave: false,
    saveUninitialized: true
}));

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

connectedClients = 0;
queue = [];
socketServer.on("connection", ws => {
    connectedClients++;
    console.log("A client has connected");

    ws.on("message", data => {
        msg = JSON.parse(data);
        console.log(msg);
        switch (msg.type) {
            //ON CHAT MESSAGE
            case "chat":
                socketServer.clients.forEach(function (client) {
                    client.send(JSON.stringify(msg));
                })
                break;
            //ON JOIN
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

            client.connect()
                .then(() => {
                    const database = client.db("tris");
                    const collection = database.collection("games");
                    collection.countDocuments()
                        .then(n_games => {
                            console.log("Number of games:" + n_games);
                            const document = { id: n_games, player1: newGame[0], player2: newGame[1], state: null, board: [0, 0, 0, 0, 0, 0, 0, 0, 0] }
                            collection.insertOne(document);
                        })
                })
                .catch(error => {
                    console.error("Error connecting to the MongoDB server:", error);
                });
        }
    }

    ws.on("close", () => {
        console.log(ws.nick + " has disconnected");
    });
    ws.onerror = function () {
        console.error("Some weird ass error occurred");
    }
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/login2', function (req, res, next) {
    let nickname = req.body.nickname;
    req.session.user = nickname;        //FIXME: not worky

    //TODO: Login?
    /*client.connect()
        .then(() => {
            const database = client.db("minigames");
            const collection = database.collection("users");
            collection.countDocuments()
                .then(users => {
                    const document = { id: users, username: nickname }
                    collection.insertOne(document);
                })
        })
        .catch(error => {
            console.error("Errore durante l'inserimento del documento:", error);
        });*/
});

router.get('/game', function (req, res, next) {
    res.render('game', { title: 'Game' });
});

module.exports = router;
