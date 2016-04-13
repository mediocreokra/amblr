var mongoose = require('mongoose');
var User = require('../models/userModel.js');

var isAuthenticated = function(req, res, next) {
  
  // if user is authenticated, move on to next request handler
  if (req.isAuthenticated()) {
    return next();
    // if the user is not authenticated, redirect to login
  }
  res.redirect('/');
};

// handles POST request from signin form
exports.signinUser = function() {
  passport.authenticate('signin', {
    successRedirect: '/', // need to adjust these paths to actual route
    failureRedirect: '/',
    failureFlash: true
  });
};

// handles POST request from signup form
exports.signupUser = function() {
  passport.authenticate('signup', {
    successRedirect: '/', // need to adjust these paths to actual route 
    failureRedirect: '/',
    failureFlash: true
  });
};

// handle logout
exports.signoutUser = function(req, res) {
  req.logout();
  res.redirect('/'); // need to adjust these paths to actual route
};

