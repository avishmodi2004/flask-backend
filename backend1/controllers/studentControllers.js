const Student = require("../models/Student");

const addStudent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { collageID, name, password, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const student = new Student({
      collageID,
      name,
      password,
      semester,
      image: req.file.filename // 🔥 FIXED
    });

    await student.save();

    res.status(201).json({
      message: "Student added successfully",
      student
    });

  } catch (err) {
    console.log("🔥 ADD ERROR:", err);

    res.status(500).json({
      message: err.message // 🔥 IMPORTANT (real error dikhega)
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json({
      data: students
    });

  } catch (err) {
    console.log("🔥 FETCH ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = { addStudent, getAllStudents };