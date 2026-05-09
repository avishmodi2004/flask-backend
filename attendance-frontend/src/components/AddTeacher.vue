<template>
  <div class="add-teacher-wrapper">
    <div class="glass-card">

      <button
  @click="$router.push('/admin?tab=teachers')"
  class="back-btn"
>
  ← Back
</button>

      <h2 class="title">
        {{ isEdit ? "Edit Teacher" : "Add Teacher" }}
      </h2>

      <div class="form-container">

        <!-- TEACHER NAME -->
        <div class="input-field">
          <input
            v-model="teacher.name"
            type="text"
            placeholder="Teacher Name"
          />
        </div>

        <!-- TEACHER ID -->
        <div class="input-field">
          <input
            v-model="teacher.teacherID"
            type="text"
            placeholder="Employee/Teacher ID"
          />
        </div>

        <!-- DEPARTMENT -->
        <div class="input-field">
          <input
            v-model="teacher.dept"
            type="text"
            placeholder="Department"
            :disabled="isEdit"
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-field">
          <input
            v-model="teacher.password"
            type="password"
            placeholder="Set Password"
            :disabled="isEdit"
          />
        </div>

        <!-- BUTTON -->
        <button
          @click="registerTeacher"
          class="register-btn"
          :disabled="loading"
        >
          {{
            loading
              ? "Processing..."
              : isEdit
              ? "Update Teacher"
              : "Register Teacher"
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

      teacher: {
        name: "",
        teacherID: "",
        dept: "",
        password: ""
      },

      isEdit: false,

      teacherId: "",

      loading: false
    };
  },

  methods: {

    async registerTeacher() {

  this.loading = true;

  try {

    // ================= EDIT =================

    if (this.isEdit) {

      await axios.put(
        `http://localhost:4000/api/teacher/edit/${this.teacherId}`,
        {
          name: this.teacher.name,
          teacherID: this.teacher.teacherID
        }
      );

      alert("Teacher Updated Successfully ✅");

      this.$router.push("/admin");

      return;
    }

    // ================= ADD =================

    if (
      !this.teacher.name ||
      !this.teacher.teacherID ||
      !this.teacher.dept ||
      !this.teacher.password
    ) {

      alert("Bhai, saari fields bharna zaroori hai!");

      return;
    }

    await axios.post(
  "http://localhost:4000/api/teacher",
  this.teacher
);

    alert("Teacher Registered Successfully! ✅");

    this.$router.push("/admin");

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Operation Failed ❌"
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

      this.teacherId =
        this.$route.query.id;

      axios
        .get("http://localhost:4000/api/teacher")
        .then((res) => {

          const foundTeacher =
            res.data.find(
              t => t._id === this.teacherId
            );

          if (foundTeacher) {

            this.teacher =
              foundTeacher;
          }
        });
    }
  }
};
</script>

<style scoped>
.add-teacher-wrapper {
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  float: left;
  font-size: 14px;
}

.title {
  color: #fff;
  font-size: 32px;
  margin-top: 50px;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-field input {
  width: 100%;
  padding: 15px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  color: #fff;
  outline: none;
  font-size: 16px;
}

.register-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
}

.register-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}
</style>