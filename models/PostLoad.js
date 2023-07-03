const mongoose = require('mongoose');
const postload = new mongoose.Schema({
  fromlocation: { type: String, required: true },
  tolocation: { type: String, required: true },
  loadtype: { type: String, required: true },
  quantity: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true }
  
});

//PostLoad.plugin(passportLocalMongoose);

module.exports = mongoose.model('PostLoad',postload);
