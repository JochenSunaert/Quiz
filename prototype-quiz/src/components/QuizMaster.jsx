import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket"; // Adjust the path as necessary
import { runIntroAnimation } from "../utils/introAnimation";
import { runButtonClickAnimation } from "../utils/splitTextAnimation";

const QuizMaster = () => {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [room, setRoom] = useState("");
	const [isRoomJoined, setIsRoomJoined] = useState(false);
	const [playerAnswers, setPlayerAnswers] = useState([]);
	const [connectedPlayers, setConnectedPlayers] = useState([]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [scores, setScores] = useState({}); // Track player scores
	const [canSubmitQuestion, setCanSubmitQuestion] = useState(true); // Track if the quizmaster can submit a question
	const [error, setError] = useState(""); // State for error messages
	const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
	const [showPlayerAnswers, setShowPlayerAnswers] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		socket.on("playerAnswerReceived", (quizAnswer) => {
			const { playerName, answer } = quizAnswer;
			setPlayerAnswers((prevAnswers) => [
				...prevAnswers,
				{ playerName, answer },
			]);
		});

		socket.on("available-players", (players) => {
			setConnectedPlayers(players);
		});

		socket.on("scoreUpdate", (updatedScores) => {
			setScores(updatedScores);
		});

		/* ################### INTRO ANIMATION ################### */
		const cleanup = runIntroAnimation(socket);
		return () => {
			cleanup();
		};
	}, []);

	/* ################### SPLIT TEXT ANIMATION ################### */
	/* ################### + ROOM CODE JOIN ################### */

	const handleJoinRoom = (e) => {
		e.preventDefault();
		if (room) {
			socket.emit("join-room", { room, playerName: "Quizmaster" });
			setIsRoomJoined(true);
			runButtonClickAnimation();
		} else {
			alert("Please enter a room name");
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(""); // Reset any existing error messages
	
		if (!isRoomJoined) {
			alert("You must join a room before submitting!");
			return;
		}
	
		// Check for empty option fields
		if (options.some(option => option.trim() === "")) {
			setEmptyOptionError("All option fields must be filled in!");
			return;
		}
	
		// Check for duplicate options
		const uniqueOptions = new Set(options);
		if (uniqueOptions.size !== options.length) {
			setError("Options must be unique!");
			return;
		}
	
		// Check if a correct answer is selected
		if (!correctAnswer) {
			setSelectCorrectAnswerError("You must select a correct answer!");
			return;
		}
	
		const questionData = { question, options };
		socket.emit("newQuestion", { questionData, room });
		setQuestion("");
		setOptions(["", "", "", ""]);
		setCanSubmitQuestion(false);
		setIsQuestionSubmitted(true); // Set this to true on successful submission
	
		// Show player answers section
		setShowPlayerAnswers(true);
	};
	
	
	const handleSelectCorrectAnswer = (e) => {
		setCorrectAnswer(e.target.value);
	};

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const handleEvaluateAnswers = () => {
		// Emit the correct answer selection
		socket.emit("correctAnswerSelected", { room, correctAnswer });
		setPlayerAnswers([]); // Clear player answers after evaluation
		setCanSubmitQuestion(true); // Allow the quizmaster to submit a new question
		
		// Reset states to show main question form
		setShowPlayerAnswers(false);
		setIsQuestionSubmitted(false); // Ensure the main question form can show again
	};

	const handleChooseRoleClick = () => {
		setShowProfileSelection(true); // Show the profile selection again
		// Reset any other necessary state if needed
	};
	
	
	
	return (
		<div class="backgroundcolor">
			<div class="selection intro quizmasterintro">
				<h2 class="extrabold chooseText">Choose</h2>
				<div class="colordiv">
					{/*Alles dat moet gebeuren na oranje knop te klikken*/}
					<div class="button-container orange">
						{/*Animatie 1*/}
							<button class="extrabold">Quizmaster</button>
							<p class="thin top-right">Jochen</p>
							<div class="joinRoom">
								<h3 class="thin createroomtext">Create a room</h3>
								<form onSubmit={handleJoinRoom} class="createroomgrid">
									<input type="text" id="room-input" placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} />
									<button type="submit" class="submitroom">
										Join room <i class="fa-solid fa-chevron-right"></i>
									</button>
								</form>
							</div>
						{/*Animatie 2*/}
							<div class="divCentreerder">
    							<div class="image-container">
        							<img src="../assets/QuizmasterTop.png" class="topSplit" alt="Image 1" />
       								<div class="line line-bottom"></div> 
        							<div class="fixed-height-content">
										<div class="orange-content">
											{/*MAIN CONTENT NA SPLIT*/}
											<div class="topnav">
											<p onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Choose role</p>
												<p>end game</p>
											</div>
											{!isQuestionSubmitted && !showPlayerAnswers && (
											<main>
												<h1 class="extrabold">Your Question</h1>
												<form class="sendQuestions" onSubmit={handleSubmit}>
													<div class="vraag">
														<input type="text" placeholder="your question" value={question} onChange={(e) => setQuestion(e.target.value)} required/>
													</div>
													<div>
														<h1 class="extrabold">Player options</h1>
														<div class="playeroptions">
    {options.map((option, index) => (
        <div class="options" key={index}>
            <input 
                type="text" 
                value={option} 
                placeholder="Place an option here" 
                onChange={(e) => handleOptionChange(index, e.target.value)} 
                required 
            />
            <div class="radio-container">
                <input 
                    type="radio" 
                    id={`radio-${index}`} 
                    name="correctAnswer" 
                    value={option} 
                    onChange={handleSelectCorrectAnswer} 
                />
                <label htmlFor={`radio-${index}`} class="checkmark"></label>
            </div>
        </div>
    ))}
</div>





													</div>
													{error && <p style={{ color: "red" }}>{error}</p>}{" "}
													{/* Display error message */}
													<button type="submit" class="submitroom extrabold" disabled={!correctAnswer || !canSubmitQuestion}> Submit Question <i class="fa-solid fa-chevron-right"></i></button>
													
												</form>
											</main>
											)}
											
{showPlayerAnswers && (
    <div class="playerAnswers">
        <h1 class="extrabold">Player Answers</h1>
        <ul class="gridplayerfilled">
            {playerAnswers.length > 0 ? (
                playerAnswers.map(({ playerName, answer }, index) => (
                    <li class="playerfilled" key={index}>
						<div>
							<h3 class="extrabold">{playerName}:</h3>
							{answer}{" "}
							{answer === correctAnswer ? "(Correct)" : "(Wrong)"}
						</div>

                    </li>
                ))
            ) : (
                <p>No answers yet...</p>
            )}
        </ul>
        <button onClick={handleEvaluateAnswers} class="submitroom extrabold evaluating" disabled={canSubmitQuestion}>
			evaluate answers <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>
)}
										</div>
        							</div>
        							<div class="line line-top"></div> 
        							<img src="../assets/QuizmasterBottom.png" class="bottomSplit" alt="Image 2" />
    							</div>
							</div>
						</div>
					{/*Alles dat moet gebeuren na paarse knop te klikken*/}
					<div class="button-container purple">
						<button class="extrabold playerButton">Player</button>
						<p class="thin top-left">Sunaert</p>
					</div>
				</div>
			</div>























			<div class="quizmaster">
				<h2>Quizmaster - Submit a Question</h2>
				

				
				<h3>Connected Players:</h3>
				<ul>
					{connectedPlayers
						.filter((player) => player !== "Quizmaster")
						.map((player, index) => (
							<li key={index}>{player}</li>
						))}
				</ul>

				<h3>Scores</h3>
				<ul>
					{Object.keys(scores)
						.filter((playerName) => playerName !== "Quizmaster") // Exclude quizmaster from score display
						.map((playerName) => (
							<li key={playerName}>
								{playerName}: {scores[playerName]}
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default QuizMaster;
