<template>
    <div class = "top-container">
      <p>Search student by collage ID</p>
        <input v-model = "collageID" placeholder = "collage Id">
        <button @click="search">Search</button>
        <button @click="$router.push('/signin')">Logout</button>
        <button @click = "toAdd = !toAdd">add student</button>
        <div class = "container" v-if = "toAdd">
        
        <div class = "section">
           <form @submit.prevent = "registerStudent">
           <input v-model="student.name" placeholder="Student Name">
           <input v-model = "student.collageID" placeholder="Collage ID">
          <input type = "password" v-model = "student.password" placeholder="Password">
           <faceAttendance @sendBlob="handleBlob"/>
          <button type = "submit">add</button>
          </form>
           
          
      </div>
     </div>
        <div class = "student-record" v-if="studentRecord !== null">
            <h1>Student details</h1>
            <h3> Student Name : {{ studentRecord.name }}</h3>
            <h3> collage ID : {{ studentRecord.collageID }}</h3>
            <h3>Days Present : {{ studentRecord.daysPresent }}</h3>
        </div>
    </div>
    <div class = "student-records" v-if = "records !== null">
      <h3>Student List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Collage Id</th>
            <th>days</th>
        </tr>
        </thead>
       
      <tbody>
        <tr v-for = "item in records">
            <td>{{ item.name }}</td>
            <td>{{ item.collageID }}</td>
            <td>{{ item.daysPresent }}</td>
        </tr>
      </tbody>
      </table>
    </div>
     <button @click = "startClass">start class</button>
</template>
<script>
   import { fetchAllStudents,addStudent,classInit } from '@/services/api';
import faceAttendance from './FaceAttendance.vue';
   export default{
     components:{
         faceAttendance
     },
      data(){
          return{
            records : null,
            toAdd:false,
            collageID : "",
            studentRecord : null,
            student : {collageID : "", name : "" , password : "",studentImage: null}
          }
      },
      methods:{
        handleBlob(blob){
             this.student.studentImage = blob;
        },
        async getRecords(){
             try{
                const Response = await fetchAllStudents();
                this.records = Response.data;
             }
             catch(err){
                 console.log(err);
                 alert("error");
             }
        },
        async startClass(){
           try{
               await classInit();
               alert("Class stablished succesfully");
           }
           catch(err){
            alert("Class stablished unsuccesfully");
            console.log(err);
          }
        },
        search(){
             if(this.records !== null){
                  for(let item of this.records){
                      if(item.collageID === this.collageID){
                            this.studentRecord = item;
                            break;
                      }
                  }
             if(this.studentRecord === null){
              alert("student not found!");
              console.log("student not found"); 
             }   
            }
        },
        async registerStudent(){
            console.log("Registering student:", this.student);
               
              try{
                const response = await addStudent(this.student);
                console.log(response);
                alert("Student registered successfully!");
              }
                
              catch(error){
                  console.log(error.message);
                  alert("Error adding student: " + (error.response?.data?.message || "Server not responding"));
              }

           }
      },
      mounted(){
        this.getRecords();
      }
   }
</script>

<style scoped>
* {
  color: #000;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.top-container {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.top-container p {
  font-size: 18px;
  margin-bottom: 10px;
}

input {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin: 10px 10px 10px 0;
  width: 250px;
}

input:focus {
  outline: none;
  border-color: #1976d2;
}

button {
  padding: 10px 16px;
  font-size: 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #1565c0;
}

.container {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.student-record {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #e3f2fd;
}

.student-record h1 {
  font-size: 24px;
  margin-bottom: 15px;
}

.student-record h3 {
  margin: 6px 0;
  font-weight: normal;
}

.student-records {
  margin-top: 50px;
  padding: 20px;
}

.student-records h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 12px 10px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #e0e0e0;
  font-weight: bold;
}
</style>