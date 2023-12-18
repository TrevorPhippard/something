const sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');

const DBSOURCE = './usersdb.sqlite';
const db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE, err => {
    if(err) return console.error(err.message)
    console.log('Database: successful connection')

    var salt = bcrypt.genSaltSync(10);
        
    db.run(`CREATE TABLE Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Username text, 
        Email text, 
        Password text,             
        Salt text,    
        Token text,
        DateLoggedIn DATE,
        DateCreated DATE
        )`, (err) => {
        if (err) {
            // Table already created
        //     db.all(`SELECT * FROM users`,[], (err,rows)=>{
        //       if(err) return console.error(err.message)
        //       rows.forEach(row => {
        //               console.log(row)
        //       });
        //   })
        } else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
            db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
            db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
            db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
            db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
        }
    });  
})

// db.close((err)=>{
//     if(err) return console.error(err.message)
// })




module.exports = db