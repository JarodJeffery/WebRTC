import * as wss from './wss.js';
import * as co from'./constants.js';
import * as ui from './ui.js';

let connectedUserDetails;

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

export const handlePreOfferAnswer =(data) =>{
    const {preOfferAnswer} = data;
    console.log('pre-offer-answer-came');
    console.log(data);
    ui.removeAllDialog();
    if(preOfferAnswer === co.preOfferAnswer.CALLEE_NOT_FOUND){
        // show that callee is not found
    }

    if(preOfferAnswer === co.preOfferAnswer.CALL_UNAVAILABLE){
        //show callee is busy 
    }

    if(preOfferAnswer === co.preOfferAnswer.CALL_REJECTED){
        // show that call was rejected
    }
    if(preOfferAnswer === co.preOfferAnswer.CALL_ACCEPTED){
        //send webRTC offer
    }
};

const acceptCallhandler =() =>{
    console.log('call accepted');
    sendPreOfferAnswer(co.preOfferAnswer.CALL_ACCEPTED);
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

