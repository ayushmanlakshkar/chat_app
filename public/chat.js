const text = document.getElementById('message');
const messages = document.getElementById('messages');
const socket = io()
const buttonp=document.getElementById('button')
var user;
var room;
const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams) {
    if (key == "username") {
        user = value;
    }
    if (key == "room_name") {
        room = value;
    }
}


function appendmsg(data) {
    var msg=document.createElement("div");
    msg.classList.add("message");
    switch(data.position) {
        case "left":
            msg.classList.add("left");
            msg.innerHTML = `<b>${data.user}</b> : ${data.content}`;
            break;
        case "right":
          msg.classList.add("right");
          msg.innerHTML = `<b>YOU</b> : ${data.content}`;
          break;
        default:
          msg.classList.add("middle");
          msg.innerHTML = `${data.content}`; 
      }
    messages.appendChild(msg);
}

function send() {
    socket.emit("msg",{
        user: user,
        room: room,
        content:text.value
    })
    text.value =''
}

function leave_room(){
    socket.emit("left-room",{room: room, user: user})
    window.location.href="http://localhost:8000/"
}



socket.on('msg', function (data) {
    appendmsg(data)
})

socket.on("connect", function () {
    socket.emit("user-joined", {
        user: user,
        room: room
    })
})

socket.on("user-joined", function (data) {
    appendmsg(data)
})

socket.on("disconnect", function(){
    socket.emit("left-room",{room: room, user: user})
})

text.addEventListener("keypress",function (event){
    if(event.key==="Enter"){
            buttonp.click();
    }}
)

