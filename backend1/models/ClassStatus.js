const mongoose = require("mongoose");

const classStatusSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("ClassStatus", classStatusSchema);