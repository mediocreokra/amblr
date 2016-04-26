var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/userModel');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  
  // Generate the hashed password
  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
  
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
    function(req, username, password, done) {
      findOrCreateUser = function() {
        // run the Mongo query for provided username
        User.findOne({username: username}, function(err, user) {
          // if there is a database error, handle it
          if (err) {
            return done(err);
          }
          // if the user already exists
          if (user) {
            var error = 'User already exists with username: ' + username;
            return done(error, false, req.flash('message', 'Username already exists'));
          } else {
            // if there is no user with that username, create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = req.param('email');
            // save the user
            newUser.save(function(err) {
              if (err) {
                console.log('Error when saving user: ', err);
                return done(err);
              }
              console.log('User signup successful');
              return done(null, newUser);
            });
          }
        });
      };
      // Delay the execution of findOrCreate user and execute the method
      // in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    })
  );
};
