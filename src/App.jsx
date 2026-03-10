import React, { useState, useEffect } from 'react';

const API_URL = "https://mental-health-ui-1nt5.onrender.com"; 

function App() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history from database
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Submit new entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note })
      });
      
      if (response.ok) {
        setMood('');
        setNote('');
        fetchHistory(); // Refresh the list
      }
    } catch (err) {
      alert("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Daily Mood Tracker</h1>
        <p>How are you feeling today?</p>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select 
          value={mood} 
          onChange={(e) => setMood(e.target.value)} 
          required 
          style={styles.input}
        >
          <option value="">Select Mood</option>
          <option value="😊 Happy">😊 Happy</option>
          <option value="😐 Neutral">😐 Neutral</option>
          <option value="😢 Sad">😢 Sad</option>
          <option value="😠 Stressed">😠 Stressed</option>
        </select>

        <textarea 
          placeholder="Write a brief note about your day..." 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          style={{...styles.input, height: '100px'}}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      <div style={styles.historySection}>
        <h3>Your Progress</h3>
        {history.length === 0 ? <p>No entries yet. Start by adding one!</p> : 
          history.map(item => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>{item.mood}</strong>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <p style={styles.cardNote}>{item.note}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// Simple internal CSS
const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f9fbfd', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '30px', color: '#2d3748' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#667eea', color: 'white', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  historySection: { marginTop: '40px' },
  card: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '5px solid #667eea', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#4a5568' },
  cardNote: { margin: 0, color: '#2d3748' }
};

export default App;