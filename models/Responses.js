const mongoose = require("mongoose");

const travelHistory = mongoose.Schema({
   _id:false,
   numberOfPlacesVisited:{
      type:Number,
      required:true
   },
   placeList:Array
});

const symptoms =mongoose.Schema({
   _id:false,
   temperature:{
      type:Number,
      required:true
   },
   breathingRate:{
      type:Number,
      required:true
   }
})

const ResponseSchema = mongoose.Schema({
   user_id:{
      type:mongoose.Types.ObjectId,
      required:true
   },
   travelHistory:travelHistory,
   symptoms:symptoms,
   contactChances:{
      type:Number,
      required:true
   }
},{
   timestamps:true
});

module.exports= mongoose.model("Response",ResponseSchema,"Responses");