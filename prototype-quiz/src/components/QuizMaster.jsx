import React, { useState } from 'react';
import socket from '../socket'; // Adjust the path as necessary

const QuizMaster = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [room, setRoom] = useState(''); // Add room state for room-specific questions
  const [isRoomJoined, setIsRoomJoined] = useState(false); // State to track if room is joined

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRoomJoined) {
      alert("You must join a room before submitting a question!");
      return;
    }
    const questionData = {
      question,
      options,
    };
    // Emit the question to the server, including the room
    socket.emit('newQuestion', { questionData, room });
    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room) {
      socket.emit('join-room', room); // Emit the event to join the room
      setIsRoomJoined(true); // Set room joined status to true
      console.log(`Requested to join room: ${room}`);
    } else {
      alert("Please enter a room name");
    }
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

      <h3>Join a Room</h3>
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

export default QuizMaster;
