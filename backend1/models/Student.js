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

  // Total present days across all subjects
  daysPresent: {
    type: Number,
    default: 0,
  },
  classTeacher: {
  type: String,
  default: "",
},

  // ✅ DYNAMIC SUBJECT ATTENDANCE (Changes here)
  // Store format: { "maths": 5, "dbms": 3, "os": 8 }
  subjectAttendance: {
    type: Map,
    of: Number,
    default: {}
  },

  // Image path for Face Recognition
  image: {
    type: String,
    required: true,
  },

  lastAttendance: {
    type: Date,
  },
});

module.exports = mongoose.model("Student", StudentSchema);