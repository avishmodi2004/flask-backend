<template>
    
    <img v-if = "studentImage" :src = "studentImage" id = "student-image">
    <div class = "student-details-section">
    <h1>{{ student.name }}</h1>
    <h2>{{ student.collageID }}</h2>
    <h3>{{ student.days }}</h3>
    <button @click="$router.push('/signin')">Logout</button>
    </div>
    <div class = "mark-section">
       <button  @click="isCameraOn = !isCameraOn" id = "mark-btn">mark attendence</button>
    </div>
    
  <div class="section" v-if = "isCameraOn">
    <p v-if="!isCameraReady">Loading camera...</p>
         <button @click = "isQrAttendance = !isQrAttendance">mark attendance by QR code </button>
         <button @click = "isFaceAttendance = !isFaceAttendance">Mark attendance by face</button>
        <qr-stream
        @decode="onDecode"
        @init-error="onInitFail"
        v-if = "isQrAttendance"
      />
      <div v-if = "isFaceAttendance">
          <FaceAttendance id = "Face-attendance" @send-blob="handleBlob" />
          <button @click = "markByFace">send image to mark attendance</button>
      </div>
    
  </div>
  
  <div class = "present-days-section" v-if = "presentDaysList.length !== 0">
       <h2>Your present days :</h2>
      <ol>
        <li v-for = "i of presentDaysList" :key = "i">{{formatDate(i)}}</li>
      </ol>
  </div>
  <p v-else> You are not present in a single day !</p>
</template>

<script>
   import { QrStream } from 'vue3-qr-reader';
   import FaceAttendance from './FaceAttendance.vue';
   import { ref } from 'vue';
   import { markAttendance,getPresentDays,showStudentImage,markAttendanceByFace } from '@/services/api';
   import { formatDate } from '@vueuse/core';

   
  export default{
    components:{
        QrStream,
        FaceAttendance
    },
    setup(){
      const camRef = ref();
      const img = ref(null);
      
      return{
          camRef,
          img
      }
    },
    data(){
        return{
            isCameraOn:false,
            isCameraReady:false,
            isQrAttendance : false,
            isFaceAttendance:false,
            studentImage : null,
            student : {},
            presentDaysList : [],
        }
    },
    methods:{
      handleBlob(blob){
           this.student.image = null;
           this.student.image = blob;
           console.log("inside handleblob "+ blob);
      },
      async onDecode(decodedText){
           //this.isCameraReady = true;
           try{
            let studentData = JSON.parse(decodedText);
            console.log(studentData);
            if(this.student.collageID === studentData.collageID){
              await markAttendance(studentData);
              this.getPresentDaysList();
              alert("attendence marked succesfully!");
            }
            else{
               throw "Provided QR code is not for " + this.student.name; 
            }
                 
           }
           catch(err){
              alert(err);
           }
           this.isCameraOn = false;

      },
      async markByFace(){
         
          const response = await markAttendanceByFace({collageID : this.student.collageID, studentImage : this.student.image})
          .then(()=>{
             alert("attendance mark succesfully");
          })
          .catch(()=>{
              alert("attendance failed");
          })


      },
      onInitFail(error) {
            console.error("Camera init failed:", error);
            this.isCameraOn = false;
      },
      async getPresentDaysList(){
          try{
              const response = await getPresentDays({collageID : this.student.collageID});
              this.presentDaysList = response.presentList;
          }catch(err){
              alert(err);
          }
      },
      formatDate(dateStr) {
       const date = new Date(dateStr);
       return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
       
    },
 

    mounted(){
      const stored = localStorage.getItem("student");
      this.student = JSON.parse(stored);
      console.log(this.student);
      this.getPresentDaysList();

        showStudentImage({ collageID: this.student.collageID })
    .then((img) => {
      this.studentImage = img;  // already base64 string with prefix
    })
    .catch((err) => console.error(err));
    }
  }
</script>
<style >
 body {
  background: linear-gradient(135deg, #f0f9ff, #cfefff);
  font-family: "Poppins", sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* =============================
   Student Image
============================= */
#student-image {
  display: block;
  margin: 30px auto 10px;
  border-radius: 50%;
  width: 160px;
  height: 160px;
  object-fit: cover;
  border: 4px solid #4caf50;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#student-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}
/* =============================
   Student Details Section
============================= */
.student-details-section {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 16px;
  text-align: center;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.student-details-section:hover {
  transform: translateY(-5px);
}

.student-details-section h1 {
  font-size: 1.8rem;
  color: #2e7d32;
  margin-bottom: 8px;
}

.student-details-section h2 {
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 5px;
}

.student-details-section h3 {
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 15px;
}

/* =============================
   Buttons
============================= */
button {
  display: inline-block;
  margin: 15px auto;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(72, 187, 120, 0.3);
  transition: all 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #45a049, #388e3c);
  transform: translateY(-2px);
}
.mark-section{
    display: flex;
  justify-content: center;
  align-items: center;
}
#mark-btn{
    padding: 12px 24px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
/* Logout button */
.student-details-section button {
  background: linear-gradient(135deg, #f44336, #e53935);
}

.student-details-section button:hover {
  background: linear-gradient(135deg, #e53935, #c62828);
}

/* =============================
   QR / Camera Section
============================= */
.section {
  background-color: #fffbea;
  border: 1px solid #ffe28a;
  padding: 25px;
  border-radius: 14px;
  margin: 25px auto;
  max-width: 520px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 222, 100, 0.3);
}

.section p {
  font-style: italic;
  color: #6c757d;
}

/* Face Attendance Component */
#Face-attendance {
  width: 60%;
  height: auto;
  margin: 15px auto;
  display: block;
  border-radius: 12px;
  border: 2px dashed #4caf50;
  padding: 8px;
}

/* =============================
   Attendance List Section
============================= */
.present-days-section {
  margin: 35px auto;
  max-width: 520px;
  background-color: #e8faff;
  padding: 25px;
  border-radius: 14px;
  border: 1px solid #b3e0ff;
  box-shadow: 0 4px 12px rgba(0, 150, 255, 0.15);
}

.present-days-section h2 {
  color: #0077b6;
  margin-bottom: 15px;
  text-align: center;
}

.present-days-section ol {
  padding-left: 25px;
}

.present-days-section li {
  padding: 6px 0;
  font-size: 1rem;
  color: #444;
}

/* =============================
   Message when no attendance
============================= */
p {
  text-align: center;
  color: #888;
  margin-top: 20px;
  font-size: 1rem;
}

/* =============================
   Responsive Layout
============================= */
@media (max-width: 600px) {
  #student-image {
    width: 120px;
    height: 120px;
  }

  .student-details-section,
  .section,
  .present-days-section {
    width: 90%;
  }

  button {
    width: 80%;
  }
}
</style>