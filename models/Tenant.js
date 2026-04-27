const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: String,

  domain: {
    type: String,
    unique: true
  },

  email: String,

  password: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Tenant", tenantSchema);