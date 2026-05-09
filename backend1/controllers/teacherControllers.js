const Teacher = require("../models/Teacher");

// Saara logic yahan shift kar dein
exports.addTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.json({ message: "Teacher added ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};
// ... baaki logic (signin, delete) bhi yahan aayega