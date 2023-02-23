// import formatMessage from '../../utils/messages';

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ( room ) => {
  roomName.innerText = room.room + " Chat Room";
  // console.log(room);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  if(message.username !== username){
    outputMessage(message.text, message.username, message.time, 'left');
  }

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // formatMessage(username, msg);

  // Emit message to server
  socket.emit('chatMessage', msg);
  const sendTime = new Date().toLocaleTimeString();
  const currTime = sendTime.slice(0,5);
  console.log(sendTime);

  outputMessage(msg,'You',currTime , 'right');

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(mssg, name, time, position) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(position);
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = name;
  p.innerHTML += `<span> ${time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = mssg;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
