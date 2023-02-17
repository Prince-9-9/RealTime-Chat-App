const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInp = document.getElementById('messageInput')
const messageContainer = document.querySelector(".container");
var audio = new Audio('notif.mp3');

// const box = document.getElementsByClassName('container');

var lastmesgg;

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}


const newname = prompt("Enter your name");
socket.emit('new-user-joined', newname);

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInp.value;
    append(`${message}`, 'right');
    socket.emit('send', message);
    messageInp.value = "";
    lastmesgg = `${newname}`;
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'join');
})

socket.on('receive', data =>{
    if(lastmesgg != `${data.name}`){
        append(`${data.name}`, 'name');
        append(`${data.message}`, 'left');
    }
    else{
        append(`${data.message}`, 'left');
    }
    lastmesgg = `${data.name}`;
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

socket.on('disconnected', name =>{
    append(`${name} left the chat`, 'leave');
})