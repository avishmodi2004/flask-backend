const Student = require("../models/Student");

// ================= ADD STUDENT =================
const addStudent = async (req, res) => {
  try {
    const { collageID, name, password, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required ❌" });
    }

    const student = new Student({
      collageID,
      name,
      password,
      semester,
      image: req.file.filename,
      daysPresent: 0,
      totalClasses: 0
    });

    await student.save();

    res.status(201).json({
      message: "Student added successfully ✅",
      student
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL STUDENTS =================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ data: students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= STUDENT SIGNIN =================
const studentSignin = async (req, res) => {
  try {
    const { collageID, password } = req.body;

    const student = await Student.findOne({ collageID });

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    if (student.password !== password) {
      return res.status(401).json({ message: "Wrong password ❌" });
    }

    res.status(200).json({
      message: "Login successful ✅",
      student
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= MARK ATTENDANCE =================
const markAttendance = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const collageID = req.body.collageID;

    if (!collageID) {
      return res.status(400).json({ message: "CollageID missing ❌" });
    }

    if (!req.file) {
      console.log("❌ FILE NOT RECEIVED");
      return res.status(400).json({
        message: "Image not received ❌"
      });
    }

    const student = await Student.findOne({ collageID });

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    student.image = req.file.filename;

    student.daysPresent = Number(student.daysPresent || 0) + 1;
    student.totalClasses = Number(student.totalClasses || 0) + 1;

    await student.save();

    return res.status(200).json({
      message: "Attendance marked ✅"
    });

  } catch (err) {
    console.log("🔥 FULL ERROR:", err);
    return res.status(500).json({
      message: "Server crash",
      error: err.message
    });
  }
};

// ================= SEMESTER ATTENDANCE =================
const semesterAttendance = async (req, res) => {
  try {
    const { collageID } = req.body;

    const student = await Student.findOne({ collageID });

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    const total = student.totalClasses || 0;
    const present = student.daysPresent || 0;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({
      totalClasses: total,
      presentCount: present,
      percentage
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= EXPORT =================
module.exports = {
  addStudent,
  getAllStudents,
  studentSignin,
  markAttendance,
  semesterAttendance
};