
require('dotenv').config();
console.log("✅ Loaded DeepSeek API key:", process.env.DEEPSEEK_API_KEY);
const express = require('express');
const cors = require('cors');
const { generateAdvice } = require('./services/deepseekClient'); 
const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// AI Advice Endpoint 
// app.post('/api/ai/advice', (req, res) => {
//   const { topic, userProfile } = req.body;

//   console.log('📥 Request Body:', req.body);

//   const exampleAdvice = {
//     Diet: "A healthy diet for hair includes protein, iron, omega-3s, and hydration.",
//     Haircare: "Use sulfate-free shampoos, deep condition weekly, and avoid heat damage.",
//     "Hair health": "Sleep, reduce stress, stay hydrated, and protect hair from UV.",
//     "Doctor's Advice": "If you're experiencing hair loss, consult a dermatologist for blood tests and treatment options.",
//     "Face shape": "Choose styles that highlight your features. Oval faces suit most styles.",
//     Style: "Try protective styles, limit heat styling, and trim split ends regularly.",
//   };

//   const advice = exampleAdvice[topic] || `No tailored advice available for: ${topic}`;

//   const response = {
//     advice: `Hello ${userProfile?.gender || 'friend'}! Here's some advice about ${topic}: ${advice}`,
//   };

//   console.log('📤 Responding with:', response);

//   res.json(response);
// });

app.post('/api/ai/advice', async (req, res) => {
  const { topic, userProfile, backgroundInfo } = req.body;

  try {
    console.log('➡️  POST /api/ai/advice');
    console.log('📥 Request Body:', req.body);

    const adviceJson = await generateAdvice(userProfile, topic, backgroundInfo);
    console.log('📤 Responding with structured advice:', adviceJson);

    res.json(adviceJson); // 💡 Now the frontend gets the full structure
  } catch (error) {
    console.error('❌ Error generating advice:', error.message);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
});


// Health check
app.get('/', (req, res) => {
  res.send('Hair Health AI server is up and running.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
