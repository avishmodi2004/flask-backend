const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    collageID : {type : String, reqired : true, unique : true},
    name: { type: String, required: true },
    password : {type : String, required : true},
    daysPresent: { type: Number, default: 0 },
    studentImage:{type : Buffer , reqired : true},
    lastAttendance: { type: Date }
});
module.exports = mongoose.model("Student",StudentSchema);