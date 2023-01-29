import * as con from './constants.js';

let state ={
    socketId: null,
    localStream: null,                  //access to cam and mic
    remoteStream: null,
    screenSharingStream: null,
    screenSharingActive: false,
    allowConnectionFromStrangers: false,
    callState: con.callState.CALL_AVAILABLE_ONLY_CHAT
};

export const setSocketId =(socketId) =>{
    state ={
        ...state,                       //...copy initial state
        socketId: socketId
    };
    console.log(state);
};

export const setLocalStream =(stream) =>{
    state={
        ...state,
        localStream: stream      
    };
};

export const setRemoteStream =(stream) =>{
    state={
        ...state,
        remoteStream: stream      
    };
};

export const setAllowConnectionFromStrangers =(allowConnections) =>{
    state={
        ...state,
        allowConnectionFromStrangers: allowConnections      
    };
};

export const setScreenSharing =(share) =>{
    state={
        ...state,
        screenSharingActive: share      
    };
};

export const setScreenSharingStream =(stream) =>{
    state={
        ...state,
        screenSharingStream: stream      
    };
};

export const setCallState =(callState) =>{
    state ={
        ...state,
        callState : callState
    }
};

export const getState = () =>{
    return state;
}