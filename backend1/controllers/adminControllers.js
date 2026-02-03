const Admin = require("../models/Admin");
const Attendance = require("../models/studentAttendance");

// Manual admin registration disabled
const addAdmin = async (req,res) =>{
    return res.status(403).json({ message: "Manual admin registration is disabled." });
}

// Admin sign-in
const adminSignin = async(req,res) =>{
    console.log(req.body);
    try{
        const admin = await Admin.findOne({adminID : req.body.adminID});
        if(!admin){
            return res.status(404).json({message : "Admin not found"});
        }
        if(admin.password !== req.body.password)
            return res.status(401).json({message : "Invalid password"});
        
        return res.status(200).json({message : "Sign-in success"});
    }
    catch(err){
        console.log(err);
        return res.status(502).json({message : "Error"});
    }
}

// Initialize class
const initializeClass = async(req,res) =>{
    try{
        const att = new Attendance();
        att.date = new Date().toISOString().split('T')[0];
        att.students = [];
        await att.save();
        return res.status(201).json({message : "Class established successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error initializing class" });
    }
}

module.exports = { addAdmin, initializeClass, adminSignin };
