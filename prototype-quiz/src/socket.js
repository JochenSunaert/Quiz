// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'], // Force WebSocket connection only
});

export default socket;
