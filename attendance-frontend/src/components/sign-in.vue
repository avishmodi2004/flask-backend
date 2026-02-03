<template>
     
 
      <form @submit.prevent = "signIn">
          <div v-if = "selectedRole === 'student'">
            <input v-model = credentials.collageID placeholder="Collage ID">
            <input type = "password" v-model = credentials.password placeholder="Student password">
          </div>

          <div v-if = "selectedRole === 'admin'">
            <input v-model = adminCredentials.adminID placeholder="Admin ID">
            <input type = "password" v-model = adminCredentials.password placeholder="Admin password">
          </div>

          <select v-model = "selectedRole">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <button type = "submit">Sign in</button>
         <!-- <p v-if = "selectedRole === 'admin'">No account? <a @click="$router.push('/register')">Register here</a></p> -->
          <p v-if = "selectedRole === 'student'">No account then contact to Admin</p>
      </form>
</template>

<script>
    import { checkDetails , checkAdminDetails} from '@/services/api';
    export default{

        data(){
            return{ 
                selectedRole : "student",
                credentials:{collageID: "",password: ""},
                adminCredentials:{adminID : "", password : ""}
            }
        },
        methods:{
             async signIn(){
                try{
                    if(this.selectedRole === "student"){
                        console.log("Sending:", this.credentials);
                        const response = await checkDetails(this.credentials);
                        const student = response.student;
                        localStorage.setItem("student", JSON.stringify(student));
                        this.$router.push("/dashboard")
                    }
                    else{
                        const response = await checkAdminDetails(this.adminCredentials);
                       // localStorage.setItem("admin", JSON.stringify(student));
                        this.$router.push("/admin");
                    }
                    
                }
                catch(error){
                       console.log(error.message);
                       alert(error.response?.data?.message || "Sign-in failed");
                }
             }
        }
    }
</script>

<style scoped>
  h1{
      text-align: center;
      color: black;
  }
  form {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px 25px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  margin: 10px 0;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

select {
  background-color: #fff;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Message links */
p {
  margin-top: 15px;
  text-align: center;
  font-size: 0.95rem;
  color: #555;
}

a {
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
  transition: color 0.2s ease;
}

a:hover {
  color: #dc3545;
}
</style>