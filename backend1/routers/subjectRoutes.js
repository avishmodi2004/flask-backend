const express = require("express");
const router = express.Router();

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

// Add subject without teacher
router.post("/", async (req, res) => {
  try {
    const { name, code, semester } = req.body;

    if (!name || !code || !semester) {
      return res.status(400).json({
        message: "Subject name, code aur semester required hai"
      });
    }

    const subject = new Subject({
      name,
      code,
      semester: Number(semester),
      teacherID: null
    });

    await subject.save();

    res.json({
      success: true,
      message: "Subject add ho gaya ✅",
      subject
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Delete subject
router.delete("/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Subject deleted ✅"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// ================= GET SUBJECT BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json(subject);

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