require("./database.js");
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
const messageRoute = require("./controllers/message.controller.js");
const userRoute = require("./controllers/user.controller.js");

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


io.on('connection', (socket) => {
    console.log('Un client s\'est connecté');
    
    
    socket.on('chat-message-send', async (data, callback) => {
        messageRoute.registerMessage(data, (res) => {
            if (res.success) {
                console.log(`Message reçu : ${data.text} de ${data.pseudo}`);
                io.emit('chat-message-resend', data); // Vous devrez peut-être corriger ici
            } else {
                io.emit('chat-message-resend', res);
            }
        });
    });

    socket.on('register-user', async (data, callback) => {
        userRoute.registerUser(data, (res) => {
            console.log(res);
            if (res.success === true) {
                console.log(`enregistrement de ${data.pseudo}`);
                const dataUser = {
                    pseudo: data.pseudo,
                    email: data.email,
                }
                io.emit('registration-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('registration-response', res);
            }
        });
    });


    socket.on('login-user', async (data, callback) => {
        userRoute.loginUser(data, (res) => {
            if (res.success === true) {
                console.log(`login de ${data.pseudo}`);
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                    email: data.email,
                }
                io.emit('login-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('login-response', res);
            }
        });
    })
    socket.on('disconnect', () => {
        console.log('Un client s\'est déconnecté');
    });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});