import { ChatSession, ChatMessage, KnowledgeDoc } from '../models/index.js';

export const startSession = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Check for existing open session for this email/ip?
        // For simplicity, create new if not provided ID
        const session = await ChatSession.create({
            visitor_name: name || 'Guest',
            visitor_email: email,
            status: 'open'
        });
        res.json(session);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getHistory = async (req, res) => {
    try {
        const { sessionId } = req.query;
        if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

        const messages = await ChatMessage.findAll({
            where: { session_id: sessionId },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// Admin: Get All Sessions
export const getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.findAll({
            order: [['updatedAt', 'DESC']],
            limit: 50
        });
        res.json(sessions);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// Admin: Get Session Details
export const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await ChatSession.findByPk(id, {
            include: [{ model: ChatMessage, as: 'messages' }] // Ensure correct alias or none
        });
        res.json(session);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// Knowledge Base CRUD
export const createDoc = async (req, res) => {
    try {
        const doc = await KnowledgeDoc.create(req.body);
        res.json(doc);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDocs = async (req, res) => {
    try {
        const docs = await KnowledgeDoc.findAll();
        res.json(docs);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
