// backend/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import CORS middleware

const app = express();

// Update the CORS origin to match the Vite frontend port
app.use(cors({
  origin: 'http://localhost:5173', // Update to match frontend port
  methods: ['GET', 'POST'],        // Allowed methods
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Update to match frontend port
    methods: ['GET', 'POST'],        // Allow specific methods
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('newQuestion', (questionData) => {
    console.log('New question received:', questionData);
    socket.broadcast.emit('question', questionData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

