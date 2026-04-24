import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
formData
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

// ================= ADD ADMIN =================
export const addAdmin = async (adminData) => {
const response = await axios.post(
`${API_URL}/addadmin`,
adminData
);
return response.data;
};
