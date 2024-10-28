import React, { useState, useEffect } from "react";
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
		if (!isRoomJoined || !correctAnswer) {
			alert(
				"You must join a room and select a correct answer before submitting!"
			);
			return;
		}

		// Check for duplicate options
		const uniqueOptions = new Set(options);
		if (uniqueOptions.size !== options.length) {
			setError("Options must be unique!"); // Set error message if duplicates are found
			return;
		} else {
			setError(""); // Clear error if no duplicates
		}

		const questionData = { question, options };
		socket.emit("newQuestion", { questionData, room });
		setQuestion("");
		setOptions(["", "", "", ""]);
		setCanSubmitQuestion(false); // Disable question submission until evaluated
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
											<p>My content will be here...</p>
											<p>More content...</p>
											<p>Even more content...</p>
											<p>...</p>
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
									placeholder="Plaats een optie hier"
									onChange={(e) => handleOptionChange(index, e.target.value)}
									required
								/>
								<input
									type="radio"
									name="correctAnswer"
									value={option}
									onChange={handleSelectCorrectAnswer}
								/>
								<label>Mark as Correct</label>
							</div>
						))}
					</div>
					{error && <p style={{ color: "red" }}>{error}</p>}{" "}
					{/* Display error message */}
					<button type="submit" disabled={!correctAnswer || !canSubmitQuestion}>
						Submit Question
					</button>
				</form>

				<button onClick={handleEvaluateAnswers} disabled={canSubmitQuestion}>
					Evaluate Answers
				</button>
				<h3>Connected Players:</h3>
				<ul>
					{connectedPlayers
						.filter((player) => player !== "Quizmaster")
						.map((player, index) => (
							<li key={index}>{player}</li>
						))}
				</ul>

				<h3>Player Answers</h3>
				<ul>
					{playerAnswers.length > 0 ? (
						playerAnswers.map(({ playerName, answer }, index) => (
							<li key={index}>
								{playerName}: {answer}{" "}
								{answer === correctAnswer ? "(Correct)" : "(Wrong)"}
							</li>
						))
					) : (
						<p>No answers yet...</p>
					)}
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
