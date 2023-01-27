import * as constants from './constants.js';
import * as elem from './elements.js';

export const updateLocalVideo=(stream) =>{
    const localVideo = document.getElementById('local_video');
    localVideo.srcObject = stream;

    localVideo.addEventListener('loadedmetadata' , () =>{
        localVideo.play();
    })
};

export const updateRemoteVideo=(stream) =>{
    const remoteVideo = document.getElementById('remote_video');
    remoteVideo.srcObject = stream;
}

export const updatePersonalCode =(updatePersonalCode) =>{
    const personalCodeParagraph = document.getElementById('personal_code_paragraph');
    personalCodeParagraph.innerHTML = updatePersonalCode;
};

export const showIncomingCallDialog = (callType, acceptCallhandler, rejectCallHandler) =>{
    const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

    const incomingCallDialog = elem.getIncomingCallDialog(callTypeInfo,  acceptCallhandler, rejectCallHandler);

    //removing all in div dialog
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());

    dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (callingDialogRejectCallHandler) =>{
    const callingDialog = elem.getCallingDialog(callingDialogRejectCallHandler);

    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());

    dialog.appendChild(callingDialog);
};

export const showInfoDialog = (preOfferAnswer) =>{
    let infoDialog = null;

    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        infoDialog = elem.getInfoDialog('Call Rejected',
        'Callee rejected your call get rekt');
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
        infoDialog = elem.getInfoDialog('Callee Not Found',
        'Pls check code hoe');
    }
    
    if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
        infoDialog = elem.getInfoDialog('Callee Unavailable',
        'Callee is too important for you');
    }
    
    if(infoDialog){
        const dialog = document.getElementById('dialog');
        dialog.appendChild(infoDialog);
        setTimeout(() =>{
            removeAllDialog();
        } , [4000]);//4 seconds
    }    
};

export const removeAllDialog = () =>{
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
};

export const showCallElements = (callType) =>{
    if(callType === constants.callType.CHAT_PERSONAL_CODE){
        showChatCallElements();
    }

    if(callType === constants.callType.VIDEO_PERSONAL_CODE){
        showVideoCallElements();
    }
}

const showChatCallElements = () => {
    const finishConnectionChatButtonContainer =document.getElementById('finish_chat_button_container');
    showElement(finishConnectionChatButtonContainer);

    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    //block panel
    disableDashboard();
}

const showVideoCallElements = () => {
    const callButtons = document.getElementById('call_buttons');
    showElement(callButtons);

    const placeHolder = document.getElementById('video_placeholder');
    hideElement(placeHolder);
    
    const remoteVideo = document.getElementById('remote_video');
    showElement(remoteVideo);

    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);

    disableDashboard();
}

//ui helper functions

const enableDashboard =() =>{
    const dashBoardBlocker = document.getElementById('dasboard_blur');
    if(!dashBoardBlocker.classList.contains('display_none')){
        dashBoardBlocker.classList.add('display_none');
    }
};

const disableDashboard =() =>{
    const dashBoardBlocker = document.getElementById('dasboard_blur');
    if(dashBoardBlocker.classList.contains('display_none')){
        dashBoardBlocker.classList.remove('display_none');
    }
};

const hideElement = (element)=>{
    if(!element.classList.contains('display_none')){
        element.classList.add('display_none');
    }
}

const showElement = (element)=>{
    if(element.classList.contains('display_none')){
        element.classList.remove('display_none');
    }
}

