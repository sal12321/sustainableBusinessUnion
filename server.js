console.log("SERVER FILE LOADED");

const express = require("express");
const Event = require("./models/Event");
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
// const PORT =  3000;

// IFFe to connect with db
(async () => {
  try {
    await connectDb();
    console.log("MongoDB connected");
  } catch (err) {
  console.error("MongoDB connection failed:", err.message);
}

})();

// app.get("/", async (req, res) => {
//   try {
//     const colors = await colorRepo.findOne();
//     const titles = await titleRepo.findOne();

//     res.render("index", {
//       colors: colors || {
//         primary: "#e4aaaaff",
//         secondary: "#fdc2c2ff",
//         other: "#ff8181ff"
//       },
//       titles: titles || {
//         heroTitle: "GREEN TECH REVOLUTION",
//         heroSubTitle: "SUSTAINABLE BUSINESS UNION"
//       }
//     });
//   } catch (err) {
//     //console.error(err);
//     res.status(500).send("Failed to load page");
//   }
// });



app.get("/", async (req, res) => {
  console.log("in root")
  try {
    const colors = await colorRepo.findOne();
      // console.log(colors)
    const titles = await titleRepo.findOne();
        console.log(titles)
    const events = await Event.find();


    console.log(events)

    res.render("index.ejs", {
      colors: colors || {
        primary: "#e4aaaaff",
        secondary: "#fdc2c2ff",
        other: "#ff8181ff"
      },
      titles: titles || {
        title: "GREEN TECH REVOLUTION",
        subTitle: "SUSTAINABLE BUSINESS UNION"
      },
      events
    });
  } catch (err) {
    res.status(500).send("Failed to load page");
  }
});

app.get("/admin", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render("admin", { events });
  } catch (err) {
    res.status(500).send("Failed to load admin panel");
  }
});





app.post("/addEvent", async (req, res) => {
  try {
    const { title, artists, date, time, location } = req.body;

    if (!title || !artists || !date || !time || !location) {
      return res.status(400).send("All fields required");
    }

    await Event.create({
      title,
      artists,
      date,
      time,
      location
    });

    res.redirect("/admin");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add event");
  }
});



app.post("/deleteEvent/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("Failed to delete event");
  }
});





app.post("/updateColor", async (req, res) => {



  //console.log("req recieved for color update");

  const { primary, secondary, other } = req.body;
  await colorRepo.deleteMany({})
    .then((result) => {
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

      console.log(result);
    })
    .catch((err) => {
      console.log(err)
    })



const titles = await titleRepo.findOne();


  res.render("index.ejs" , {colors , titles });



})
app.post("/updateTitle", async (req, res) => {




  const { title , subTitle } = req.body;
  // delete the previous color from db;
  await titleRepo.deleteMany({})
    .then((result) => {

      console.log(result)

    })
    .catch((error) => {
      console.log(error);
    })

  const titles = new titleRepo({
    title,
    subTitle
  })



  titles.save()
    .then((result) => {
console.log(result)
    })
    .catch((err) => {
console.log(err)
    })




    const colors = await colorRepo.findOne();



    res.render("index.ejs" , {colors   ,titles});



})









// start server
app.listen(PORT, () => {
  // console.log(`Server running on http://localhost:${PORT}`);
});


