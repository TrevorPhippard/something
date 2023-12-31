const messages = require('../models/messages');

var socketIO = function (io, socket, onlineUsers) {
  // connect to server
  console.log('a user connected', socket.id);
  socket.on('connectToServer', (data) => {
    console.log('data::', data)
    onlineUsers.push(data);
  });

  // send/receive message
  socket.on('message', ({ message }, callback) => {
    console.log(socket.id)
    io.to(message.roomId).emit('receivedMsg', { message });
    messages.addMsgToRoom(message.displayName, message.roomId, message.msg);
    callback({ status: "ok" });
  });

  // join rooms
  socket.on('join', ({ userId, roomId, socketId }) => {
    console.log(`user ${userId} has joined room ${roomId}`);
    socket.join(roomId);
    // let room know someone joined
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].socketId === socketId) {
        onlineUsers[i].roomId = roomId;
        io.to(roomId).emit('enteredRoom', onlineUsers[i]);
        break;
      }
    }
  })

  // leave rooms
  socket.on('leave', ({ userId, roomId, socketId }) => {
    console.log(`user ${userId} has left room ${roomId}`);
    socket.leave(roomId);
    // find user info
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].socketId === socketId) {
        onlineUsers[i].roomId = null;
        io.to(roomId).emit('disconnected', onlineUsers[i]);
        break;
      }
    }
  });

  // track disconnects
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].socketId === socket.id) {
        // let clients know user disconnected
        io.to(onlineUsers[i].roomId).emit('disconnected', onlineUsers[i]);
        // delete user from online list
        onlineUsers.splice(i, 1);
      }
    }
  })
}

module.exports = socketIO;