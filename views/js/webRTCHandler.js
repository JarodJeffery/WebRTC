import * as wss from './wss.js';
import * as co from'./constants.js';
import * as ui from './ui.js';
import * as store from'./store.js';

let connectedUserDetails;
let peerConnection;
let screenSharingStream;
let dataChannel;
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

    dataChannel = peerConnection.createDataChannel("chat");

    peerConnection.ondatachannel =(event) =>{
        const dataChannel = event.channel;

        dataChannel.onopen =() =>{
            console.log('peer connection ready to recieve messages');
        }

        dataChannel.onmessage =(event) =>{
            console.log('message cmae from data channel');
            const message =JSON.parse(event.data);
            ui.appendMessage(message);
        }
    }

    peerConnection.onicecandidate = (event) =>{
        console.log('getting ice candidate from stun server')
        if(event.candidate){
            //send ice candidate to other user
            wss.sendDataUsingWebRTCSignaling({
                connectedUserSocketId: connectedUserDetails.socketId,
                type: co.WebRTCSignaling.ICE_CANDIDATE,
                candidate: event.candidate
            });
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

export const sendMessageUsingDataChannel =(message) =>{
    const stringifedMessage = JSON.stringify(message);
    dataChannel.send(stringifedMessage);
}

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

export const handleWebRTCCandidate = async (data) =>{
    console.log('handling incoming webRTC candidate');
    try{
        await peerConnection.addIceCandidate(data.candidate);
    }catch(err){
        console.log('error occured when trying to add recieved ICE candidate', err);
    }
}

export const switchBetweenCameraAndScreenSharing = async (screenSharingActive) =>{
    if(screenSharingActive){
        console.log('switching back for screen sharing');
        const localStream = store.getState().localStream;
        const senders = peerConnection.getSenders();

        const sender = senders.find((sender) =>{
            console.log( localStream.getVideoTracks());
            return sender.track.kind === localStream.getVideoTracks()[0].kind;
        });

        if(sender){
            sender.replaceTrack(localStream.getVideoTracks()[0]);
        }
        //stop screen sharing window
        store.getState().screenSharingStream.getTracks()
        .forEach((track) =>{track.stop()});
        store.setScreenSharing(!screenSharingActive);
        ui.updateLocalVideo(localStream);
    } else {
        console.log('switching for screen sharing');
        try{
            screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            store.setScreenSharingStream(screenSharingStream);
            //replace track that sender is sending 
            const senders =peerConnection.getSenders();
            const sender = senders.find((sender) =>{
                return sender.track.kind === screenSharingStream.getVideoTracks()[0].kind;
            });
            if(sender){
                sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
            }
            

            store.setScreenSharing(!screenSharingActive);

            ui.updateLocalVideo(screenSharingStream);
        }catch(err){
            console.log('error occured when switching screens', err);
        }
    }
}

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

//hangup

export const handleHangUp =() =>{
    const data ={
        connectedUserSocketId : connectedUserDetails.socketId
    }
    wss.sendUserHangUp(data);
    closePeerConnectionAndResetState();
}

export const handleConnectedUserHangedUp = () =>{
    closePeerConnectionAndResetState();
}

const closePeerConnectionAndResetState =() =>{
    if(peerConnection){
        peerConnection.close();
        peerConnection= null;
    }

    //active mic and camera
    if(connectedUserDetails.callType === co.callType.VIDEO_PERSONAL_CODE || 
        connectedUserDetails.callType === co.callType.VIDEO_STRANGER)
    {
        store.getState().localStream.getVideoTracks()[0] = true;
        store.getState().localStream.getAudioTracks()[0] = true;
    }
    ui.updateUIAfterHangUp(connectedUserDetails.callType);
    connectedUserDetails =null;
}