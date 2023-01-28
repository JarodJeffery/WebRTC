import * as store from './store.js';
import * as wss from './wss.js';
import * as ui from './ui.js';
import * as web from './webRTCHandler.js';
import * as types from './constants.js';

let mediaRecorder;
let recordedChunks =[];

const vp9Codec = 'video/webm; codecs=vp=9';
const vp9Options ={ mimeType: vp9Codec };

export const startRec =() =>{
    const remoteStream =store.getState().remoteStream;

    if(MediaRecorder.isTypeSupported(vp9Codec)){
        mediaRecorder = new MediaRecorder(remoteStream, vp9Codec);
    }else{
        mediaRecorder = new MediaRecorder(remoteStream);
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

export const pauseRec =() =>{
    mediaRecorder.pause();
}

export const resumeRec =() =>{
    mediaRecorder.resume();
}

export const stopRec =() =>{
    mediaRecorder.stop();
}

const handleDataAvailable =(event) =>{
    if(event.data.size > 0){
        recordedChunks.push(event.data);
        downloadRecVideo();
    }
}

const downloadRecVideo =() =>{
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style ='display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}
