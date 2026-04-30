<template>
  <div class="top-container">

    <p>Search student by collage ID</p>

    <input v-model="collageID" placeholder="collage Id">

    <button @click="search">Search</button>
    <button @click="$router.push('/signin')">Logout</button>
    <button @click="$router.push('/admin-settings')">
      Change Admin Details
    </button>
    <button @click="toAdd = !toAdd">Add Student</button>

    <!-- ADD STUDENT FORM -->
    <div class="container" v-if="toAdd">
      <form @submit.prevent="registerStudent">

        <input v-model="student.name" placeholder="Student Name" required>
        <input v-model="student.collageID" placeholder="Collage ID" required>
        <input type="password" v-model="student.password" placeholder="Password" required>

        <select v-model="student.semester" required>
          <option disabled value="">Select Semester</option>
          <option value="1">Sem 1</option>
          <option value="2">Sem 2</option>
          <option value="3">Sem 3</option>
          <option value="4">Sem 4</option>
          <option value="5">Sem 5</option>
          <option value="6">Sem 6</option>
        </select>

        <faceAttendance @sendBlob="handleBlob"/>

        <!-- 🔥 IMAGE STATUS -->
        <p v-if="student.studentImage" style="color:green;">
          Image Captured ✅
        </p>
        <p v-else style="color:red;">
          Capture Image Required ❌
        </p>

        <button type="submit">Add</button>

      </form>
    </div>

    <!-- STUDENT DETAILS -->
    <div class="student-record" v-if="studentRecord !== null">
      <h1>Student details</h1>
      <h3>Name : {{ studentRecord.name }}</h3>
      <h3>Collage ID : {{ studentRecord.collageID }}</h3>
      <h3>Days Present : {{ studentRecord.daysPresent }}</h3>
    </div>

    <!-- STUDENT LIST -->
    <div class="student-records" v-if="records !== null">
      <h3>Student List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Collage Id</th>
            <th>Days</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in records" :key="item.collageID">
            <td>{{ item.name }}</td>
            <td>{{ item.collageID }}</td>
            <td>{{ item.daysPresent }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="startClass">Start Class</button>

  </div>
</template>

<script>
import { fetchAllStudents, addStudent, classInit } from '@/services/api';
import faceAttendance from './FaceAttendance.vue';

export default {
  components: { faceAttendance },

  data() {
    return {
      records: null,
      toAdd: false,
      collageID: "",
      studentRecord: null,
      student: {
        collageID: "",
        name: "",
        password: "",
        semester: "",
        studentImage: null
      }
    };
  },

  methods: {

    handleBlob(blob) {
      this.student.studentImage = blob;
    },

    async getRecords() {
      try {
        const res = await fetchAllStudents();
        this.records = res.data;
      } catch (err) {
        console.error("Error loading students", err);
      }
    },

    async startClass() {
      try {
        await classInit();
        console.log("Class started");
      } catch (err) {
        console.error("Start failed", err);
      }
    },

    search() {
      this.studentRecord = this.records?.find(
        s => s.collageID === this.collageID
      ) || null;

      if (!this.studentRecord) {
        console.error("Student not found");
      }
    },

    async registerStudent() {
      try {

        // 🔥 FULL VALIDATION
        if (!this.student.name || !this.student.collageID || !this.student.password) {
          console.error("Fill all fields ❌");
          return;
        }

        if (!this.student.semester) {
          console.error("Select semester ❌");
          return;
        }

        if (!this.student.studentImage) {
          console.error("Capture image first ❌");
          return;
        }

        await addStudent(this.student);

        console.log("Student added ✅");

        // RESET
        this.student = {
          collageID: "",
          name: "",
          password: "",
          semester: "",
          studentImage: null
        };

        this.toAdd = false;
        this.getRecords();

      } catch (err) {
        console.error("Add error", err);
      }
    }

  },

  mounted() {
    this.getRecords();
  }
};
</script>

<style scoped>
.top-container {
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
}

.container {
  margin: 20px auto;
  width: 400px;
  padding: 25px;
  background: white;
  color: black;
  border-radius: 12px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
}

button {
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
}

.student-record,
.student-records {
  margin-top: 20px;
  background: white;
  padding: 20px;
  color: black;
}

table {
  width: 100%;
}
</style>