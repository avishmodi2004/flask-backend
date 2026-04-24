const express = require("express");
const router = express.Router();

const {
  addAdmin,
  initializeClass,
  adminSignin
} = require("../controllers/adminControllers");

// ✅ FIXED ROUTES
router.post("/addadmin", addAdmin);
router.get("/initclass", initializeClass);

// 🔥 IMPORTANT FIX (same as frontend)
router.post("/adminSignin", adminSignin);

module.exports = router;