var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

//create user schema


var userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.plugin(timestamps);
mongoose.model('User', userSchema);

var User = mongoose.model('User', userSchema);


