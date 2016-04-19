var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/userModel');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  
  // compare password from user input against database
  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  };
  // use the Local Strategy (locally saved username and password, i.e. not OAuth)
  passport.use('signin', new LocalStrategy({
    passReqToCallback: true // allows us to use the request in the following callback
  }, 
    function(req, username, password, done) {
      // run the Mongo query for the user requested
      User.findOne({username: username},
        function(err, user) {
          // if there is a database error, handle it
          if (err) {
            return done(err);
          }
          // if user is not found
          if (!user) {
            // log error and alert user
            var error = 'User query failed with username: ' + username;
            return done(error, false, req.flash('message', 'User not found; please try again.'));
          }
          // if password does not match
          if (!isValidPassword(user, password)) {
            var error = 'Invalid password.';
            return done(error, false, req.flash('message', 'Invalid password; please try again.'));
          }
          // if username and password match, return user
          return done(null, user);
        }
      );
    })
  );
  
};
