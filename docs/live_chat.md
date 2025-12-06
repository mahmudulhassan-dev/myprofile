# AI Live Chat System Documentation

## Overview
This system provides a full-stack Live Chat solution with AI automation (Gemini/OpenAI), Real-time messaging (Socket.IO), and an Admin Panel for human agent takeover.

## Components

### 1. Backend (Server)
- **Tech**: Node.js, Express, Socket.IO, Sequelize (MySQL).
- **Services**:
    - `socketService.js`: Handles real-time events (`connection`, `join`, `client:message`, `agent:message`).
    - `aiService.js`: Intercepts user messages, performs RAG (optional), and generates AI responses using Google Gemini or OpenAI.
    - `chatController.js`: REST API for session management and admin history.
- **Models**: `ChatSession`, `ChatMessage`, `ChatSettings`, `KnowledgeDoc`.

### 2. Frontend Widget (Client)
- **Tech**: React, Vite (Lib Mode).
- **Location**: `src/widget/`.
- **Build**: `npm run build:widget` -> `public/widget/chat-widget.umd.js`.
- **Usage**:
  ```html
  <script src="/widget/chat-widget.umd.js"></script>
  <script>
    window.addEventListener('load', () => {
      window.initChatWidget({ siteKey: 'YOUR_SITE_KEY' });
    });
  </script>
  ```

### 3. Admin Panel
- **New Tab**: "Live Chat" in Admin Dashboard.
- **Features**:
    - Real-time list of active sessions (sorted by last activity).
    - Chat Window to view history and send messages as "Agent".
    - "Agent Typing" indicators.

## Setup & Deployment

### Environment Variables
Ensure `.env` contains:
```env
GEMINI_API_KEY="AIza..."
# OR
OPENAI_API_KEY="sk-..."

JWT_SECRET="your_secret"
```

### Installation
1. Install dependencies:
   ```bash
   npm install socket.io socket.io-client @google/generative-ai openai
   ```
2. Build the widget:
   ```bash
   npm run build:widget
   ```
3. Run the server:
   ```bash
   npm run dev:full
   ```

### Database
The system uses `sequelize.sync({ alter: true })` on startup, which automatically creates necessary tables (`ChatSessions`, `ChatMessages`, etc.).

## Verification / Testing

### Manual Test
1. Go to `http://localhost:5173`.
2. Click the Floating Chat Button (Bottom Right).
3. Type "Hello".
4. Check if AI responds (if API Key is set) or check Admin Panel.
5. Go to `http://localhost:5173/admin` -> Live Chat.
6. Verify the session appears.
7. Click the session and reply "Hello from Agent".
8. Verify the Widget receives the agent message immediately.

### Automated Test
Run `node tests/chat_test.js` (Created separately) to verify Socket.IO connectivity.
