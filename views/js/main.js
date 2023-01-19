const socket = io('/');

socket.on('connect', () =>{
    console.log('sucessully connected to socket.io server');
    console.log(socket.id);
})