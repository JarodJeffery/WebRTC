import * as store from './store.js';
import * as wss from './wss.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';
import * as types from './constants.js';

// initialization of socket io connection
const socket = io('/');
wss.registerSocketEvents(socket);

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