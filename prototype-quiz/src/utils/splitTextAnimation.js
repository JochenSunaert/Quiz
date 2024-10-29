export const runButtonClickAnimation = () => {
    const joinRoomButton = document.querySelector(".submitroom");
    const JoinRoomUI = document.querySelector(".joinRoom");
    const orangeButton = document.querySelector(".orange button");
    if (!joinRoomButton) return; // Ensure button exists
    const splitRoom = document.querySelector(".divCentreerder");
    const topLine = document.querySelector(".line-top");
    const bottomLine = document.querySelector(".line-bottom");
    const heightContent = document.querySelector(".fixed-height-content");
    const orangecontent = document.querySelector(".orange-content");
    const bottomSplit = document.querySelector(".bottomSplit");
    const topSplit = document.querySelector(".topSplit");
    // Initialize loading phase
    let loading = 0;
    // Define a timed interval to manage animation stages
    const interval = setInterval(() => {
        loading++;

        // Set up conditions for each loading phase
        if (loading === 1) {
            JoinRoomUI.style.opacity = 0;
            orangeButton.style.opacity = 0;
            splitRoom.style.display = "grid";
            splitRoom.style.opacity = "0";
        } else if (loading === 2) {
            JoinRoomUI.style.display = "none";
            orangeButton.style.display = "none";
            splitRoom.style.opacity = "1";
        } else if (loading === 4) {
            topLine.style.width = "calc(100% + 250px)"; // Adjust as needed
            bottomLine.style.width = "calc(100% + 250px)"; // Adjust as needed
        } else if (loading === 5) {
            heightContent.style.opacity = "0";
            heightContent.style.display = "block";
            heightContent.style.height= "0px";
        }else if (loading === 6) {
            heightContent.style.height= "600px";
            orangecontent.style.display = 'block';
            bottomLine.style.marginTop = "0px";
            topLine.style.marginBottom = "0px";
            topLine.style.opacity = " 0.4";
            bottomLine.style.opacity = " 0.4";
            bottomSplit.style.opacity = " 0.4";
            topSplit.style.opacity = " 0.4";
            

        }else if (loading === 7) {
            // Clear the interval after the last step
            heightContent.style.opacity = "1";
        }else if( loading ===8){
            clearInterval(interval);
        }
    }, 500); // Adjust timing between phases as needed
};








// export const runButtonClickAnimation = () => {
//     const joinRoomButton = document.querySelector(".submitroom");
//     const JoinRoomUI = document.querySelector(".joinRoom");
//     const orangeButton = document.querySelector(".orange button");
//     if (!joinRoomButton) return; // Ensure button exists

//     const splitRoom = document.querySelector(".divCentreerder");
//     const topLine = document.querySelector(".line-top");
//     const bottomLine = document.querySelector(".line-bottom");
//     const heightContent = document.querySelector(".fixed-height-content");
//     const orangeContent = document.querySelector(".orange-content");
//     const bottomSplit = document.querySelector(".bottomSplit");
//     const topSplit = document.querySelector(".topSplit");

//     // Initialize loading phase
//     let loading = 0;

//     // Define a timed interval to manage animation stages
//     const interval = setInterval(() => {
//         loading++;

//         if (loading === 1) {
//             // Adjust opacity and hide elements
//             JoinRoomUI.style.opacity = 0;
//             orangeButton.style.opacity = 0;

//             // Display split room container
//             splitRoom.style.display = "grid";
//             splitRoom.style.opacity = "1";

//             // Set line animations to expand width
//             topLine.style.width = "calc(100% + 250px)";
//             bottomLine.style.width = "calc(100% + 250px)";

//             // Display and animate the content container
//             heightContent.style.display = "block";
//             heightContent.style.height = "600px"; // Final expanded height

//             // Show orange content and adjust line positions
//             orangeContent.style.display = 'block';
//             bottomLine.style.marginTop = "0px";
//             topLine.style.marginBottom = "0px";
//             topLine.style.opacity = "0.4";
//             bottomLine.style.opacity = "0.4";

//             // Adjust image opacity for split effect
//             bottomSplit.style.opacity = "0.4";
//             topSplit.style.opacity = "0.4";

//             // Hide JoinRoomUI and orange button entirely after animation starts
//             setTimeout(() => {
//                 JoinRoomUI.style.display = "none";
//                 orangeButton.style.display = "none";
//             }, 500); // Adjust timing if needed

//             // Clear the interval after this step
//             clearInterval(interval);
//         }
//     }, 500); // Adjust timing if needed
// };
