const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
// ================= ADD STUDENT =================
const addStudent = async (req, res) => {
  try {
    console.log(req.body);
    const { collageID, name, password, semester } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image required ❌" });
    }
    
    const uploadDir = path.join(__dirname, "../uploads");

    // create folder if not exists
     if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${collageID}.jpg`);
    fs.writeFileSync(filePath, req.file.buffer);
    const student = new Student({
      collageID,
      name,
      password,
      semester,
      image: filePath,
      daysPresent: 0,
      totalClasses: 0
    });

    await student.save();

    res.status(201).json({
      message: "Student added successfully ✅",
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
    
    
    const recievedImage = req.file.buffer;
    const storedImage = fs.readFileSync(student.image);

    if(!storedImage){
       return res.status(404).json({ message: "image not found ❌" });
    }

    const faceResponse = await axios.post("http://localhost:5000/face-compare", {image1 : recievedImage.toString("base64"),
      image2 : storedImage.toString("base64")
    });
    
    
    if(faceResponse.data.result === "success"){
        student.daysPresent = Number(student.daysPresent || 0) + 1;
        student.totalClasses = Number(student.totalClasses || 0) + 1;

        await student.save();

        return res.status(200).json({
           message: "Attendance marked ✅"
        });
    }
    else{
      return res.status(404).json({message : "face does not match"});
    }
    

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