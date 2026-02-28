const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const PORT = 5000;

let users = {}; // socketId -> username

io.on('connection', socket => {
  console.log('New connection:', socket.id);

  socket.on('join', username => {
    users[socket.id] = username;

    // Send existing users to the new user
    socket.emit('all-users', Object.keys(users).filter(id => id !== socket.id));

    // Notify existing users about new user
    socket.broadcast.emit('user-joined', { id: socket.id, name: username });

    // Update participants for everyone
    io.emit('participants', Object.values(users));
  });

  socket.on('signal', data => {
    io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-left', socket.id);
    io.emit("participants", Object.values(users));
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

