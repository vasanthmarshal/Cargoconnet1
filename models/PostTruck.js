const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const postTruck = new mongoose.Schema({
  userid:{type:String,required:true},
  currentlocation: { type: String, required: true },
  tolocation: { type: String, required: true },
  vehiclenumber: { type: String, required: true },
  phone: { type: String, required: true },
  vehicletype: { type: String, required: true },
  capacity: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now  // Set the default value to the current timestamp
  },
  photo:{ data: Buffer, contentType: String }
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
