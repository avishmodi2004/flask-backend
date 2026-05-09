const Subject = require("../models/Subject");

// 1. Sare subjects dikhane ke liye (Admin Panel Fix)
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
};

// 2. Specific teacher ke subjects (Teacher Portal Fix)
exports.getSubjectsByTeacher = async (req, res) => {
  try {
    const data = await Subject.find({ teacherID: req.params.tid });
    res.json({ subjects: data }); 
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
};

// 3. Naya subject permanent save karne ke liye
exports.addSubject = async (req, res) => {
  try {
    const { name, code, teacherID } = req.body;
    const subject = new Subject({ name, code, teacherID });
    await subject.save();
    res.json({ success: true, message: "Subject saved to DB ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};