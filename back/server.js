const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require("path");
require("dotenv").config({ path: ".env" });


const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    // path: `${process.env.BASE_URL_API}`,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
        credentials: true,
    },
    transports: ['websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'],
    allowEIO3: true,
    serveClient: true,
});

const corsOptions = {
    Origin: '*',
    origin: '*',
    credentials: true,
    allowedHeaders: ["*", "Content-type"],
    exposeHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



// Gérez les connexions et les déconnexions des clients
io.on('connection', (socket) => {
    console.log('Un client s\'est connecté');
    // Gérez les événements spécifiques, par exemple, lorsqu'un client envoie un message
    socket.on('chat-message-send', (message) => {
        console.log(`Message reçu : ${message}`);
        // Diffusez le message à tous les clients connectés
        io.emit('chat-message-resend', message);
    });

    // Gérez les déconnexions de clients
    socket.on('disconnect', () => {
        console.log('Un client s\'est déconnecté');
    });
});

// Démarrez le serveur
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});