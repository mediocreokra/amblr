var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
require('mongoose-type-email');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true }
});

userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);
