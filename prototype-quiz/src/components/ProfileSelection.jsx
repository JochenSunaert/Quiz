import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSelection = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleRoleSelection = (role) => {
    if (role === 'quizmaster') {
      navigate('/quizmaster'); // Redirect to the quizmaster route
    } else {
      navigate('/player'); // Redirect to the player route
    }
  };

  return (
    <div class="selection">
        <h2>Select your role</h2>
        <div class="colordiv">
            <button onClick={() => handleRoleSelection('quizmaster')}>Quizmaster</button>
            <button onClick={() => handleRoleSelection('player')}>Player</button>
        </div>
    </div>

  );
};

export default ProfileSelection;