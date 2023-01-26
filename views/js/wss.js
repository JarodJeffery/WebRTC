import * as store from './store.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents =(socket) => {
    socketIO = socket;
    socket.on('connect', () =>{
        console.log('sucessully connected to socket.io server');
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    });


    socket.on('pre-offer', (data) =>{
        console.log('pre offer came again')
        web.handlePreOffer(data);
    });

    socket.on('pre-offer-answer', (data) =>{
        web.handlePreOfferAnswer(data);
    })
};

export const sendPreOffer = (data) =>{
    console.log('emmiting to server preoffer event');
    socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer =(data) =>{
    socketIO.emit('pre-offer-answer', data);
}

