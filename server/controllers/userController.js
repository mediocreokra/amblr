var expressSession = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = require('../models/userModel.js');
var app = require('../server.js');

// configuring Passport
app.use(cookieParser());
// store and show messages to user that were created in config/passport/signin.js and signup.js
app.use(flash());
app.use(expressSession({secret: 'supersecretpizzapartypassthecheese'}));
app.use(passport.initialize());
app.use(passport.session());

// initialize Passport
var initPassport = require('../config/passport/init');
initPassport(passport);

var isAuthenticated = function(req, res, next) {
  
  // if user is authenticated, move on to next request handler
  if (req.isAuthenticated()) {
    return next();
    // if the user is not authenticated, redirect to login
  }
  res.redirect('/');
};

// handles POST request from signin form
exports.signinUser = function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/', // need to adjust these paths to actual route
    failureRedirect: '/',
    failureFlash: true
  });
};

// handles POST request from signup form
exports.signupUser = function(req, res, next) {
  console.log('in userController');
  passport.authenticate('signup', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, function(err) {

      if (err) {
        logger.info(err);
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
  
  
};

// handle logout
exports.signoutUser = function(req, res) {
  req.logout();
  res.redirect('/'); // need to adjust these paths to actual route
};

