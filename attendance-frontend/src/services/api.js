import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
});

// ================= FETCH STUDENTS =================
export const fetchAllStudents = async () => {
  try {
    const res = await api.get("/student");
    return res.data;
  } catch (err) {
    console.error("Student fetch error:", err);
    throw err;
  }
};

// ================= ADD STUDENT =================
export const addStudent = async (studentData) => {
  try {
    const formData = new FormData();
    formData.append("collageID", studentData.collageID);
    formData.append("name", studentData.name);
    formData.append("password", studentData.password);
    formData.append("semester", studentData.semester);

    if (studentData.studentImage && studentData.studentImage instanceof Blob) {
      formData.append("image", studentData.studentImage);
    } else {
      throw new Error("Image not captured properly ❌");
    }

    const response = await api.post("/student/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.error("🔥 Add Student Error:", err);
    throw err;
  }
};

// ================= ADMIN FUNCTIONS =================
export const adminSignin = async (loginData) => {
  const res = await api.post("/admin/signin", loginData);
  return res.data;
};

export const addAdmin = async (adminData) => {
  const res = await api.post("/admin/addadmin", adminData);
  return res.data;
};

export const classInit = async () => {
  const res = await api.post("/admin/init");
  return res.data;
};

// ================= TEACHER SECTION =================
export const getTeachers = async () => {
  const res = await api.get("/teacher");
  return res.data;
};

export const addTeacher = async (teacher) => {
  return api.post("/teacher", teacher);
};

export const deleteTeacher = async (id) => {
  return api.delete(`/teacher/${id}`);
};

export const teacherSignin = async (loginData) => {
  const res = await api.post("/teacher/signin", loginData);
  return res.data;
};

// ================= SUBJECT SECTION =================
export const getSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data;
};

export const addSubject = async (subject) => {
  return api.post("/subjects", subject);
};

export const deleteSubject = async (id) => {
  return api.delete(`/subjects/${id}`);
};

export const getTeacherSubjects = async (tid) => {
  return api.get(`/subjects/teacher/${tid}`);
};

// ================= CLASS STATUS =================
export const getClassStatus = async (tid) => {
  // ✅ FIXED: Backticks use kiye hain taaki tid sahi se jaye
  const res = await api.get(`/class/current-status/${tid}`); 
  return res.data;
};

export default api;
// ================= ATTENDANCE SECTION (NEW) =================
// Isse Face Recognition wala 404 error solve ho jayega
export const markAttendance = async (attendanceData) => {
  try {
    // attendanceData mein collageID aur image1 (live base64) jayega
    const res = await api.post("/student/mark-attendance", attendanceData);
    return res.data;
  } catch (err) {
    console.error("Attendance API Error:", err);
    throw err;
  }
};