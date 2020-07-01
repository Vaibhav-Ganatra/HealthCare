const express = require("express");
const router = express.Router();

const verify = require("./JWTVerification");
const Response = require("../models/Responses");
const User = require("../models/Users");
const ContactDetails = require("../models/ContactDetails");

async function addUserResponse(req,res){
   try{
      const userId= req.body.userId;
      if(!userId){
         res.status(400).json({
            success:false,
            message:"Please provide a userId"
         });
      }
      else{
         const user = await User.findById(userId);
         if(!user){
            res.status(400).json({
               success:false,
               message:"Please provide a valid userId"
            });
         }
         else{
            const newResponse = await new Response({
               user_id:userId,
               contactChances:req.body.contactChances,
               travelHistory:{
                  numberOfPlacesVisited:req.body.travelHistory.numberOfPlacesVisited,
                  placeList:req.body.travelHistory.placeList
               },
               symptoms:{
                  temperature:req.body.symptoms.temperature,
                  breathingRate: req.body.symptoms.breathingRate
               }
            }).save();
            res.status(200).json({
               success:true,
               response:newResponse
            })
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

async function contactDetails(req,res){
   try{
      const userId= req.body.userId;
      if(!userId){
         res.status(400).json({
            success:false,
            message:"Please provide a userId"
         });
      }
      else{
         const user = await User.findById(userId);
         if(!user){
            res.status(400).json({
               success:false,
               message:"Please provide a valid userId"
            });
         }
         else{
            const details = await new ContactDetails({
               user_id:userId,
               phoneNumber:req.body.phoneNumber,
               address:req.body.address,
               city:req.body.city,
               state:req.body.state
            }).save();
            res.status(200).json({
               success:true,
               details:details
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

router.post("/add",verify.verifyToken,addUserResponse);
router.post("/contactDetails",verify.verifyToken,contactDetails);

module.exports = router; 