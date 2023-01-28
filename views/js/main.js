import * as store from './store.js';
import * as wss from './wss.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';
import * as types from './constants.js';
import * as rec from './recordingUtils.js';

// initialization of socket io connection
const socket = io('/');
wss.registerSocketEvents(socket);

web.getLocalPreview();
//registering event listener for personal code copy button
const copyButton = document.getElementById('personal_code_copy_button');
copyButton.addEventListener("click", () =>{
    const pCode = store.getState().socketId;
    //save to clipboard
    navigator.clipboard && navigator.clipboard.writeText(pCode);
});

// register eventlistern for connection buttons
const personalCodeChatButton= document.getElementById('personal_code_chat_button');
const personalCodeVideoButton= document.getElementById('personal_code_video_button');
const strangerChatButton = document.getElementById('stanger_chat_button');
const strangerVideoButton = document.getElementById('stanger_video_button');

personalCodeChatButton.addEventListener("click", () =>{
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = types.callType.CHAT_PERSONAL_CODE;
    console.log("chat button clicked");
    web.sendPreOffer(calleePersonalCode, callType);
});

personalCodeVideoButton.addEventListener("click", () =>{
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = types.callType.VIDEO_PERSONAL_CODE;
    console.log("chat button clicked");
    web.sendPreOffer(calleePersonalCode, callType);
});

strangerChatButton.addEventListener("click", () =>{
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = types.callType.CHAT_STRANGER;
    console.log("chat button clicked");
    web.sendPreOffer(calleePersonalCode, callType);
});

strangerVideoButton.addEventListener("click", () =>{
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = types.callType.VIDEO_STRANGER;
    console.log("chat button clicked");
    web.sendPreOffer(calleePersonalCode, callType);
});


//event listeners for video call buttons

const micButton = document.getElementById('mic_button');
micButton.addEventListener('click', () =>{
    const localStream = store.getState().localStream;
    const micEnable = localStream.getAudioTracks()[0].enabled; //only 1 audio track returns true is mic is enabled
    localStream.getAudioTracks()[0].enabled = !micEnable;
    ui.updateMicButton(micEnable);
});

const cameraButton = document.getElementById('camera_button');
cameraButton.addEventListener('click', () =>{
    const localStream = store.getState().localStream;
    const cameraEnable = localStream.getVideoTracks()[0].enabled;
    localStream.getVideoTracks()[0].enabled =!cameraEnable;
    ui.updateCameraButton(cameraEnable);
});

const screeenShareButton = document.getElementById('screen_sharing_button');
screeenShareButton.addEventListener('click',() =>{
    const screenSharingActive = store.getState().screenSharingActive;
    web.switchBetweenCameraAndScreenSharing(screenSharingActive);
});

//messanger 

const newMessageInput = document.getElementById('new_message_input');
newMessageInput.addEventListener('keydown', (event) =>{
    console.log('change occured');
    const key =event.key;

    if(key === "Enter"){
        web.sendMessageUsingDataChannel(event.target.value);
        ui.appendMessage(event.target.value, true);
        newMessageInput.value='';
    }
});

const sendMessage = document.getElementById('send_message_button');
sendMessage.addEventListener('click', () =>{
    const message = newMessageInput.value;
    web.sendMessageUsingDataChannel(message);
    ui.appendMessage(message, true);
    newMessageInput.value='';
});

// recording

const startRecButton = document.getElementById('start_recording_button');
startRecButton.addEventListener('click', () =>{
    rec.startRec();
    ui.showRecordingPanel();
});

const stopRecButton = document.getElementById('stop_recording_button');
stopRecButton.addEventListener('click', () =>{
    rec.stopRec();
    ui.resetRecButton();
});

const pauseRecButton =document.getElementById('pause_recording_button');
pauseRecButton.addEventListener('click', () =>{
    rec.pauseRec();
    ui.switchRecButtions(true);
});

const resRecButton =document.getElementById('resume_recording_button');
resRecButton.addEventListener('click', () =>{
    rec.resumeRec();
    ui.switchRecButtions();
});
