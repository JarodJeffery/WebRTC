import * as wss from './wss.js';
import * as co from'./constants.js';
import * as ui from './ui.js';
import * as store from'./store.js';

let connectedUserDetails;
let peerConnection;

const defualtConstraints ={
    audio: true,
    video:true
}

const configuration={
    iceServers: [
        {
            urls: 'stun:stun.1.google.com:13902'
        }
    ]
};

export const getLocalPreview =() =>{
    navigator.mediaDevices
    .getUserMedia(defualtConstraints)
    .then((stream =>{
        ui.updateLocalVideo(stream);
        store.setLocalStream(stream);
    }))
    .catch((err)=>{
        console.log('camera cannot connect');
        console.log(err);
    });
};

const createPeerConnection=() =>{
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) =>{
        console.log('getting ice candidate from stun server')
        if(event.candidate){
            //send ice candidate to other user
        }
    }

    peerConnection.onconnectionstatechange=(event) =>{
        if(peerConnection.connectionState === 'connected'){
            console.log('succesfully connected with other peer');
        }
    }

    //recieving tracks 
    const remoteStream = new MediaStream();
    store.setRemoteStream(remoteStream);
    ui.updateRemoteVideo(remoteStream);

    peerConnection.ontrack = (event) =>{
        remoteStream.addTrack(event.track);
    }

    //add our stream to peer connection
    
    if(connectedUserDetails.callType === co.callType.VIDEO_PERSONAL_CODE){
        const localStream = store.getState().localStream;
        for(const track of localStream.getTracks()){
            peerConnection.addTrack(track, localStream);
        }
    }
};

export const sendPreOffer = (calleePersonalCode, callType) => {
    connectedUserDetails ={
        callType,
        socketId: calleePersonalCode
    }

    if(callType === co.callType.CHAT_PERSONAL_CODE || callType === co.callType.VIDEO_PERSONAL_CODE){
        const data={
            callType,
            calleePersonalCode
        };
        ui.showCallingDialog(callingDialogRejectCallHandler);
        wss.sendPreOffer(data);
    }    
}

export const handlePreOffer = (data) =>{
    const {callType, callerSocketId } = data;

    connectedUserDetails={
        socketId: callerSocketId,
        callType,
    };
    
    if(callType === co.callType.CHAT_PERSONAL_CODE || callType === co.callType.VIDEO_PERSONAL_CODE){
        ui.showIncomingCallDialog(callType, acceptCallhandler, rejectCallHandler);
    }
};

export const handlePreOfferAnswer = (data) =>{
    const { preOfferAnswer } = data;

    ui.removeAllDialog();
    if(preOfferAnswer === co.preOfferAnswer.CALLEE_NOT_FOUND){
        // show that callee is not found
        ui.showInfoDialog(preOfferAnswer);
    }

    if(preOfferAnswer === co.preOfferAnswer.CALL_UNAVAILABLE){
        //show callee is busy 
        ui.showInfoDialog(preOfferAnswer);
    }

    if(preOfferAnswer === co.preOfferAnswer.CALL_REJECTED){
        // show that call was rejected
        ui.showInfoDialog(preOfferAnswer);
    }
    if(preOfferAnswer === co.preOfferAnswer.CALL_ACCEPTED){
        ui.showCallElements(connectedUserDetails.callType);
        createPeerConnection();
        sendWebRTCOffer();
    }
};


const sendWebRTCOffer = async () =>{
    const offer =await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: co.WebRTCSignaling.OFFER,
        offer: offer,
    });
}

export const handleWebRTCOffer = async (data) =>{
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: co.WebRTCSignaling.ANSWER,
        answer: answer
    });
};

export const handleWebRTCAnswer = async(data) =>{
    console.log('handeling web rtc answer');
    console.log(data);
    await peerConnection.setRemoteDescription(data.answer);
};

const acceptCallhandler =() =>{
    console.log('call accepted');
    createPeerConnection();
    sendPreOfferAnswer(co.preOfferAnswer.CALL_ACCEPTED);
    ui.showCallElements(connectedUserDetails.callType);
}

const rejectCallHandler =() =>{
    console.log('call rejected');
    sendPreOfferAnswer(co.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = () =>{
    console.log('call terminted');
}

const sendPreOfferAnswer = (preOfferAnswer) =>{
    const data ={
        callerSocketId: connectedUserDetails.socketId,
        preOfferAnswer
    }
    ui.removeAllDialog();
    wss.sendPreOfferAnswer(data);
}

