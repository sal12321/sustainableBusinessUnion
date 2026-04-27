process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION:', err);
});

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
// const multer = require("multer");
const aboutRepo = require("./models/about");
const upload = require("./config/multer");
const Page = require("./models/Page");
const libraryRoutes = require("./routes/libraryRoutes");

//tenant import
const Tenant = require("./models/Tenant");


app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("admin"));
app.use(express.urlencoded({ extended: true }));

app.use(async (req,res,next)=>{
 try{
   const host = req.hostname.toLowerCase();

   let tenant = await Tenant.findOne({ domain: host });

   if(!tenant){
      tenant = await Tenant.findOne({ domain: "localhost" });
   }

   req.tenant = tenant;
   next();

 }catch(err){
   next(err);
 }
});

app.use(libraryRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



const PORT = process.env.PORT || 8080;

if (!PORT) {
  throw new Error("PORT is not defined");
}

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });
// console.log("PORT VALUE:", process.env.PORT);

// // THEN connect DB (non-blocking)
// connectDb()
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch(err => {
//     console.error("MongoDB connection failed:", err);
//   });

connectDb()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });
//tenant logic


// app.get("/", async (req, res) => {

//     // res.send("Server is working");


//   try {
//    const colors = await colorRepo.findOne() || {
//       primary:   "#009344",
//       secondary: "#006635",
//       other:     "#f6a623"
//     };
//     const titles = await titleRepo.findOne();

//     const events = await Event.find();
//     const logo = await logoRepo.findOne();
//     const colCard = await colCardRepo.findOne();
//     const video = await videoRepo.findOne();
//     const about = await aboutRepo.findOne();





// res.render("index", {
//   colors,
//   titles,
//   events,
//   logo,
//   colCard: colCard || {
//     label: "ANNOUNCEMENT",
//     heading: "Upcoming Events",
//     description: "Stay updated with our latest events"
//   },
//   video: video || {
//   videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
// },
// about: about || {
//   title: "ABOUT US",
//   description: "We are committed to sustainable development and innovation.",
//   image: "/images/default-about.jpg"
// }

// });
//   } catch (err) {
//   console.error(err);
//   res.status(500).send("Failed to load page");
// }
// });

// app.get("/", async (req,res)=>{

//  try{

//    if(!req.tenant){
//       return res.send("Domain not registered");
//    }

//    const tenantId = req.tenant._id;

//    const colors = await colorRepo.findOne({tenantId});
//    const titles = await titleRepo.findOne({tenantId});
//    const logo = await logoRepo.findOne({tenantId});
//    const events = await Event.find({tenantId});

//    res.render("index",{
//       colors,
//       titles,
//       logo,
//       events
//    });

//  }catch(err){
//    res.status(500).send("Error");
//  }

// });

app.get("/", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");

    const tenantId = req.tenant._id;

   const colors = await colorRepo.findOne({ tenantId }) || {
  primary:"#009344",
  secondary:"#006635",
  other:"#f6a623"
};
    const titles = await titleRepo.findOne({ tenantId }) || {
  title: "Welcome",
  subTitle: "Your subtitle here"
};
    const logo = await logoRepo.findOne({ tenantId }) || {
  logoTextTop: "My",
  logoTextBottom: "Brand"
};
const events = await Event.find({ tenantId });
const colCard = await colCardRepo.findOne({ tenantId }) || {
 label:"Announcement",
 heading:"Upcoming Events",
 description:"Stay updated"
};

const video = await videoRepo.findOne({ tenantId }) || {
 videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ"
};

const about = await aboutRepo.findOne({ tenantId }) || {
 title:"About Us",
 description:"Welcome to our website"
};

    // res.render("index", { colors, titles });
    res.render("index", {
  colors,
  titles,
  logo,
  events,
  colCard,
  video,
  about
});

  } catch (err) {
    res.status(500).send("Error");
  }
});


app.get("/admin", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;

    const events = await Event.find({ tenantId }).sort({ date: 1 });

    res.render("admin", { events });
  } catch (err) {
    res.status(500).send("Failed");
  }
});


app.get("/editEvent/:id", async (req, res) => {
  try {
    const tenantId = req.tenant._id;

    const event = await Event.findOne({
      _id: req.params.id,
      tenantId
    });

    if (!event) {
      return res.send("Event not found");
    }

    res.render("edit", { event });

  } catch (err) {
    res.status(500).send("Failed");
  }
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});

app.get("/terms", (req, res) => {
  res.render("terms");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.post("/updateEvent/:id", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const { title, artists, date, time, location } = req.body;

    // await Event.findByIdAndUpdate(req.params.id, {
    //   title,
    //   artists,
    //   date,
    //   time,
    //   location
    // });
    const tenantId = req.tenant._id;

await Event.findOneAndUpdate(
  {
    _id: req.params.id,
    tenantId
  },
  {
    title,
    artists,
    date,
    time,
    location
  }
);

    res.redirect("/admin");

  } catch (err) {
    res.status(500).send("Failed to update event");
  }
});

// app.post("/updateLogo", async (req, res) => {
//   try {
//     const { logoMark, logoTextTop, logoTextBottom } = req.body;

//     await logoRepo.deleteMany({});

//     await logoRepo.create({
//       logoMark,
//       logoTextTop,
//       logoTextBottom
//     });

//     res.redirect("/");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to update logo");
//   }
// });

app.post("/updateLogo", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { logoMark, logoTextTop, logoTextBottom } = req.body;

    await logoRepo.findOneAndUpdate(
      { tenantId },
      {
        tenantId,
        logoMark,
        logoTextTop,
        logoTextBottom
      },
      { upsert: true, new: true }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed");
  }
});





app.post("/addEvent", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const { title, artists, date, time, location } = req.body;

    if (!title || !artists || !date || !time || !location) {
      return res.status(400).send("All fields required");
    }

    // await Event.create({
    //   title,
    //   artists,
    //   date,
    //   time,
    //   location
    // });

    const tenantId = req.tenant._id;

await Event.create({
  tenantId,
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


// app.post("/updateColCard", upload.array("images", 5), async (req, res) => {
//   try {
//     const { label, heading, description } = req.body;

//     const updateData = {
//       label,
//       heading,
//       description
//     };

//     console.log("FILES:", req.files);
// console.log("BODY:", req.body);

//     // only update images if provided
//     if (req.files && req.files.length > 0) {
//       updateData.images = req.files.map(file => "/uploads/" + file.filename);
//     }

//     await colCardRepo.findOneAndUpdate(
//       {},
//       updateData,
//       {
//         upsert: true,
//         new: true
//       }
//     );

//     res.redirect("/");
//   } catch (err) {
//     console.error("Update ColCard Error:", err);
//     // res.status(500).send("Failed to update ColCard");
//     res.status(500).send(err.message);
//   }
// });

app.post("/updateColCard", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { label, heading, description } = req.body;

    const updateData = {
      tenantId,
      label,
      heading,
      description
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => "/uploads/" + file.filename);
    }

    await colCardRepo.findOneAndUpdate(
      { tenantId },
      updateData,
      {
        upsert: true,
        new: true
      }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed");
  }
});



app.get("/deleteEvent/:id", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    // await Event.findByIdAndDelete(req.params.id);
    const tenantId = req.tenant._id;

await Event.findOneAndDelete({
  _id: req.params.id,
  tenantId
});
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed to delete event");
  }
});







// app.post("/updateColor", async (req, res) => {
//   try {
//     const { primary, secondary, other } = req.body;

//     await colorRepo.findOneAndUpdate(
//       {},
//       { primary, secondary, other },
//       { upsert: true, new: true }
//     );

//     res.redirect("/");
//   } catch (err) {
//     console.error("Failed to update color:", err);
//     res.status(500).send("Failed to update color");
//   }
// });
app.post("/updateColor", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    console.log(req.tenant)
    const tenantId = req.tenant._id;
    const { primary, secondary, other } = req.body;

    await colorRepo.findOneAndUpdate(
      { tenantId },
      { tenantId, primary, secondary, other },
      { upsert: true, new: true }
    );

    res.redirect("/");
  } catch (err) {
    // res.status(500).send("Failed");
    console.error("COLOR UPDATE ERROR:", err);
  res.status(500).send(err.message);
  }
});


// app.post("/updateTitle", async (req, res) => {
//   try {

//     const { title, subTitle, heroEyebrow, heroUrl } = req.body;

//     await titleRepo.findOneAndUpdate(
//       {tenantId},
//       { tenantId,title, subTitle, heroEyebrow, heroUrl },
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
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { title, subTitle, heroEyebrow, heroUrl } = req.body;

    await titleRepo.findOneAndUpdate(
      { tenantId },
      { tenantId, title, subTitle, heroEyebrow, heroUrl },
      { upsert: true, new: true }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed");
  }
});

// app.post("/updateVideo", async (req, res) => {
//   try {
//     const { videoUrl } = req.body;

//     await videoRepo.findOneAndUpdate(
//       {tenantId},
//       {tenantId, videoUrl },
//       { upsert: true }
//     );

//     res.redirect("/");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to update video");
//   }
// });

app.post("/updateVideo", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { videoUrl } = req.body;

    await videoRepo.findOneAndUpdate(
      { tenantId },
      { tenantId, videoUrl },
      { upsert: true, new: true }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed");
  }
});


// app.post("/updateAbout", upload.array("images", 10), async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const updateData = {
//       title,
//       description
//     };

//     // only update images if files uploaded
//     if (req.files && req.files.length > 0) {
//       updateData.images = req.files.map(file => "/uploads/" + file.filename);
//     }

//     await aboutRepo.findOneAndUpdate(
//       {tenantId},
//       updateData,
//       {
//         upsert: true,
//         new: true
//       }
//     );

//     res.redirect("/");
//   } catch (err) {
//     console.error("Update About Error:", err);
//     res.status(500).send("Failed to update About section");
//   }
// });
app.post("/updateAbout", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { title, description } = req.body;

    const updateData = {
      tenantId,
      title,
      description
    };

    if (req.files?.length) {
      updateData.images = req.files.map(file => "/uploads/" + file.filename);
    }

    await aboutRepo.findOneAndUpdate(
      { tenantId },
      updateData,
      { upsert: true, new: true }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Failed");
  }
});

// app.post("/updatePage", async (req, res) => {
//   try {
//     const { name, content } = req.body;

//     // await Page.findOneAndUpdate(
//     //   { name },
//     //   { content },
//     //   { upsert: true }
//     // );

//     await Page.findOneAndUpdate(
//   { name, tenantId },
//   { name, content, tenantId },
//   { upsert:true }
// )
//     res.redirect("/admin");

//   } catch (err) {
//     res.status(500).send("Failed to update page");
//   }
// });
app.post("/updatePage", async (req, res) => {
  try {
    if (!req.tenant) return res.send("Tenant not found");
    const tenantId = req.tenant._id;
    const { name, content } = req.body;

    await Page.findOneAndUpdate(
      { name, tenantId },
      { name, content, tenantId },
      { upsert: true, new: true }
    );

    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("Failed");
  }
});





app.use((err,req,res,next)=>{
   console.error(err);
   res.status(500).send("Server Error");
});