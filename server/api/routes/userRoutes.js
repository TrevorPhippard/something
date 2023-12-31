'use strict';

module.exports = function (app) {
  const userHandlers = require('../controllers/userController.js');
  
  /** delete for production */
  app.route('/auth/checktable').get(userHandlers.fetchTableData);
  app.route('/auth/signup').post(userHandlers.register);
  app.route('/auth/signin').post(userHandlers.login);
  app.route('/auth/users').get(userHandlers.getUsers);
};