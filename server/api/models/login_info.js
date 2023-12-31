const orm = require('../db/orm');

class LoginInfo {

    constructor(name){
        this.name =name ;
    }

    async listAll() {
        const result = await orm.selectAll(this.name);
        return result;
    }

    async matchpassword(username, inputpassword) {
        let target = 'user_password';
        let index = `(user_email = '${username}')`;
        let result = await orm.findOne(this.name, target, index);
        return result[0].user_password === inputpassword;
    }

    async checkExistingusername(newUserEmail) {
        const column = 'user_email';
        const exists = `(user_email = '${newUserEmail}')`;
        const result = await orm.findOne(this.name, column, exists);
        return result[0];
    }

    async addNew(user_name, user_email, user_password) {
        const vars = '(user_name, user_email, user_password)';
        const data = `('${user_name}', '${user_email}', '${user_password}')`;
        await orm.insertOne(this.name, vars, data);
    }

    async matchWithUser(email){
        const column = '*';
        const where = `(user_email = '${email}')`;
        const result = await orm.findOne(this.name, column, where );
        return result[0];
    }

    async getId(email, password) {
        const result = await orm.findOne(this.name, '*', `user_email = \'${email}\' AND user_password = \'${password}\'`);
        if (!result.length) return null;
        else return result[0];
    }

    async getAllUsers() {
        const result = await orm.selectAll(this.name);
        if (result.length) return null;
        else return result[0];
    }
    
    async fetchByTable(data) {
        const result = await orm.selectAll(data);
        if (!result.length) return null;
        else return result;
    }
}




module.exports = new LoginInfo('login_info');