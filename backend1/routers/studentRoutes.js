const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ClassTeacher = require("../models/ClassTeacher");
const Attendance = require("../models/Attendance");

// ✅ Ensure image upload folder exists
const uploadDir = "uploads/students/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname + ".jpg");
  },
});

const upload = multer({ storage });

// ================= FETCH ALL STUDENTS =================
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Data fetch error: " + err.message });
  }
});


// ================= DELETE STUDENT BY CLASS TEACHER =================
router.delete("/class-teacher-delete/:id", async (req, res) => {
  try {
    const { teacherID } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student nahi mila"
      });
    }

    const classTeacher = await ClassTeacher.findOne({
      teacherID,
      semester: Number(student.semester)
    });

    if (!classTeacher) {
      return res.status(403).json({
        success: false,
        message: "Student delete sirf class teacher kar sakta hai"
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted by class teacher ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student database mein nahi mila! ❌"
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully! ✅"
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error: " + err.message
    });
  }
});

// ================= EDIT STUDENT =================
router.put("/edit/:id", async (req, res) => {
  try {

    const {
      name,
      collageID,
      semester,
      classTeacher
    } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        collageID,
        semester,
        classTeacher
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found ❌"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully ✅",
      student: updatedStudent
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= STUDENT LOGIN =================
router.post("/signin", async (req, res) => {
  try {

    const { collageID, password } = req.body;

    const student = await Student.findOne({
      collageID
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student ID not found!"
      });
    }

    if (student.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!"
      });
    }

    res.json({
      success: true,
      message: "Login successful! ✅",
      student: {
        name: student.name,
        collageID: student.collageID
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= ADD STUDENT =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const {
      name,
      collageID,
      password,
      semester,
      classTeacher
    } = req.body;

    console.log("Adding Student:", name, collageID);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo click karna zaroori hai! 📸"
      });
    }

    const newStudent = new Student({
      name,
      collageID,
      password,
      semester,
      classTeacher,
      image: req.file.path,
      subjectAttendance: {},
      daysPresent: 0
    });

    await newStudent.save();

    console.log("Student saved to MongoDB! ✅");

    res.json({
      success: true,
      message: "Student Added Successfully ✅"
    });

  } catch (err) {

    console.error("Save Error:", err.message);

    res.status(500).json({
      success: false,
      message: "DB Error: " + err.message
    });
  }
});


// ================= ATTENDANCE ROUTE WITH SINGLE RANDOM CHALLENGE =================
router.post("/verify-challenge", async (req, res) => {
  try {
    const { image1, challenge } = req.body;

    if (!image1 || !challenge) {
      return res.status(400).json({
        success: false,
        message:  "Photo or challenge is missing"
      });
    }

    const cleanLiveImage = image1.replace(/^data:image\/\w+;base64,/, "");

    const pythonRes = await axios.post(
      "http://127.0.0.1:5000/verify-pose",
      {
        image: cleanLiveImage,
        challenge
      },
      {
        timeout: 15000
      }
    );

    if (pythonRes.data.result !== "success") {
      return res.status(400).json({
        success: false,
        message: pythonRes.data.message || "Challenge failed ❌"
      });
    }

    res.json({
      success: true,
      message: "Challenge passed ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Challenge verify server error",
      debug: err.message
    });
  }
}); 


router.post("/mark-attendance", async (req, res) => {
  try {
    const { collageID, image1, subjectCode, challenge } = req.body;

    if (!collageID || !subjectCode || !image1 || !challenge) {
      return res.status(400).json({
        success: false,
        message: "ID, photo, subject, or challenge is missing",
      });
    }

    const student = await Student.findOne({
      collageID: collageID.toString(),
    });

    if (!student || !student.image) {
      return res.status(404).json({
        success: false,
        message: "Student record or photo not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const alreadyMarked = await Attendance.findOne({
      collageID: student.collageID,
      subject: subjectCode,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this class",
      });
    }

    const originalImagePath = path.join(__dirname, "../", student.image);

    if (!fs.existsSync(originalImagePath)) {
      return res.status(404).json({
        success: false,
        message: "Original photo not found on disk",
      });
    }

    const originalImageBase64 = fs.readFileSync(originalImagePath, {
      encoding: "base64",
    });

    const cleanLiveImage = image1.replace(/^data:image\/\w+;base64,/, "");

    const pythonRes = await axios.post(
      "http://127.0.0.1:5000/face-compare",
      {
        image1: originalImageBase64,
        image2: cleanLiveImage,
        challenge,
      },
      {
        timeout: 25000,
      }
    );

    console.log("Python Response:", pythonRes.data);

    if (pythonRes.data.result !== "success") {
      return res.status(400).json({
        success: false,
        message: pythonRes.data.message || "Face match or challenge failed",
      });
    }

    if (!student.subjectAttendance) {
      student.subjectAttendance = new Map();
    }

    const currentAttendance =
      student.subjectAttendance.get(subjectCode) || 0;

    student.subjectAttendance.set(subjectCode, currentAttendance + 1);
    student.daysPresent = Number(student.daysPresent || 0) + 1;
    student.lastAttendance = new Date();
    student.lastSubject = subjectCode;

    await Attendance.create({
      studentId: student._id,
      collageID: student.collageID,
      subject: subjectCode,
      date: today,
      status: "Present",
    });

    await student.save();

    res.json({
      success: true,
      message: `Attendance marked successfully for ${subjectCode}`,
      challengePassed: true,
      attendanceCount: student.subjectAttendance.get(subjectCode),
    });
  } catch (err) {
    console.error("Attendance Error Detail:", err.message);

    res.status(500).json({
      success: false,
      message: "Recognition failed or server error",
      debug: err.message,
    });
  }
});
module.exports = router;