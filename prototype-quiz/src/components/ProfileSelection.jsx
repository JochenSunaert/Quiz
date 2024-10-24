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
    <h2 class="extrabold">Choose</h2>
    <div class="colordiv">
        <div class="button-container orange">
            <button onClick={() => handleRoleSelection('quizmaster')} class="extrabold">Quizmaster</button>
            <p class="thin top-right">Jochen</p>
        </div>
        <div class="button-container purple">
            <button onClick={() => handleRoleSelection('player')} class="extrabold">Player</button>
            <p class="thin top-left">Sunaert</p>
        </div>
    </div>
</div>


  );
};

export default ProfileSelection;