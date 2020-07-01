const express = require("express");
const router = express.Router();

const User = require("../models/Users");
const jwt= require("jsonwebtoken");

async function login(req,res){
   try{
      const email =req.body.email;
      const password =req.body.password;
      if(!email||!password)
         res.status(400).json({
            success:false,
            message:"Please provide E-mail and password"
         });
      else{
         const user = await User.findOne({email:email, password:password});
         if(!user)
            res.status(400).json({
               success:false,
               message:"Incorrect E-mail or password"
            });
         else{
            const token= await jwt.sign({email:email},"secret_key",{expiresIn: 60*60*24*7});
            res.status(200).json({
               success:true,
               user:{
                  _id:user._id,
                  email:user.email,
                  token:token
               }
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


router.post("/user",login);
module.exports=router;