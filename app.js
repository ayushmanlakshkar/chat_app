const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
let app = express()
let server = http.createServer(app);
let io = socketio(server);

app.set('view engine', 'hbs');
app.use(express.static('views'))
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    res.render('home')
})

app.get('/:id', async (req, res) => {
    res.render('chat', { id: req.params.id })
});

let users = [];
io.on('connection', (socket) => {
    console.log("user connected");

    socket.on('setall', ({ username, room_name }) => {
        if (users.indexOf(username) > -1) {
            socket.emit('userexists', "username already exists")
        }
        else {
            users.push(username)
            socket.emit('room-joined', { username, room_name })
        }
    })

    socket.on("user-joined", (data) => {
        socket.join(data.room)
        socket.emit('user-joined', {
            user: data.user,
            room: data.room,
            position: "middle",
            content: "Welcome to the chat room"
        })
        socket.broadcast.to(data.room).emit("user-joined", {
            user: data.user,
            room: data.room,
            position: "middle",
            content: data.user + " joined the chat"
        })
    })

    socket.on('msg', (data) => {
        socket.emit('msg', {
            user: data.user,
            room: data.room,
            position: "right",
            content: data.content
        })
        socket.broadcast.to(data.room).emit("msg", {
            user: data.user,
            room: data.room,
            position: "left",
            content: data.content
        })
    })

    socket.on("left-room", function(data) {
        i=users.indexOf(data.user)
        users=users.splice(i,1)
        socket.broadcast.to(data.room).emit("msg", {
            user: data.user,
            room: data.room,
            position: "middle",
            content: data.user + " just left the chat"
        })
    })



    socket.on('disconnect', () => {
        console.log("user disconnected");
    })
})

server.listen(8000, () => {
    console.log("server started");
})