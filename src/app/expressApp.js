const express = require("express");
const app = express();
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("admin"));
app.use(express.urlencoded({ extended: true })); 

app.set("views", path.join(__dirname, "views"));



// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/udpateColors")
// }

// main().then( (res) =>{
//     console.log("connection success with db for colors");

// })
// .catch((err) =>{
//     console.log("error in connection with db for color update")
// })




module.exports = app;