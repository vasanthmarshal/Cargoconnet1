const mongoose = require('mongoose');

require('dotenv').config();

const uri = `mongodb+srv://vasanthmarshal2020:${process.env.PASSWORD}@smtvasanth1.a2xrmit.mongodb.net/?retryWrites=true&w=majority`;

const connection=mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Add this line for timeout
})
  .then(() => {
    console.log('Connected to MongoDB');
    return mongoose.connection.db.command({ ping: 1 });
  })
  .then(() => {
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  })
  /*.finally(() => {
    mongoose.connection.close();
  });*/

  module.exports=connection;
