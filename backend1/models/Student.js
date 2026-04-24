const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  collageID: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  daysPresent: {
    type: Number,
    default: 0,
  },

  studentImage: {
    type: Buffer,
    required: true,
  },

  lastAttendance: {
    type: Date,
  },
});

module.exports = mongoose.model("Student", StudentSchema);