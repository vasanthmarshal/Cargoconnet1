const mongoose = require('mongoose');
const postload = new mongoose.Schema({
  userid:{type: String, required: true},
  fromlocation: { type: String, required: true },
  tolocation: { type: String, required: true },
  loadtype: { type: String, required: true },
  quantity: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now  // Set the default value to the current timestamp
  },
  photo: { data: Buffer, contentType: String }
});

//PostLoad.plugin(passportLocalMongoose);

module.exports = mongoose.model('PostLoad',postload);
