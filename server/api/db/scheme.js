// const users = `CREATE TABLE Users (
//     Id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username text, 
//     email text, 
//     password text,             
//     Salt text,    
//     Token text,
//     DateLoggedIn DATE,
//     DateCreated DATE
//     )`

// 
// user_name, user_email, user_password
var create_login_info = `CREATE TABLE login_info (
    id INTEGER AUTO_INCREMENT,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_password VARCHAR(255),
    PRIMARY KEY(id)
  )`;

  var create_users = `CREATE TABLE users (
    id INTEGER AUTO_INCREMENT,
    login_id INTEGER,
    user_email VARCHAR(30),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    user_name VARCHAR(30),
    avatar_dirct VARCHAR(30),
    PRIMARY KEY(id)
  )`;
  
 var create_messages = `CREATE TABLE messages (
    id INTEGER AUTO_INCREMENT,
    user_id VARCHAR(30),
    room_id VARCHAR(30),
    message_body VARCHAR(300),
    PRIMARY KEY(id)
  )`;
  
 var create_rooms = `CREATE TABLE rooms (
    id INTEGER AUTO_INCREMENT,
    room_name VARCHAR(50),
    PRIMARY KEY(id)
  )`;

module.exports = { 
    create_login_info,
    create_users,
    create_messages,
    create_rooms

}