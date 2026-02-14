<template>
  <div class="error-box">
    <p>⚠️ {{ message }}</p>
    <button v-if="onRetry" @click="onRetry">Retry</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  onRetry: {
    type: Function,
    required: false
  }
});
</script>

<style scoped>
.error-box {
  background: #ffe6e6;
  color: #b30000;
  padding: 12px;
  border: 1px solid #b30000;
  border-radius: 6px;
  margin: 10px 0;
  text-align: center;
}
button {
  margin-top: 8px;
  background: #b30000;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #800000;
}
</style>