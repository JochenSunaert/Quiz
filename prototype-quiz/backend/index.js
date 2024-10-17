const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import CORS middleware

const app = express();

// Update the CORS origin to match the Vite frontend port
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],        // Allowed methods
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Adjust this to match your frontend port
    methods: ['GET', 'POST'],
    transports: ['websocket'], // Allow only WebSocket transport
  },
  allowEIO3: true, // This is optional, but may help if the client uses older engine.io versions
});


// logging in the server to see if my actions are being completed
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Joining a room
  socket.on('join-room', (room) => {
    socket.join(room); // Join the specified room
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Correct the destructuring to handle the room properly
  socket.on('newQuestion', (data) => {
    const { questionData, room } = data; // Destructure correctly
    if (room) {
      console.log(`New question received for room ${room}:`, questionData);
      // Emit the question only to users in the specific room
      socket.to(room).emit('question', questionData); // This sends to the room only
    } else {
      console.log('Room name is missing!');
    }
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

