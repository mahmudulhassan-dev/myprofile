import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ChatSession, ChatMessage } from '../models/index.js';
import { handleAiResponse } from './aiService.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all for now, lock down in prod
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket Connected:', socket.id);

        // Join Room (Agent or User)
        socket.on('join', async (data) => {
            // data: { type: 'agent' | 'visitor', token? | sessionId? }
            if (data.type === 'visitor' && data.sessionId) {
                socket.join(`session:${data.sessionId}`);
                console.log(`Visitor joined session:${data.sessionId}`);
            } else if (data.type === 'agent') {
                // Verify Admin Token
                try {
                    if (data.token) {
                        const decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'secret');
                        if (decoded) { // Check role if needed
                            socket.join('agents');
                            console.log(`Agent ${decoded.id} joined agents room`);
                        }
                    }
                } catch (e) {
                    console.error('Agent Auth Failed', e.message);
                }
            }
        });

        // Human Message (Visitor)
        socket.on('client:message', async (data) => {
            // data: { sessionId, content }
            try {
                const { sessionId, content } = data;
                if (!sessionId || !content) return;

                // 1. Save Message
                const message = await ChatMessage.create({
                    session_id: sessionId,
                    sender_type: 'visitor',
                    content: content
                });

                // 2. Broadcast to Room (Self + Agents)
                io.to(`session:${sessionId}`).emit('message', message);
                io.to('agents').emit('agent:new_message', { sessionId, message });

                // 3. Trigger AI (Async)
                handleAiResponse(sessionId, content, io);

            } catch (e) { console.error('Socket Message Error:', e); }
        });

        // Agent Message
        socket.on('agent:message', async (data) => {
            // data: { sessionId, content, token }
            try {
                const { sessionId, content } = data;
                // Verify token again or trust if in 'agents' room? Better verify.
                const message = await ChatMessage.create({
                    session_id: sessionId,
                    sender_type: 'agent',
                    content: content,
                    is_read: true
                });

                // Broadcast
                io.to(`session:${sessionId}`).emit('message', message);

                // Update Session Status to Active if not already
                await ChatSession.update({ status: 'active', last_seen: new Date() }, { where: { id: sessionId } });

            } catch (e) { console.error('Agent Message Error:', e); }
        });

        socket.on('typing', (data) => {
            const { sessionId, isTyping } = data;
            socket.to(`session:${sessionId}`).emit('typing', { isTyping });
        });

        socket.on('disconnect', () => {
            // console.log('Socket Disconnected:', socket.id);
        });
    });

    console.log('Socket.IO Initialized');
    return io;
};

export const getIo = () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};
