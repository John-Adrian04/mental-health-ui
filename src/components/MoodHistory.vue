<template>
  <div class="history-card">
    <h3>Mood History</h3>
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-if="error" :message="error" :onRetry="fetchMoods" />
    <ul v-else>
      <li v-for="mood in moods" :key="mood.id">
        <span class="date">{{ new Date(mood.date).toLocaleString() }}</span>
        <span class="text">— {{ mood.full_name }} felt "{{ mood.mood_text }}"</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMoodHistory } from '../services/moodService';
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorMessage from './ErrorMessage.vue';

const moods = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchMoods = async () => {
  try {
    moods.value = await getMoodHistory();
  } catch {
    error.value = 'Failed to load mood history';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMoods);
</script>

<style scoped>
.history-card {
  background: #000;
  color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 500px;
  margin: 20px auto;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 10px 0;
  border-bottom: 1px solid #444;
}
.date {
  font-weight: bold;
  color: #ffeb3b;
}
.text {
  color: #fff;
}
</style>