var signin = require('./signin');
var signup = require('./signup');
var User = require('../../models/userModel');

module.exports = function(passport) {
  // serialize / deserialize is used to create login sessions, so that
  // every subsequent request will not contain user credentials
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });
  
  signin(passport);
  signup(passport);

};


