const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// 1. GET ALL TEACHERS (Admin Panel fix)
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find(); 
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teachers" });
  }
});

// 2. ADD TEACHER (Validation fix ke saath)
router.post("/", async (req, res) => {
  try {
    const { name, teacherID, dept, password } = req.body;
    
    // Naya teacher create karein
    // Note: Agar model mein 'subject' required hai, toh yahan empty string bhej rahe hain
    const newTeacher = new Teacher({ 
      name, 
      teacherID, 
      dept, 
      password,
      subject: "" // Validation bypass karne ke liye
    });
    
    await newTeacher.save(); 
    res.json({ success: true, message: "Teacher added permanently ✅" });
  } catch (err) {
    // Ye wahi error hai jo image_e350dc.png mein aa raha tha
    res.status(500).json({ message: "Error saving teacher: " + err.message });
  }
});

// 3. SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { teacherID, password } = req.body;
    const teacher = await Teacher.findOne({ teacherID, password });

    if (teacher) {
      res.json({ success: true, message: "Login successful ✅", teacher });
    } else {
      res.status(401).json({ success: false, message: "Invalid ID or Password ❌" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// 4. DELETE (Database se hatane ke liye)
router.delete("/:id", async (req, res) => {
  try {
    const result = await Teacher.findByIdAndDelete(req.params.id);

    if (result) {
      res.json({
        success: true,
        message: "Teacher deleted successfully ✅"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Teacher nahi mila ❌"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete error: " + err.message
    });
  }
});

module.exports = router;