const username=document.getElementById('username');
const room=document.getElementById('room');
const error_msg=document.getElementById('error');
const socket=io()
var user;
function setall(){
    user=username.value
    room_name=room.value
    socket.emit('setall',{username:user,room_name})
}

socket.on('userexists',(data)=>{
    error_msg.innerText = data
})

socket.on('room-joined',({username,room_name})=>{
    window.location.href = window.location.href+room_name+"?username="+username+"&room_name="+room_name
})

