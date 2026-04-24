const Student = require("../models/Student");
const Attendance = require("../models/studentAttendance");

// ================= ADD STUDENT =================
const addStudent = async (req, res) => {
try {
const { collageID, name, password, semester } = req.body;

```
if (!collageID || !name || !password || !semester) {
  return res.status(400).json({ message: "Missing required fields" });
}

if (!req.file) {
  return res.status(400).json({ message: "Image required" });
}

const student = new Student({
  collageID,
  name,
  password,
  semester,
  studentImage: req.file.buffer
});

await student.save();

return res.status(201).json({ message: "Student added successfully" });
```

} catch (err) {
console.log("ADD ERROR:", err);
return res.status(500).json({ message: "Server error" });
}
};

// ================= GET ALL STUDENTS =================
const getAllStudents = async (req, res) => {
try {
const students = await Student.find();

```
return res.status(200).json({
  data: students
});
```

} catch (err) {
console.log(err);
return res.status(500).json({ message: "Error fetching students" });
}
};

// ================= SEMESTER ATTENDANCE =================
const getSemesterAttendance = async (req, res) => {
try {
const { collageID, semester } = req.body;

```
if (!collageID || !semester) {
  return res.status(400).json({
    message: "Missing collageID or semester"
  });
}

const records = await Attendance.find({ semester });

let presentDays = 0;

for (let record of records) {
  // 🔥 SAFE CHECK
  if (record.students && Array.isArray(record.students)) {
    if (record.students.includes(collageID)) {
      presentDays++;
    }
  }
}

return res.status(200).json({ presentDays });
```

} catch (err) {
console.log("SEMESTER ERROR:", err);
return res.status(500).json({ message: "Server error" });
}
};

module.exports = {
addStudent,
getAllStudents,
getSemesterAttendance
};
