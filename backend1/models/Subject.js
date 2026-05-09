const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true,
    unique: true
  },

  semester: {
    type: Number,
    required: true
  },

  // Class teacher baad me subject teacher assign karega
  teacherID: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Subject", SubjectSchema);