<script setup>
import { ref } from "vue";
import Camera from "simple-vue-camera";

const camera = ref(null);
const emit = defineEmits(["sendBlob"]);

const takeSnapShot = async () => {
  try {
    // 🔥 check camera ready hai ya nahi
    if (!camera.value) {
      console.error("Camera not ready ❌");
      return;
    }

    // 🔥 snapshot lo
    const blob = await camera.value.snapshot(
      { width: 640, height: 480 },
      "image/jpeg",   // ✅ PNG hata diya (important)
      0.7
    );

    // 🔥 agar blob null hai to error
    if (!blob) {
      console.error("Snapshot failed ❌");
      return;
    }

    console.log("BLOB:", blob); // ✅ debug

    alert("Photo clicked ✅");

    // 🔥 parent ko bhejo (admin.vue)
    emit("sendBlob", blob);

  } catch (err) {
    console.error("Camera error:", err);
  }
};
</script>

<template>
  <div>
    <!-- CAMERA -->
    <Camera
      :resolution="{ width: 640, height: 480 }"
      ref="camera"
      autoplay
    />

    <!-- BUTTON -->
    <button @click="takeSnapShot">
      Take Photo
    </button>
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>