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
const upload = require('./multer.js');
const UserModel = require('./models/user.model.js');
const MessageModel = require('./models/message.model.js');

// require("dotenv").config({ path: ".envDev" });
require("dotenv").config({ path: ".env" });
const messageRoute = require("./controllers/message.controller.js");
const userRoute = require("./controllers/user.controller.js");

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    path: `${process.env.BASE_URL}`,
    cors: {
        origin: '*',
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
app.use(express.static(path.join(__dirname, 'pictures')));

app.post(`${process.env.BASE_URL}/upload`, upload.single('file'), async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.body.userId;

        const user = await UserModel.findByIdAndUpdate(userId, {
            pictureUser: req.file != null
                ? `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE}/${req.file.filename}`
                : `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE}/default/default-user.jpg`,
        });
        await MessageModel.updateMany({ userId }, {
            pictureUser: req.file != null ? `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE}/${req.file.filename}`
                : `${req.protocol}://${req.get("host")}/${process.env.BASE_IMAGE}/default/default-user.jpg`,
        }
        )
            res.status(200).json(user);


    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
        res.status(500).send('Erreur lors du téléchargement du fichier');
    }
});

io.on('connection', (socket) => {

    const userId = socket.id; // Vous pouvez utiliser l'ID de socket comme identifiant d'utilisateur
    socket.broadcast.emit('user-online', { userId });





    socket.on('chat-message-send', async (data, callback) => {
        messageRoute.registerMessage(data, (res) => {
            if (res.success) {
                // console.log(`Message reçu : ${data.text} de ${data.pseudo}`);        
                io.emit('chat-message-resend', data);
            } else {
                io.emit('chat-message-resend', res);
            }
        });
    });

    socket.on('get-all-messages', async (data, callback) => {
        messageRoute.getAllMessages(data, (res) => {
            if (res.success) {
                io.emit('chat-message-resend-all', res);
            }
        });
    });

    socket.on('get-all-user', async (data, callback) => {
        userRoute.getAllUser(data, (res) => {
            if (res.success) {
                console.log(res)
                io.emit('All-user', res);
            }
        })
    });
    
    
    socket.on('get-user', async (data, callback) => {
        userRoute.getUser(data, (res) => {
            if (res.success) {

                console.log(res)
                io.emit('user', res);
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

    socket.on('logout-user', async (data, callback) => {
        console.log(data);
        userRoute.logoutUser(data, (res) => {
            if (res.success === true) {
                console.log(`login de ${data.pseudo}`);
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                }
                io.emit('logout-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('logout-response', res);
            }
        });
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-offline', { userId });
    });


});

;

server.listen(() => {
    const address = server.address();
    const host = address.address;
    const port = address.port;
    console.log(`Serveur en cours d'écoute sur http://${host}:${port}`);

});
// server.listen(`${process.env.PORT}`, () => {
//     console.log(`connected ${process.env.PORT}`);
// });