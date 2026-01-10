console.log("SERVER FILE LOADED");

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


(async () => {
  try {
    await connectDb();
    //console.log("MongoDB connected");
  } catch (err) {
  console.error("MongoDB connection failed:", err.message);
}

})();








// app.get("/", async (req, res) => {
//   try {

//      // get connected with db
//     // await connectDb();
//     // already connected through IIFE
   
//      //Fetch from DB
//     const colors = await colorRepo.findOne();
//     const title = await titleRepo.findOne();
//     //console.log(colors)
//     //console.log(title)

//     // 2️⃣ Send to render
//     res.render("index", {
//       colors: colors 
//        || {
//         primary: "#e4aaaaff",
//         secondary: "#fdc2c2ff",
//         other: "#ff8181ff"
//       }
//     });

//   } catch (err) {
//     //console.error(err);
//     res.status(500).send("Failed to load page");
//   }
// });



app.get("/", async (req, res) => {
  try {
    const colors = await colorRepo.findOne();
    const titles = await titleRepo.findOne();

    res.render("index", {
      colors: colors || {
        primary: "#e4aaaaff",
        secondary: "#fdc2c2ff",
        other: "#ff8181ff"
      },
      titles: titles || {
        heroTitle: "GREEN TECH REVOLUTION",
        heroSubTitle: "SUSTAINABLE BUSINESS UNION"
      }
    });
  } catch (err) {
    //console.error(err);
    res.status(500).send("Failed to load page");
  }
});







app.post("/updateColor", async (req, res) => {



  //console.log("req recieved for color update");

  const { primary, secondary, other } = req.body;
  // delete the previous color from db;
  await colorRepo.deleteMany({})
    .then((result) => {
      //console.log("all colors deleted");
      //console.log(result)

    })
    .catch((error) => {
      //console.log(error);
    })
  const colors = new colorRepo({
    primary,
    secondary,
    other
  })



  colors.save()
    .then((result) => {
      //console.log("colors saved");
      //console.log(result);
    })
    .catch((err) => {
      //console.log(err)
    })




  //console.log(req.body);


const titles = await titleRepo.findOne();


  // res.send("<h1>data sent </h1>");
  //console.log("send")

  res.render("index.ejs" , {colors , titles });

  // res.render("index", {
  //   colors: colors || {
  //     primary: "#ff0080",
  //     secondary: "#ff0080",
  //     other: "#80ff00"
  //   }
  // });

})
app.post("/updateTitle", async (req, res) => {



  //console.log("req recieved for color update");

  const { title , subTitle } = req.body;
  // delete the previous color from db;
  await titleRepo.deleteMany({})
    .then((result) => {
      //console.log("all titles deleted");
      //console.log(result)

    })
    .catch((error) => {
      //console.log(error);
    })

  const titles = new titleRepo({
    title,
    subTitle
  })



  titles.save()
    .then((result) => {
      //console.log("title saved");
      //console.log(result);
    })
    .catch((err) => {
      //console.log(err)
    })




  //console.log(req.body)
    const colors = await colorRepo.findOne();


  //console.log(titleRepo.find({}));

  // res.send("<h1>data sent </h1>");
  //console.log("send")

    res.render("index.ejs" , {colors   ,titles});



})









// start server
app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
});


async function deleteColors() {
  // Example using the Node.js driver
  const deleteManyResult = await colorRepo.deleteMany({});
  //console.log("Deleted " + deleteManyResult.deletedCount + " documents");


}