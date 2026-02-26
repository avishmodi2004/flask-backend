```vue
<template>
  <div class="wrapper">

    <!-- LOGIN CARD -->
    <form class="login-form" @submit.prevent="signIn">

      <h1 class="academy">IPS Academy</h1>
      <h2>Welcome Back</h2>

      <input v-model="credentials.collageID" placeholder="College ID" />

      <input
        type="password"
        v-model="credentials.password"
        placeholder="Password"
      />

      <select v-model="selectedRole">
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Sign in</button>

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
      credentials: {
        collageID: "",
        password: "",
      },
    };
  },
  methods: {
    async signIn() {
      try {
        const res = await axios.post(
          "http://localhost:3000/student/signin",
          this.credentials
        );

        localStorage.setItem("student", JSON.stringify(res.data.student));
        this.$router.push("/student");
      } catch (err) {
        alert("Login failed");
      }
    },
  },
};
</script>

<style scoped>
:global(body){
  margin:0;
}

/* BACKGROUND IMAGE */
.wrapper {
  position: relative;
  height: 100vh;
  background: url("@/assets/login-bg.png") center/cover no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* DARK OVERLAY */
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

/* GLASS LOGIN CARD */
.login-form {
  position: relative;
  width: 380px;
  padding: 40px 36px;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 28px;

  box-shadow:
    0 0 0 1px rgba(255,255,255,0.15),
    0 40px 80px rgba(0,0,0,0.55);

  z-index: 2;
  text-align: center;
}

/* IPS HEADING */
.academy{
  color:white;
  font-size:32px;
  margin-bottom:8px;
  text-shadow:0 10px 40px rgba(0,0,0,0.7);
}

h2 {
  color:white;
  margin-bottom:22px;
}

/* INPUT STYLE */
input,
select {
  width: 100%;
  padding: 14px;
  margin-bottom: 14px;
  border-radius: 12px;
  border: none;
  outline:none;
  background: rgba(255,255,255,0.85);
}

/* BUTTON */
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

p {
  margin-top: 15px;
  text-align: center;
  font-size: 0.85rem;
  color:white;
}
</style>
```
