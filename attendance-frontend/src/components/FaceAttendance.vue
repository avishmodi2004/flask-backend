<template>
  <!-- ✅ Sirf ye wrapper div add kiya hai warning hatane ke liye -->
  <div class="face-attendance-wrapper">
    <div class="camera-container">
      <!-- CAMERA COMPONENT -->
      <Camera
        :resolution="{ width: 640, height: 480 }"
        ref="camera"
        autoplay
        class="video-feed"
      />

      <!-- TAKE PHOTO BUTTON -->
      <div class="controls">
        <button type="button" class="capture-btn" @click="takeSnapShot">
          📸 Click Photo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Camera from "simple-vue-camera";

const camera = ref(null);
const emit = defineEmits(["sendBlob"]);

const takeSnapShot = async () => {
  try {
    if (!camera.value) {
      console.error("Camera not ready ❌");
      return;
    }

    const blob = await camera.value.snapshot(
      { width: 640, height: 480 },
      "image/jpeg",
      0.7
    );

    if (!blob) {
      console.error("Snapshot failed ❌");
      return;
    }

    console.log("BLOB Captured:", blob);
    emit("sendBlob", blob); 

  } catch (err) {
    console.error("Camera error:", err);
  }
};
</script>

<style scoped>
/* Wrapper to solve the extraneous non-props warning */
.face-attendance-wrapper {
  width: 100%;
  height: 100%;
}

.camera-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.capture-btn {
  padding: 10px 20px;
  background: rgba(37, 99, 235, 0.9);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.capture-btn:hover {
  transform: scale(1.1);
  background: #2563eb;
}
</style>