// src/components/QuizMaster.jsx
import React, { useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io('http://localhost:3001');

const QuizMaster = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      question,
      options,
    };
    // Emit the question to the server
    socket.emit('newQuestion', questionData);
    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quizmaster - Submit a Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <label>Option {index + 1}:</label>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit">Submit Question</button>
      </form>
    </div>
  );
};

export default QuizMaster;
