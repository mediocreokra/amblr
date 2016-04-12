var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
require('mongoose-type-email');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true }
});

userSchema.plugin(timestamps);
mongoose.model('User', userSchema);

var User = mongoose.model('User', userSchema);

