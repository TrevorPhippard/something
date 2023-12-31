const orm = require('../db/orm');

class Room {

    constructor(name){
        this.name =name ;
    }

     async listAll() {
        const result = await orm.selectAll(this.name)
        return result;
    }

     async addNewRoom(roomInput) {
        const varName = '(room_name)';
        const data = `('${roomInput}')`;
        await orm.insertOne(this.name, varName, data);
    }

     async removeRoom(roomID) {
        const index = `id = ${roomID}`;
        await orm.deleteOne(this.name, index);
    }
};

module.exports = new Room('rooms');