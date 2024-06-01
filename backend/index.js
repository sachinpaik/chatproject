// Importing required modules
import express from "express";
import dotenv from "dotenv";
import {Server} from "socket.io";
import http from "http";
import receiverSocket from "nodemon";
import connectToMongoDB from "./db/connectToMongoDB.js";
import {addMsgToConversation} from "./controllers/msgs.controller.js";
import msgRouter from "./routes/msgs.route.js";
import cors from "cors";
import {publish, subscribe} from "./redis/connectToRedis.js";

// Creating an instance of Express

dotenv.config();
const PORT = process.env.PORT || 3001; // Use the provided port or default to 3000
const app = express();
app.use(cors({
        credentials: true,
        origin: ["http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:3000","http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:3001"]
    }
));
app.use('/msgs', msgRouter);
const server = http.createServer(app);
const io = new Server(server, {
        cors: {
            allowedHeaders: ["*"],
            origin: "*"
        }
    }
);

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('Client Connected');
    const username = socket.handshake.query.username;
    userSocketMap[username] = socket;
    const channelName = `chat_${username}`
    subscribe(channelName, (msg) => {
        console.log(msg);
        socket.emit("chat msg", JSON.parse(msg));
    });
    socket.on('chat msg', (msg) => {
        const receiverSocket = userSocketMap[msg.receiver];
        if (receiverSocket) {
            receiverSocket.emit('chat msg', msg);
        }
        else{
            const channelName = `chat_${msg.receiver}`;
            publish(channelName, JSON.stringify(msg));
        }
        addMsgToConversation([msg.sender,msg.receiver],{
                text: msg.text,
                sender:msg.sender,
                receiver:msg.receiver
            }
        )
        // socket.broadcast.emit('chat msg', msg.textMsg);
    })
})


// Define a route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


app.get('/health', (req, res) => {
    const userId = req.params.id;
    res.status(201).send(`ok`);
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});

