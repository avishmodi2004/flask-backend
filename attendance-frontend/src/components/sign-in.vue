<template>
  <div class="wrapper">
    <!-- Login Form Container -->
    <form class="login-form" @submit.prevent="signIn">
      <h1 class="academy">IPS Academy</h1>
      <h2 class="school-text">School of Computer</h2>

      <div class="input-container">
        <!-- ID Input -->
        <input
          v-model="credentials.id"
          :placeholder="getPlaceholder"
          required
          class="modern-input"
        />

        <!-- Password Input -->
        <div class="password-box">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="credentials.password"
            placeholder="Password"
            required
            class="modern-input"
          />
          <span class="toggle" @click="showPassword = !showPassword">
            {{ showPassword ? "Hide" : "Show" }}
          </span>
        </div>

        <!-- Role Selection -->
        <select v-model="selectedRole" class="modern-select">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option> <!-- 🔥 Naya Role Add Kiya -->
          <option value="admin">Admin</option>
        </select>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading" class="sign-in-btn">
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>
      </div>

      <p class="contact-text">No account? Contact Admin</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedRole: "student",
      showPassword: false,
      loading: false,
      credentials: {
        id: "",
        password: "",
      },
    };
  },
  computed: {
    // Dynamic placeholder text
    getPlaceholder() {
      if (this.selectedRole === 'admin') return 'Admin ID';
      if (this.selectedRole === 'teacher') return 'Teacher ID';
      return 'College ID';
    }
  },
  methods: {
    async signIn() {
      this.loading = true;
      try {
        let res;
        const apiBase = "http://localhost:4000/api";
        
        // 1. Student Login
        if (this.selectedRole === "student") {
          res = await axios.post(`${apiBase}/student/signin`, {
            collageID: this.credentials.id,
            password: this.credentials.password,
          });
          localStorage.setItem("student", JSON.stringify(res.data.student));
          alert("Student Login Success ✅");
          this.$router.push("/dashboard");
        } 
        // 2. Teacher Login Logic 🔥
        else if (this.selectedRole === "teacher") {
          res = await axios.post(`${apiBase}/teacher/signin`, {
            teacherID: this.credentials.id,
            password: this.credentials.password,
          });
          localStorage.setItem("teacher", JSON.stringify(res.data.teacher));
          alert("Teacher Login Success ✅");
          this.$router.push("/teacher-dashboard"); // Teacher ke dashboard ka route
        }
        // 3. Admin Login
        else {
          res = await axios.post(`${apiBase}/admin/signin`, {
            adminID: this.credentials.id,
            password: this.credentials.password,
          });
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
          alert("Admin Login Success ✅");
          this.$router.push("/admin");
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Login failed ❌");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>

.wrapper{
  position: fixed;
  inset: 0;

  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  background:
  linear-gradient(
    rgba(0,0,0,0.65),
    rgba(0,0,0,0.75)
  ),
  url("/src/assets/login-bg.jpeg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* animated glowing circles */

.wrapper::before{
  content:"";

  position:absolute;

  width:500px;
  height:500px;

  background:
  radial-gradient(
    circle,
    rgba(59,130,246,0.25),
    transparent 70%
  );

  top:-120px;
  left:-120px;

  animation: glowMove 8s infinite alternate;
}

.wrapper::after{
  content:"";

  position:absolute;

  width:450px;
  height:450px;

  background:
  radial-gradient(
    circle,
    rgba(168,85,247,0.25),
    transparent 70%
  );

  bottom:-120px;
  right:-120px;

  animation: glowMove2 8s infinite alternate;
}

@keyframes glowMove{

  from{
    transform:translate(0,0);
  }

  to{
    transform:translate(70px,40px);
  }
}

@keyframes glowMove2{

  from{
    transform:translate(0,0);
  }

  to{
    transform:translate(-60px,-40px);
  }
}

/* login card */

.login-form{

  position: relative;
  z-index: 10;

  width: 420px;

  padding: 40px;

  border-radius: 30px;

  background:
  rgba(15,23,42,0.72);

  backdrop-filter: blur(18px);

  border:
  1px solid rgba(255,255,255,0.12);

  box-shadow:
  0 20px 50px rgba(0,0,0,0.55);

  text-align:center;

  color:white;

  animation: fadeUp 0.5s ease;
}

@keyframes fadeUp{

  from{
    opacity:0;
    transform:translateY(30px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* heading */

.academy{

  font-size:42px;

  font-weight:700;

  margin-bottom:10px;

  background:
  linear-gradient(
    to right,
    #38bdf8,
    #818cf8
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.school-text{

  color:#cbd5e1;

  margin-bottom:35px;

  font-size:16px;

  font-weight:400;
}

/* input area */

.input-container{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.modern-input,
.modern-select{

  width:100%;

  padding:16px;

  border-radius:16px;

  border:
  1px solid rgba(255,255,255,0.08);

  background:
  rgba(255,255,255,0.06) !important;

  color:white !important;

  outline:none;

  font-size:15px;

  transition:0.3s;

  box-sizing:border-box;
}

.modern-input:focus,
.modern-select:focus{

  border-color:#3b82f6;

  box-shadow:
  0 0 15px rgba(59,130,246,0.25);
}

.modern-input::placeholder{
  color:#94a3b8;
}

.modern-select option{
  background:#0f172a;
  color:white;
}

/* password */

.password-box{
  position:relative;
}

.toggle{

  position:absolute;

  right:15px;
  top:50%;

  transform:translateY(-50%);

  cursor:pointer;

  color:#94a3b8;

  font-size:12px;

  font-weight:bold;
}

/* button */

.sign-in-btn{

  width:100%;

  padding:16px;

  border:none;

  border-radius:16px;

  background:
  linear-gradient(
    to right,
    #2563eb,
    #06b6d4
  );

  color:white;

  font-size:16px;

  font-weight:600;

  cursor:pointer;

  transition:0.3s;

  margin-top:8px;
}

.sign-in-btn:hover:not(:disabled){

  transform:translateY(-2px);

  box-shadow:
  0 12px 30px rgba(59,130,246,0.35);
}

.sign-in-btn:disabled{
  opacity:0.7;
  cursor:not-allowed;
}

/* footer */

.contact-text{

  margin-top:25px;

  color:#94a3b8;

  font-size:14px;
}

/* responsive */

@media(max-width:500px){

  .login-form{
    width:92%;
    padding:28px;
  }

  .academy{
    font-size:32px;
  }
}

/* ===== LOGIN ANIMATIONS ===== */

.wrapper::before{
  content:"";
  position:absolute;
  width:520px;
  height:520px;
  top:-140px;
  left:-120px;
  background:radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%);
  animation: loginGlowOne 8s infinite alternate;
  pointer-events:none;
}

.wrapper::after{
  content:"";
  position:absolute;
  width:460px;
  height:460px;
  right:-120px;
  bottom:-120px;
  background:radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%);
  animation: loginGlowTwo 9s infinite alternate;
  pointer-events:none;
}

@keyframes loginGlowOne{
  from{
    transform:translate(0,0);
  }
  to{
    transform:translate(70px,45px);
  }
}

@keyframes loginGlowTwo{
  from{
    transform:translate(0,0);
  }
  to{
    transform:translate(-70px,-45px);
  }
}

.login-form{
  animation: loginCardEntry 0.7s ease;
}

@keyframes loginCardEntry{
  from{
    opacity:0;
    transform:translateY(35px) scale(0.96);
  }
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

.academy{
  animation: titleGlow 2.5s infinite alternate;
}

@keyframes titleGlow{
  from{
    filter:drop-shadow(0 0 4px rgba(59,130,246,0.4));
  }
  to{
    filter:drop-shadow(0 0 16px rgba(6,182,212,0.8));
  }
}

.modern-input,
.modern-select{
  transition:0.3s ease;
}

.modern-input:focus,
.modern-select:focus{
  transform:scale(1.02);
  box-shadow:0 0 18px rgba(59,130,246,0.35);
}

.sign-in-btn{
  position:relative;
  overflow:hidden;
}

.sign-in-btn::before{
  content:"";
  position:absolute;
  top:0;
  left:-120%;
  width:100%;
  height:100%;
  background:linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.35),
    transparent
  );
  transition:0.6s;
}

.sign-in-btn:hover::before{
  left:120%;
}

.sign-in-btn:hover{
  transform:translateY(-3px) scale(1.02);
}
</style>