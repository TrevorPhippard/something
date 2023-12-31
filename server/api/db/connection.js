const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DBSOURCE = './database.sqlite';
const { create_login_info, create_users, create_messages, create_rooms } = require('./scheme');


class Database {
    constructor(config){

            this.db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE, err => {
                if(err) return console.error(err.message)

                console.log('Database: successful connection');
                this.db.run(create_login_info, this.handleError('login_info')); 
                this.db.run(create_users, this.handleError('users')); 
                this.db.run(create_messages, this.handleError('messages')); 
                this.db.run(create_rooms, this.handleError('rooms')); 
            
        })
    }

    handleError(tablename, cb){
      return (err)=>{  
        if (err) {
            // Table already created
            this.db.all(`SELECT * FROM ${tablename}`,[], (err,rows)=>{
                // return err
                //  ? console.error(err.message)
                //  : rows.forEach(row => {console.log(tablename, row)});
            })
        } else{
            console.log(`${tablename} successfully created`)
            if(cb) cb();
        }}
    }
    
    query(sql, args=[]) {
        return new Promise((resolve, reject) => {
            // console.log('database query: ==>',sql, args)
            this.db.all(sql, args, (error, rows) => {
                if (error) {
                    return reject(error);
                } else {
                    // console.log('rows: ==>',rows)
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.end( error => {
                if (error) {
                    return reject(error);
                } else {
                    resolve();
                }
            } );
        } );
    }

    createSampleUsers(){
        // Table just created, creating some rows
        var insert = 'INSERT INTO Users (username, email, password, Salt, DateCreated) VALUES (?,?,?,?,?)'
        this.db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
        this.db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
        this.db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
        this.db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
  
    }
}


const connectDB = (dbName, dbpassword) => {

    // {
    //     host: "localhost",
    //     port: 3306,
    //     user: "root",
    //     password: dbpassword,
    //     database: dbName
    //   }
    const db = new Database()
    return db;
};

module.exports = connectDB;