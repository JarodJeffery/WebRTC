import * as ui from './ui.js';

export const getIncomingCallDialog = (callTypeInfo,  acceptCallhandler, rejectCallHandler) =>{
    console.log('getting incoming call dialog');
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);
    const title =document.createElement('p');
    title.classList.add('dialog_title');
    title.innerHTML = 'Incoming ' + callTypeInfo + ' Call';

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('dialog_image_container');
    const image = document.createElement('img');
    const imgPath = './utils/images/dialogAvatar.png';
    image.src = imgPath;
    imageContainer.appendChild(image);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add("dialog_button_container");
    const acceptButton = document.createElement('button');
    acceptButton.classList.add('dialog_accept_call_button');
    const acceptCallImg = document.createElement('img');
    acceptCallImg.classList.add("dialog_button_image");
    acceptCallImg.src ='./utils/images/acceptCall.png';
    acceptButton.appendChild(acceptCallImg);
    buttonContainer.appendChild(acceptButton);

    const rejectButton = document.createElement('button');
    rejectButton.classList.add('dialog_reject_call_button');
    const rejectCallImg = document.createElement('img');
    rejectCallImg.classList.add("dialog_button_image");
    rejectCallImg.src ='./utils/images/rejectCall.png';
    rejectButton.appendChild(rejectCallImg);
    buttonContainer.appendChild(rejectButton);

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(buttonContainer);

    acceptButton.addEventListener('click', () =>{
        acceptCallhandler();
    });

    rejectButton.addEventListener('click', ()=>{
        rejectCallHandler();
    })
    return dialog;
}

export const getCallingDialog =(callingDialogRejectCallHandler) =>{
    console.log('getting incoming call dialog');
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);
    const title =document.createElement('p');
    title.classList.add('dialog_title');
    title.innerHTML = 'Calling';

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('dialog_image_container');
    const image = document.createElement('img');
    const imgPath = './utils/images/dialogAvatar.png';
    image.src = imgPath;
    imageContainer.appendChild(image);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add("dialog_button_container");

    const rejectButton = document.createElement('button');
    rejectButton.classList.add('dialog_reject_call_button');
    const rejectCallImg = document.createElement('img');
    rejectCallImg.classList.add("dialog_button_image");
    rejectCallImg.src ='./utils/images/rejectCall.png';
    rejectButton.appendChild(rejectCallImg);
    buttonContainer.appendChild(rejectButton);

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(buttonContainer);

    return dialog;
}

export const getInfoDialog =(dialogTitle, description) =>{
    const dialog = document.createElement('div');
    dialog.classList.add('dialog_wrapper');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);
    const title =document.createElement('p');
    title.classList.add('dialog_title');
    title.innerHTML = dialogTitle;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('dialog_image_container');
    const image = document.createElement('img');
    const imgPath = './utils/images/dialogAvatar.png';
    image.src = imgPath;
    imageContainer.appendChild(image);

    const des = document.createElement('p');
    des.classList.add('dialog_description');
    des.innerHTML= description;

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(des);

    return dialog;
}   

export const getLeftMessage =(message) =>{
    const messageContainer =document.createElement('div');
    messageContainer.classList.add('message_left_container');

    const para = document.createElement('p');
    para.classList.add('message_left_paragraph');
    para.innerHTML = message;

    messageContainer.appendChild(para);

    return messageContainer;
}

export const getRightMessage =(message) =>{
    const messageContainer =document.createElement('div');
    messageContainer.classList.add('message_right_container');

    const para = document.createElement('p');
    para.classList.add('message_right_paragraph');
    para.innerHTML = message;

    messageContainer.appendChild(para);

    return messageContainer;
}