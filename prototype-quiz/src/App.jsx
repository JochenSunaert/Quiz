// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileSelection from './components/ProfileSelection.jsx';
import QuizMaster from './components/QuizMaster';
import Player from './components/Player'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileSelection />} />
        <Route path="/quizmaster" element={<QuizMaster />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
};

export default App;
