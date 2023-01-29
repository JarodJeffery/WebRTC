import * as constants from './constants.js';
import * as elem from './elements.js';
import * as rec from './recordingUtils.js';
import * as store from './store.js';

export const updateLocalVideo=(stream) =>{
    const localVideo = document.getElementById('local_video');
    localVideo.srcObject = stream;

    localVideo.addEventListener('loadedmetadata' , () =>{
        localVideo.play();
    })
};

export const showVideoCallButtons =() =>{
    const personalVideo = document.getElementById('personal_code_video_button');
    const strangerVideo = document.getElementById('stanger_video_button');
    showElement(personalVideo);
    showElement(strangerVideo);
}

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

export const showNoStrangerAvailableDialog =() =>{
    const infoDialog = elem.getInfoDialog('No Strangers Available', 'You all alone you lonely loner hahaha');
    if(infoDialog){
        const dialog = document.getElementById('dialog');
        dialog.appendChild(infoDialog);
        setTimeout(() =>{
            removeAllDialog();
        } , [4000]);//4 seconds
    } 
}

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
    if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.CHAT_STRANGER){
        showChatCallElements();
    }

    if(callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER){
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

//ui call buttons

const micOnimageSrc ='./utils/images/mic.png';
const micOffImagesrc = './utils/images/micOff.png';
const camButtonImgSrcOn = './utils/images/camera.png';
const camButtonImgSrcOff =  './utils/images/cameraOff.png';

export const updateMicButton = (micEnable) =>{
    const micButtonImage = document.getElementById('mic_button_image');
    micButtonImage.src = micEnable ? micOffImagesrc : micOnimageSrc ;
};

export const updateCameraButton = (cameraEnable) =>{
    const cameraButtonImage = document.getElementById('camera_button_image');
    cameraButtonImage.src = cameraEnable ? camButtonImgSrcOff : camButtonImgSrcOn;
};

//ui messages

export const appendMessage =(message, right= false) =>{
    const messageContainer = document.getElementById('messages_container');
    const messageElement = right ? elem.getRightMessage(message): elem.getLeftMessage(message);
    messageContainer.appendChild(messageElement);
}

export const clearMessanger =() =>{
    const messageContainer = document.getElementById('messages_container');
    messageContainer.querySelectorAll('*').forEach((n) => n.remove());
}

//recording

export const showRecordingPanel =() =>{
    const recButton = document.getElementById('video_recording_buttons');
    showElement(recButton);

    // hide start rec button if active
    const startRec = document.getElementById('start_recording_button');
    hideElement(startRec);
}

export const resetRecButton =() =>{
    const startRec = document.getElementById('start_recording_button');
    showElement(startRec);
    const recButton = document.getElementById('video_recording_buttons');
    hideElement(recButton);
}

export const switchRecButtions =(switchResButton = false) =>{
    const resButton = document.getElementById('resume_recording_button');
    const pauseButton =document.getElementById('pause_recording_button');
    if(switchResButton){
        hideElement(pauseButton);
        showElement(resButton);
    }else{
        hideElement(resButton);
        showElement(pauseButton);
    }
}

//ui after hang up
export const updateUIAfterHangUp =(callType) =>{
    enableDashboard();
    //hide call buttons
    if(callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER){
        const callButtons = document.getElementById('call_buttons');
        hideElement(callButtons);
    }else{
        const chatCallButtons = document.getElementById('finish_chat_button_container');
        hideElement(chatCallButtons);
    }

    const newMessInput =document.getElementById('new_message');
    hideElement(newMessInput);
    clearMessanger();

    updateMicButton(false);
    updateCameraButton(false);

    removeAllDialog();
    //hide remote video and show place holder

    const placeholder = document.getElementById('video_placeholder');
    showElement(placeholder);
    const remoteVideo = document.getElementById('remote_video');
    hideElement(remoteVideo);
}


//update checkbox

export const updateStrangerCheckBox =(checkBoxState) =>{
    const checkBoxCheckImg = document.getElementById('allow_strangers_checkbox_image');
    !checkBoxState ? showElement(checkBoxCheckImg): hideElement(checkBoxCheckImg);
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
};

const showElement = (element)=>{
    if(element.classList.contains('display_none')){
        element.classList.remove('display_none');
    }
};