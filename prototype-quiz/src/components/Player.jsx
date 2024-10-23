import React, { useState, useEffect } from 'react';
import socket from '../socket'; // Adjust the path as necessary

const Player = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [room, setRoom] = useState(''); // State to track the room
  const [isRoomJoined, setIsRoomJoined] = useState(false); // State to track if room is joined
  const [buttonText, setButtonText] = useState('Join a room first!');
  const [playerName, setPlayerName] = useState(''); // State to track player name
  const [availableRooms, setAvailableRooms] = useState([]); // State for available rooms
  const [hasAnswered, setHasAnswered] = useState(false); // Track if player has answered the current question

  useEffect(() => {
    // Listen for new questions from the server
    socket.on('question', (questionData) => {
      setCurrentQuestion(questionData);
      setHasAnswered(false); // Reset the answer state when a new question is received
    });

    // Listen for available rooms from the server
    socket.on('available-rooms', (rooms) => {
      console.log('Available rooms:', rooms); // Log available rooms
      setAvailableRooms(rooms); // Update available rooms when received
    });

    // Listen for answer submission status
    socket.on('answerAlreadySubmitted', ({ playerName }) => {
      if (playerName === playerName) {
        alert("You have already answered this question!");
        setHasAnswered(true); // Mark as answered if notification received
      }
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('question'); // Remove listener to prevent memory leaks
      socket.off('available-rooms'); // Remove listener for available rooms
      socket.off('answerAlreadySubmitted'); // Remove listener for answer submission status
    };
  }, [playerName]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room && playerName) { // Check if name is provided
      socket.emit('join-room', { room, playerName }); // Emit the event with room and player name
      setIsRoomJoined(true);
      console.log(`Requested to join room: ${room} with name: ${playerName}`);
      setButtonText('Send to quizmaster');
    } else {
      alert("Please enter a room name and your name.");
    }
  };

  const handleAnswerQuestion = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (!isRoomJoined) {
      alert('You must join a room to submit an answer!');
      return;
    }
    if (hasAnswered) {
      alert('You have already answered this question!'); // Notify the player they cannot answer again
      return;
    }

    const selectedAnswer = document.querySelector('input[name="answerQuiz"]:checked');
    if (selectedAnswer) {
      const quizAnswer = {
        playerName: playerName, // Include player name
        answer: selectedAnswer.value, // Use the selected answer value
        room,
      };
      console.log('Submitting answer:', quizAnswer); // Logs the quizAnswer object
      socket.emit("playerAnswer", quizAnswer); // Emit the answer with player name
      setHasAnswered(true); // Mark the player as having answered
    } else {
      console.log('No answer selected!');
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setPlayerName(name);

    // Emit an event to fetch available rooms when the name is updated
    if (name) {
      socket.emit('fetch-available-rooms'); // Emit to fetch available rooms
    } else {
      setAvailableRooms([]); // Clear available rooms if name is empty
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Player - Waiting for Question...</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={handleNameChange} // Update name and fetch rooms
        required // Make it required to prevent empty names
      />

      {availableRooms.length > 0 && ( // Show available rooms if there are any
        <div>
          <h3>Available Rooms:</h3>
          <ul>
            {availableRooms.map((roomName, index) => (
              <li key={index}>{roomName}</li>
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

      {currentQuestion && (
        <div>
          <h3>{currentQuestion.question}</h3>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <strong>Option {index + 1}:</strong> {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentQuestion && (
        <form onSubmit={handleAnswerQuestion}>
          <p>Answer the question of the quizmaster:</p>
          <div>
            {currentQuestion?.options.map((option, index) => (
              <div key={index}>
                <input type="radio" id={`option${index}`} name="answerQuiz" value={option} />
                <label htmlFor={`option${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <div>
            <button type="submit" disabled={!isRoomJoined || hasAnswered} id="roomOrAnswerButton">{buttonText}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Player;
