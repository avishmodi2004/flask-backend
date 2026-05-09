const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Student model se linked
    required: true
  },
  collageID: {
    type: String,
    required: true
  },
  // ✅ NEW FIELD: Kaunse subject ki attendance hai
  subject: {
    type: String,
    required: true
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true
  },
  status: {
    type: String,
    default: "Present"
  }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);