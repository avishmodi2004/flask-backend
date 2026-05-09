const express = require("express");
const router = express.Router();

const ClassTeacher = require("../models/ClassTeacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

// ================= ASSIGN CLASS TEACHER =================
router.post("/assign", async (req, res) => {
  try {

    const {
      semester,
      teacherID
    } = req.body;

    if (!semester || !teacherID) {

      return res.status(400).json({
        success: false,
        message: "Semester aur teacherID required hai"
      });
    }

    const totalStudents =
      await Student.countDocuments({
        semester: Number(semester)
      });

    if (totalStudents === 0) {

      return res.status(404).json({
        success: false,
        message: "Is semester me koi student nahi hai"
      });
    }

    const assigned =
      await ClassTeacher.findOneAndUpdate(

        {
          semester: Number(semester)
        },

        {
          teacherID
        },

        {
          new: true,
          upsert: true
        }
      );

    res.json({
      success: true,
      message:
        `Semester ${semester} ka class teacher assign ho gaya ✅`,
      assigned
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= GET ALL CLASS TEACHERS =================
router.get("/", async (req, res) => {
  try {

    const data =
      await ClassTeacher.find()
        .sort({ semester: 1 });

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= EDIT CLASS TEACHER =================
router.put("/edit/:semester", async (req, res) => {

  try {

    const {
      teacherID
    } = req.body;

    const updated =
   await ClassTeacher.findOneAndUpdate(

      {
  semester: Number(req.params.semester)
},

        {
          teacherID
        },

        {
          new: true
        }
      );

    if (!updated) {

      return res.status(404).json({
        success: false,
        message: "Class Teacher record not found ❌"
      });
    }

    res.json({
      success: true,
      message: "Class Teacher Updated ✅",
      data: updated
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= GET SUBJECTS OF CLASS TEACHER =================
router.get("/my-subjects/:teacherID", async (req, res) => {
  try {

    const classTeacher =
      await ClassTeacher.findOne({
        teacherID: req.params.teacherID
      });

    if (!classTeacher) {

      return res.json({
        success: false,
        message:
          "Aap kisi semester ke class teacher nahi ho",
        subjects: []
      });
    }

    const subjects =
      await Subject.find({
        semester: classTeacher.semester
      });

    res.json({
      success: true,
      semester: classTeacher.semester,
      subjects
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= ASSIGN SUBJECT TEACHER =================
router.post("/assign-subject-teacher", async (req, res) => {
  try {

    const {
      classTeacherID,
      subjectCode,
      subjectTeacherID
    } = req.body;

    const subject =
      await Subject.findOne({
        code: subjectCode
      });

    if (!subject) {

      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const classTeacher =
      await ClassTeacher.findOne({
        semester: subject.semester
      });

    if (
      !classTeacher ||
      classTeacher.teacherID !== classTeacherID
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Sirf is semester ka class teacher subject teacher assign kar sakta hai"
      });
    }

    subject.teacherID =
      subjectTeacherID;

    await subject.save();

    res.json({
      success: true,
      message:
        "Subject teacher assign ho gaya ✅",
      subject
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= CHECK TEACHER IS CLASS TEACHER =================
router.get("/check/:teacherID", async (req, res) => {
  try {
    const classTeacher = await ClassTeacher.findOne({
      teacherID: req.params.teacherID
    });

    if (!classTeacher) {
      return res.json({
        success: true,
        isClassTeacher: false,
        semester: null
      });
    }

    res.json({
      success: true,
      isClassTeacher: true,
      semester: classTeacher.semester
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= REMOVE CLASS TEACHER =================
router.delete("/remove/:semester", async (req, res) => {
  try {
    await ClassTeacher.findOneAndDelete({
      semester: Number(req.params.semester)
    });

    res.json({
      success: true,
      message: "Class teacher removed ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
module.exports = router;