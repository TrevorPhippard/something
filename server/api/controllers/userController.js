'use strict';

// const fs = require('fs');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const login_info = require('../models/login_info');
const user = require('../models/user');
const salt = process.env.SALT
//bcrypt.genSaltSync(10);

function createUserToken(user,email ){
    const token = jwt.sign(
        {   user_id: user.Id, 
            username: user.username, 
            email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return token
}

/** ------------------------------------------------------------------------ */

exports.register = async (req, res) =>{
    console.log('req::',req.body)
    const {username, email, password } = req.body;
    const result = await login_info.checkExistingusername(email)

    if( !result ){
        const Pass =  bcrypt.hashSync(password, salt);

        console.log('req:login:',Pass)

        // console.log(`POST REQUEST: Adding [NEW USER]: username: ${username}, email: ${email}, password: ${Pass}`);
        await login_info.addNew(username, email, Pass);
        const loginID = await login_info.matchWithUser(email); // find id # of table login_id
        await user.addNew(loginID.id, email, username);
        const Token = createUserToken(email, Pass);
        
        res.status(202).send( {code: 202, message:'Registration successful', token:Token} );
    }else {
        res.status(404).send( {code: 404, message: 'username is already taken...'})
    };
}

exports.login = async (req, res) =>{
    const {email, password } = req.body
    const Pass = bcrypt.hashSync(password, salt);
    const loginID = await login_info.getId(email, Pass);
    const Token = createUserToken(email, Pass);

    if (loginID) res.send({ code: 202, user_name: loginID.user_name, token:Token });
    else res.send({ code: 404 });
}

exports.getUsers = async (req, res) =>{
    const users = await login_info.getAllUsers();
    if (users) res.send(users);
    else res.send({ code: 404 });
}

exports.fetchTableData = async (req, res) =>{
    /** login_info  users  messages  rooms */
    const data = await login_info.fetchByTable('login_info');
    if (data) res.send(data);
    else res.send({ code: 404 });
}