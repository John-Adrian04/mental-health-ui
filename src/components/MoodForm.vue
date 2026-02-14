<template>
  <div class="form-card">
    <h2>Mood Check-in</h2>
    <input v-model="name" placeholder="Your name" />
    <textarea v-model="mood" placeholder="How are you feeling today?"></textarea>
    <button @click="submitMood">Submit</button>

    <!-- Show AI Advisor output -->
    <div v-if="aiMessage" class="ai-box">
      <h4>🤖 AI Advisor</h4>
      <p>{{ aiMessage }}</p>
    </div>

    <!-- Show error if validation fails -->
    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import ErrorMessage from './ErrorMessage.vue';

const name = ref('');
const mood = ref('');
const aiMessage = ref('');
const error = ref(null);

const submitMood = async () => {
  error.value = null;

  // Validation
  if (!name.value.trim()) {
    error.value = 'Name cannot be empty.';
    return;
  }
  if (!/^[A-Za-z\s]+$/.test(name.value)) {
    error.value = 'Name must contain only letters.';
    return;
  }
  if (!mood.value.trim()) {
    error.value = 'Mood cannot be empty.';
    return;
  }

  try {
    await api.post('/mood', {
      full_name: name.value,
      mood_text: mood.value
    });

    // AI Advisor responses
    const moodLower = mood.value.toLowerCase();
    if (moodLower.includes('sad')) {
      aiMessage.value = "Oh, you're sad. Take a deep breath — things will get better.";
    } else if (moodLower.includes('happy')) {
      aiMessage.value = "Great to hear you're happy! Keep spreading the positivity.";
    } else if (moodLower.includes('angry')) {
      aiMessage.value = "I see you're angry. Try to pause and calm yourself — it helps.";
    } else {
      aiMessage.value = `Thanks ${name.value}, I understand you're feeling "${mood.value}".`;
    }
  } catch {
    error.value = 'Failed to submit mood. Please try again.';
  }
};
</script>

<style scoped>
.form-card {
  background: #000;
  color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  margin: 20px auto;
  text-align: center;
}
input, textarea {
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border-radius: 6px;
  border: none;
}
button {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #43a047;
}
.ai-box {
  background: #222;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  color: #ffeb3b;
}
</style>