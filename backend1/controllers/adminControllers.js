const Admin = require("../models/Admin");

// 🔥 GLOBAL CLASS STATE
let classStarted = false;

// ================= ADMIN LOGIN =================
const adminSignin = async (req, res) => {
  try {
    const { adminID, password } = req.body;

    const admin = await Admin.findOne({ adminID });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found ❌" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Wrong password ❌" });
    }

    res.status(200).json({
      message: "Login successful ✅",
      admin
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ================= START CLASS =================
const startClass = (req, res) => {
  classStarted = true;

  res.status(200).json({
    message: "Class started ✅"
  });
};

// ================= GET CLASS STATUS =================
const getClassStatus = (req, res) => {
  res.json({
    started: classStarted
  });
};

// ================= EXPORT =================
module.exports = {
  adminSignin,
  startClass,
  getClassStatus
};