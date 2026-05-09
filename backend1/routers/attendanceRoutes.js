const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const ClassTeacher = require("../models/ClassTeacher");

const todayDate = () => new Date().toISOString().split("T")[0];

router.get("/live/:subjectCode/:teacherID", async (req, res) => {
  try {
    const { subjectCode, teacherID } = req.params;

    const subject = await Subject.findOne({ code: subjectCode });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    if (subject.teacherID !== teacherID) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only class teacher can view this list."
      });
    }

    const students = await Student.find({
      semester: Number(subject.semester)
    }).sort({ name: 1 });

    const attendance = await Attendance.find({
      subject: subjectCode,
      date: todayDate()
    });

    const presentIDs = attendance.map(a => a.collageID);

    const list = students.map(student => ({
      _id: student._id,
      name: student.name,
      collageID: student.collageID,
      semester: student.semester,
      status: presentIDs.includes(student.collageID)
        ? "Present"
        : "Absent"
    }));

    res.json({
      success: true,
      subject,
      totalStudents: list.length,
      presentCount: list.filter(s => s.status === "Present").length,
      absentCount: list.filter(s => s.status === "Absent").length,
      students: list
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.post("/manual", async (req, res) => {
  try {
    const { teacherID, subjectCode, collageID } = req.body;

    const subject = await Subject.findOne({ code: subjectCode });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const classTeacher = await ClassTeacher.findOne({
  teacherID,
  semester: Number(subject.semester)
});

if (!classTeacher) {
      return res.status(403).json({
        success: false,
        message: "Manual attendance can only mark by class teacher"
      });
    }

    const student = await Student.findOne({
      collageID,
      semester: Number(subject.semester)
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student is semester/class me nahi mila"
      });
    }

    const already = await Attendance.findOne({
      collageID,
      subject: subjectCode,
      date: todayDate()
    });

    if (already) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked"
      });
    }

    await Attendance.create({
      studentId: student._id,
      collageID: student.collageID,
      subject: subjectCode,
      date: todayDate(),
      status: "Present"
    });

    const current = student.subjectAttendance.get(subjectCode) || 0;
    student.subjectAttendance.set(subjectCode, current + 1);
    student.daysPresent = Number(student.daysPresent || 0) + 1;
    student.lastAttendance = new Date();

    await student.save();

    res.json({
      success: true,
      message: "Manual attendance marked ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= DELETE ATTENDANCE ONLY CLASS TEACHER =================
router.delete("/remove", async (req, res) => {
  try {
    const { teacherID, subjectCode, collageID } = req.body;

    const subject = await Subject.findOne({ code: subjectCode });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const classTeacher = await ClassTeacher.findOne({
      teacherID,
      semester: Number(subject.semester)
    });

    if (!classTeacher) {
      return res.status(403).json({
        success: false,
        message: "Attendance remove sirf class teacher kar sakta hai"
      });
    }

    const deleted = await Attendance.findOneAndDelete({
      collageID,
      subject: subjectCode,
      date: todayDate()
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Attendance record nahi mila"
      });
    }

    const student = await Student.findOne({ collageID });

    if (student) {
      const current = student.subjectAttendance.get(subjectCode) || 0;
      student.subjectAttendance.set(subjectCode, Math.max(0, current - 1));
      student.daysPresent = Math.max(0, Number(student.daysPresent || 0) - 1);
      await student.save();
    }

    res.json({
      success: true,
      message: "Attendance removed ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;