
const express = require("express");
const app = express();
const path = require("path");
const connectDb  = require("./DB/DbConnect")
const colorRepo  = require("./models/color");
const titleRepo  = require("./models/title");



app.use(express.json());
app.use(express.static("public"));
app.use(express.static("admin"));
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const PORT = process.env.PORT || 3000;







app.get("/", async (req, res) => {
  try {

     // get connected with db
    connectDb();
   
     //Fetch from DB
    const colors = await colorRepo.findOne();
    const title = await titleRepo.findOne();
    console.log(colors)
    console.log(title)

    // 2️⃣ Send to render
    res.render("index", {
      colors: colors 
       || {
        primary: "#e4aaaaff",
        secondary: "#fdc2c2ff",
        other: "#ff8181ff"
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load page");
  }
});






app.post("/updateColor", async (req, res) => {



  console.log("req recieved for color update");

  const { primary, secondary, other } = req.body;
  // delete the previous color from db;
  await colorRepo.deleteMany({})
    .then((result) => {
      console.log("alll colors deleted");
      console.log(result)

    })
    .catch((error) => {
      console.log(error);
    })
  const colors = new colorRepo({
    primary,
    secondary,
    other
  })



  colors.save()
    .then((result) => {
      console.log("colors saved");
      console.log(result);
    })
    .catch((err) => {
      console.log(err)
    })




  console.log(req.body)


  console.log(colorRepo.find({}));

  // res.send("<h1>data sent </h1>");
  console.log("send")

  res.redirect("/");

  // res.render("index", {
  //   colors: colors || {
  //     primary: "#ff0080",
  //     secondary: "#ff0080",
  //     other: "#80ff00"
  //   }
  // });

})









// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


async function deleteColors() {
  // Example using the Node.js driver
  const deleteManyResult = await colorRepo.deleteMany({});
  console.log("Deleted " + deleteManyResult.deletedCount + " documents");


}