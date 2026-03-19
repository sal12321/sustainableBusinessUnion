console.log("SERVER FILE LOADED");

const express = require("express");
const Event = require("./models/Event");
const app = express();
const path = require("path");
const connectDb = require("./DB/DbConnect")
const colorRepo = require("./models/color");
const titleRepo = require("./models/title");
const logoRepo = require("./models/logo");
const colCardRepo = require("./models/colCard");
const videoRepo = require("./models/video");
const multer = require("multer");
const aboutRepo = require("./models/about");



app.use(express.json());
app.use(express.static("public"));
app.use(express.static("admin"));
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


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





app.get("/", async (req, res) => {

  try {
    const colors = await colorRepo.findOne();

    const titles = await titleRepo.findOne();

    const events = await Event.find();
    const logo = await logoRepo.findOne();
    const colCard = await colCardRepo.findOne();
    const video = await videoRepo.findOne();
    const about = await aboutRepo.findOne();





res.render("index", {
  colors,
  titles,
  events,
  logo,
  colCard: colCard || {
    label: "ANNOUNCEMENT",
    heading: "Upcoming Events",
    description: "Stay updated with our latest events"
  },
  video: video || {
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
},
about: about || {
  title: "ABOUT US",
  description: "We are committed to sustainable development and innovation.",
  image: "/images/default-about.jpg"
}

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

app.get("/editEvent/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render("edit", { event });
  } catch (err) {
    res.status(500).send("Failed to load edit page");
  }
});
app.post("/updateEvent/:id", async (req, res) => {
  try {
    const { title, artists, date, time, location } = req.body;

    await Event.findByIdAndUpdate(req.params.id, {
      title,
      artists,
      date,
      time,
      location
    });

    res.redirect("/admin");

  } catch (err) {
    res.status(500).send("Failed to update event");
  }
});

app.post("/updateLogo", async (req, res) => {
  try {
    const { logoMark, logoTextTop, logoTextBottom } = req.body;

    await logoRepo.deleteMany({});

    await logoRepo.create({
      logoMark,
      logoTextTop,
      logoTextBottom
    });

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update logo");
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
// app.post("/updateColCard", async (req, res) => {
//   try {
//     const { label, heading, description } = req.body;

//     await colCardRepo.findOneAndUpdate(
//       {},
//       { label, heading, description },
//       { upsert: true }
//     );

//     res.redirect("/");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to update col-card");
//   }
// });
app.post("/updateColCard", upload.single("image"), async (req, res) => {
  try {
    const { label, heading, description } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    }

    await colCardRepo.findOneAndUpdate(
      {},
      {
        label,
        heading,
        description,
        ...(imagePath && { image: imagePath })
      },
      { upsert: true }
    );

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update col-card");
  }
});



app.post("/deleteEvent/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to delete event");
  }
});





app.post("/updateColor", async (req, res) => {



  //console.log("req recieved for color update");

  const { primary, secondary, other } = req.body;
  await colorRepo.deleteMany({})
    .then((result) => {
      // console.log(result)

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

    })
    .catch((err) => {
      console.log(err)
    })



  const titles = await titleRepo.findOne();
  const events = await Event.find();
// res.render("index.ejs", { colors, titles, events });
res.redirect("/");


  // res.render("index.ejs", { colors, titles });



})
// app.post("/updateTitle", async (req, res) => {




//   const { title, subTitle } = req.body;
//   // delete the previous color from db;
//   await titleRepo.deleteMany({})
//     .then((result) => {

//       // console.log(result)

//     })
//     .catch((error) => {
//       console.log(error);
//     })

//   const titles = new titleRepo({
//     title,
//     subTitle
//   })



//   titles.save()
//     .then((result) => {
//       // console.log(result)
//     })
//     .catch((err) => {
//       console.log(err)
//     })




//   const colors = await colorRepo.findOne();
//   const events = await Event.find();


//   res.render("index.ejs", { colors, titles, events });



// })

// 2

// app.post("/updateTitle", async (req, res) => {
//   try {

//     const { title, subTitle, heroEyebrow } = req.body;

//     await titleRepo.findOneAndUpdate(
//       {},
//       { title, subTitle, heroEyebrow },
//       { upsert: true }
//     );

//     res.redirect("/");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to update title");
//   }
// });



app.post("/updateTitle", async (req, res) => {
  try {

    const { title, subTitle, heroEyebrow, heroUrl } = req.body;

    await titleRepo.findOneAndUpdate(
      {},
      { title, subTitle, heroEyebrow, heroUrl },
      { upsert: true }
    );

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update title");
  }
});

app.post("/updateVideo", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    await videoRepo.findOneAndUpdate(
      {},
      { videoUrl },
      { upsert: true }
    );

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update video");
  }
});

app.post("/updateAbout", async (req, res) => {
  try {
    const { title, description, images } = req.body;

    // convert comma-separated string → array
    const imageArray = images ? images.split(",") : [];

    await aboutRepo.findOneAndUpdate(
      {},
      {
        title,
        description,
        images: imageArray
      },
      { upsert: true }
    );

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update about section");
  }
});


// start server
app.listen(PORT, () => {
  // console.log(`Server running on http://localhost:${PORT}`);
});


