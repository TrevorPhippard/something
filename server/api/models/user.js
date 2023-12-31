const orm = require('../db/orm');

class Users {

    constructor(name){
        this.name =name ;
    }

    async listAll() {
        const result = await orm.selectAll(this.name);
        return result;
    }

    async addNew(loginID, email, username, firstName='', lastName='',  avatarPNG='defaut') {
        const vars = '(login_id, user_email, first_name, last_name, user_name, avatar_dirct)';
        const data = `(${loginID}, '${email}', '${username}', '${firstName}', '${lastName}', '${avatarPNG}')`;
        await orm.insertOne(this.name, vars, data);
    }

    async updateFirstName(loginID, newFirstName) {
        const change = `first_name = '${newFirstName}'`;
        const index = `login_id = ${loginID}`;
        await orm.updateOne(this.name, change, index);
    }

    async updateLastName(loginID, newLastName) {
        const change = `last_name = '${newLastName}'`;
        const index = `login_id = ${loginID}`;
        await orm.updateOne(this.name, change, index);
    }

    async updateusername(loginID, newusername) {
        const change = `user_name = '${newusername}'`;
        const index = `login_id = ${loginID}`;
        await orm.updateOne(this.name, change, index);
    }
};

module.exports = new Users('users');