import * as store from './store.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';
import * as con from './constants.js';

let socketIO = null;

export const registerSocketEvents =(socket) => {
    socketIO = socket;
    socket.on('connect', () =>{
        console.log('sucessully connected to socket.io server');
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    });


    socket.on('pre-offer', (data) =>{
        web.handlePreOffer(data);
    });

    socket.on('pre-offer-answer', (data) =>{
        web.handlePreOfferAnswer(data);
    });

    socket.on('webRTC-signaling', (data)=>{
        console.log('recieved data');
        switch(data.type){
            case con.WebRTCSignaling.OFFER:
                web.handleWebRTCOffer(data);
                break;
            case con.WebRTCSignaling.ANSWER:
                web.handleWebRTCAnswer(data);
                defualt:
                    return ;
        }
    });
};

export const sendPreOffer = (data) =>{
    console.log('emmiting to server preoffer event');
    socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer =(data) =>{
    socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = (data) =>{
    socketIO.emit('webRTC-signaling', data);
}

