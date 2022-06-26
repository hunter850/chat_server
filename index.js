const express = require('express')
const app = express()

const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    }
});

io.on("connection", socket => {
    const id = socket.handshake.query.id;
    socket.join(id)

    socket.on("send-message", ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient);
            newRecipients.push(id);
            socket.broadcast.to(recipient).emit("receive-message", {
                recipients: newRecipients, sender: id, text
            })
        })
    })
})

server.listen(4000, function () {
    console.log('listening on port 4000');
});