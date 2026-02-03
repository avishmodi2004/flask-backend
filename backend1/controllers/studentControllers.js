const Student = require("../models/Student");
const attendance = require("../models/studentAttendance")
const axios = require("axios");
const getAllStudents = async(req,res)=>{
    try{
        const students = await Student.find();

        return res.status(200).json({message : "success", data:students});
    }
    catch(err){
        return res.status(502).json({message : "Error  "});
    }  
};

const addStudent = async (req, res) => {
    if (!req.body.collageID || !req.body.name || !req.body.password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log(req.body);
    try {
        const student = new Student();
        student.name = req.body.name;
        student.collageID = req.body.collageID;
        student.password = req.body.password;
        student.studentImage = req.file.buffer;
        console.log(req.file.buffer);
        await student.save();
        const response = await axios.post('http://localhost:5000/generate-qr' , {collageID : req.body.collageID , image : student.studentImage.toString("base64")});
        console.log(response.data.qr_url);
        return res.status(201).json({ message: "Student added successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to add student" });
    }
};
const getImage = async(req, res) =>{
    try{
          const blobImage = await Student.findOne({collageID : req.body.collageID});

          const base64Image = blobImage.studentImage.toString("base64");
          return res.status(201).json({message : "image found" , image : `data:image/png;base64,${base64Image}`});
    }
    catch(err){
        res.status(404).json({message : "image not found"});
    }
}
const studentSignin = async (req, res)=>{
    console.log(req.body);
    const{CollageID,password} = req.body;
    
    try{
      const student = await Student.findOne({collageID : req.body.collageID});

      if(!student){
          return  res.status(404).json({message : "Student not found"});
      }
      if(student.password !== password)
          return res.status(401).json({message : "invalid password"})
      
      return res.status(200).json({ message: "Sign-in successful" , student : {
           collageID : student.collageID,
           name : student.name,
           days : student.daysPresent
      }});
    }
    catch(error){
         return res.status(502).json({meaasge : "Error  "});
    }
}
const attendanceMark = async(req,res) =>{
    const currDate = new Date().toISOString().split('T')[0];

    try{
        const att = await attendance.findOne({date : currDate});
        console.log("inside mark addendance "+req.body.collageID);
        const stu = await Student.findOne({collageID : req.body.collageID});
        if (!stu) {
            
            return res.status(404).json({ message: "Student not found" });
        }
        
          // Prevent marking attendance twice
          if (!att.students.includes(req.body.collageID)) {
            att.students.push(req.body.collageID);
            stu.lastAttendance = currDate;
            stu.daysPresent += 1;
            await att.save();
            await stu.save();
        } else {
            return res.status(400).json({ message: "Attendance already marked for today" });
        }
        return res.status(200).json({ message: "Attendance marked successfully" });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error while marking attendance" });
    }
}

const attendanceMarkByFace = async(req,res)=>{
       const currDate = new Date().toISOString().split('T')[0];

    try{
        const att = await attendance.findOne({date : currDate});
        console.log("inside mark addendance "+req.body.collageID);
        const stu = await Student.findOne({collageID : req.body.collageID});
        console.log(stu);
       const recievedImage = req.file.buffer;
       const storedImage = stu.studentImage;
       console.log("inside face attendance ");
       console.log("Recieved:", recievedImage.length, "Stored:", storedImage.length);
        if (!stu) {
            
            return res.status(404).json({ message: "Student not found" });
        }
          // Prevent marking attendance twice
          if (!att.students.includes(req.body.collageID)) {

            const response = await axios.post("http://localhost:5000/face-compare",{image1 : recievedImage.toString("base64"), image2 : storedImage.toString("base64")});
            if(response.data.status === "success"){
                att.students.push(req.body.collageID);
                stu.lastAttendance = currDate;
                stu.daysPresent += 1;
                await att.save();
                await stu.save();
            }
            else{
                return res.status(404).json({message : "face does not match"});
            }
        } 
        else
        {
            return res.status(400).json({ message: "Attendance already marked for today" });
        }
        return res.status(200).json({ message: "Attendance marked successfully" });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error while marking attendance" });
    }
}
const getListOfPresentDays = async(req,res) =>{
    console.log(req.body);
    try{
        const records = await attendance.find();
        let result = [];
        
        for(let record of records){
            for(let i = 0; i < record.students.length; ++i){
                if(req.body.collageID === record.students[i]){
                    result.push(record.date);
                    break;
                }
            }
            
        }
        console.log(result);
        return res.status(200).json({message :"success" , presentList : result});
    }
    catch(err){
        return res.status(502).json({message : "Error  "});
    }
}
module.exports = {getAllStudents,addStudent,studentSignin,attendanceMark,attendanceMarkByFace,getListOfPresentDays,getImage};