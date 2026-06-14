<template>
  <div class="add-subject-wrapper">
    <div class="glass-card">

     <button
  @click="$router.push('/admin?tab=subjects')"
  class="back-btn"
>
  ← Back
</button>

      <h2 class="title">
        {{ isEdit ? "Edit Subject" : "Add Subject" }}
      </h2>

      <div class="form-container">

        <!-- SUBJECT NAME -->
        <div class="input-field">
          <input
            v-model="subject.name"
            type="text"
            placeholder="Subject Name"
          />
        </div>

        <!-- SUBJECT CODE -->
        <div class="input-field">
          <input
            v-model="subject.code"
            type="text"
            placeholder="Subject Code"
          />
        </div>

        <!-- SEMESTER -->
        <div class="input-field">

          <select
            v-model="subject.semester"
            class="teacher-select"
           
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

        <!-- TEACHER -->
       

        <!-- BUTTON -->
        <button
          @click="submitSubject"
          class="create-btn"
          :disabled="loading"
        >

          {{
            loading
              ? "Processing..."
              : isEdit
              ? "Update Subject"
              : "Create Subject"
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

      subject: {
        name: "",
        code: "",
        teacherID: "",
        semester: ""
      },

      teachers: [],

      loading: false,

      isEdit: false,

      subjectId: ""
    };
  },

  methods: {

    // ================= FETCH TEACHERS =================
async fetchTeachers() {

  try {

    const res = await axios.get(
      "http://localhost:4000/api/teacher"
    );

    console.log("Teachers:", res.data);

    this.teachers = Array.isArray(res.data)
      ? res.data
      : [];

  } catch (err) {

    console.error(
      "Teachers load fail",
      err
    );

    this.teachers = [];
  }
},

    // ================= SUBMIT SUBJECT =================
    async submitSubject() {

      this.loading = true;

      try {

        // ================= EDIT =================

        if (this.isEdit) {

         await axios.put(
  `http://localhost:4000/api/subjects/${this.subjectId}`,
  {
    name: this.subject.name,
    code: this.subject.code,
    semester: this.subject.semester,
    teacherID: this.subject.teacherID
  }
);

          alert(
            "Subject Updated Successfully ✅"
          );

        this.$router.push("/admin?tab=subjects");

          return;
        }

        // ================= ADD =================

        if (
  !this.subject.name ||
  !this.subject.code ||
  !this.subject.semester
) {

          alert(
            "Please fill all details!"
          );

          return;
        }

        await axios.post(
          "http://localhost:4000/api/subjects",
          this.subject
        );

        alert(
          "Subject Created Successfully! ✅"
        );

        this.$router.push("/admin?tab=subjects");

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

    this.fetchTeachers();

    // ✅ EDIT MODE
    if (this.$route.query.edit) {

      this.isEdit = true;

      this.subjectId =
        this.$route.query.id;

      axios
        .get("http://localhost:4000/api/subjects")
        .then((res) => {

          const foundSubject =
            res.data.find(
              s => s._id === this.subjectId
            );

          if (foundSubject) {

            this.subject =
              foundSubject;
          }
        });
    }
  }
};
</script>

<style scoped>
.add-subject-wrapper {
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

.input-field input,
.teacher-select {
  width: 100%;
  padding: 15px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  color: #fff;
  outline: none;
  font-size: 16px;
}

.teacher-select {
  cursor: pointer;
}

.create-btn {
  background: #7c3aed;
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

.create-btn:hover {
  background: #6d28d9;
  transform: translateY(-2px);
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  margin-top: 5px;
}
</style>