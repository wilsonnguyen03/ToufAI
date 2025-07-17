
const express = require('express');
const router = express.Router();
const { generateAdvice } = require('../services/deepseekClient');


router.post('/advice', async (req, res) => {
  try {
    console.log('📥 Request Body:', req.body);
    console.log('📤 Response:', response);

    const { userProfile, topic, backgroundInfo } = req.body;

    if (!userProfile || !topic || !backgroundInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const advice = await generateAdvice(userProfile, topic, backgroundInfo);
    res.json({ advice });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Something went wrong generating advice' });
  }
});

module.exports = router;
