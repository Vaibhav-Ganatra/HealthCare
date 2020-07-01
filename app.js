//Creating App
const express= require("express");
const app= express();

//Creating Server
const http= require("http");
const server= http.createServer(app);

//Applying MiddleWare
const morgan= require("morgan");
app.use(morgan("dev"));
const bodyParser= require("body-parser");
app.use(bodyParser.json());

//Connecting to MongoDB
const mongoose= require("mongoose");
mongoose.connect("mongodb://localhost:27017/HealthCare",{
   useNewUrlParser:true,
   useUnifiedTopology:true,
   useCreateIndex:true
},(err) =>{
   if(err)
      console.log(err);
   else
      console.log("Connected to Mongo Server");
})

//Applying Routes
const signUp= require("./routes/SignUp");
app.use("/signUp",signUp);
const login= require("./routes/Login");
app.use("/login",login);
const response = require("./routes/Response");
app.use("/response",response);

//Listening on port-3000
server.listen(3000,(err) =>{
   if(err) 
      console.log(err);
   else
      console.log("Server running")
})