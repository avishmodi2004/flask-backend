const express = require("express");
const router = express.Router();

const {
  adminSignin,
  startClass,
  getClassStatus
} = require("../controllers/adminControllers");

// ✅ ADMIN LOGIN
router.post("/signin", adminSignin);

// 🔥 START CLASS (VERY IMPORTANT)
router.post("/init", startClass);

// 🔥 CHECK STATUS
router.get("/status", getClassStatus);

module.exports = router;