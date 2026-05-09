const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  date: {
    type: String,   // string rakhna better hai (YYYY-MM-DD)
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  students: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("studentAttendance", studentAttendanceSchema);