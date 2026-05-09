const mongoose = require("mongoose");

const ClassTeacherSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
    unique: true
  },

  teacherID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("ClassTeacher", ClassTeacherSchema);