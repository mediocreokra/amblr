var userRouter = require('express').Router();
var userController = require('../controllers/userController.js');

// Declare all routes for users and specify what controller method we're going to use for each

// the path '/api/users' is already prepended to all routes based on app.use statement in server.js
userRouter.route('/signup').post(userController.signupUser);
userRouter.route('/signin').post(userController.signinUser);
userRouter.route('/signout').get(userController.signoutUser);

module.exports = userRouter;
