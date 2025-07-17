require('dotenv').config();
const axios = require('axios');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY;

async function generateAdvice(userProfile, topic, backgroundInfo) {
  const prompt = `
You are a certified haircare consultant AI. A user is asking for advice about the topic: "${topic}".

Their profile:
${JSON.stringify(userProfile, null, 2)}

Additional background:
${backgroundInfo}

Please respond in strictly the following JSON format:
{
  "summary": "Brief overview of the issue and why it matters for this user.",
  "causes": ["List 2-3 likely causes based on the user profile."],
  "recommendations": ["List 3 specific, practical, personalized actions the user should try."],
  "sourceNote": "Mention expert consensus or relevant research that supports the advice."
}

Return only valid JSON. No markdown, no commentary, no extra text.
`;

  const response = await axios.post(
    DEEPSEEK_API_URL,
    {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional haircare expert providing structured, reliable, and helpful responses.',
        },
        {
          role: 'user',
          content: prompt,
        }
      ],
      temperature: 0.7,
      max_tokens: 700
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    }
  );

  const raw = response.data.choices?.[0]?.message?.content;
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No valid JSON found in response');
  return JSON.parse(match[0]);
}

module.exports = { generateAdvice };
