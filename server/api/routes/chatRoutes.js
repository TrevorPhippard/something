'use strict';

module.exports = function (app) {
  const chatHandler = require('../controllers/chatController.js');

  // request previous messages
  app.route('/api/messages/:roomId').get(chatHandler.messagesByRoomId);
  // add message to DB
  app.route('/api/messages').post(chatHandler.messages);
  // request online users array 
  app.route('/api/online/:roomId').get(chatHandler.onlineByRoomId);
  // request room list
  app.route('/api/rooms').get(chatHandler.rooms);
  // add rooms
  app.route('/api/rooms').post(chatHandler.rooms);
  // delete rooms
  app.route('/api/rooms/:roomId').delete(chatHandler.roomsByRoomId);


};