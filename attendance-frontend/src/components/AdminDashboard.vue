<template>
  <div class="admin-wrapper">
    <div class="admin-container">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="logo-area">
          <div class="logo-icon">🎓</div>
          <div>
            <h2>Attendence AI</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav class="nav-list">
          <div
            class="nav-item"
            :class="{ active: activeTab === 'dashboard' }"
            @click="switchTab('dashboard')"
          >
            📊 Dashboard
          </div>

          <div
            class="nav-item"
            :class="{ active: activeTab === 'students' }"
            @click="switchTab('students')"
          >
            👨‍🎓 Students
          </div>

          <div
            class="nav-item"
            :class="{ active: activeTab === 'teachers' }"
            @click="switchTab('teachers')"
          >
            👨‍🏫 Teachers
          </div>

          <div
            class="nav-item"
            :class="{ active: activeTab === 'subjects' }"
            @click="switchTab('subjects')"
          >
            📚 Subjects
          </div>

          <div
            class="nav-item"
            :class="{ active: activeTab === 'classTeacher' }"
            @click="switchTab('classTeacher')"
          >
            🏫 Class Teacher
          </div>
        </nav>

        <div class="logout-wrap">
          <button class="logout-btn" @click="logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main-content">

        <header class="top-nav">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage your smart attendance system</p>
          </div>

          <div class="admin-badge">
            👤 Administrator
          </div>
        </header>

        <!-- DASHBOARD -->
        <div
          v-if="activeTab === 'dashboard'"
          class="tab-content fade-in"
        >
          <div class="stats-grid">
            <div class="stat-card blue card-1">
              <span>Total Students</span>
                <h3>{{ animatedStudents }}</h3>
              <p>Registered students</p>
            </div>

            <div class="stat-card green card-2">
              <span>Total Teachers</span>
              <h3>{{ animatedTeachers }}</h3>
              <p>Active faculty members</p>
            </div>

            <div class="stat-card purple card-3">
              <span>Total Subjects</span>
              <h3>{{ animatedSubjects }}</h3>
              <p>Assigned subjects</p>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="glass-panel">
              <div class="panel-header">
                <h3>Quick Student Search</h3>
              </div>

              <input
                type="text"
                v-model="dashSearchQuery"
                placeholder="Enter student ID or name..."
                class="search-input"
              />

              <div v-if="foundStudent" class="detail-card">
                <p><strong>Name:</strong> {{ foundStudent.name }}</p>
                <p><strong>ID:</strong> {{ foundStudent.collageID }}</p>
                <p><strong>Semester:</strong> {{ foundStudent.semester }}</p>
              </div>

              <div v-else class="empty-text">
                Search student details quickly.
              </div>
            </div>

           
          </div>
        </div>

        <!-- CLASS TEACHER -->
        <div
          v-else-if="activeTab === 'classTeacher'"
          class="tab-content fade-in"
        >
          <div class="glass-panel full-panel">
            <div class="panel-header">
              <h3>Assign Class Teacher</h3>
            </div>

            <div class="assign-box">
              <select v-model="selectedSemester" class="search-input">
                <option value="" disabled>Select Semester</option>

                <option
                  v-for="sem in semesters"
                  :key="sem"
                  :value="sem"
                >
                  Semester {{ sem }}
                </option>
              </select>

              <select v-model="selectedTeacherID" class="search-input">
                <option value="" disabled>Select Teacher</option>

                <option
                  v-for="teacher in teachers"
                  :key="teacher._id"
                  :value="teacher.teacherID"
                >
                  {{ teacher.name }} - {{ teacher.teacherID }}
                </option>
              </select>

              <button
                class="add-btn-primary"
                @click="assignClassTeacher"
              >
                Assign Class Teacher
              </button>
            </div>

            <h3 class="section-title">Assigned Class Teachers</h3>

            <table class="modern-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Class Teacher ID</th>
                  <th>Teacher Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in classTeachers"
                  :key="item._id"
                >
                  <td>Semester {{ item.semester }}</td>
                  <td>{{ item.teacherID }}</td>
                  <td>{{ getTeacherName(item.teacherID) }}</td>

                  <td>
                    <button
                      v-if="editingClassTeacherId !== item._id"
                      class="icon-btn edit"
                      @click="startEditClassTeacher(item)"
                    >
                      ✏️
                    </button>

                    <div
                      v-else
                      class="edit-inline"
                    >
                      <select
                        v-model="selectedEditTeacherID"
                        class="search-input small-select"
                      >
                        <option
                          v-for="teacher in teachers"
                          :key="teacher._id"
                          :value="teacher.teacherID"
                        >
                          {{ teacher.name }}
                        </option>
                      </select>

                      <button
                        class="icon-btn save"
                        @click="saveClassTeacher(item)"
                      >
                        ✅
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MANAGEMENT -->
        <div
          v-else-if="
            activeTab === 'students' ||
            activeTab === 'teachers' ||
            activeTab === 'subjects'
          "
          class="tab-content fade-in"
        >
          <div class="glass-panel full-panel">
            <div class="panel-header manage-header">
              <h3>Manage {{ activeTab.toUpperCase() }}</h3>

              <div class="header-actions">
                <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="'Search ' + activeTab + '...'"
                  class="search-input"
                />

                <button
                  v-if="activeTab === 'students'"
                  class="add-btn-primary"
                  @click="$router.push('/add-student')"
                >
                  + Add Student
                </button>

                <button
                  v-else-if="activeTab === 'teachers'"
                  class="add-btn-primary"
                  @click="$router.push('/add-teacher')"
                >
                  + Add Teacher
                </button>

                <button
                  v-else-if="activeTab === 'subjects'"
                  class="add-btn-primary"
                  @click="$router.push('/add-subject')"
                >
                  + Add Subject
                </button>
              </div>
            </div>

            <table class="modern-table">
              <thead>
               <tr v-if="activeTab === 'students'">
  <th>Name</th>
  <th>ID</th>
  <th>Semester</th>
  <th>Total Present</th>
  <th>Subject Attendance</th>
  <th>Action</th>
</tr>

                <tr v-else-if="activeTab === 'teachers'">
                  <th>Teacher Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>

                <tr v-else>
                  <th>Subject Name</th>
                  <th>Code</th>
                  <th>Action</th>
                </tr>
              </thead>

             <tbody>
  <tr
    v-for="(item, index) in filteredData"
    :key="item._id || item.teacherID || item.collageID || item.code"
    class="table-row-animate"
    :style="{ animationDelay: `${index * 0.06}s` }"
  >
  <template v-if="activeTab === 'students'">
  <td>{{ item.name }}</td>
  <td>{{ item.collageID }}</td>
  <td>{{ item.semester }}</td>

  <td>
    {{ item.daysPresent || 0 }}
  </td>

  <td>
    <div v-if="item.subjectAttendance">
      <div
        v-for="(count, subject) in item.subjectAttendance"
        :key="subject"
      >
        {{ getSubjectName(subject) }} : {{ count }}
      </div>
    </div>

    <span v-else>0</span>
  </td>
</template>
  

<template v-else-if="activeTab === 'teachers'">
  <td>{{ item.name }}</td>
  <td>{{ item.teacherID }}</td>
  <td>{{ item.dept || "Engineering" }}</td>
</template>

<template v-else>
  <td>{{ item.name }}</td>
  <td>{{ item.code }}</td>
</template>

                  <td class="action-buttons">
                    <button
                      class="icon-btn edit"
                      @click="editItem(item, activeTab)"
                    >
                      ✏️
                    </button>

                    <button
                      class="icon-btn del"
                      @click="deleteItem(item, activeTab)"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import {
  fetchAllStudents,
  getTeachers,
  getSubjects,
  deleteTeacher,
  deleteSubject
} from "@/services/api";

export default {
  name: "AdminDashboard",

  data() {
    return {
      activeTab: "dashboard",

      isAttendanceRunning: false,
      attendanceTimer: null,

      searchQuery: "",
      dashSearchQuery: "",

      students: [],
      teachers: [],
      subjects: [],

      classTeachers: [],

      selectedSemester: "",
      selectedTeacherID: "",
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],

      apiBase: "http://localhost:4000/api",

      editingClassTeacherId: null,
      selectedEditTeacherID: ""
    };
  },

  computed: {
    foundStudent() {
      if (!this.dashSearchQuery) return null;

      const query = this.dashSearchQuery.trim();

      return this.students.find(s =>
        (s.collageID &&
          s.collageID.toString() === query) ||
        (s.name &&
          s.name.toLowerCase() === query.toLowerCase())
      );
    },

    filteredData() {
      let data = [];

      if (this.activeTab === "students") {
        data = this.students;
      } else if (this.activeTab === "teachers") {
        data = this.teachers;
      } else if (this.activeTab === "subjects") {
        data = this.subjects;
      }

      if (!this.searchQuery) return data;

      const q = this.searchQuery.toLowerCase();

      return data.filter(item => {
        return (
          (item.name &&
            item.name.toLowerCase().includes(q)) ||
          (item.collageID &&
            item.collageID.toString().includes(q)) ||
          (item.teacherID &&
            item.teacherID.toString().includes(q)) ||
          (item.code &&
            item.code.toLowerCase().includes(q))
        );
      });
    }
  },

 methods: {
  startEditClassTeacher(item) {
    this.editingClassTeacherId = item._id;
    this.selectedEditTeacherID = item.teacherID;
  },
  getSubjectName(subjectCode) {
  const subject = this.subjects.find(
    s => s.code === subjectCode
  );

  return subject ? subject.name : subjectCode;
},
animateCount(target, property) {
  let start = 0;

  const timer = setInterval(() => {
    start++;

    this[property] = start;

    if (start >= target) {
      clearInterval(timer);
    }
  }, 20);
},
    async saveClassTeacher(item) {
      try {
        await axios.put(
          `${this.apiBase}/class-teacher/edit/${item.semester}`,
          {
            teacherID: this.selectedEditTeacherID
          }
        );

        alert("Class Teacher Updated ✅");

        this.editingClassTeacherId = null;

        await this.fetchClassTeachers();

      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Update failed ❌"
        );
      }
    },

    async loadData() {
      try {
        const [
          resStudents,
          resTeachers,
          resSubjects
        ] = await Promise.all([
          fetchAllStudents(),
          getTeachers(),
          getSubjects()
        ]);

        this.students =
          resStudents.students ||
          resStudents.data ||
          resStudents ||
          [];

        this.teachers =
          resTeachers.teachers ||
          resTeachers.data ||
          resTeachers ||
          [];

        this.subjects =
          resSubjects.subjects ||
          resSubjects.data ||
          resSubjects ||
          [];

        await this.fetchClassTeachers();
        this.animateCount(this.students.length, "animatedStudents");
this.animateCount(this.teachers.length, "animatedTeachers");
this.animateCount(this.subjects.length, "animatedSubjects");

      } catch (error) {
        console.error("Data load error:", error);
      }
    },

    async fetchClassTeachers() {
      try {
        const res = await axios.get(
          `${this.apiBase}/class-teacher`
        );

        this.classTeachers =
          res.data.data || [];

      } catch (err) {
        console.error(
          "Class teacher load error:",
          err
        );
      }
    },

    async assignClassTeacher() {
      if (
        !this.selectedSemester ||
        !this.selectedTeacherID
      ) {
        alert("Semester aur teacher select karo");
        return;
      }

      try {
        const res = await axios.post(
          `${this.apiBase}/class-teacher/assign`,
          {
            semester: this.selectedSemester,
            teacherID: this.selectedTeacherID
          }
        );

        alert(res.data.message);

        this.selectedSemester = "";
        this.selectedTeacherID = "";

        await this.fetchClassTeachers();

      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Class teacher assign failed"
        );
      }
    },

    getTeacherName(teacherID) {
      const teacher = this.teachers.find(
        t => t.teacherID === teacherID
      );

      return teacher ? teacher.name : "Unknown";
    },

    startAttendance() {
      if (this.isAttendanceRunning) return;

      this.isAttendanceRunning = true;

      this.attendanceTimer = setInterval(() => {
        console.log(
          "System Status: Marking Attendance..."
        );
      }, 3000);
    },

    stopAttendance() {
      this.isAttendanceRunning = false;

      if (this.attendanceTimer) {
        clearInterval(this.attendanceTimer);
        this.attendanceTimer = null;
      }
    },

 switchTab(tab) {
  this.activeTab = tab;

  this.searchQuery = "";
  this.dashSearchQuery = "";

  this.$router.push({
    path: this.$route.path,
    query: { tab }
  });
},

    logout() {
      this.stopAttendance();
      this.$router.push("/");
    },

    editItem(item, type) {
      if (type === "students") {
        this.$router.push({
          path: "/add-student",
          query: {
            edit: "true",
            id: item._id
          }
        });
      }

      else if (type === "teachers") {
        this.$router.push({
          path: "/add-teacher",
          query: {
            edit: "true",
            id: item._id
          }
        });
      }

      else if (type === "subjects") {
        this.$router.push({
          path: "/add-subject",
          query: {
            edit: "true",
            id: item._id
          }
        });
      }
    },

    async deleteItem(item, type) {
      if (
        confirm(
          `Are you sure you want to delete this ${type.slice(0, -1)}?`
        )
      ) {
        try {
          const id =
            item._id ||
            item.teacherID ||
            item.code ||
            item.collageID;

          if (type === "students") {
            await axios.delete(
              `${this.apiBase}/student/${id}`
            );
          }

          else if (type === "teachers") {
            await deleteTeacher(id);
          }

          else if (type === "subjects") {
            await deleteSubject(id);
          }

          await this.loadData();

          alert("Deleted successfully! ✅");

        } catch (error) {
          alert("Delete failed!");
        }
      }
    }
  },

mounted() {
  this.activeTab =
    this.$route.query.tab || "dashboard";

  this.loadData();
},
  beforeUnmount() {
    this.stopAttendance();
  }
};
</script>

<style scoped>
:global(body),
:global(html) {
  margin: 0;
  padding: 0;
  background: #020617;
  overflow: hidden;
}

.admin-wrapper {
  position: fixed;
  inset: 0;

  background:
    radial-gradient(circle at top left, rgba(59,130,246,0.25), transparent 30%),
    radial-gradient(circle at bottom right, rgba(168,85,247,0.25), transparent 30%),
    #020617;

  overflow: hidden;
}

.admin-container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* SIDEBAR */
.sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(25px);
  border-right: 1px solid rgba(255,255,255,0.08);
  padding: 30px 18px;
  display: flex;
  flex-direction: column;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
  color: white;
}

.logo-icon {
  width: 55px;
  height: 55px;
  border-radius: 18px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 10px 25px rgba(59,130,246,0.35);
}

.logo-area h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.logo-area p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 15px 18px;
  border-radius: 14px;
  color: #94a3b8;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.nav-item:hover {
  background: rgba(255,255,255,0.06);
  color: white;
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  box-shadow: 0 10px 25px rgba(59,130,246,0.35);
}

.logout-wrap {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  padding: 15px 18px;
  border-radius: 14px;
  color: white;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(239,68,68,0.35);
}

/* MAIN */
.main-content {
  flex: 1;
  padding: 35px;
  overflow-y: auto;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.top-nav h1 {
  color: white;
  font-size: 34px;
  margin: 0;
}

.top-nav p {
  color: #94a3b8;
  margin-top: 6px;
}

.admin-badge {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  padding: 12px 18px;
  border-radius: 14px;
}

/* COMMON */
.tab-content {
  animation: fadeIn 0.35s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-panel {
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

.panel-header h3,
.section-title {
  color: white;
  margin: 0 0 18px;
}

.full-panel {
  min-height: 520px;
}

/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 25px;
}

.stat-card {
  padding: 25px;
  border-radius: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  transition: 0.3s;
}
.stat-card:hover{
  transform:translateY(-8px);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card span {
  color: #dbeafe;
  font-weight: 700;
}

.stat-card h3 {
  font-size: 42px;
  margin: 12px 0 4px;
}

.stat-card p {
  color: #dbeafe;
  margin: 0;
}

.blue {
  background: linear-gradient(135deg, rgba(37,99,235,0.85), rgba(59,130,246,0.55));
}

.green {
  background: linear-gradient(135deg, rgba(5,150,105,0.85), rgba(16,185,129,0.55));
}

.purple {
  background: linear-gradient(135deg, rgba(109,40,217,0.85), rgba(139,92,246,0.55));
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 25px;
}

/* STATUS */
.status-panel {
  text-align: center;
}

.status-panel h3 {
  color: white;
}

.status-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2,6,23,0.7);
  border: 5px solid;
}

.status-circle span {
  font-size: 30px;
  font-weight: 900;
}

.status-circle.on {
  border-color: #22c55e;
  box-shadow: 0 0 30px rgba(34,197,94,0.45);
}

.status-circle.on span {
  color: #22c55e;
}

.status-circle.off {
  border-color: #ef4444;
  box-shadow: 0 0 30px rgba(239,68,68,0.3);
}

.status-circle.off span {
  color: #ef4444;
}

.btn-row {
  display: flex;
  gap: 12px;
}

.start-btn,
.stop-btn {
  flex: 1;
  padding: 13px;
  border-radius: 14px;
  border: none;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.start-btn {
  background: #22c55e;
}

.stop-btn {
  background: #ef4444;
}

.start-btn:disabled,
.stop-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* INPUTS */
.search-input {
  padding: 13px 15px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  color: white;
  outline: none;
  min-width: 230px;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input option {
  color: black;
}

.small-select {
  min-width: 180px;
}

.detail-card {
  margin-top: 20px;
  background: rgba(59,130,246,0.12);
  border-left: 4px solid #3b82f6;
  padding: 18px;
  border-radius: 16px;
  color: white;
}

.empty-text {
  color: #94a3b8;
  margin-top: 20px;
}

/* MANAGE */
.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.add-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 13px 20px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  transition: 0.3s;
  box-shadow: 0 10px 25px rgba(59,130,246,0.35);
}

.add-btn-primary:hover {
  transform: translateY(-3px);
}

/* TABLE */
.modern-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 18px;
}

.modern-table th {
  text-align: left;
  padding: 16px;
  color: #60a5fa;
  background: rgba(15,23,42,0.85);
  font-size: 13px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.modern-table td {
  padding: 17px;
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.modern-table tr:hover {
  background: rgba(255,255,255,0.035);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.icon-btn {
  border: none;
  width: 42px;
  height: 38px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.icon-btn:hover {
  transform: translateY(-3px);
}

.icon-btn.edit {
  background: #3b82f6;
}

.icon-btn.del {
  background: #ef4444;
}

.icon-btn.save {
  background: #22c55e;
}

.assign-box {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.edit-inline {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .sidebar {
    width: 90px;
  }

  .logo-area h2,
  .logo-area p {
    display: none;
  }

  .nav-item {
    font-size: 0;
    text-align: center;
  }

  .nav-item::first-letter {
    font-size: 20px;
  }

  .stats-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .manage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

/* ===== EXTRA ANIMATIONS ===== */

.admin-wrapper::before{
  content:"";
  position:absolute;
  width:520px;
  height:520px;
  top:-140px;
  left:-140px;
  background:radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%);
  animation: floatGlow 8s infinite alternate;
  pointer-events:none;
}

.admin-wrapper::after{
  content:"";
  position:absolute;
  width:480px;
  height:480px;
  right:-130px;
  bottom:-130px;
  background:radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%);
  animation: floatGlow2 9s infinite alternate;
  pointer-events:none;
}

@keyframes floatGlow{
  from{ transform:translate(0,0); }
  to{ transform:translate(70px,45px); }
}

@keyframes floatGlow2{
  from{ transform:translate(0,0); }
  to{ transform:translate(-65px,-45px); }
}

.fade-in{
  animation: pageFade 0.45s ease;
}

@keyframes pageFade{
  from{
    opacity:0;
    transform:translateY(18px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

.stat-card,
.glass-panel{
  transition:0.35s ease;
}

.stat-card:hover,
.glass-panel:hover{
  transform:translateY(-6px);
  box-shadow:0 18px 40px rgba(0,0,0,0.38);
}

.nav-item:hover{
  transform:translateX(6px);
  box-shadow:0 0 20px rgba(59,130,246,0.28);
}

.add-btn-primary,
.icon-btn,
.logout-btn{
  transition:0.3s ease;
}

.add-btn-primary:hover,
.icon-btn:hover{
  transform:translateY(-3px) scale(1.03);
}

.search-input{
  transition:0.3s ease;
}

.search-input:focus{
  border-color:#3b82f6;
  box-shadow:0 0 18px rgba(59,130,246,0.3);
}

.card-1,
.card-2,
.card-3{
  opacity:0;
  animation:cardEntry 0.7s ease forwards;
}

.card-1{
  animation-delay:0.2s;
}

.card-2{
  animation-delay:0.4s;
}

.card-3{
  animation-delay:0.6s;
}

@keyframes cardEntry{
  from{
    opacity:0;
    transform:translateY(30px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }
}

.nav-item{
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.nav-item:hover{
  transform: translateX(8px);
}

.nav-item::before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  width:4px;
  height:100%;
  background:#3b82f6;
  transform:scaleY(0);
  transition:0.3s ease;
}

.nav-item:hover::before{
  transform:scaleY(1);
}

.table-row-animate {
  opacity: 0;
  animation: rowSlide 0.45s ease forwards;
}

@keyframes rowSlide {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.tab-content {
  animation: tabFadeSlide 0.45s ease;
}

@keyframes tabFadeSlide {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  transform: translateX(6px);

  box-shadow:
    inset 4px 0 0 #3b82f6,
    0 0 18px rgba(59,130,246,0.18);
}

.nav-item {
  transition: all 0.3s ease;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  transform: translateY(-50%);
  animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {
  0% {
    box-shadow: 0 0 0 0 rgba(59,130,246,0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(59,130,246,0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(59,130,246,0);
  }
}
.search-input {
  transition: all 0.25s ease;
}

.search-input:focus {
  transform: scale(1.02);
  border-color: #3b82f6;
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.25);
  outline: none;
}
.modern-table tbody tr {
  transition: all 0.25s ease;
}

.modern-table tbody tr:hover {
  transform: scale(1.01);
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
}
.modern-table tbody tr td {
  transition: color 0.25s ease;
}

.modern-table tbody tr:hover td {
  color: #60a5fa;
}
.icon-btn {
  transition: all 0.25s ease;
}

.icon-btn:hover {
  transform: translateY(-3px) scale(1.08);
}
.icon-btn.edit:hover {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.35);
}
.icon-btn.del:hover {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.35);
}
.icon-btn.save:hover {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.35);
}
.icon-btn:active {
  transform: scale(0.92);
}
.add-btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
}

.add-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.35);
}

.add-btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -90%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.45),
    transparent
  );
  transform: skewX(-25deg);
}

.add-btn-primary:hover::before {
  animation: adminBtnShine 0.8s ease;
}

@keyframes adminBtnShine {
  from {
    left: -90%;
  }
  to {
    left: 130%;
  }
}
.glass-panel {
  transition: all 0.3s ease;
}

.glass-panel:hover {
  transform: translateY(-6px);

  box-shadow:
    0 20px 40px rgba(0,0,0,0.25),
    0 0 25px rgba(59,130,246,0.12);
}
.empty-text {
  animation: softPulse 2s ease-in-out infinite;
}

@keyframes softPulse {
  0%, 100% {
    opacity: 0.55;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}
</style>