const express = require("express");
const router = express.Router();

const otpGenerator = require("otp-generator");
const tools = require("otp-without-db");
const secret = "secret_key"

const User= require("../models/Users");
const mongoose = require("mongoose");

async function sendVerificationEmail(req,res){
   try{
      const name= req.body.name;
      const otp= otpGenerator.generate(6,{
         specialChars:false
      });
      const email= req.body.email;
      if(!email||!name){
         res.status(400).json({
            success:false,
            message:"Please provide an E-mail"
         });
      }
      else{
      const hash = tools.createNewOTP(email,otp,secret,expiresAfter=5);
      sendEmail(email,otp,name,req,res,hash);
      }
   }
   catch(err){
      console.log(err);
      res.status(500).json({
         success:false,
         error:err
      })
   }
}

async function verifyNewUser(req,res){
   try{
   const hash= req.body.hash;
   const otp= req.body.otp;
   const email= req.body.email;
   if(!hash||!otp||!email){
      res.status(400).json({
         success:false,
         message:"Please provide all necessary fields"
      })
   }
   else{
      const result= await tools.verifyOTP(email,otp,hash,secret);
      if(result){
         const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email:email,
            emailVerified:true
         }).save();
         res.status(200).json({
            success:true,
            message:"E-mail verified, please provide password"
         });
      }
      else{
         res.status(400).json({
            success:false,
            message:"Incorrect e-mail or password"
         });
      }
   }
   }
   catch(err){
      res.status(500).json({
         success:false,
         error:err
      });
   }
}

async function setPassword(req,res){
   try{
      const password= req.body.password;
      const email= req.body.email;
      if(!email || !password){
         res.status(400).json({
            success:false,
            message:"Please provide E-mail and password"
         });
      }
      else{
      const user = await User.findOne({email:email});
      if(!user){
         res.status(400).json({
            success:false,
            message:"User not found, please Sign-up and verify your email"
         });
      }
      else{
         await user.updateOne({$set:{password:password}});
         res.status(200).json({
            success:true,
            message:"Password updated successfully, please login to access other features"
         });
      }
   }
   }
   catch(err){
      res.status(500).json({
         success:false,
         error:err
      });
   }
}

const nodemailer = require("nodemailer");
let transporter;

async function nodeMailerAccount(){
    var smtpConfig = {
       host: 'smtp.gmail.com',
       port: 465,
       secure: true, // use SSL, 
                     // you can try with TLS, but port is then 587
       auth:{
         user:"",// Your email id
         pass:"" //Your password
       }
     };
     transporter = nodemailer.createTransport(smtpConfig);
    }
    
    nodeMailerAccount();

async function sendEmail(email,otp,name,req,res,hash){
    try{
         console.log(email);
         await transporter.sendMail({
            from:"'CureAssist'<your_email_goes_here>",
            to:email,
            subject:"E-mail verification for CureAssist",
            html:"Hello "+name+", <br> Your email verification code for CureAssist is:"
            + otp+" and is valid for 5 minutes. You can use it to verify your E-mail.<br><br><br> Thank you, <br> Team CureAssist"
         }, (error, info) => {
            if(error) {
               console.log(error);
               res.status(500).json({
                  success:false,
                  message:"OTP not sent",
                  });
            }
            else {   
               console.log("email sent:",info.response);
               res.status(200).json({
                  success:true,
                  message:"OTP sent",
                  hash:hash
                  });
            }
      });
   }
   catch(err) {
      console.log(err);
      return false;
   }
}

router.post("/sendVerificationEmail",sendVerificationEmail);
router.post("/verify", verifyNewUser);
router.post("/setPassword", setPassword);

module.exports= router;