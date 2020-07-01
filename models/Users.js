const mongoose = require("mongoose");
const UserSchema= mongoose.Schema({
   name:String,
   email:{
      type:String,
      required:true,
      unique:true
   },
   password:{
      type:String,
   },
   emailVerified:{
      type:Boolean,
      required:true
   }
});

module.exports= mongoose.model("User",UserSchema,"Users");