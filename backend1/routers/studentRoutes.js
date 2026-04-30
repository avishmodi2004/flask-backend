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

const memoryStorage = multer.memoryStorage();
const uploadOnMemory = multer({storage : memoryStorage});
// ROUTES
router.post("/add", uploadOnMemory.single("image"), addStudent);
router.get("/", getAllStudents);
router.post("/signin", studentSignin);

// 🔥 IMPORTANT
router.post("/mark-attendance", uploadOnMemory.single("image"), markAttendance);

router.post("/semester-attendance", semesterAttendance);

module.exports = router;