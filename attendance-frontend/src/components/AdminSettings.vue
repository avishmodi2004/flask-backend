<template>
  <div class="container">

```
<h2>Change Admin Details</h2>

<input v-model="name" placeholder="New Name" />

<input
  type="password"
  v-model="oldPassword"
  placeholder="Old Password"
/>

<input
  type="password"
  v-model="newPassword"
  placeholder="New Password"
/>

<input v-model="newAdminID" placeholder="New Admin ID" />

<button @click="updateAdmin">Update</button>
```

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      oldPassword: "",
      newPassword: "",
      newAdminID: ""
    };
  },

  methods: {
    async updateAdmin() {
      try {
        const admin = JSON.parse(localStorage.getItem("admin"));

        const res = await axios.put(
          "http://localhost:5000/api/admin/update",
          {
            adminID: admin.admin.adminID,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            name: this.name,
            newAdminID: this.newAdminID
          }
        );

        alert("Admin updated successfully ✅");

      } catch (err) {
        alert(err.response?.data?.message || "Update failed ❌");
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #1565c0;
}
</style>
