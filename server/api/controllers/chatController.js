'use strict';

const messages = require('../models/messages');
const rooms = require('../models/rooms');

exports.rooms = async (req, res) =>{
    console.log('GET REQUEST: fetching rooms information');
    const data = await rooms.listAll();
    console.table(data);
    res.status(200).send(data);
}

exports.messagesByRoomId = async (req, res) =>{
    console.log(`GET REQUEST: fetching previous messages for room ${req.params.roomId}`);
    const data = await messages.getRoomMsgs(req.params.roomId);
    console.table(data);
    res.send(data);
}

exports.onlineByRoomId = async (req, res) =>{
    console.log(`GET REQUEST: fetching list of online users for room ${req.params.roomId}`);
    // filter out users with same roomId as input
    let roomUsers = [];
    for (let i=0; i<onlineUsers.length; i++) {
        if (onlineUsers[i].roomId == req.params.roomId) roomUsers.push(onlineUsers[i]);
    }
    console.table(roomUsers);
    res.send(roomUsers);
}


exports.messages = async (req, res) =>{
    console.log(`POST REQUEST: adding message to DB ${req.body}`);
    messages.addMsgToRoom(req.body.userId, req.body.roomId, req.body.msg);
    res.send({ message:'success' });
}


exports.rooms = async (req, res) =>{
    console.log(`POST REQUEST: adding room to DB ${req.body}`);
    let roomInput = req.body;
    console.log ( 'roominput', roomInput)
    await rooms.addNewRoom(roomInput.room_name)
        .then(result => console.log(`Room: ${roomInput} is added to database!`))
        .catch(error => console.log(error));
    res.send({ message: 'success' });
}

exports.roomsByRoomId = async (req, res) =>{
    const id = req.params.roomId;
    console.log(`DELETE REQUEST: removing room ${id} and all messages from DB `);
    rooms.removeRoom(id)
        .then(result => console.log(`Room: ${id} is deleted from database!`))
        .catch(error => console.log(error));
    messages.removeMsgByRoom(id)
        .then(result => console.log(`All messages in room: ${id} are deleted from database!`))
        .catch(error => console.log(error));
    res.send({ message: 'success' });
}


