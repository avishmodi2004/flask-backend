const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
addStudent,
getAllStudents,
getSemesterAttendance
} = require("../controllers/studentControllers");

// MULTER
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ADD STUDENT
router.post("/student/add", upload.single("image"), addStudent);

// GET ALL
router.get("/students", getAllStudents);

// STUDENT LOGIN (dummy)
router.post("/student/signin", (req, res) => {
return res.status(200).json({
message: "Student login working"
});
});

// SEMESTER ATTENDANCE
router.post("/student/semester-attendance", getSemesterAttendance);

module.exports = router;
