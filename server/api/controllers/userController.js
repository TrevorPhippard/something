'use strict';
var db = require('../../db');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


 exports.getAllUsers = (req, res, next) => {

  var sql = "SELECT * FROM Users"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
};


//* GET SINGLE USER

exports.getSingleUser =  (req, res, next) => {
  var sql = "SELECT * FROM Users WHERE Id = ?"
  
  db.all(sql, req.params.id, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
};


// * REGISTER NEW USER

exports.registerNewUser = async (req, res) => {
  var errors=[]
  try {
      const { Username, Email, Password } = req.body;

      if (!Username){
          errors.push("Username is missing");
      }
      if (!Email){
          errors.push("Email is missing");
      }
      if (errors.length){
          res.status(400).json({"error":errors.join(",")});
          return;
      }
      let userExists = false;
      
      
      var sql = "SELECT * FROM Users WHERE Email = ?"        
      await db.all(sql, Email, (err, result) => {
          if (err) {
              res.status(402).json({"error":err.message});
              return;
          }
          
          if(result.length === 0) {                
              
              var salt = bcrypt.genSaltSync(10);

              var data = {
                  Username: Username,
                  Email: Email,
                  Password: bcrypt.hashSync(Password, salt),
                  Salt: salt,
                  DateCreated: Date('now')
              }
      
              var sql ='INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
              var params =[data.Username, data.Email, data.Password, data.Salt, Date('now')]
              var user = db.run(sql, params, function (err, innerResult) {
                  if (err){
                      res.status(400).json({"error": err.message})
                      return;
                  }
                
              });           
          }            
          else {
              userExists = true;
              // res.status(404).send("User Already Exist. Please Login");  
          }
      });

      setTimeout(() => {
          if(!userExists) {
              res.status(201).json("Success");    
          } else {
              res.status(201).json("Record already exists. Please login");    
          }            
      }, 500);


  } catch (err) {
    console.log(err);
  }
}


// * LOGIN

exports.login =  async (req, res) => {

try {      

  const { Email, Password } = req.body;
      // Make sure there is an Email and Password in the request
      if (!(Email && Password)) {
         return  res.status(400).send("All input is required");
      }
          
      let user = [];
      var sql = `SELECT * FROM Users WHERE Email = ?`;

      db.all(sql, Email, function(err, rows) {
          if (err){
              return res.status(400).json({"error": err.message});
          }else{
          rows.forEach(function (row) { user.push(row) })
          
          var PHash = bcrypt.hashSync(Password, user[0].Salt);
     
          if(PHash === user[0].Password) {
              // * CREATE JWT TOKEN
              const token = jwt.sign(
                  { user_id: user[0].Id, username: user[0].Username, Email },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "1d", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                  }  
              );

              user[0].Token = token;
              return res.status(200).send(user);                
          } else {
              return res.status(400).send("No Match");          
          }
        
        }
    });	
  } catch (err) {
    console.log(err);
  }    
};
