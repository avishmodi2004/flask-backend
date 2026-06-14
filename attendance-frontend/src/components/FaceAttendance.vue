<template>
  <div class="face-attendance-wrapper">
    <div class="camera-container">
      <div class="challenge-box">
        {{ challenge }}
      </div>

      <Camera
        :resolution="{ width: 320, height: 240 }"
        ref="camera"
        autoplay
        class="video-feed"
      />

      <div class="controls">
        <button type="button" class="capture-btn" @click="takeSnapShot">
          📸 Capture
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

const challenges = [
  "Look UP",
  "Look DOWN",
  "Move Face LEFT",
  "Move Face RIGHT",
];

const challenge = ref(
  challenges[Math.floor(Math.random() * challenges.length)]
);

const takeSnapShot = async () => {
  const blob = await camera.value.snapshot(
    { width: 320, height: 240 },
    "image/jpeg",
    0.5
  );

  emit("sendBlob", {
    blob,
    challenge: challenge.value,
  });
};
</script>

<style scoped>
.face-attendance-wrapper {
  width: 100%;
  height: 100%;
}

.camera-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scan-box {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.78);
  color: white;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: bold;
  z-index: 20;
  border: 1px solid #2563eb;
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
  padding: 10px 22px;
  background: rgba(37, 99, 235, 0.95);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
}

.capture-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>