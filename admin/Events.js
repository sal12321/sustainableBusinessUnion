// const express = require("express") ;
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");

// const port = 3000;



// // app.set("view engine" , "ejs");
// app.set("views", path.join(__dirname, "views"));



// app.listen(port , (req, res) =>{
//     console.log("server is working");
// })

// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/Events")
// }

// main().then( (res) =>{
//     console.log("connection sucess with db");

// })
// .catch((err) =>{
//     console.log("error in connection with db")
// })



// app.get("/" , (req, res)=>{
//     res.send("root is working")
// })

// app.post("/addEvent", (req, res) =>{
//     console.log("event added");
//     saveEvent();
// })



// const mongoose = require("mongoose") ;


// const eventSchema = new mongoose.Schema({

//     Title :{
//         type :String  
//     },

//     Artist :{
//         type : String    
//     },
//     Date:{
//         type : Date
//     },
//     Location : {
//         type : String
//     }
// })

// // this is my repo
// const eventRepo =  mongoose.model("Event", eventSchema);

// const newEvent = new eventRepo({
//     title : "this is title",
//     Artist : "aaqib",
//     Date : new Date(),
//     Location : "Delhi"


// })

// function saveEvent(){
// newEvent.save()
// .then((res) =>{
//     console.log(res);
// })
// .catch((err) =>{
//     console.log(err);
// })
// }
