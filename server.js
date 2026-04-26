// Replace the fetch call section (around line 20-50) with:

const { GoogleGenerativeAI } = require('@google/generative-ai');

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        // Get the last user message
        const userMessage = messages[messages.length - 1].content;
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        });
        
        const reply = result.response.text();
        res.json({ reply: reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});