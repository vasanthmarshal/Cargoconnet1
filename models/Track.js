const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const Track = new mongoose.Schema({
  loadid: { type: String, required: true,unique: true },
  tracklink: { type: String, required: true}
});


//Track.plugin(passportLocalMongoose);

module.exports = mongoose.model('Track',Track);