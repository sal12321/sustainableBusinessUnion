const mongoose = require("mongoose");

const TitleSchema = new mongoose.Schema({

  title: {
    type: String
  },

  subTitle: {
    type: String
  }
});

// this is my repo
const titleRepo = mongoose.model("updateTitle", TitleSchema);

module.exports = titleRepo; // exporting the colorRepo