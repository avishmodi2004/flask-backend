const Admin = require("../models/Admin");

// ✅ ADD ADMIN
const addAdmin = async (req, res) => {
  try {
    const { adminID, password } = req.body;

    const existing = await Admin.findOne({ adminID });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ adminID, password });
    await admin.save();

    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

// ✅ INIT CLASS (dummy for now)
const initializeClass = async (req, res) => {
  try {
    res.json({ message: "Class initialized" });
  } catch (err) {
    res.status(500).json({ message: "Error initializing class" });
  }
};

// ✅ ADMIN LOGIN
const adminSignin = async (req, res) => {
  try {
    const { adminID, password } = req.body;

    const admin = await Admin.findOne({ adminID });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    return res.json({
      message: "Login success",
      admin
    });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ EXPORT ALL (IMPORTANT)
module.exports = {
  addAdmin,
  initializeClass,
  adminSignin
};