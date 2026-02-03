const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
    date : {type : Date, required : true , unique : true},
    students:[
        {type : String}
    ]

});

module.exports =  mongoose.model("studentAttendance",studentAttendanceSchema);