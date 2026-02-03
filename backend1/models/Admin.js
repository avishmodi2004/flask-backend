const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    adminID :  {type : String, reqired : true, unique : true},
    name :{type : String, required : true},
    password : {type : String , required : true}
});
module.exports = mongoose.model("Admin", AdminSchema);
