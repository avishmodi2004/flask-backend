const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

// All subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ semester: 1 });

    res.json(subjects);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Subjects assigned to subject teacher
router.get("/teacher/:id", async (req, res) => {
  try {
    const teacherSubjects = await Subject.find({
      teacherID: req.params.id
    });

    res.json(teacherSubjects);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// Subjects by semester
router.get("/semester/:semester", async (req, res) => {
  try {
    const subjects = await Subject.find({
      semester: Number(req.params.semester),
    }).sort({ name: 1 });

    res.json(subjects);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Add subject without teacher
router.post("/", async (req, res) => {
  try {
    const { name, code, semester, teacherID } = req.body;

    if (!name || !code || !semester) {
      return res.status(400).json({
        success: false,
        message: "Subject name, code, and semester are required"
      });
    }

    const subject = new Subject({
      name,
      code,
      semester: Number(semester),
      teacherID: teacherID || null
    });

    await subject.save();

    res.json({
      success: true,
      message: "Subject added successfully",
      subject
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
// Delete subject
router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    await Attendance.deleteMany({ subject: subject.code });

    const students = await Student.find();

    for (const student of students) {
      if (
        student.subjectAttendance &&
        student.subjectAttendance.has(subject.code)
      ) {
        const count = student.subjectAttendance.get(subject.code) || 0;

        student.daysPresent = Math.max(
          0,
          Number(student.daysPresent || 0) - Number(count)
        );

        student.subjectAttendance.delete(subject.code);
        await student.save();
      }
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Subject and related attendance deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ================= UPDATE SUBJECT =================
router.put("/:id", async (req, res) => {
  try {
    const { name, code, semester, teacherID } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        semester,
        teacherID
      },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      message: "Subject updated successfully ✅",
      subject: updatedSubject
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
module.exports = router;