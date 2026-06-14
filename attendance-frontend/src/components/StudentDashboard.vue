<template>
  <div class="dashboard-wrapper">
    <div class="overlay"></div>

    <div class="glass-card" v-if="student && student.collageID">
      <div class="profile-header">
        <h1 class="welcome-msg">Welcome, {{ student.name }}</h1>
        <p class="id-badge">College ID: {{ student.collageID }}</p>
      </div>

      <div class="attendance-container">
        <div class="camera-box">
          <div v-if="!isClassStarted" class="locked-overlay">
            <p>🔒 Class Not Started</p>
          </div>

          <FaceAttendance v-else @sendBlob="handleBlob" />
        </div>

      

        <div v-if="challengeText" class="challenge-info">
          Challenge: {{ challengeText }}
        </div>

        <button
          class="sign-in-btn"
          :disabled="loading || !isClassStarted || !imageCaptured"
          @click="handleAttendanceClick"
        >
          {{ loading ? "Comparing Face..." : "Submit Attendance" }}
        </button>
      </div>

      <button class="logout" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import FaceAttendance from "../components/FaceAttendance.vue";
import axios from "axios";

export default {
  components: { FaceAttendance },

  data() {
    return {
      student: {},
      isClassStarted: false,
      activeSubjectCode: "",

      imageCaptured: false,
      imageBlob: null,
      challengeText: "",

      loading: false,
      statusTimer: null,
    };
  },

 methods: {
  async checkClassStatus() {
  try {
    const res = await axios.get("http://localhost:4000/api/class/all-active");

    if (Array.isArray(res.data) && res.data.length > 0) {
      this.isClassStarted = true;
      this.activeSubjectCode = res.data[0].subjectCode;
    } else if (res.data && res.data.isActive) {
      this.isClassStarted = true;
      this.activeSubjectCode = res.data.subjectCode;
    } else {
      this.isClassStarted = false;
      this.activeSubjectCode = "";
      this.imageCaptured = false;
      this.imageBlob = null;
      this.challengeText = "";
    }
  } catch (err) {
    console.error("Server Status check failed!", err);
    this.isClassStarted = false;
  }
},

  async handleBlob(data) {
    this.imageBlob = data.blob;
    this.challengeText = data.challenge;
    this.imageCaptured = false;

    const imageBase64 = await this.blobToBase64(this.imageBlob);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/student/verify-challenge",
        {
          image1: imageBase64,
          challenge: this.challengeText,
        }
      );

      if (res.data.success) {
        this.imageCaptured = true;
        alert(`Challenge passed ✅\nNow submit attendance`);
      } else {
        this.imageBlob = null;
        this.imageCaptured = false;
        alert(res.data.message || "Challenge failed ❌");
      }
    } catch (err) {
      this.imageBlob = null;
      this.imageCaptured = false;
      alert(err.response?.data?.message || "Challenge failed ❌");
    }
  },

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },
  async handleAttendanceClick() {
  if (!this.imageBlob || !this.challengeText) {
    alert("Please capture and pass the challenge first");
    return;
  }

  if (!this.activeSubjectCode) {
    alert("Subject code is missing");
    return;
  }

  this.loading = true;

  try {
    const imageBase64 = await this.blobToBase64(this.imageBlob);

    const res = await axios.post(
      "http://localhost:4000/api/student/mark-attendance",
      {
        collageID: this.student.collageID,
        image1: imageBase64,
        subjectCode: this.activeSubjectCode,
        challenge: this.challengeText,
      }
    );

    if (res.data.success) {
      alert(res.data.message || "Attendance marked successfully");

      this.imageCaptured = false;
      this.imageBlob = null;
      this.challengeText = "";

      window.location.reload();
    } else {
      alert(res.data.message || "Attendance failed");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Attendance failed");
  } finally {
    this.loading = false;
  }
},

  logout() {
    if (this.statusTimer) clearInterval(this.statusTimer);
    localStorage.removeItem("student");
    this.$router.push("/");
  }
},

  mounted() {
    const stored = localStorage.getItem("student");

    if (stored) {
      this.student = JSON.parse(stored);
      this.checkClassStatus();
      this.statusTimer = setInterval(this.checkClassStatus, 3000);
    } else {
      this.$router.push("/");
    }
  },

  beforeUnmount() {
    if (this.statusTimer) clearInterval(this.statusTimer);
  },
};
</script>
<style scoped>

.dashboard-wrapper{
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  overflow: hidden;

  background:
  linear-gradient(
    rgba(0,0,0,0.65),
    rgba(0,0,0,0.75)
  ),
  url("/src/assets/admin-bg.png");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  padding: 20px;
}

/* animated glowing circles */

.dashboard-wrapper::before{
  content: "";

  position: absolute;

  width: 500px;
  height: 500px;

  background:
  radial-gradient(
    circle,
    rgba(59,130,246,0.25),
    transparent 70%
  );

  top: -120px;
  left: -120px;

  animation: glowMove 8s infinite alternate;
}

.dashboard-wrapper::after{
  content: "";

  position: absolute;

  width: 450px;
  height: 450px;

  background:
  radial-gradient(
    circle,
    rgba(168,85,247,0.25),
    transparent 70%
  );

  bottom: -120px;
  right: -120px;

  animation: glowMove2 8s infinite alternate;
}

@keyframes glowMove{

  from{
    transform: translate(0,0);
  }

  to{
    transform: translate(60px,40px);
  }
}

@keyframes glowMove2{

  from{
    transform: translate(0,0);
  }

  to{
    transform: translate(-60px,-40px);
  }
}

/* main card */

.glass-card{

  position: relative;
  z-index: 10;

  width: 430px;

  padding: 35px;

  border-radius: 28px;

  background:
  rgba(15,23,42,0.72);

  backdrop-filter: blur(18px);

  border:
  1px solid rgba(255,255,255,0.12);

  box-shadow:
  0 15px 45px rgba(0,0,0,0.55);

  text-align: center;

  color: white;

  animation: fadeUp 0.5s ease;
}

@keyframes fadeUp{

  from{
    opacity:0;
    transform: translateY(30px);
  }

  to{
    opacity:1;
    transform: translateY(0);
  }
}

/* heading */

.welcome-msg{

  font-size: 32px;

  font-weight: 700;

  margin-bottom: 8px;

  background:
  linear-gradient(
    to right,
    #38bdf8,
    #818cf8
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.id-badge{

  color: #cbd5e1;

  margin-bottom: 25px;

  font-size: 15px;
}

/* camera box */

.camera-box{

  width: 100%;
  height: 300px;

  border-radius: 22px;

  overflow: hidden;

  position: relative;

  background: black;

  border:
  2px solid rgba(255,255,255,0.08);

  margin-bottom: 20px;

  box-shadow:
  inset 0 0 20px rgba(0,0,0,0.5);
}

/* class not started */

.locked-overlay{

  position: absolute;

  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background:
  rgba(0,0,0,0.55);

  color: #ef4444;

  font-size: 22px;

  font-weight: bold;

  z-index: 5;
}

/* live text */

.live-tag{

  margin-bottom: 18px;

  color: #22c55e;

  font-weight: bold;

  font-size: 16px;

  animation: blink 1.2s infinite;
}

@keyframes blink{

  50%{
    opacity:0.5;
  }
}

/* submit button */

.sign-in-btn{

  width: 100%;

  padding: 15px;

  border: none;

  border-radius: 16px;

  background:
  linear-gradient(
    to right,
    #06b6d4,
    #3b82f6
  );

  color: white;

  font-size: 16px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;
}

.sign-in-btn:hover{

  transform: translateY(-2px);

  box-shadow:
  0 10px 25px rgba(59,130,246,0.35);
}

.sign-in-btn:disabled{

  background: #1e293b;

  color: #64748b;

  cursor: not-allowed;

  box-shadow: none;
}

/* logout */

.logout{

  margin-top: 20px;

  background: transparent;

  border: none;

  color: #94a3b8;

  font-size: 15px;

  cursor: pointer;

  transition: 0.3s;
}

.logout:hover{
  color: white;
}

/* responsive */

@media(max-width:500px){

  .glass-card{
    width: 95%;
    padding: 25px;
  }

  .camera-box{
    height: 250px;
  }

  .welcome-msg{
    font-size: 26px;
  }
}

</style>