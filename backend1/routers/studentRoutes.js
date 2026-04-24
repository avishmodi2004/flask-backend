const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addStudent,
  getAllStudents
} = require("../controllers/studentControllers"); // ✅ fixed

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg");
  }
});

const upload = multer({ storage });

// ✅ correct routes
router.post("/add", upload.single("image"), addStudent);
router.get("/", getAllStudents);

module.exports = router;