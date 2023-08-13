const mongoose=require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery',false);

const connectionParams={
    useNewUrlParser: true,
  connectTimeoutMS: 30000,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000, 

};
const uri=`mongodb+srv://vasanthmarshal2020:${process.env.PASSWORD}@smtvasanth1.a2xrmit.mongodb.net/?retryWrites=true&w=majority`;

const connection=mongoose.connect(uri,connectionParams)
.then(()=>console.log('database connected to cloud atlas'))
.catch((err)=>console.log(err));


module.exports=connection;
