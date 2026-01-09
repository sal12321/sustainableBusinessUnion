const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({

  primary: {
    type: String
  },

  secondary: {
    type: String
  },
  other: {
    type: String
  }
})

// this is my repo
const colorRepo = mongoose.model("udpateColor", colorSchema);

module.exports = colorRepo; // exporting the colorRepo