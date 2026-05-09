const express = require("express");
const router = express.Router();

const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");


// ===== TEACHER =====

// add
router.post("/teacher", async (req, res) => {
  const teacher = new Teacher(req.body);
  await teacher.save();
  res.json({ message: "Teacher added" });
});

// get
router.get("/teacher", async (req, res) => {
  const data = await Teacher.find();
  res.json(data);
});

// delete
router.delete("/teacher/:id", async (req, res) => {
  await Teacher.deleteOne({ teacherID: req.params.id });
  res.json({ message: "Deleted" });
});

// update
router.put("/teacher/:id", async (req, res) => {
  await Teacher.updateOne({ teacherID: req.params.id }, req.body);
  res.json({ message: "Updated" });
});


// ===== SUBJECT =====

// add
router.post("/subject", async (req, res) => {
  const subject = new Subject(req.body);
  await subject.save();
  res.json({ message: "Subject added" });
});

// get
router.get("/subject", async (req, res) => {
  const data = await Subject.find();
  res.json(data);
});

// delete
router.delete("/subject/:id", async (req, res) => {
  await Subject.deleteOne({ code: req.params.id });
  res.json({ message: "Deleted" });
});

// update
router.put("/subject/:id", async (req, res) => {
  await Subject.updateOne({ code: req.params.id }, req.body);
  res.json({ message: "Updated" });
});

module.exports = router;