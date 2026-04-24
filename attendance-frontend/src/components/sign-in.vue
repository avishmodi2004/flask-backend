<template>
  <div class="wrapper">

    <form class="login-form" @submit.prevent="signIn">

      <h1 class="academy">IPS Academy</h1>
      <h2>Welcome Back</h2>

      <input
        v-model="credentials.id"
        :placeholder="selectedRole === 'admin' ? 'Admin ID' : 'College ID'"
        required
      />

      <div class="password-box">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="credentials.password"
          placeholder="Password"
          required
        />
        <span class="toggle" @click="showPassword = !showPassword">
          {{ showPassword ? "Hide" : "Show" }}
        </span>
      </div>

      <select v-model="selectedRole">
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" :disabled="loading">
        {{ loading ? "Signing in..." : "Sign in" }}
      </button>

      <p>No account? Contact Admin</p>

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

  methods: {
    async signIn() {
      this.loading = true;

      try {
        let res;

        if (this.selectedRole === "student") {

          // ✅ STUDENT LOGIN
          res = await axios.post(
            "http://localhost:5000/api/student/signin",
            {
              collageID: this.credentials.id,
              password: this.credentials.password,
            }
          );

          localStorage.setItem("student", JSON.stringify(res.data.student));
          alert("Student Login Success ✅");
          this.$router.push("/dashboard");

        } else {

          // ✅ ADMIN LOGIN (🔥 FIXED)
          res = await axios.post(
            "http://localhost:5000/api/admin/signin",
            {
              adminID: this.credentials.id,
              password: this.credentials.password,
            }
          );

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
:global(body){
  margin:0;
  font-family: Arial, sans-serif;
}

.wrapper {
  position: relative;
  height: 100vh;
  background: url("@/assets/login-bg.png") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(
    135deg,
    rgba(15,25,50,0.7),
    rgba(70,25,90,0.55)
  );
}

.login-form {
  position: relative;
  width: 380px;
  padding: 40px 36px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 28px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.15),
    0 40px 80px rgba(0,0,0,0.55);
  z-index: 2;
  text-align: center;
}

.academy{
  color:white;
  font-size:32px;
  margin-bottom:8px;
}

h2 {
  color:white;
  margin-bottom:22px;
}

input,
select {
  width: 100%;
  padding: 14px;
  margin-bottom: 14px;
  border-radius: 12px;
  border: none;
  outline:none;
  background: rgba(255,255,255,0.9);
  font-size: 14px;
}

.password-box {
  position: relative;
}

.toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 12px;
  color: #333;
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  transform: scale(1.03);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

p {
  margin-top: 15px;
  font-size: 0.85rem;
  color:white;
}
</style>