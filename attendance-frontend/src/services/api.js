import axios from "axios";
const API_URL = "http://localhost:4000/api";
export const addStudent = async(studentData) => {
      try{
        const formData = new FormData();
        formData.append("collageID", studentData.collageID);
        formData.append("name", studentData.name);
        formData.append("password", studentData.password);
        formData.append("studentImage",studentData.studentImage);
        console.log(formData);
        const response = await axios.post(`${API_URL}/addstudent`,formData,{
           headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data;
      }
      catch(error){
        console.error("Axios Error:", error.message);
        console.error("Axios Response Data:", error.response?.data || "No response received");
        throw error;
      }
      
}

export const addAdmin = async(AdminData) => {
  try{
    const response = await axios.post(`${API_URL}/addadmin`,AdminData);
    return response.data;
  }
  catch(error){
    console.error("Axios Error:", error.message);
    console.error("Axios Response Data:", error.response?.data || "No response received");
    throw error;
  }
  
}

export const classInit = async() =>{
     try{
        const response = await axios.get(`${API_URL}/initclass`);
     }
     catch(err){
        console.log(err);
        throw err;
     }

}
export const getPresentDays = async(studentData)=>{
      try{
          const response = await axios.post(`${API_URL}/get-all-days`,studentData,{
            headers: { "Content-Type": "application/json" } // Ensure JSON
        });
          return response.data;
      }
      catch(error){
        console.error("Axios Error:", error.message);
        console.error("Axios Response Data:", error.response?.data || "No response received");
        throw error;
      }
}
export const markAttendance = async(studentData) =>{
      try{
        console.log(studentData);
         const response = axios.post(`${API_URL}/mark-attendance`, studentData);
         return response.message;
      }
      catch(err){
        console.error(err.message);
        throw err;
      }
}
export const markAttendanceByFace = async(studentData) =>{
      try{

        
        const formData = new FormData();
        formData.append("collageID",studentData.collageID);
        formData.append("studentImage",studentData.studentImage);
        const response = await axios.post(`${API_URL}/mark-attendance-face`,formData,{
           headers: { "Content-Type": "multipart/form-data" }
        });
        return response.message;
      }
      catch(err){
         console.log(err);
         alert("error to mark attendance by face");
      }
}
export const checkDetails = async(studentData) =>{
  try{
    const response = await axios.post(`${API_URL}/signin`,studentData, {
      headers: { "Content-Type": "application/json" } // Ensure JSON
  });
    return response.data;
  }
  catch(error){
    console.error("Axios Error:", error.message);
    console.error("Axios Response Data:", error.response?.data || "No response received");
    throw error;
  }
}
export const showStudentImage = async (studentData) =>{
    try{
       const response = await axios.post(
            `${API_URL}/getImage`,studentData,{
              headers : {"Content-Type": "application/json"}
            }
        );
      console.log(response.data.image);
      return response.data.image;
    }
    catch(err){
           throw err;
    }
}
export const checkAdminDetails = async(AdminData) =>{
    try{
        const response = await axios.post(`${API_URL}/adminSignin`,AdminData,{
            headers: { "Content-Type": "application/json" }});
        return response;
    }
    catch(error){
      console.error("Axios Error:", error.message);
      console.error("Axios Response Data:", error.response?.data || "No response received");
      throw error;
    }
}
export const fetchAllStudents = async()=>{
   try{
        const response = await axios.get(`${API_URL}/all-students`);
        return response.data;
   }
   catch(error){
    console.error("Axios Error:", error.message);
    console.error("Axios Response Data:", error.response?.data || "No response received");
    throw error;
   }
}