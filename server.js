import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connectToDatabase } from './db.config.js';
import { ChatModel } from './chat.schema.js';

const app = express();
app.use(cors());
export const PORT = process.env.PORT || 5000;
// create server
const server = http.createServer(app);

// create socket server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Online users array list
let onlineUsers = [];

// create socket events
io.on("connection", (socket) => {
    console.log("Connection is established");

    // event: user joins
    socket.on("join", async(username) => {
        const oldMessages = await ChatModel.find();
        onlineUsers.push({ id: socket.id, username });
        // emitting
        io.emit("onlineUser", onlineUsers);

        ChatModel.find().sort({timestamp:1}).limit(50)
            .then(messages => {
                socket.emit('load-messages', messages);
            }).catch(err => {
                console.log(err);
            })
        socket.emit("joined", oldMessages);
    })

    // event: User sends a message
    socket.on("sendMessage", async(newMessage) => {
        if (!newMessage.username || !newMessage.message) {
            return;
        }
        const newUser = new ChatModel({
            name: newMessage.username,
            message: newMessage.message,
            timestamp: new Date()
        });
        await newUser.save();
        // emitting this message to client.
        io.emit("newMessage", newUser);
    })

    // User typing
    socket.on("typing", () => {
        io.emit('typing', socket.id);
    })


    socket.on("disconnect", () => {
        const indexToRemove = onlineUsers.findIndex(user => user.id == socket.id);
        onlineUsers.splice(indexToRemove, 1);
        io.emit('onlineUser', onlineUsers);
        console.log("Connection disconnected.");
    })
})

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "public")));

// sending response to client
// app.get('/', (req,res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// })

// listen to server
server.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`);
    connectToDatabase();
})