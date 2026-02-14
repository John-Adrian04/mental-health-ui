<template>
  <div class="app-container">
    <MoodForm />
    <MoodHistory />
  </div>
</template>

<script setup>
import MoodForm from './components/MoodForm.vue';
import MoodHistory from './components/MoodHistory.vue';
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff; /* constant white background */
}

.app-container {
  display: flex;
  flex-direction: column; /* stack vertically */
  align-items: center;    /* center horizontally */
  justify-content: center;/* center vertically */
  min-height: 100vh;      /* full screen height */
  gap: 30px;              /* spacing between MoodForm and MoodHistory */
}
</style>