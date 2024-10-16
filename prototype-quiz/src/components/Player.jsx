// src/components/Player.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const Player = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // Listen for new questions from the server
    socket.on('question', (questionData) => {
      setCurrentQuestion(questionData);
    });
  }, []);

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
    </div>
  );
};

export default Player;
