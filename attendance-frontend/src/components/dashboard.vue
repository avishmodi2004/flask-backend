<template>
  <div class="dashboard">

    <div class="card">
      <h1>Welcome {{ student.name }}</h1>
      <h3>College ID: {{ student.collageID }}</h3>

      <div class="semester-box">
        <label>Select Semester:</label>
        <select v-model="selectedSemester" @change="fetchAttendance">
          <option v-for="sem in 8" :key="sem" :value="sem">
            Semester {{ sem }}
          </option>
        </select>
      </div>

      <div class="attendance-info">
        <h3>Total Classes: {{ totalClasses }}</h3>
        <h3>Present: {{ presentCount }}</h3>
        <h2>Percentage: {{ percentage }}%</h2>
      </div>

      <!-- 🔥 MARK ATTENDANCE -->
      <div class="attendance-box">
        <h3>Mark Attendance</h3>

        <FaceAttendance @sendBlob="handleBlob" />

        <p v-if="imageCaptured" style="color:green;">
          Image Captured ✅
        </p>
        <p v-else style="color:red;">
          Capture Image Required ❌
        </p>

        <button @click="submitAttendance">
          Submit Attendance
        </button>
      </div>

      <button @click="logout">Logout</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import FaceAttendance from "./FaceAttendance.vue";

export default {
  components: {
    FaceAttendance
  },

  data() {
    return {
      student: {},
      selectedSemester: 1,
      totalClasses: 0,
      presentCount: 0,
      percentage: 0,

      imageBlob: null,
      imageCaptured: false
    };
  },

  methods: {

    handleBlob(blob) {
      console.log("📸 Blob received:", blob);
      this.imageBlob = blob;
      this.imageCaptured = true;
    },

    // 🔥 FINAL SUBMIT FIX
    async submitAttendance() {
      if (!this.imageBlob) {
        alert("Capture image first ❌");
        return;
      }

      try {
        const formData = new FormData();

        // 🔥 STRONG FILE CONVERSION
        const file = new File(
          [this.imageBlob],
          "photo.jpg",
          { type: this.imageBlob.type || "image/jpeg" }
        );

        console.log("📤 Sending file:", file);

        formData.append("collageID", this.student.collageID);
        formData.append("image", file);

        await axios.post(
          "http://localhost:5000/api/student/mark-attendance",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        alert("Attendance Marked ✅");

        this.fetchAttendance();

      } catch (err) {
        console.error("❌ ERROR:", err);
        alert("Attendance failed ❌");
      }
    },

    async fetchAttendance() {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/student/semester-attendance",
          {
            collageID: this.student.collageID,
            semester: this.selectedSemester
          }
        );

        this.totalClasses = res.data.totalClasses;
        this.presentCount = res.data.presentCount;
        this.percentage = res.data.percentage;

      } catch (err) {
        console.log(err);
      }
    },

    logout() {
      localStorage.removeItem("student");
      this.$router.push("/");
    }
  },

  mounted() {
    const stored = JSON.parse(localStorage.getItem("student"));
    this.student = stored;
    this.fetchAttendance();
  }
};
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* MAIN CARD */
.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  padding: 35px 30px;
  border-radius: 25px;
  width: 420px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
}

/* HEADINGS */
.card h1 {
  font-size: 26px;
  margin-bottom: 5px;
}

.card h3 {
  font-size: 14px;
  opacity: 0.8;
}

/* SEMESTER BOX */
.semester-box {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

select {
  padding: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  font-size: 14px;
  outline: none;
}

/* ATTENDANCE INFO */
.attendance-info {
  margin-top: 15px;
}

.attendance-info h3 {
  margin: 5px 0;
}

.attendance-info h2 {
  margin-top: 10px;
  font-size: 20px;
  color: #00ffcc;
}

/* MARK ATTENDANCE BOX */
.attendance-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
}

/* CAMERA VIDEO */
.attendance-box video {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 10px;
  border: 2px solid rgba(255,255,255,0.3);
}

/* BUTTON */
button {
  margin-top: 15px;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
}

/* STATUS TEXT */
p {
  font-size: 13px;
  margin-top: 5px;
}
</style>