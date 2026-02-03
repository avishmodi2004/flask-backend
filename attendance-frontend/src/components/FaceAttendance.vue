<script setup>
   import {ref} from "vue"
   import Camera from "simple-vue-camera";
   const camera = ref();
   const emit = defineEmits(["sendBlob"]);
   const takeSnapShot = async ()=>{
      let blob = await camera.value.snapshot({width: 640, height : 480},
        "image/png",
        0.7
      );
      alert("photo clicked");
     emit("sendBlob",blob);
      
   }
   
  
</script>

<template>
  <Camera :resolution="{width: 1970 , height:1090 }" ref = "camera" autoplay />
   
  <button @click = "takeSnapShot">take photo</button>
 
  
</template>

<style scoped>
   #cam{
       width :50%;
       height: 50%;
   }
</style>
