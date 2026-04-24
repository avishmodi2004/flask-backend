<template>
  <div class="top-container">

```
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

    <input v-model="student.name" placeholder="Student Name">
    <input v-model="student.collageID" placeholder="Collage ID">
    <input type="password" v-model="student.password" placeholder="Password">

    <!-- 🔥 NEW SEMESTER FIELD -->
    <select v-model="student.semester">
      <option disabled value="">Select Semester</option>
      <option value="1">Sem 1</option>
      <option value="2">Sem 2</option>
      <option value="3">Sem 3</option>
      <option value="4">Sem 4</option>
      <option value="5">Sem 5</option>
      <option value="6">Sem 6</option>
    </select>

    <faceAttendance @sendBlob="handleBlob"/>

    <button type="submit">Add</button>

  </form>
</div>

<!-- STUDENT DETAILS -->
<div class="student-record" v-if="studentRecord !== null">
  <h1>Student details</h1>
  <h3>Student Name : {{ studentRecord.name }}</h3>
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
```

  </div>
</template>

<script>
import { fetchAllStudents, addStudent, classInit } from '@/services/api';
import faceAttendance from './FaceAttendance.vue';

export default {
  components: {
    faceAttendance
  },

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
        semester: "", // ✅ ADDED
        studentImage: null
      }
    };
  },

  methods: {

    handleBlob(blob) {
      this.student.studentImage = new File([blob], "photo.jpg", {
        type: "image/jpeg"
      });
    },

    async getRecords() {
      try {
        const response = await fetchAllStudents();
        this.records = response.data;
      } catch (err) {
        console.log(err);
        alert("Error loading students");
      }
    },

    async startClass() {
      try {
        await classInit();
        alert("Class started successfully ✅");
      } catch (err) {
        alert("Class start failed ❌");
        console.log(err);
      }
    },

    search() {
      this.studentRecord = this.records?.find(
        item => item.collageID === this.collageID
      ) || null;

      if (!this.studentRecord) {
        alert("Student not found ❌");
      }
    },

    async registerStudent() {
      try {

        if (!this.student.semester) {
          alert("Please select semester ❌");
          return;
        }

        console.log(this.student);

        await addStudent(this.student);

        alert("Student added successfully ✅");

        this.toAdd = false;

      } catch (error) {
        console.log(error);
        alert("Error adding student ❌");
      }
    }

  },

  mounted() {
    this.getRecords();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  }

/* 🌌 Background */
.top-container {
min-height: 100vh;
padding: 30px;
background: linear-gradient(135deg, #1e3c72, #2a5298);
color: white;
}

/* 🔝 Top Bar */
.top-container p {
text-align: center;
font-size: 20px;
margin-bottom: 15px;
}

/* 🔥 CENTER PANEL */
.container {
margin: 20px auto;
width: 400px;
padding: 25px;
background: white;
color: black;
border-radius: 12px;
box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* 🔍 INPUTS */
input, select {
width: 100%;
padding: 12px;
margin: 10px 0;
border-radius: 8px;
border: 1px solid #ccc;
}

/* 🔘 BUTTONS */
button {
width: 100%;
padding: 12px;
margin: 8px 0;
border-radius: 10px;
border: none;
background: #1976d2;
color: white;
font-weight: bold;
cursor: pointer;
transition: 0.3s;
}

button:hover {
background: #125ea8;
transform: scale(1.03);
}

/* 🔴 Logout */
button:nth-child(4) {
background: #ff4d4d;
}

/* 🟢 Search */
button:nth-child(3) {
background: #00c853;
}

/* 📊 STUDENT DETAILS */
.student-record {
margin: 20px auto;
padding: 20px;
width: 400px;
background: white;
color: black;
border-radius: 12px;
}

/* 📋 TABLE */
.student-records {
margin-top: 30px;
background: white;
padding: 20px;
border-radius: 12px;
color: black;
}

table {
width: 100%;
border-collapse: collapse;
}

th {
background: #1976d2;
color: white;
}

td, th {
padding: 10px;
}

/* 🚀 Start Button */
button:last-child {
background: #673ab7;
}

</style>
