const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Config
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- ✅ ROUTERS IMPORT ---
const studentRoutes = require("./routers/studentRoutes");
const teacherRoutes = require("./routers/teacherRoutes");
const adminRoutes = require("./routers/adminRoutes");
const subjectRoutes = require("./routers/subjectRoutes");
const attendanceRoutes = require("./routers/attendanceRoutes");
const classRoutes = require("./routers/classRoutes");
const classTeacherRoutes = require("./routers/classTeacherRoutes");

// --- ✅ ROUTES USE ---
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/class", classRoutes);
app.use("/api/class-teacher", classTeacherRoutes);
app.get("/api/check", (req, res) => {
  res.json({ message: "backend updated working" });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/collegeDB")
  .then(() => console.log("MongoDB Connected Successfully! ✅"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Server Listen
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});