import * as constants from './constants.js';
import * as wss from './wss.js';
import * as web from './webRTCHandler.js';
import * as ui from './ui.js';
let strangerCallType;

export const changeStrangerConnectionStatus =(status) =>{
    const data  = {status};
    wss.changeStrangerConnectionStatus(data);
};

export const getStrangerSocketIdAndConnect = (callType) =>{
    strangerCallType =callType;
    wss.getStrangerSocketId();
};

export const connectWithStranger = (data) =>{
    if(data.randomStrangetSocketId){
        web.sendPreOffer(data.randomStrangetSocketId, strangerCallType);
    }else{
        ui.showNoStrangerAvailableDialog();
    }
    
};