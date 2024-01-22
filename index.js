const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

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

        http.get(`https://movie-review-classifier-api.onrender.com/predict/${msg}`, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                data = JSON.parse(data)
                console.log('API Response:', data);
                socket.emit('chat message', `Rating: ${data['prediction']}`)
            });
        }).on('error', (error) => {
            socket.emit('chat message', '<error>')
            console.error('Error making API request:', error.message);
        });
    }
    );
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = 3030;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});