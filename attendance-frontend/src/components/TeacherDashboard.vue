<template>
  <div class="dashboard-wrapper">
    <div class="glass-card">

      <h1>Teacher Portal</h1>

      <p>
        Welcome, {{ teacher.name }}
        ({{ teacher.teacherID }})
      </p>

      <!-- SUBJECT SELECT -->
      <select
        v-model="selectedSubject"
        :disabled="isClassRunning"
      >
        <option value="" disabled>
          Select Subject
        </option>

        <option
          v-for="sub in subjects"
          :key="sub._id"
          :value="sub.code"
        >
          {{ sub.name }} - Semester {{ sub.semester }}
        </option>
      </select>

      <!-- START / STOP -->
      <button
        @click="toggleClass"
        :disabled="loading"
      >
        {{ isClassRunning ? "Stop Class" : "Start Class" }}
      </button>

      <button
        class="logout-btn"
        @click="logout"
      >
        Logout
      </button>

      <!-- CLASS TEACHER INFO -->
      <p v-if="isClassTeacher" class="present">
        ✅ Class Teacher Access Enabled
      </p>

      <!-- LIVE SECTION -->
      <div
        v-if="isClassRunning"
        class="live-box"
      >

        <!-- TIMER -->
        <h3 class="timer">
          ⏳ Time Left:
          {{ formatTime(remainingTime) }}
        </h3>

        <h2>Live Attendance</h2>

        <p>
          Total Students:
          {{ totalStudents }}
        </p>

        <p>
          Present:
          {{ presentCount }}
        </p>

        <p>
          Absent:
          {{ absentCount }}
        </p>

        <!-- TABLE -->
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>College ID</th>
              <th>Status</th>
              <th>Manual Attendance</th>
              <th v-if="isClassTeacher">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="student in students"
              :key="student._id"
            >
              <td>{{ student.name }}</td>

              <td>
                {{ student.collageID }}
              </td>

              <td>
                <span
                  v-if="student.status === 'Present'"
                  class="present"
                >
                  Present
                </span>

                <span
                  v-else
                  class="absent"
                >
                  Absent
                </span>
              </td>

             <td>
  <button
    v-if="isClassTeacher && student.status === 'Absent'"
    class="small-btn"
    @click="manualMark(student.collageID)"
  >
    Mark Present
  </button>

  <button
    v-else-if="isClassTeacher && student.status === 'Present'"
    class="small-btn"
    @click="removeAttendance(student.collageID)"
  >
    Remove Attendance
  </button>

  <span v-else>
    {{ student.status }}
  </span>
</td>

<td v-if="isClassTeacher">
  <button
    class="small-btn"
    @click="deleteStudent(student._id)"
  >
    Delete Student
  </button>
</td>

            </tr>
          </tbody>
        </table>

      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {

      teacher: {},

      subjects: [],

      selectedSubject: "",

      isClassRunning: false,

      loading: false,

      students: [],

      totalStudents: 0,

      presentCount: 0,

      absentCount: 0,

      apiBase: "http://localhost:4000/api",

      liveTimer: null,

      // TIMER
      remainingTime: 0,

timerInterval: null,

isClassTeacher: false
    };
  },

  methods: {
    async checkClassTeacher() {
  try {
    const res = await axios.get(
      `${this.apiBase}/class-teacher/check/${this.teacher.teacherID}`
    );

    this.isClassTeacher = res.data.isClassTeacher;
  } catch (err) {
    this.isClassTeacher = false;
  }
},

async deleteStudent(studentId) {
  if (!confirm("Student delete karna hai?")) return;

  try {
    const res = await axios.delete(
      `${this.apiBase}/student/class-teacher-delete/${studentId}`,
      {
        data: {
          teacherID: this.teacher.teacherID
        }
      }
    );

    alert(res.data.message);
    await this.fetchLiveAttendance();

  } catch (err) {
    alert(err.response?.data?.message || "Student delete failed");
  }
},

async removeAttendance(collageID) {
  if (!confirm("Attendance remove karni hai?")) return;

  try {
    const res = await axios.delete(
      `${this.apiBase}/attendance/remove`,
      {
        data: {
          teacherID: this.teacher.teacherID,
          subjectCode: this.selectedSubject,
          collageID
        }
      }
    );

    alert(res.data.message);
    await this.fetchLiveAttendance();

  } catch (err) {
    alert(err.response?.data?.message || "Attendance remove failed");
  }
},

    // FETCH SUBJECTS
    async fetchSubjects() {

      const res = await axios.get(
        `${this.apiBase}/subjects/teacher/${this.teacher.teacherID}`
      );

      this.subjects = res.data;

      if (this.subjects.length > 0) {
        this.selectedSubject = this.subjects[0].code;
      }
    },

    // CHECK CLASS STATUS
    async checkClassStatus() {

      const res = await axios.get(
        `${this.apiBase}/class/current-status/${this.teacher.teacherID}`
      );

      this.isClassRunning =
        res.data.isLive ||
        res.data.isActive;

      if (res.data.subjectCode) {
        this.selectedSubject =
          res.data.subjectCode;
      }

      // TIMER START
      if (res.data.endTime) {
        this.startCountdown(
          res.data.endTime
        );
      }

      if (this.isClassRunning) {
        this.startLiveAttendance();
      }
    },

    // START / STOP CLASS
    async toggleClass() {

      if (!this.selectedSubject) {
        alert("Please select subject");
        return;
      }

      this.loading = true;

      try {

        const action =
          this.isClassRunning
            ? "stop"
            : "start";

        const res = await axios.post(
          `${this.apiBase}/class/toggle`,
          {
            teacherID:
              this.teacher.teacherID,

            subjectCode:
              this.selectedSubject,

            action
          }
        );

        this.isClassRunning =
          res.data.isLive;

        // TIMER START
        if (res.data.endTime) {
          this.startCountdown(
            res.data.endTime
          );
        }

        if (this.isClassRunning) {
          this.startLiveAttendance();
        } else {
          this.stopLiveAttendance();
        }

      } catch (err) {

        alert(
          err.response?.data?.message ||
          "Class action failed"
        );

      } finally {

        this.loading = false;

      }
    },

    // LIVE ATTENDANCE
    async fetchLiveAttendance() {

      if (!this.selectedSubject)
        return;

      const res = await axios.get(
        `${this.apiBase}/attendance/live/${this.selectedSubject}/${this.teacher.teacherID}`
      );

      this.students =
        res.data.students;

      this.totalStudents =
        res.data.totalStudents;

      this.presentCount =
        res.data.presentCount;

      this.absentCount =
        res.data.absentCount;
    },

    // AUTO REFRESH
    startLiveAttendance() {

      this.fetchLiveAttendance();

      if (this.liveTimer) {
        clearInterval(
          this.liveTimer
        );
      }

      this.liveTimer =
        setInterval(() => {

          this.fetchLiveAttendance();

        }, 3000);
    },

    // STOP LIVE
    stopLiveAttendance() {

      this.students = [];

      this.totalStudents = 0;

      this.presentCount = 0;

      this.absentCount = 0;

      if (this.liveTimer) {

        clearInterval(
          this.liveTimer
        );

        this.liveTimer = null;
      }

      // STOP TIMER
      if (this.timerInterval) {

        clearInterval(
          this.timerInterval
        );

        this.timerInterval = null;
      }
    },

    // MANUAL ATTENDANCE
    async manualMark(collageID) {

      try {

        await axios.post(
          `${this.apiBase}/attendance/manual`,
          {
            teacherID:
              this.teacher.teacherID,

            subjectCode:
              this.selectedSubject,

            collageID
          }
        );

        await this.fetchLiveAttendance();

      } catch (err) {

        alert(
          err.response?.data?.message ||
          "Manual attendance failed"
        );
      }
    },

    // FORMAT TIMER
    formatTime(ms) {

      if (!ms || ms <= 0)
        return "00:00";

      const totalSeconds =
        Math.floor(ms / 1000);

      const minutes =
        Math.floor(totalSeconds / 60);

      const seconds =
        totalSeconds % 60;

      return `
        ${String(minutes).padStart(2, "0")}
        :
        ${String(seconds).padStart(2, "0")}
      `;
    },

    // START TIMER
    startCountdown(endTime) {

      this.remainingTime =
        endTime - Date.now();

      if (this.timerInterval) {

        clearInterval(
          this.timerInterval
        );
      }

      this.timerInterval =
        setInterval(() => {

          this.remainingTime =
            endTime - Date.now();

          if (
            this.remainingTime <= 0
          ) {

            clearInterval(
              this.timerInterval
            );

            this.isClassRunning = false;

            this.stopLiveAttendance();
          }

        }, 1000);
    },

    // LOGOUT
    logout() {

      localStorage.removeItem(
        "teacher"
      );

      this.$router.push("/");
    }
  },

  async mounted() {

    const stored =
      localStorage.getItem(
        "teacher"
      );

    if (!stored) {

      this.$router.push("/");
      return;
    }

    this.teacher =
      JSON.parse(stored);

    await this.checkClassTeacher();
await this.fetchSubjects();
await this.checkClassStatus();
  },

  beforeUnmount() {

    this.stopLiveAttendance();
  }
};
</script>

<style scoped>

.dashboard-wrapper{
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;

  background:
  linear-gradient(
    rgba(0,0,0,0.55),
    rgba(0,0,0,0.7)
  ),
  url("@/assets/login-bg.jpeg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow-y: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 30px;
}

.glass-card{

  width: 95%;
  max-width: 1300px;

  min-height: 90vh;

  background: rgba(15,23,42,0.72);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.12);

  border-radius: 28px;

  padding: 35px;

  color: white;

  box-shadow:
  0 10px 40px rgba(0,0,0,0.5);

  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn{
  from{
    opacity:0;
    transform:translateY(20px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }
}

h1{
  font-size: 40px;
  font-weight: 700;

  margin-bottom: 10px;

  background: linear-gradient(
    to right,
    #38bdf8,
    #818cf8
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p{
  color: #cbd5e1;
  margin-bottom: 15px;
}

select{

  width: 100%;

  padding: 14px;

  border-radius: 14px;

  border: 1px solid rgba(255,255,255,0.15);

  background: rgba(255,255,255,0.08);

  color: white;

  outline: none;

  margin-top: 10px;
  margin-bottom: 20px;

  font-size: 15px;
}

select option{
  background: #0f172a;
}

button{

  padding: 13px 22px;

  border: none;

  border-radius: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;

  margin-right: 12px;
  margin-bottom: 15px;
}

button:hover{
  transform: translateY(-2px);
}

button:first-of-type{

  background:
  linear-gradient(
    to right,
    #06b6d4,
    #3b82f6
  );

  color: white;
}

.logout-btn{

  background:
  rgba(255,255,255,0.08);

  color: #e2e8f0;

  border:
  1px solid rgba(255,255,255,0.1);
}

.logout-btn:hover{
  background:
  rgba(255,255,255,0.15);
}

.present{
  color: #22c55e;
  font-weight: bold;
}

.absent{
  color: #ef4444;
  font-weight: bold;
}

.live-box{

  margin-top: 25px;

  background:
  rgba(255,255,255,0.05);

  border:
  1px solid rgba(255,255,255,0.08);

  border-radius: 22px;

  padding: 25px;

  overflow-x: auto;
}

.timer{

  color: #facc15;

  margin-bottom: 18px;

  font-size: 22px;
}

table{

  width: 100%;

  border-collapse: collapse;

  margin-top: 20px;

  overflow: hidden;

  border-radius: 18px;
}

thead{

  background:
  linear-gradient(
    to right,
    #2563eb,
    #06b6d4
  );
}

th{

  padding: 16px;

  text-align: center;

  font-size: 15px;

  color: white;
}

td{

  padding: 16px;

  text-align: center;

  background:
  rgba(255,255,255,0.04);

  border-bottom:
  1px solid rgba(255,255,255,0.05);

  color: #f1f5f9;
}

tr:hover td{

  background:
  rgba(255,255,255,0.08);

  transition: 0.3s;
}

.small-btn{

  background:
  linear-gradient(
    to right,
    #10b981,
    #059669
  );

  color: white;

  padding: 8px 14px;

  border-radius: 10px;

  font-size: 13px;

  margin: 4px;
}

.small-btn:hover{
  transform: scale(1.05);
}

@media(max-width:768px){

  .glass-card{
    padding: 20px;
  }

  h1{
    font-size: 28px;
  }

  table{
    font-size: 13px;
  }

  th,td{
    padding: 10px;
  }

  button{
    width: 100%;
  }
}

background:
linear-gradient(
rgba(0,0,0,0.55),
rgba(0,0,0,0.7)
),
url("/src/assets/login-bg.jpeg");

</style>