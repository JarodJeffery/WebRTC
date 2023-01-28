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

    socket.on("pre-offer", (data) =>{
        console.log('Pre offer came');
        console.log(data);

        const {callType, calleePersonalCode} = data;

        const connectedPeer = connectedPeers.find((peerSocketId) =>
            peerSocketId === calleePersonalCode
        );
        
        if(connectedPeer){
            const data={
                callerSocketId: socket.id,
                callType,
            };

            io.to(calleePersonalCode).emit('pre-offer', data);
        } else {
            const data ={
                preOfferAnswer: 'CALLEE_NOT_FOUND'
            };
            io.to(socket.id).emit('pre-offer-answer', data);
        }
    });

    socket.on('pre-offer-answer', (data) =>{
        console.log('pre-offer-answer-came');
        console.log(data);

        const connectedPeer = connectedPeers.find((peerSocketId) =>
            peerSocketId === data.callerSocketId
        );

        if(connectedPeer){
            io.to(data.callerSocketId).emit('pre-offer-answer', data);
        }
    });

    socket.on('webRTC-signaling', (data) =>{
        const { connectedUserSocketId } = data;
        const connectedPeer = connectedPeers.find((peerSocketId) =>
            peerSocketId === connectedUserSocketId
        );

        if(connectedPeer){
            io.to(connectedUserSocketId).emit('webRTC-signaling', data);
        }
    });

    socket.on('user-hanged-up', (data) =>{
        const {connectedUserSocketId} = data;

        const connectedPeer = connectedPeers.find((peerSocketId) =>
            peerSocketId === connectedUserSocketId
        );

        if(connectedPeer){
            io.to(connectedUserSocketId).emit('user-hanged-up');
        }
    });

    socket.on('disconnect', () =>{
        
        const newConnectedPeers = connectedPeers.filter((peerSocketId) =>{
             return peerSocketId !== socket.id;
        });

        connectedPeers = newConnectedPeers;
    })
});

server.listen(PORT, () =>{
    console.log('Listening on port', PORT);
});