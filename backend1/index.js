const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Admin = require("./models/Admin");
const studentRoutes = require("./routers/studentRoutes");
const adminRoutes = require("./routers/adminRoutes");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "70mb" }));
app.use(express.urlencoded({ limit: "70mb", extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ================= ROUTES =================
// ✅ FIXED ROUTES
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// ================= CREATE ADMIN (ONLY ONCE) =================
const createPermanentAdmin = async () => {
    try {
        const adminID = "admin01";

        const existingAdmin = await Admin.findOne({ adminID });

        if (!existingAdmin) {
            const admin = new Admin({
                adminID,
                name: "Neel Admin",
                password: "neel@123"
            });

            await admin.save();
            console.log("✅ Admin created");
        } else {
            console.log("ℹ️ Admin already exists");
        }

    } catch (err) {
        console.log("❌ Admin error:", err);
    }
};

// ================= DATABASE =================
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB")
.then(() => {
    console.log("✅ MongoDB Connected");
    createPermanentAdmin();
})
.catch(err => console.log("❌ DB Error:", err));

// ================= SERVER =================
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});