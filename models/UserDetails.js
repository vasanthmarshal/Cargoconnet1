const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const UserDetails = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: {type: String,required: true},
  password: { type: String, required: true }
});

UserDetails.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserDetails',UserDetails);
