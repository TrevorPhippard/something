'use strict';

module.exports = function (app) {
  const userHandlers = require('../controllers/userController.js');
  
  //  Routes
  app.route('/api/users').get(userHandlers.getAllUsers);
  app.route("/api/user/:id").get(userHandlers.getSingleUser);
  app.route("/auth/signin").post(userHandlers.login);
  app.route("/auth/signup").post(userHandlers.registerNewUser);
};