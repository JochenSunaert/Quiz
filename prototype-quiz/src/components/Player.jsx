import React, { useState, useEffect } from 'react';
import socket from '../socket'; // Adjust the path as necessary

const Player = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [room, setRoom] = useState(''); // Add state to track the room
  const [isRoomJoined, setIsRoomJoined] = useState(false); // State to track if room is joined

  useEffect(() => {
    // Listen for new questions from the server
    socket.on('question', (questionData) => {
      setCurrentQuestion(questionData);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('question'); // Remove listener to prevent memory leaks
    };
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room) {
      socket.emit('join-room', room); // Emit the event to join the room
      setIsRoomJoined(true); // Mark that the room was joined
      console.log(`Requested to join room: ${room}`);
    } else {
      alert("Please enter a room name");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Player - Waiting for Question...</h2>
      {currentQuestion && (
        <div>
          <h3>{currentQuestion.question}</h3>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          id="room-input"
          placeholder="Enter room name"
          value={room} // Controlled input for the room name
          onChange={(e) => setRoom(e.target.value)} // Set room value
        />
        <button type="submit">Join room</button>
      </form>
    </div>
  );
};

export default Player;
