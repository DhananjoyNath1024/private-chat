const express = require('express');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Broadcast received message to all clients
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    // Notify on disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});






