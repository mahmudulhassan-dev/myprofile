import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { ChatMessage, ChatSettings, KnowledgeDoc } from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

// Placeholder for RAG retrieval
const retrieveContext = async (query) => {
    // In future: Use vector search
    // For now: Fetch all docs and do simple keyword match (simple approach for v1)
    const docs = await KnowledgeDoc.findAll();
    if (docs.length === 0) return "";

    // Simple Keyword Match
    const keywords = query.toLowerCase().split(' ');
    const relevant = docs.filter(doc => {
        const content = doc.content.toLowerCase();
        return keywords.some(k => content.includes(k));
    }).slice(0, 3); // Top 3

    return relevant.map(d => `[Knowledge: ${d.title}]\n${d.content}`).join('\n\n');
};

export const handleAiResponse = async (sessionId, userMessage, io) => {
    try {
        // 1. Check if AI is enabled
        const aiEnabledSetting = await ChatSettings.findByPk('ai_enabled');
        if (aiEnabledSetting && aiEnabledSetting.value === 'false') return;

        // 2. Typing Indicator
        io.to(`session:${sessionId}`).emit('typing', { isTyping: true, sender: 'ai' });

        // 3. Build Context
        const context = await retrieveContext(userMessage);

        // 4. Get Chat History (Last 10)
        const history = await ChatMessage.findAll({
            where: { session_id: sessionId },
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        const historyText = history.reverse().map(m => `${m.sender_type}: ${m.content}`).join('\n');

        // 5. System Prompt
        const systemPrompt = `
        You are a helpful AI support assistant for a portfolio website.
        Use the following Context to answer questions. If unsure, ask for clarification or offer to connect with a human.
        Be concise, professional, and friendly.
        
        CONTEXT:
        ${context}
        
        CHAT HISTORY:
        ${historyText}
        
        User: ${userMessage}
        Assistant:
        `;

        let replyText = "";

        // 6. Call AI API
        // Prefer Gemini if Key exists, else OpenAI
        if (process.env.GEMINI_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(systemPrompt);
            replyText = result.response.text();
        } else if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: systemPrompt }],
                model: "gpt-3.5-turbo",
            });
            replyText = completion.choices[0].message.content;
        } else {
            replyText = "I'm sorry, my AI brain (API Key) is not configured yet. A human will be with you shortly.";
        }

        // 7. Save AI Message
        const message = await ChatMessage.create({
            session_id: sessionId,
            sender_type: 'ai',
            content: replyText,
            is_read: true
        });

        // 8. Send Response
        io.to(`session:${sessionId}`).emit('message', message);
        io.to(`session:${sessionId}`).emit('typing', { isTyping: false, sender: 'ai' });

    } catch (e) {
        console.error('AI Service Error:', e);
        io.to(`session:${sessionId}`).emit('typing', { isTyping: false, sender: 'ai' });
    }
};
