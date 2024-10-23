const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); 

const app = express();
const players = {}; // Store player names
const rooms = {}; // Store active rooms
let playerScores = {}; // Store player scores
let playerAnswers = {}; // Store player answers by room
let correctAnswers = {}; // Store correct answers by room
let activeQuestions = {};

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],        
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    transports: ['websocket'], 
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle player joining a room
  socket.on('join-room', ({ room, playerName }) => {
    socket.join(room);

    // Add player to room
    if (!rooms[room]) rooms[room] = [];
    if (!rooms[room].includes(playerName)) rooms[room].push(playerName);

    // Initialize player scores
    if (!playerScores[room]) playerScores[room] = {};
    if (!playerScores[room][playerName]) playerScores[room][playerName] = 0;

    // Emit the available players and rooms to clients
    io.to(room).emit('available-players', rooms[room]);
    socket.emit('available-rooms', Object.keys(rooms));

    // Track player by their socket ID
    players[socket.id] = playerName;
  });

  // Handle quizmaster submitting a new question
  socket.on('newQuestion', ({ questionData, room }) => {
    // Check if there's already an active question for the room
    if (activeQuestions[room]) {
      socket.emit('error', { message: 'A question is already active. Please evaluate answers first.' });
      return;
    }

    playerAnswers[room] = []; // Reset answers for the room
    correctAnswers[room] = null; // Reset correct answer for the room
    activeQuestions[room] = true; // Set the question as active

    io.to(room).emit('question', questionData); // Broadcast the question to the room
  });

  // Handle player answering a question
// Handle player answering a question
socket.on('playerAnswer', ({ playerName, answer, room }) => {
  // Check if the player has already answered
  if (!playerAnswers[room].find(a => a.playerName === playerName)) {
    playerAnswers[room].push({ playerName, answer });
    io.to(room).emit('playerAnswerReceived', { playerName, answer }); // Send player answer to quizmaster
  } else {
    socket.emit('answerAlreadySubmitted', { playerName }); // Notify the player that they've already answered
  }
});

  // Handle quizmaster selecting the correct answer
  socket.on('correctAnswerSelected', ({ room, correctAnswer }) => {
    correctAnswers[room] = correctAnswer; // Store the correct answer for the room
  
    // Loop through all answers for the room and calculate scores
    playerAnswers[room].forEach(({ playerName, answer }) => {
      if (answer === correctAnswer) {
        playerScores[room][playerName] += 1; // Increment the player's score for correct answer
      }
    });
  
    // Emit updated scores to all players in the room
    io.to(room).emit('scoreUpdate', playerScores[room]);
  
    // Reset player answers for the room after evaluation
    playerAnswers[room] = [];
    activeQuestions[room] = false; // Allow new questions after evaluation
  });
// Listen for fetching available rooms
socket.on('fetch-available-rooms', () => {
  const availableRooms = Object.keys(rooms); // Get the current rooms
  socket.emit('available-rooms', availableRooms); // Send back the available rooms to the player
});

  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const playerName = players[socket.id];
    
    // Remove player from all rooms they joined
    for (const room in rooms) {
      if (rooms[room].includes(playerName)) {
        rooms[room] = rooms[room].filter((name) => name !== playerName);
        io.to(room).emit('available-players', rooms[room]); // Notify the room of updated player list
      }
    }
    delete players[socket.id]; // Remove player from tracking
  });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
