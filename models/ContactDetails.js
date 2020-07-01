const mongoose = require("mongoose");
const ContactSchema = mongoose.Schema({
   user_id:{
      type:mongoose.Types.ObjectId,
      required:true
   },
   phoneNumber:{
      type:String,
      required:true
   },
   address:{
      type:String,
      required:true
   },
   city:{
      type:String,
      required:true
   },
   state:{
      type:String,
      required:true
   }
});

module.exports = mongoose.model("ContactDetail", ContactSchema,"ContactDetails");