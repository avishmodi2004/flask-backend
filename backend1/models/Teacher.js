const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacherID: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  password: { type: String, required: true },
  // ✅ FIX: 'subject' ko optional kar diya hai ya default empty array rakha hai
  // Taaki validation fail na ho agar aap registration ke waqt subject na dein
  subject: { type: String, required: false }, 
  subjects: [{ type: String }] // Array format for multiple subjects
});

module.exports = mongoose.model("Teacher", teacherSchema);