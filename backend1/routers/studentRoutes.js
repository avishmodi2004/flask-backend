const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addStudent,
  getAllStudents,
  studentSignin,
  markAttendance,
  semesterAttendance
} = require("../controllers/studentControllers");

// 🔥 FIXED multer (absolute path)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ROUTES
router.post("/add", upload.single("image"), addStudent);
router.get("/", getAllStudents);
router.post("/signin", studentSignin);

// 🔥 IMPORTANT
router.post("/mark-attendance", upload.single("image"), markAttendance);

router.post("/semester-attendance", semesterAttendance);

module.exports = router;