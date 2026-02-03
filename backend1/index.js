const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Admin = require("./models/Admin"); // Admin schema
const studentRoutes = require("./routers/studentRoutes");
const adminRoutes = require("./routers/adminRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json({ limit: "70mb" }));
app.use(express.urlencoded({ limit: "70mb", extended: true }));

const corsOptions = {
    origin: "http://localhost:5173", // Vue.js frontend port
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use("/api", studentRoutes);
app.use("/api", adminRoutes);

// Permanent Admin Creation
const createPermanentAdmin = async () => {
    try {
        const adminID = "admin01"; // Change as needed
        const existingAdmin = await Admin.findOne({ adminID });

       if (!existingAdmin) {
    const admin = new Admin({
        adminID,
        name: "Admin",
        password: "neel@123" // New password
    });
    await admin.save();
    console.log("Permanent admin created!");
} else {
    existingAdmin.password = "neel@123"; // Update password
    existingAdmin.name = "Neel Admin";  // Update name (optional)

    await existingAdmin.save();
    console.log("Admin credentials updated!");
}

    } catch (err) {
        console.error("Error creating permanent admin:", err);
    }
}

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("DB connected");
    createPermanentAdmin(); // Automatic admin creation
})
.catch(err => console.log("Error connecting to DB: " + err));

// Start server
app.listen(4000, () => {
    console.log("App is running ....");
});
