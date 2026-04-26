const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint for chat with Gemini AI
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('Received message:', userMessage);
    
    // If no API key, give basic response
    if (!apiKey) {
        let reply = `💡 I'm your finance assistant!\n\n`;
        reply += `📊 Personal Finance Tips for India:\n`;
        reply += `• Save 20% of your income\n`;
        reply += `• Build emergency fund (6 months expenses)\n`;
        reply += `• Invest in PPF, Mutual Funds, or FD\n`;
        reply += `• Follow the 50-30-20 budget rule\n\n`;
        reply += `🔑 Add your Gemini API key in Render environment variables for AI-powered responses!`;
        return res.json({ reply: reply });
    }
    
    try {
        // ✅ CORRECT MODEL NAME for 2026 - Using gemini-2.5-flash-latest
        // This is the stable, working model as of 2026 [citation:8][citation:9]
        const modelName = 'gemini-2.5-flash-latest';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a friendly personal finance expert specialized in Indian finance. Answer this question helpfully, concisely, and use ₹ currency when relevant. Keep responses clear and practical: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800
                }
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            throw new Error(data.error.message);
        }
        
        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply: reply });
        
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            reply: `⚠️ Sorry, I'm having trouble connecting to AI. Please try again in a moment.\n\nError details: ${error.message}`
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
