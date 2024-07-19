const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: message }
                ],
                max_tokens: 100,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const tokenUsage = response.data.usage;
        const reply = response.data.choices[0].message.content.trim();

        res.json({
            reply,
            tokenUsage,
        });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
