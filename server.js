const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint for chat (mock response for now - will work without API key)
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Simple mock response if no API key
    let reply = `I'm your finance assistant! Here's what I know about "${userMessage}":\n\n`;
    reply += `For personal finance in India, consider these basics:\n`;
    reply += `• Save 20% of your income\n`;
    reply += `• Build an emergency fund (6 months expenses)\n`;
    reply += `• Invest in PPF, mutual funds, or FD\n`;
    reply += `• Use the 50-30-20 budget rule\n\n`;
    reply += `⚠️ For specific advice, please add your API key to enable AI responses.`;
    
    res.json({ reply: reply });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
