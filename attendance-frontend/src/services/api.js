import axios from "axios";

const API_URL = "http://localhost:4000/api";

// ================= ADD STUDENT =================
export const addStudent = async (studentData) => {
  const formData = new FormData();

  formData.append("collageID", studentData.collageID);
  formData.append("name", studentData.name);
  formData.append("password", studentData.password);
  formData.append("semester", studentData.semester);
  formData.append("image", studentData.studentImage, "photo.jpg");

  const response = await axios.post(
    `${API_URL}/student/add`,
    formData,
    {
        headers: {
          "Content-Type": "multipart/form-data"
        }
    }
  );

  return response.data;
};

// ================= FETCH ALL STUDENTS =================
export const fetchAllStudents = async () => {
  const response = await axios.get(`${API_URL}/student`);
  return response.data;
};

// ================= START CLASS =================
export const classInit = async () => {
  const response = await axios.post(`${API_URL}/admin/init`);
  return response.data;
};

// ================= ADMIN LOGIN (🔥 ADD THIS) =================
export const adminSignin = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/admin/signin`,   // ✅ FIXED ROUTE
    loginData
  );
  return response.data;
};

// ================= ADD ADMIN =================
export const addAdmin = async (adminData) => {
  const response = await axios.post(
    `${API_URL}/admin/addadmin`,  // ✅ FIXED (important)
    adminData
  );
  return response.data;
};