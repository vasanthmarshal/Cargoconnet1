const express=require('express');
const mongoose=require('mongoose');
const dp=require('./connection');
 passport = require("passport"),
bodyParser = require("body-parser"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose")
const app=express();
const path=require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const cors=require('cors');
require('dotenv').config();
const UserDetails=require('./models/UserDetails');
const PostLoad=require('./models/PostLoad');
const Track=require('./models/Track');
const PostTruck=require('./models/PostTruck');
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
app.use(express.json());
const axios = require("axios");
const querystring = require('querystring');
const alert = require('alert-node');
const NodeCache=require('node-cache');
const bcrypt = require('bcrypt');





//creating instance of node cache
const myCache=new NodeCache();

//ADDING TWILIO API
const accountSid = 'ACf1312dd71e801f259015782aba72428c';
const authToken = '657c6671a143e186a0db42a67aae8914';
const client = require('twilio')(accountSid, authToken);


//END TWILLO


//set views's
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

//


//passport
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(UserDetails.authenticate()));
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());
//passport end




// Set up session middleware to use req.session.name
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


//end od session initialization


//using cookies//
app.use(cookieParser());
//







//main page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './views/main.html'));
});
//end of main page



//start of signin route
app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname, './views/signup.html'));
});


function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

//Oce user filles all the information along post request (enteredinfo+otp+otppage is send)
app.post('/send-otp', async (req, res) => {
  const { username, email,phone, password} = req.body;
  try{
  const user=await UserDetails.findOne({ email:email})
    if(user) {
      res.render('alert', { message: `it seems that the email address you've provided (${email}) is already registered with us. If this is your email, please proceed to the login page to access your account.
      If you've forgotten your username or password, you can use the 'Forgot Username' and 'Forgot Password' option on the login page to reset it.`,route:`signup` });
      //alert(`it seems that the email address you've provided (${email}) is already registered with us. If this is your email, please proceed to the login page to access your account.
      //If you've forgotten your password, you can use the 'Forgot Password' option on the login page to reset it.`);
      //res.redirect('/signup');
    }
    else{

  const otp = generateOTP();
  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'vasanthmarshal2020@gmail.com',
      pass:process.env.PASSWORD1
    }
  });

  const option3={
    from:'vasanthmarshal2020@gmail.com',
    to:`${email}`,
    subject:'From Cargo Connect',
    text:`The OTP: ${otp}`
  };

  transporter.sendMail(option3,function(error,info)
        {
          if(error)
          {
            //console.log(error);
            res.render('alert', { message: `please Enter the valid email id during signup`,route:`signup` });
          }
          else{
            console.log('Email sent: ' + info.response);
            res.render('verifysignup', {otp,username, email,phone, password });
          }
        });
    }
  }
  catch(err) 
{
    console.log(err);
    res.render('alert', { message: `Oops! It seems there was an issue with your sign-up. Please double-check your information and try signing up again.`,route:`signup` });
  }
});

//handling form submission 
//once the otp is send all the information is  all the information are proceessed and send
app.post('/verify-otp', async function(req, res) {
    const {otp,username, email,phone, password,enteredotp} = req.body;

try{

  if (otp === enteredotp) 
  {
      const saltRounds=10;
      const salt=await bcrypt.genSalt(saltRounds);
      const hashedpassword=await bcrypt.hash(password,salt);
      const withTimeout = (promise, ms) => {
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Operation timed out'));
          }, ms);
        });
      
        return Promise.race([promise, timeoutPromise]);
      };

      //const user=await withTimeout(UserDetails.findOne({ username:username}),30000);
      const newUser = await withTimeout(new UserDetails({ username:username, email:email,phone:phone,password:hashedpassword }),30000);
      newUser.save() 
      .then(() => {
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.render('alert', { message: `Oops! It seems there was an issue with your sign-up. Please double-check your information and try signing up again.`,route:`signup` });
          //res.send('please Go back and signup again');
        });
  }

  else
  {
    res.render('alert', { message: `The Entered OTP is incorret please go back and signup again`,route:`signup` });
    //alert(`Enter the correct otp send to you email id ${email}`);
    //res.redirect('/signup');
  }

}
catch(err) 
{
    console.log(err);
    res.render('alert', { message: `Oops! It seems there was an issue with your sign-up. Please double-check your information and try signing up again.`,route:`signup` });
  }
});

//end of sign up page



//start of login page
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, './views/login.html'));
});

//handling after login form submitted
app.post('/login',async(req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    try{
      const withTimeout = (promise, ms) => {
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Operation timed out'));
          }, ms);
        });
      
        return Promise.race([promise, timeoutPromise]);
      };
     
     const user=await withTimeout(UserDetails.findOne({ username:username}),30000);
     console.log(user);
     if(user) {
        //const saltRounds=10;
        //const salt=await bcrypt.genSalt(saltRounds);
        //const hashedenteredpassword=await bcrypt.hash(password,salt);
        //console.log(hashedenteredpassword);
        const result = await bcrypt.compare(password,user.password);
        if(result)
        {

        const data = {
          name_1 :user.username,
          email_1:user.email,
          id_1:user._id,
          phone_1:user.phone
        };

        const serializedData = JSON.stringify(data);

        res.cookie('userdata', serializedData);
        console.log('Cookies are set');
         
         const user1=req.cookies.userdata;
         const  data1=JSON.parse(user1);
         res.redirect(`/index/${data1.id_1}`);//after login displaying it along with object id
        //res.redirect('/otpverify');
        }
        else{
          res.render('alert', { message: `Unfortunately, the password you entered doesn't match the one associated with this account. If you've forgotten your password, you can use the 'Forgot Password' option to  reset it.`,route:`login` });
        }
      }
      else
      {
        res.render('alert', { message: `We couldn't find a username associated with the information you provided. If you've forgotten your username, please make use of the 'Forgot Username' option to retrieve it.`,route:`login` });
      }
    }
      catch(err) {
        console.log(err);
        res.render('alert', { message: `Oops! It seems there was an issue with your login. Please double-check your information and try login again.`,route:`login` });

      }
});




//used to send otp tp regitered mail and forgot username form link
app.get("/forgotusername",async(req,res)=>
{
  res.render("forgotusername");
});


//used to send username to registerd email
app.post("/forgotusername",async(req,res)=>{
    const {email}=req.body;
    const user=await UserDetails.findOne({ email:email});
      if(user)
      {
        const transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'vasanthmarshal2020@gmail.com',
            pass:process.env.PASSWORD1
          }
        });

        const option3={
          from:'vasanthmarshal2020@gmail.com',
          to:`${email}`,
          subject:'From CargoConnect',
          text:`The username for the registered email address is ${user.username}. If you need further assistance, feel free to reach out.`
        };
    
        transporter.sendMail(option3,function(error,info)
        {
          if(error)
          {
            console.log(error);
          }
          else{
            console.log('mail.send',info);
          }
        })
        res.render('alert', { message: `We've sent your username to the email address you registered with. Please check your inbox`,route:`login` });
      }
      else{
        res.render('alert', { message: `The email address entered is not yet registered. Please provide a valid and registered email address to proceed.`,route:`forgotusername` });
      }


    });
    

    //display the forgot password username page
    app.get("/forgotpasswordotp",(req, res) => {
           res.render("forgotpasswordotp"); 
      }
      );
      
      //sending otp and moving route to forgototp/get once done
      //justing moving the route route will decide what wan to do
      app.post("/forgotpasswordotp",async(req, res) =>
      {
        const {username}=req.body;
        let password = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999
        const pw=password.toString(); 
        //
        const value={otp:pw};
        myCache.set("pw_1",JSON.stringify(value));
        const data=JSON.parse(myCache.get("pw_1"));
        //console.log(data.otp);
        //
        /*const passwordCache = {
          pw_1:pw
        };
        const updatedData = JSON.stringify(passwordCache);
        res.cookie('passwordCache1', updatedData);
         console.log('cookies have added succesfuuly');*/
      const user=await UserDetails.findOne({username:username});
      if(user)
      {
        const transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'vasanthmarshal2020@gmail.com',
            pass:process.env.PASSWORD1
          }
        });

        const option3={
          from:'vasanthmarshal2020@gmail.com',
          to:`${user.email}`,
          subject:'From CargoConnect',
          text:`the OTP: ${pw}`
        };
    
        transporter.sendMail(option3,function(error,info)
        {
          if(error)
          {
            console.log(error);
          }

          else{
            console.log('mail send',info);
          }
        })
        res.render('alert', { message: `The OTP has been sent to the email address associated with this username. Please check your inbox for the verification code.`,route:`forgotpassword` });
      }
      else{
        res.render('alert', { message: `Please enter the correct username to proceed`,route:`forgotpasswordotp` });
      }

      });



//used to send otp to registered mail along with fotgot password form page
app.get("/forgotpassword",async(req,res)=>
{
   res.render("forgotpassword");
});



//Used to erify the password and otp and Update in the server
app.post("/forgotpassword",async(req,res)=>
{
  const {username,newPassword,confirmPassword,otp}=req.body;
  /*const user=req.cookies.passwordCache1;
  const  data=JSON.parse(user);*/
  const data=JSON.parse(myCache.get("pw_1"));
  if(otp==data.otp)
  {
    if(newPassword!=confirmPassword)
    {
      res.render('alert', { message: `The new password and confirmed password do not match. Please ensure both passwords are the same before proceeding.`,route:`forgotpassword` });
    }
    else
    {
      const user1=await UserDetails.findOne({ username:username});
      if(!user1)
      {
        res.render('alert', { message: `Please enter the correct username to proceed`,route:`forgotpassword` });
      }
      else
      {
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(newPassword,salt);
      user1.password=hashedPassword;
      await user1.save();
      res.redirect("./login");
      }

    }
  }
  else
  {
    res.render('alert', { message: `Please enter the correct OTP that was sent to your registered email address.`,route:`forgotpassword` });
  }
});



//end of otp verification




app.get('/index/:id',(req, res) => {
      //getting data from express session
      //const name=req.session.name;
      //const id=req.session.id;
      //console.log(id);
      //console.log(name);
      //end of the page
      const user=req.cookies.userdata;
      const  data=JSON.parse(user);
      res.render('index', { username:data.name_1,id:data.id_1});  
  });



  //making a conatus post request to send to email
  app.post('/contactus',async(req,res,next)=>
  {

    const transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'vasanthmarshal2020@gmail.com',
        pass:process.env.PASSWORD1
      }
    });

    const option1={
      from:'vasanthmarshal2020@gmail.com',
      to:`${req.body.email}`,
      subject:'From CargoConnect',
      text:'We received your request. Our team will contact you soon.'
    };

    transporter.sendMail(option1,function(error,info)
    {
      if(error)
      {
        console.log(error);
      }
      else{
        console.log('mail.send',info);
      }
    })

    const option2={
      from:'vasanthmarshal2020@gmail.com',
      to:`vasathmarshal2020@gmail.com`,
      subject:'From SMT Transport Manapparai',
      text:`the first name of the customer is ${req.body.fname}
      the last name of the customer is ${req.body.lastname}
      the customer email is ${req.body.email}
      the customer's description: ${req.body.subject}
      the customer's phone number: ${req.body.phone}`
    };

    transporter.sendMail(option2,function(error,info)
    {
      if(error)
      {
        console.log(error);
      }
      else{
        console.log('mail.send',info);
      }
    })
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);

    res.redirect(`/index/${data.id_1}`);

  });



  //end------------------



  //starting of posting a load route
  app.get("/postload",(req,res)=>{
    //const id=req.session.id;
    //console.log(id);
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    res.render('postload',{id:data.id_1});
  });

  app.post('/postload',(req,res)=>{

    //const id=req.session.id;
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    const {fromloc,toloc,loadtype,quantity,price,description,phone}=req.body;
    console.log(fromloc+toloc+loadtype+quantity+price+description+phone);
    const newload= new PostLoad({fromlocation:fromloc,tolocation:toloc,loadtype:loadtype,quantity:quantity,price:price,description:description,phone:phone});
    newload.save() 
    .then(() => {
        res.redirect(`/index/${data.id_1}`);
      })
      .catch((err) => {
        console.log(err);
        res.render('alert', { message: `Oops! It seems there was an issue with your posting your load. Please double-check your information and try posting the load again.`,route:`poatload` });
      });
  });

  //end of posting a load route

  //starting of posting a truckroute
  app.get("/posttruck",(req,res)=>{
    //const id=req.session.id;
    //console.log(id);
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    res.render('posttruck',{id:data.id_1});
  });

  app.post('/posttruck',(req,res)=>{
   

    //const id=req.session.id;
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    const {curloc,toloc,vehnumber,phone,vehtype,capacity}=req.body;
    console.log(curloc+toloc+vehnumber+phone+vehtype+capacity);
    const newtruck= new PostTruck({currentlocation:curloc,tolocation:toloc,vehiclenumber:vehnumber,phone:phone,vehicletype:vehtype,capacity:capacity});
    newtruck.save() 
    .then(() => {
        res.redirect(`/index/${data.id_1}`);
      })
      .catch((err) => {
        console.log(err);
        res.render('alert', { message: `Oops! It seems there was an issue with your posting your truck. Please double-check your information and try posting the Truck again.`,route:`poattruck` });
      });
  });

  //end of posting a truck route


  //starting of bboking a load
  app.get("/bookload",async(req,res)=>{
    try{
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const loads = await PostLoad.find({ createdAt: { $gte: sevenDaysAgo } });
    const user=req.cookies.userdata;
    const data=JSON.parse(user);
    res.render('bookload',{id:data.id_1,loads:loads});
    }
    catch (err) {
      console.log(err);
        const user=req.cookies.userdata;
        const  data=JSON.parse(user);
        res.render('alert', { message: `Oops! It seems there was an issue with fetching the data. Please Go back and try again`,route:`index/${data.id_1}` });  
    }
  });




  //starting of filtering loading
  app.post("/filterload",async(req,res)=>{

    const {fromlocation,tolocation}=req.body;
    var loads;
    try{

    if(fromlocation!=""&&tolocation=="")
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      loads = await PostLoad.find({ fromlocation:fromlocation,createdAt: { $gte: sevenDaysAgo } });
    }

    else if(fromlocation==""&&tolocation!="")
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      loads = await PostLoad.find({ tolocation:tolocation,createdAt: { $gte: sevenDaysAgo } });
  
    }
    else if(fromlocation==""&&tolocation=="")
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      loads = await PostLoad.find({createdAt: { $gte: sevenDaysAgo } });

    }

    else
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      loads = await PostLoad.find({fromlocation:fromlocation,tolocation:tolocation,createdAt: { $gte: sevenDaysAgo } });
    }
    
    res.render('bookload',{loads:loads});
  }
  catch(err)
  {
    console.log(err);
        const user=req.cookies.userdata;
        const  data=JSON.parse(user);
        res.render('alert', { message: `Oops! It seems there was an issue with fetching the data. Please Go back and try again`,route:`index/${data.id_1}` });
  }
  });


  //end of filtering loading


  //end of booking truck route





  //starting of bboking a truckroute
app.get("/booktruck",async(req,res)=>{
    //const id=req.session.id;
    try{
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const trucks = await PostTruck.find({ createdAt: { $gte: sevenDaysAgo } });
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    res.render('booktruck',{id:data.id_1,trucks:trucks});
    }
    catch (err) {
        console.log(err);
        const user=req.cookies.userdata;
        const  data=JSON.parse(user);
        res.render('alert', { message: `Oops! It seems there was an issue with fetching the data. Please Go back and try again`,route:`index/${data.id_1}` });
    }
  });



  //sending details based on choose by form and to location
  app.post("/filtertruck",async(req,res)=>{
    const {fromlocation,tolocation}=req.body;
    console.log(fromlocation);
    console.log(tolocation+"  hello");
    var trucks;
    try{
    if(fromlocation!=""&&tolocation=="")
    {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        trucks = await PostTruck.find({
        currentlocation:fromlocation,
        createdAt: { $gte: sevenDaysAgo }
      });
    }
    else if(fromlocation==""&&tolocation!="")
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
       trucks = await PostTruck.find({
      tolocation:tolocation,
        createdAt: { $gte: sevenDaysAgo }
      });

       //var trucks=await PostTruck.find({tolocation:tolocation});
    }
    else if(fromlocation==""&&tolocation=="")
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      trucks = await PostTruck.find({ createdAt: { $gte: sevenDaysAgo } });
    }
    else
    {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      trucks = await PostTruck.find({
        currentlocation:fromlocation,
        tolocation:tolocation,
        createdAt: { $gte: sevenDaysAgo }
      });
    }
    res.render('booktruck',{trucks:trucks});
  }
  catch(err)
  {
    console.log(err);
        const user=req.cookies.userdata;
        const  data=JSON.parse(user);
        res.render('alert', { message: `Oops! It seems there was an issue with fetching the data. Please Go back and try again`,route:`index/${data.id_1}` });
  }
  });


  // end sending details based on choose by form and to location


  //end of booking truck route

  //start of connecting end to end customers
  app.get('/contact/:phone', (req, res) => {
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);

    const phoneNumber =`${req.params.phone}`; // Replace with your phone number
    const message = `Hello this is  ${data.name_1}`; // Replace with your message
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    res.redirect(url);

  });


  //end of connecting end to end customers


 //start of handling whatsup message 
 //code is working perfectly

  app.all('/whatsup', (req, res) => {
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    const phoneNumber = '7397106325'; // Replace with your phone number
    const message = `Hello this is ${data.name_1}`; // Replace with your message
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    res.redirect(url);
  });

  //end of handling whatsup message
  
  



  //end of handling whatsup message


  



  


app.get('/booking', function(req, res) {
  const user=req.cookies.userdata;
  const  data=JSON.parse(user);
   res.render('booking',{id:data.id_1});
  });



app.post('/bookloadsmt/:id',async(req,res) => {

  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'vasanthmarshal2020@gmail.com',
      pass:process.env.PASSWORD1
    }
  });
  //console(req.body)

  const option4={
    from:'vasanthmarshal2020@gmail.com',
    to:`${req.body.email}`,
    subject:'From Cargo Connect',
    text:`We have received your request for booking a vehicle. Here are the details you provided:

    Customer Information:
    - First Name: ${req.body.firstname}
    - Last Name: ${req.body.lastname}
    - Email: ${req.body.email}
    - Phone Number: ${req.body.phone}
    
    Booking Details:
    - From Location: ${req.body.fromlocation}
    - To Location: ${req.body.tolocation}
    - Capacity Needed: ${req.body.capacity}
    - Vehicle Company Preference: ${req.body.company}
    - Vehicle Type Needed: ${req.body.type}
    - Vehicle Length Needed: ${req.body.length}
    
    Additional Information:
    - Customer's Description: ${req.body.subject}
    
    Our team will review your request and get back to you soon. Thank you for choosing our services.`
  };

  transporter.sendMail(option4,function(error,info)
  {
    if(error)
    {
      console.log(error);
    }
    else{
      console.log('mail.send',info);
    }
  })

  const option5={
    from:'vasanthmarshal2020@gmail.com',
    to:`vasathmarshal2020@gmail.com`,
    subject:'From Cargo Connect',
    text:`We have received your request for booking a vehicle. Here are the details you provided:

    Customer Information:
    - First Name: ${req.body.firstname}
    - Last Name: ${req.body.lastname}
    - Email: ${req.body.email}
    - Phone Number: ${req.body.phone}
    
    Booking Details:
    - From Location: ${req.body.fromlocation}
    - To Location: ${req.body.tolocation}
    - Capacity Needed: ${req.body.capacity}
    - Vehicle Company Preference: ${req.body.company}
    - Vehicle Type Needed: ${req.body.type}
    - Vehicle Length Needed: ${req.body.length}
    
    Additional Information:
    - Customer's Description: ${req.body.subject}
    
    Our team will review your request and get back to you soon. Thank you for choosing our services.`
  };

  transporter.sendMail(option5,function(error,info)
  {
    if(error)
    {
      console.log(error);
    }
    else{
      console.log('mail.send',info);
    }
  })

  


    res.redirect(`/index/${req.params.id}`)
         
}
);

//checking whether

app.post('/getweather',(req,res)=>
{
  const apiKey = '37703db95dec06430e8d026a901a26a5';
  const {location}=req.body;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
axios.get(apiUrl)
  .then(response => {
    console.log(response.data);
    res.render('weather',{weather:response.data,location:location});
  })
  .catch((error) => {
    console.log(error);
        const user=req.cookies.userdata;
        const  data=JSON.parse(user);
        res.render('alert', { message: `please enter a valid city name`,route:`index/${data.id_1}` });
  });


});


//end of checking weather


//getting and display fuel price API
app.get('/getfuelprice',async(req, res) => {
  const options = {
    method: 'GET',
    url: 'https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/list/india/states',
    params: {
      isoDate: '2022-09-01',
      'fuelTypes[0]': 'petrol'
    },
    headers: {
      'X-RapidAPI-Key': '56039ed7fcmshfb3e635008eb9f2p144630jsn292ffbb1d736',
      'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.render('fuelstates',{states:response.data.states});
  } catch (error) {
    console.error(error);
  }
 
});
//en dof fuel price API

//get fuel price by state

app.get('/getfuelprice/:stateId',async(req,res) =>
{
  const options = {
    method: 'GET',
    url: `https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/list/india/${req.params.stateId}/cities`,
    params: {
      isoDate: '2022-09-01',
      'fuelTypes[0]': 'petrol'
    },
    headers: {
      'X-RapidAPI-Key': '56039ed7fcmshfb3e635008eb9f2p144630jsn292ffbb1d736',
      'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.render('fuelcities',{cities:response.data.cities,state:req.params.stateId});
  } catch (error) {
    res.redirect('/getfuelprice');
  }

});

app.get('/getfuelprice/:stateId/:cityId',async(req,res)=>{

  const options = {
    method: 'GET',
    url: `https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/${req.params.stateId}/${req.params.cityId}`,
    headers: {
      'X-RapidAPI-Key': '56039ed7fcmshfb3e635008eb9f2p144630jsn292ffbb1d736',
      'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    //res.send(response.data);
    res.render('fuelprice',{data:response.data});
  } catch (error) {
    res.redirect('/getfuelprice');
  }

});
//end of get fuel price by city


//allowing admin to ente the truck link

app.get('/enterlink',(req,res)=>
{
  res.render('enterlink');
});
app.post('/enterlink',async(req,res)=>
{
    //const id=req.session.id;
    const user=req.cookies.userdata;
    const  data=JSON.parse(user);
    const {loadid,tracklink}=req.body;
    const newtrack= await new Track({loadid,tracklink});
    newtrack.save() 
    .then(() => {
        res.redirect(`/index/data.id_1`);
      })
      .catch((err) => {
        console.log(err);
        res.send('Error saving data');
      });
});

//send the link through wgatsup if corresct customer id

app.post('/sendtracklink',async(req, res) => {
  const user=req.cookies.userdata;
  const  data=JSON.parse(user);
  var {loadid,phone}=req.body;
  try{
    const user=await Track.findOne({ loadid:loadid});
    console.log(user);
    if(user) {

     
    

      const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'vasanthmarshal2020@gmail.com',
          pass:process.env.PASSWORD1
        }
      });
  
      const option1={
        from:'vasanthmarshal2020@gmail.com',
        to:`${data.email_1}`,
        subject:`From SMT Transport Manapparai `,
        text:`your traking link ${user.tracklink}`
      };
  
      transporter.sendMail(option1,function(error,info)
      {
        if(error)
        {
          console.log(error);
        }
        else{
          res.redirect(`/index/${data.id_1}`)
        }
      })

    
     }
     else
     {
       res.send("error");
     }
   }
     catch(err) {
      res.send(error);
     }
})


//working on logout functionalities

app.get('/logout', (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect the user to the login page
    res.redirect('/login'); // Change to your login page URL
  });
});

/*app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log("this is from cargo connect");
  
});*/

dp.then(() => {
  // Database connection is established, start the Express server
  app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
    console.log("this is from cargo connect");
  });
});




