import * as store from './store.js';
import * as constants from './constants.js';
import * as elem from './elements.js';

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

export const removeAllDialog = () =>{
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
};
