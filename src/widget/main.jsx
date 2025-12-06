import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './ChatWidget';

// Expose render function to global scope
window.initChatWidget = (config) => {
    const rootId = 'chat-widget-root';
    let rootElement = document.getElementById(rootId);

    if (!rootElement) {
        rootElement = document.createElement('div');
        rootElement.id = rootId;
        document.body.appendChild(rootElement);
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ChatWidget {...config} />
        </React.StrictMode>
    );
};
