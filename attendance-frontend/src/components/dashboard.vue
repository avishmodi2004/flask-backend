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

      <button @click="logout">Logout</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      student: {},
      selectedSemester: 1,
      totalClasses: 0,
      presentCount: 0,
      percentage: 0
    };
  },
  methods: {
    async fetchAttendance() {
      try {
        const res = await axios.post(
          "http://localhost:3000/student/semester-attendance",
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

.dashboard{
  height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#5b8cff,#e0a9ff);
}

.card{
  background:white;
  padding:50px 40px;
  border-radius:28px;
  width:420px;
  text-align:center;
  box-shadow:0 25px 60px rgba(0,0,0,0.2);
}

.card h1{
  color:#222;
  margin-bottom:8px;
}

.card h3{
  color:#555;
  margin-bottom:10px;
}

.semester-box{
  margin:25px 0;
}

label{
  display:block;
  margin-bottom:8px;
  color:#333;
  font-weight:500;
}

select{
  padding:10px 14px;
  border-radius:10px;
  border:1px solid #ccc;
  font-size:15px;
}

.attendance-info{
  margin-top:20px;
}

.attendance-info h3{
  color:#444;
}

.attendance-info h2{
  color:#2563eb;
  margin-top:10px;
}

button{
  margin-top:25px;
  padding:12px 22px;
  border:none;
  border-radius:14px;
  background:#2563eb;
  color:white;
  font-weight:600;
  cursor:pointer;
}

</style>