const mongoose = require("mongoose");

const SemesterConfigSchema = new mongoose.Schema({
    _id: { type: String, default: "semesterConfig" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalWorkingDays: { type: Number, required: true }
});
module.exports = mongoose.model("SemesterConfig", SemesterConfigSchema);