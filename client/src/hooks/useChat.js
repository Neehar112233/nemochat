import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { autoConnect: false });

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [roomId]);

  const joinRoom = (data) => {
    socket.emit('joinRoom', data);
  };

  const sendMessage = (data) => {
    socket.emit('sendMessage', data);
  };

  const leaveRoom = (data) => {
    socket.emit('leaveRoom', data);
  };

  return { messages, setMessages, isConnected, joinRoom, sendMessage, leaveRoom };
};

export default useChat;
export { socket };
