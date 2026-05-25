const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.'));

let vitalsBuffer = {};

// ESP32 posts vitals here
app.post('/api/vitals', (req, res) => {
  const { patientId, temperature, weight } = req.body;
  if (!patientId || !temperature || !weight) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  vitalsBuffer[patientId] = { temperature, weight, timestamp: Date.now() };
  console.log(`Vitals received for ${patientId}:`, temperature, weight);
  res.json({ ok: true });
});

// Dashboard polls here
app.get('/api/vitals/:patientId', (req, res) => {
  const data = vitalsBuffer[req.params.patientId];
  res.json(data || null);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MedFlow server running on port ${PORT}`));