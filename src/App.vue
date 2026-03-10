<template>
  <div class="zen-wrapper">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="main-content">
      <header class="glass-header">
        <h1>Mindful<span>Space</span></h1>
        <p>How is your soul feeling today?</p>
      </header>

      <section class="glass-card form-section">
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label>Current Vibration</label>
            <div class="mood-selector">
              <button 
                type="button" 
                v-for="m in moodOptions" 
                :key="m.val"
                :class="{ active: form.mood === m.val }"
                @click="form.mood = m.val"
              >
                <span class="emoji">{{ m.emoji }}</span>
                <span class="label">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>Reflection</label>
            <textarea 
              v-model="form.note" 
              placeholder="Deep breaths... write what's on your mind..."
            ></textarea>
          </div>

          <button type="submit" :disabled="loading || !form.mood" class="glow-button">
            {{ loading ? 'Syncing...' : 'Release to Journal' }}
          </button>
        </form>
      </section>

      <section class="history-container">
        <h3 class="section-title">Timeline of Peace</h3>
        <div v-if="history.length === 0" class="empty-state">No reflections captured yet.</div>
        
        <div v-for="item in history" :key="item.id" class="journal-entry">
          <div class="entry-emoji">{{ item.mood.split(' ')[0] }}</div>
          <div class="entry-details">
            <div class="entry-header">
              <span class="entry-mood">{{ item.mood.split(' ').slice(1).join(' ') }}</span>
              <span class="entry-date">{{ formatDate(item.created_at) }}</span>
            </div>
            <p class="entry-note">{{ item.note || 'A moment of silence.' }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = "https://mental-health-ui-1nt5.onrender.com";
const loading = ref(false);
const history = ref([]);
const form = ref({ mood: '', note: '' });

const moodOptions = [
  { val: '😊 Happy', emoji: '😊', label: 'Radiant' },
  { val: '😐 Neutral', emoji: '😐', label: 'Balanced' },
  { val: '😢 Sad', emoji: '😢', label: 'Healing' },
  { val: '😠 Stressed', emoji: '😠', label: 'Overwhelmed' }
];

const fetchHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/api/history`);
    history.value = await res.json();
  } catch (err) { console.error(err); }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    if (res.ok) {
      form.value = { mood: '', note: '' };
      await fetchHistory();
    }
  } catch (err) { alert("Connection issue."); }
  finally { loading.value = false; }
};

const formatDate = (ds) => new Date(ds).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
onMounted(fetchHistory);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.zen-wrapper {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: #0f172a; /* Deep dark blue */
  color: #f8fafc;
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

/* Background Blobs */
.blob {
  position: absolute;
  width: 400px;
  height: 400px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  filter: blur(80px);
  border-radius: 50%;
  z-index: 0;
}
.blob-1 { top: -100px; right: -100px; }
.blob-2 { bottom: -100px; left: -100px; background: rgba(45, 212, 191, 0.1); }

.main-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }

.glass-header { text-align: center; margin-bottom: 40px; }
.glass-header h1 { font-weight: 600; font-size: 2.5rem; letter-spacing: -1px; }
.glass-header h1 span { color: #818cf8; }
.glass-header p { opacity: 0.7; font-weight: 300; }

/* Form Card */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.input-group { margin-bottom: 25px; }
.input-group label { display: block; margin-bottom: 12px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #818cf8; }

/* Mood Buttons */
.mood-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.mood-selector button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 15px 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
}
.mood-selector button:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-3px); }
.mood-selector button.active { background: #818cf8; border-color: #818cf8; transform: scale(1.05); }
.emoji { font-size: 1.5rem; display: block; margin-bottom: 5px; }
.label { font-size: 0.7rem; opacity: 0.8; }

textarea {
  width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 15px; color: white; font-family: inherit; resize: none; height: 100px;
}

.glow-button {
  width: 100%; padding: 16px; border-radius: 16px; border: none;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  color: white; font-weight: 600; cursor: pointer;
  transition: 0.3s; box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}
.glow-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }

/* History */
.section-title { margin-top: 50px; font-weight: 600; font-size: 1.2rem; margin-bottom: 20px; }
.journal-entry {
  display: flex; align-items: center; background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05); border-radius: 20px;
  padding: 20px; margin-bottom: 15px; transition: 0.3s;
}
.journal-entry:hover { background: rgba(255,255,255,0.05); border-color: rgba(129, 140, 248, 0.4); }
.entry-emoji { font-size: 2rem; margin-right: 20px; }
.entry-details { flex: 1; }
.entry-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
.entry-mood { font-weight: 600; color: #818cf8; }
.entry-date { font-size: 0.75rem; opacity: 0.5; }
.entry-note { font-size: 0.9rem; opacity: 0.8; line-height: 1.5; }
</style>