import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const newSocket = io(window.location.origin || 'http://localhost:5000');

        newSocket.on('connect', () => {
            setSocket(newSocket);
        });

        newSocket.on('notification', (data) => {
            setNotifications(prev => [data, ...prev]);
        });

        return () => {
            if (newSocket) newSocket.close();
        };
    }, []);

    const clearNotifications = () => setNotifications([]);

    return (
        <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
