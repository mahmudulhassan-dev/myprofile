import { Project, Skill, Profile } from '../models/index.js';

export const handleAIChat = async (req, res) => {
    try {
        const { message } = req.body;
        const msg = message.toLowerCase();

        // Data Retrieval for Context
        const projects = await Project.findAll({ limit: 5 });
        const profile = await Profile.findOne();
        const skills = await Skill.findAll();

        let reply = "I'm not sure about that. Try asking about Mahmudul's projects or skills!";

        // Smart Filter Logic (Bridge to real LLM if needed)
        if (msg.includes('project') || msg.includes('work')) {
            const projectNames = projects.map(p => p.name).join(', ');
            reply = `Mahmudul has worked on several impressive projects including ${projectNames}. Would you like to know more about a specific one?`;
        } else if (msg.includes('skill') || msg.includes('stack')) {
            const skillList = skills.map(s => s.name).slice(0, 5).join(', ');
            reply = `He is an expert in ${skillList}, and many other modern technologies. Check out the Skills section for the full list!`;
        } else if (msg.includes('contact') || msg.includes('hire')) {
            reply = `You can reach out to Mahmudul via the Contact section below or email him at manager@amanaflow.com. He's currently available for new opportunities!`;
        } else if (msg.includes('who') || msg.includes('about')) {
            reply = `Mahmudul Hassan is a ${profile?.tagline || 'Professional Developer'} specializing in automation and high-end web applications.`;
        } else if (msg.includes('hi') || msg.includes('hello')) {
            reply = "Hello! I'm the Amanaflow Assistant. How can I help you explore Mahmudul's portfolio today?";
        }

        res.json({ reply });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
};
