// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174", // React dev server
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat
    socket.on("join_chat", ({ username, room }) => {
        socket.username = username;
        socket.room = room || "global";
        socket.join(socket.room);

        console.log(`${username} joined room ${socket.room}`);

        // Optional: notify others
        socket.to(socket.room).emit("receive_message", {
            user: "system",
            text: `${username} joined the chat`,
        });
    });

    // Send message
    socket.on("send_message", (data) => {
        const messageData = {
            user: socket.username,
            text: data.text,
        };

        // Emit to everyone including sender
        io.in(socket.room).emit("receive_message", messageData);
    });

    socket.on("disconnect", () => {
        if (socket.username && socket.room) {
            socket.to(socket.room).emit("receive_message", {
                user: "system",
                text: `${socket.username} left the chat`,
            });
        }
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});