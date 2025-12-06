import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const runTest = async () => {
    console.log('--- Chat System Connectivity Test ---');

    // 1. Visitor Connection
    const visitorSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        query: { sessionId: 'test-session-1' }
    });

    // 2. Agent Connection
    const agentSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        query: { type: 'agent', token: 'mock-token' } // In prod, use real JWT
    });

    // Visitor Events
    visitorSocket.on('connect', () => {
        console.log('✅ Visitor Connected:', visitorSocket.id);

        // Start Chat
        visitorSocket.emit('join', { type: 'visitor', sessionId: 'test-session-1' });

        // Send Message
        setTimeout(() => {
            console.log('📤 Visitor sending message...');
            visitorSocket.emit('client:message', { sessionId: 'test-session-1', content: 'Hello from Test Script' });
        }, 500);
    });

    visitorSocket.on('message', (msg) => {
        console.log(`📩 Visitor received (${msg.sender_type}):`, msg.content);
        if (msg.sender_type === 'agent' && msg.content === 'Hello Visitor') {
            console.log('✅ Full Cycle Test Passed!');
            process.exit(0);
        }
        if (msg.sender_type === 'ai') {
            console.log('🤖 AI Auto-Replied:', msg.content);
        }
    });

    // Agent Events
    agentSocket.on('connect', () => {
        console.log('✅ Agent Connected:', agentSocket.id);
        agentSocket.emit('join', { type: 'agent' });
    });

    agentSocket.on('agent:new_message', (data) => {
        console.log('🔔 Agent notified of new message from:', data.sessionId);

        // Reply
        setTimeout(() => {
            console.log('📤 Agent replying...');
            agentSocket.emit('agent:message', { sessionId: data.sessionId, content: 'Hello Visitor' });
        }, 500);
    });

    // Timeout
    setTimeout(() => {
        console.log('❌ Test Timed Out');
        process.exit(1);
    }, 5000);
};

runTest();
