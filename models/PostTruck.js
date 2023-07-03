const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const postTruck = new mongoose.Schema({
  currentlocation: { type: String, required: true },
  tolocation: { type: String, required: true },
  vehiclenumber: { type: String, required: true },
  phone: { type: String, required: true },
  vehicletype: { type: String, required: true },
  capacity: { type: String, required: true }
});

//PostLoad.plugin(passportLocalMongoose);

module.exports = mongoose.model('PostTruck',postTruck);

/*
 currentlocation
 tolocation
vehiclenumber
phone
vehicletype
capacity
*/