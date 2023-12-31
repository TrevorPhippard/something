const orm = require('../db/orm');

class Messages {

    constructor(name){
        this.name =name ;
    }

    async listAll() {
        const result = await orm.selectAll(this.name)
        return result;
    }

    async getRoomMsgs(roomId) {
        const result = await orm.directQuery(
        `SELECT messages.room_id, users.avatar_dirct, users.user_name, messages.message_body 
        FROM messages LEFT JOIN users ON users.id = user_id WHERE room_id = ${roomId};`);
        return result;
    }

    // add message output: { user, channel, msg }
    async addMsgToRoom(userId, roomId, msg) {
        const variableQuery = `(user_id, room_id, message_body)`;
        const dataQuery = `(${userId}, ${roomId}, \'${msg}\')`;
        await orm.insertOne(this.name,variableQuery,dataQuery);
    }

    // delete all messages for 1 room output: { message: 'success' or 'failure' }
    async removeMsgByRoom(roomID) {
        const index = `room_id = ${roomID}`;
        await orm.deleteOne(this.name, index);
    }
};

module.exports =new  Messages('messages');