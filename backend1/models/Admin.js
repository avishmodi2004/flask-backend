const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
adminID: String,
password: String,
name: String
});

module.exports = mongoose.model("Admin", adminSchema);
