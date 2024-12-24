const socket = io.connect("http://localhost:5000");

const inputMessage = document.getElementById('input-msg');
const sendButton = document.getElementById('send-btn');

const userInput = document.getElementById('user-input');
const enterButton = document.getElementById('enter-btn');

let username = '';

// collecting username and emitting it to server
enterButton.addEventListener('click', () => {
    username = userInput.value;
    // show welcome message
    const welcome = document.getElementById('welcome-user');
    welcome.innerText = "Welcome : " + username;
    socket.emit("join", username);
})


// const username = prompt("Enter you name");


// update number of users with there names
socket.on("onlineUser", (onlineUsers) => {
    const connectedUsers = document.getElementById('connected-user');
    connectedUsers.innerText = "Connected users: " + onlineUsers.length;
    const onlineUsersList = document.getElementById('online-users-list');
    onlineUsersList.innerHTML = "";
    onlineUsers.forEach(user => {
        const newUser = document.createElement('div');
        newUser.innerHTML = `<div class="user">
                         <img src="https://tse1.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api" style="height: 20px; width: 20px; margin-right: 20px; border-radius: 50%" alt=""
                         <p>${user.username}</p>
                         <p id="${user.id}" class="typing" style="margin-right:auto; margin-left:10px"><p>
                         <span class="online-dot"></span>
                         </div>`;
        onlineUsersList.appendChild(newUser);
    })
})

// send message to server
sendButton.addEventListener('click', () => {
    const data = {username: username, message: inputMessage.value};
    socket.emit('sendMessage', data);
    inputMessage.value = "";
})
// by pressing "Enter" button
inputMessage.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        const data = {username: username, message: inputMessage.value};
        socket.emit('sendMessage', data);
        inputMessage.value = "";
    }
})

// Receive and display new message
socket.on("newMessage", (newUser) => {
    const chatList = document.getElementById("chat-list");
    const msg = document.createElement('div');
    const timestamp = new Date(newUser.timestamp);
    if (newUser.name == username) {
        msg.innerHTML = `
        <div id="user-details-box">
            <img src="https://tse1.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api" style="height: 20px; width: 20px; margin-right: 20px; border-radius: 50%" id="chat-image" alt="">
            <div id="name-message">
                <div id="name">${newUser.name}</div>
                <div id="message">${newUser.message}</div>
            </div>
            <div id="time">${timestamp.getHours()}:${timestamp.getMinutes()}</div>
        </div>`;
    }else{
        msg.innerHTML = `
        <div id="message-block">
            <img src="https://tse1.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api" style="height: 20px; width: 20px; margin-right: 20px; border-radius: 50%" id="chat-image" alt="">
            <div id="name-message">
                <div id="name">${newUser.name}</div>
                <div id="message">${newUser.message}</div>
            </div>
            <div id="time">${timestamp.getHours()}:${timestamp.getMinutes()}</div>
        </div>`;
    }
    chatList.appendChild(msg);
})


// display older messages
// socket.on("load-messages", (oldMessage) => {
//     const messageList = document.getElementById("chat-list");
//     if(oldMessage) {
//         const oldmsg = document.createElement("div");
//         const timestamp = new Date(oldMessage.timestamp);
//           oldmsg.innerHTML = `
//             <div id="message-block">
//                 <img src="https://tse1.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api" style="height: 20px; width: 20px; margin-right: 20px; border-radius: 50%" id="chat-image" alt="">
//                 <div id="name-message">
//                     <div id="name">${oldMessage.name}</div>
//                     <div id="message">${oldMessage.message}</div>
//                 </div>
//                 <div id="time">${timestamp.getHours()}:${timestamp.getMinutes()}</div>
//             </div>`;
//           messageList.appendChild(oldmsg);
//     }
//   });


// Typing Indicator
inputMessage.addEventListener("input", () => {
    socket.emit("typing", username);
});

socket.on("typing", (userId) => {
    if (userId) {
      document.getElementById(userId).innerText = "typing..";
    }
    setTimeout(() => {
      document.getElementById(userId).innerText = "";
    }, 800);
  });


