<template>
  <div id="app-wrapper">
    <!-- Router view hi saare pages (Login, Admin, etc.) ko render karega -->
    <router-view></router-view> 
  </div>
</template>


<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global CSS jo har page par apply hogi */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  /* Dark background taaki page load hote waqt white flash na maare */
  background-color: #020617; 
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

#app-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Scrollbar ko thoda sa clean karne ke liye (Optional) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>