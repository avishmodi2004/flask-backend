<template>
  <div class="add-student-wrapper">
    <div class="glass-card">

     <button
  @click="$router.push('/admin?tab=students')"
  class="back-btn"
>
  ← Back
</button>

      <h2 class="title">
        {{ isEdit ? "Edit Student" : "Add Student" }}
      </h2>

      <div class="form-container">

        <!-- NAME -->
        <div class="input-field">
          <input
            v-model="student.name"
            type="text"
            placeholder="Student Full Name"
          />
        </div>

        <!-- COLLEGE ID -->
        <div class="input-field">
          <input
            v-model="student.collageID"
            type="text"
            placeholder="College ID"
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-field">
          <input
            v-model="student.password"
            type="password"
            placeholder="Password"
            :disabled="isEdit"
          />
        </div>

        <!-- SEMESTER -->
        <div class="input-field">
          <select
            v-model="student.semester"
            class="compact-select"
            :disabled="isEdit"
          >
            <option value="" disabled>
              Select Semester
            </option>

            <option
              v-for="n in 8"
              :key="n"
              :value="n"
            >
              {{ n }}th Semester
            </option>
          </select>
        </div>

        <!-- CAMERA ONLY FOR ADD -->
        <div class="camera-box" v-if="!isEdit">

          <video
            v-if="!imageCaptured"
            ref="video"
            autoplay
            playsinline
            class="live-video"
          ></video>

          <canvas
            ref="canvas"
            v-show="false"
          ></canvas>

          <img
            v-if="imageCaptured"
            :src="capturedImageUrl"
            class="captured-preview"
          />

          <div class="camera-controls">

            <button
              v-if="!imageCaptured"
              @click="capturePhoto"
              class="photo-btn"
            >
              📸 Capture Photo
            </button>

            <button
              v-else
              @click="retakePhoto"
              class="retake-btn"
            >
              🔄 Retake Photo
            </button>

          </div>

          <p
            v-if="!imageCaptured"
            class="status-msg error"
          >
            Photo Capture Required ✖
          </p>

          <p
            v-else
            class="status-msg success"
          >
            Photo Captured Successfully ✅
          </p>

        </div>

        <!-- BUTTON -->
        <button
          @click="registerStudent"
          class="register-btn"
          :disabled="loading"
        >
          {{
            loading
              ? "Saving..."
              : isEdit
              ? "Update Student"
              : "Add Student"
          }}
        </button>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {

  data() {

    return {

      student: {
        name: "",
        collageID: "",
        password: "",
        semester: "",
        image: ""
      },

      isEdit: false,
      studentId: "",

      imageCaptured: false,
      capturedImageUrl: null,
      loading: false,
      stream: null
    };
  },

  methods: {

    async initCamera() {

      try {

        this.stream =
          await navigator.mediaDevices.getUserMedia({
            video: true
          });

        if (this.$refs.video) {
          this.$refs.video.srcObject = this.stream;
        }

      } catch (err) {

        alert(
          "Error: Camera access denied. Please enable camera permissions."
        );
      }
    },

    capturePhoto() {

      const video = this.$refs.video;
      const canvas = this.$refs.canvas;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas
        .getContext("2d")
        .drawImage(video, 0, 0);

      this.capturedImageUrl =
        canvas.toDataURL("image/jpeg");

      this.student.image =
        this.capturedImageUrl;

      this.imageCaptured = true;

      if (this.stream) {

        this.stream
          .getTracks()
          .forEach(track => track.stop());
      }
    },

    retakePhoto() {

      this.imageCaptured = false;

      this.student.image = "";

      this.capturedImageUrl = null;

      this.$nextTick(() => {
        this.initCamera();
      });
    },

    async registerStudent() {

      this.loading = true;

      try {

        // ================= EDIT =================

        if (this.isEdit) {

          await axios.put(
            `http://localhost:4000/api/student/edit/${this.studentId}`,
            {
              name: this.student.name,
              collageID: this.student.collageID
            }
          );

          alert("Student Updated Successfully ✅");

          this.$router.push("/admin");

          return;
        }

        // ================= ADD =================

        if (
          !this.student.name ||
          !this.student.collageID ||
          !this.student.password ||
          !this.student.semester ||
          !this.student.image
        ) {

          alert(
            "Please complete all fields and capture photo."
          );

          return;
        }

        const response =
          await fetch(this.student.image);

        const blob =
          await response.blob();

        const formData =
          new FormData();

        formData.append(
          "name",
          this.student.name
        );

        formData.append(
          "collageID",
          this.student.collageID
        );

        formData.append(
          "password",
          this.student.password
        );

        formData.append(
          "semester",
          this.student.semester
        );

        formData.append(
          "image",
          blob,
          "student.jpg"
        );

        await axios.post(
          "http://localhost:4000/api/student/add",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        alert(
          "Student registered successfully! ✅"
        );

        this.$router.push("/admin");

      } catch (err) {

        console.error(err);

        alert(
          err.response?.data?.message ||
          "Operation failed ❌"
        );

      } finally {

        this.loading = false;
      }
    }
  },

  mounted() {

    // ✅ EDIT MODE
    if (this.$route.query.edit) {

      this.isEdit = true;

      this.studentId =
        this.$route.query.id;

      axios
        .get("http://localhost:4000/api/student")
        .then((res) => {

          const foundStudent =
            res.data.find(
              s => s._id === this.studentId
            );

          if (foundStudent) {

            this.student =
              foundStudent;
          }
        });

    }

    // ✅ ADD MODE
    else {

      this.initCamera();
    }
  },

  beforeUnmount() {

    if (this.stream) {

      this.stream
        .getTracks()
        .forEach(track => track.stop());
    }
  }
};
</script>

<style scoped>
.camera-box {
  background: #0f172a;
  border-radius: 15px;
  padding: 10px;
  border: 1px solid #1e293b;
  margin: 10px 0;
}

.live-video,
.captured-preview {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  background: #000;
}

.camera-controls {
  margin-top: 10px;
}

.photo-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.retake-btn {
  background: #4b5563;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.add-student-wrapper {
  min-height: 100vh;
  background: #0a0b14;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.glass-card {
  width: 100%;
  max-width: 450px;
  background: #1e293b;
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);
}

.back-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  float: left;
}

.title {
  color: #fff;
  font-size: 30px;
  margin-top: 45px;
  margin-bottom: 25px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field input,
.compact-select {
  width: 100%;
  padding: 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  color: #fff;
  outline: none;
}

.register-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-msg {
  font-size: 12px;
  margin-top: 5px;
  font-weight: 600;
}

.error {
  color: #f87171;
}

.success {
  color: #34d399;
}
</style>