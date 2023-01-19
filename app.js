const express = require('express');
const http = require('http');
const path = require('path');

const adminRoutes = require('./routes/admin');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, 'views')));
app.use(adminRoutes);

let connectedPeers =[];

io.on('connection', (socket) =>{
    /*console.log("User connected to socket io server");
    console.log(socket.id);*/
    connectedPeers.push(socket.id);
    //console.log(connectedPeers);
    socket.on('disconnect', () =>{
        //console.log("User DC");
        const newConnectedPeers = connectedPeers.filter((peerSocketId) =>{
            peerSocketId !== socket.id;
        });
        connectedPeers = newConnectedPeers;
        //console.log(connectedPeers);
    })
});

server.listen(PORT, () =>{
    console.log('Listening on port', PORT);
});