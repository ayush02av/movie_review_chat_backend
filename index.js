const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.emit("chat message", `${socket.id} connected`)
    socket.emit("chat message", "This is a basic movie review classification model")
    socket.emit("chat message", "Try: `This was a good movie` or `Worst movie ever` ")

    socket.on('chat message', (msg) => {
        axios.get(`https://movie-review-classifier-api.onrender.com/predict/${msg}`)
            .then(function (response) {
                socket.emit('chat message', `Rating: ${response.data.prediction}`)
            })
            .catch(function (error) {
                socket.emit('chat message', '<error>')
            })
    }
    );
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = 80;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
