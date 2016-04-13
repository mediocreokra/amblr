var signin = require('./signin');
var signup = require('./signup');
var User = require('../../models/userModel');

module.exports = function(passport) {
  // serialize / deserialize is used to create login sessions, so that
  // every subsequent request will not contain user credentials
  passport.serializeUser(function(user, done) {
    console.log('Serializing user: ', user);
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(id, done) {
      console.log('Deserializing user: ', user);
      done(err, user);
    });
  });
  
  // signin(passport);
  signup(passport);

};


