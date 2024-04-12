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
queueTicTacToe = [];
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
            case "joinTicTacToe":
                var found = false;
                for (let i = 0; i < queueTicTacToe.length; i++) {
                    if (queueTicTacToe[i] == msg.nick) {
                        console.log(msg.nick + " is already in the network");
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    ws.nick = msg.nick;
                    console.log(msg.nick + " has joined the queue for TicTacToe");
                    queueTicTacToe.push(msg.nick);
                    console.log(queueTicTacToe);
                    matchmaking();
                }
                break;
        }
    });

    async function matchmaking() {
        if (queueTicTacToe.length >= 2) {
            newGame = [queueTicTacToe[0], queueTicTacToe[1]];
            queueTicTacToe.splice(0, 2);

            var turn = Math.floor(Math.random());
            
            if(turn == 0){
                var turn0 = true;
                var turn1 = false;
            } else {
                var turn0 = false;
                var turn1 = true;
            }

            var gameId;
            await client.connect()
            console.log("Connected to the MongoDB server")
            const database = client.db("tris");
            const collection = database.collection("games");
            await collection.countDocuments();

            let n_games = await collection.countDocuments();
            n_games++;
            gameId = n_games;
            console.log("Created game n: " + (gameId));
            const document = { gameId: gameId, player1: newGame[0], player2: newGame[1], state: null, board: [0, 0, 0, 0, 0, 0, 0, 0, 0] }
            collection.insertOne(document);

            console.log(gameId)

            socketServer.clients.forEach(function (client) {
                if (client.nick == newGame[0]) {
                    client.send(JSON.stringify({ type: "game", gameId: gameId, opponent: newGame[1], turn: turn0 }));
                } else if (client.nick == newGame[1]) {
                    client.send(JSON.stringify({ type: "game", gameId: gameId, opponent: newGame[0], turn: turn1 }));
                }
            });

            
        }
    }

    ws.on("close", () => {
        console.log(ws.nick + " has disconnected");
        connectedClients--;
        if(queueTicTacToe.includes(ws.nick)){
            queueTicTacToe.splice(queueTicTacToe.indexOf(ws.nick), 1);
        }
    });
    ws.onerror = function () {
        console.error("Some weird ass error occurred");
    }
});

router.get('/', function (req, res, next) {
    //TODO: if login = true -> redirect to homepage
    res.render('index', { title: 'Home' });
});
router.post('/login2', function (req, res, next) {
    const username = req.body.username;
    req.session.login = "true";
    req.session.username = username;
    console.log(req.session)

    //TODO: Login?
    /*client.connect()
        .then(() => {
            const database = client.db("minigames");
            const collection = database.collection("users");
            collection.countDocuments()
                .then(users => {
                    const document = { id: users, username: username }
                    collection.insertOne(document);
                })
        })
        .catch(error => {
            console.error("Errore durante l'inserimento del documento:", error);
        });*/
    res.redirect("/tris")
});

router.get('/tris', function (req, res, next) {
    res.render('tris', { title: 'Tris', login: req.session.login, username: req.session.username });
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


module.exports = router;
