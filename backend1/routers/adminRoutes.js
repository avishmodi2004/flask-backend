const express = require("express");
const router = express.Router();

const {addAdmin,initializeClass,adminSignin} = require("../controllers/adminControllers");

router.post("/addadmin",addAdmin);
router.get("/initclass",initializeClass);
router.post("/adminSignin",adminSignin);
module.exports = router;