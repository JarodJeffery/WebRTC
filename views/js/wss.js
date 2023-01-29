import * as store from './store.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';
import * as con from './constants.js';
import * as stranger from './strangerUtils.js';

let socketIO = null;

export const registerSocketEvents =(socket) => {
    socketIO = socket;
    socket.on('connect', () =>{
        //console.log('sucessully connected to socket.io server');
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    });


    socket.on('pre-offer', (data) =>{
        web.handlePreOffer(data);
    });

    socket.on('pre-offer-answer', (data) =>{
        web.handlePreOfferAnswer(data);
    });

    socket.on('user-hanged-up', () =>{
        web.handleConnectedUserHangedUp();

    });

    socket.on('webRTC-signaling', (data)=>{
        //console.log('recieved data');
        switch(data.type){
            case con.WebRTCSignaling.OFFER:
                web.handleWebRTCOffer(data);
                break;
            case con.WebRTCSignaling.ANSWER:
                web.handleWebRTCAnswer(data);
                break;
            case con.WebRTCSignaling.ICE_CANDIDATE:
                web.handleWebRTCCandidate(data);
                break;
            defualt:
                return;                
        }
    });

    socket.on('stranger-socket-id' , (data) =>{
        stranger.connectWithStranger(data);
    });
};

export const sendPreOffer = (data) =>{
    //console.log('emmiting to server preoffer event');
    socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer =(data) =>{
    socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = (data) =>{
    socketIO.emit('webRTC-signaling', data);
}

export const sendUserHangUp =(data)=>{
    socketIO.emit('user-hanged-up', data);
}

export const changeStrangerConnectionStatus = (data) =>{
    socketIO.emit('stranger-connection-status', data);
}

export const getStrangerSocketId =() =>{
    socketIO.emit('get-stranget-socket-id');
}
