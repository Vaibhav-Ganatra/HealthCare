const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req,res,next) => {
   try{
      const token = req.headers.token;
      const result = await jwt.verify(token,"secret_key");
      if(Boolean.valueOf(result)){
         next()
      }
      else{
         res.status(401).json({
            success:false,
            message:"Unauthorized, please login and use a valid token"
         });
      }
   }
   catch(err){
      res.status(500).json({
         success:false,
         error:err
      })
   }
}