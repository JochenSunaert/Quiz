// introAnimation.js

export const runIntroAnimation = (socket) => {
    const introElement = document.querySelector(".intro");
    if (introElement) {
        let loading = 0;
        const orangeButton = document.querySelector(".orange button");
        const purpleElement = document.querySelector(".purple");
        const selectionButton = document.querySelector(".selection button");
        const joinRoom = document.querySelector(".joinRoom");

        // Initial state: add transition classes
        orangeButton.classList.add("transition");
        purpleElement.classList.add("transition");

        const interval = setInterval(() => {
            loading++;
            introElement.style.opacity = "1";
            orangeButton.style.cursor = "auto";

            if (loading === 1) {
                document.querySelector(".orange p").style.display = "block";
                document.querySelector(".chooseText").style.top = "30%";
            } else if (loading === 3) {
                document.querySelector(".chooseText").style.top = "150%";
            } else if (loading === 4) {
                document.querySelector(".chooseText").style.display = "none";
                document.querySelector(".purple p").style.opacity = "0";
                document.querySelector(".purple p").style.display = "block";
            } else if (loading === 5) {
                document.querySelector(".purple p").style.opacity = "1";
                document.querySelector(".orange p").style.fontSize = "100px";
                document.querySelector(".purple p").style.fontSize = "100px";
                document.querySelector(".purple button").style.display = "none";
                orangeButton.style.width = "200%";
                orangeButton.style.fontSize = "130px";
            } else if (loading === 6) {
                document.querySelector(".backgroundcolor").style.backgroundColor =
                    "#fd2e00";
            } else if (loading === 8) {
                document.querySelector(".orange p").style.opacity = "0";
                document.querySelector(".purple p").style.opacity = "0";
                joinRoom.style.display = "grid";
                setTimeout(() => {
                    orangeButton.style.height = "25%";
                    selectionButton.style.height = "25%";
                    orangeButton.style.fontSize = "75px";
                }, 0);
            } else if (loading === 9) {
                joinRoom.style.opacity = "1";
                joinRoom.style.marginLeft = "0";
                joinRoom.style.marginRight = "0";
            } else if (loading === 10) {
                orangeButton.classList.add("no-transition");
                purpleElement.classList.add("no-transition");
                orangeButton.style.width = "100%";
                purpleElement.style.display = "none";
            } else if (loading === 11) {
                orangeButton.classList.remove("no-transition");
                purpleElement.classList.remove("no-transition");
            } else if (loading === 12) {
                orangeButton.style.height = "25%";
                selectionButton.style.height = "25%";
            }
        }, 300);

        // Cleanup function to clear interval
        return () => {
            clearInterval(interval);
            socket.off("playerAnswerReceived");
            socket.off("available-players");
            socket.off("scoreUpdate");
        };
    }
};

        // Debugging Output
        // console.log(`Loading: ${loading}`);
        // console.log(`Button Styles: ${orangeButton.style.cssText}`);
        //  clearInterval(interval);



        // introAnimation.js

// export const runIntroAnimation = (socket) => {
//     const introElement = document.querySelector(".intro");
//     if (introElement) {
//         const orangeButton = document.querySelector(".orange button");
//         const purpleElement = document.querySelector(".purple");
//         const selectionButton = document.querySelector(".selection button");
//         const joinRoom = document.querySelector(".joinRoom");
        
//         // Initial state: add transition classes
//         orangeButton.classList.add("transition");
//         purpleElement.classList.add("transition");

//         const interval = setInterval(() => {
//             // Set loading to 1, apply all styles, and then clear the interval
//             let loading = 1;
//             introElement.style.opacity = "1";
//             orangeButton.style.cursor = "auto";
            
//             // Consolidate all style updates here
//             document.querySelector(".orange p").style.display = "block";
//             document.querySelector(".chooseText").style.top = "30%";
//             document.querySelector(".chooseText").style.top = "150%";
//             document.querySelector(".chooseText").style.display = "none";
//             document.querySelector(".purple p").style.opacity = "1";
//             document.querySelector(".orange p").style.fontSize = "100px";
//             document.querySelector(".purple p").style.fontSize = "100px";
//             document.querySelector(".purple button").style.display = "none";
//             orangeButton.style.width = "200%";
//             orangeButton.style.fontSize = "130px";
//             document.querySelector(".backgroundcolor").style.backgroundColor = "#fd2e00";
//             document.querySelector(".orange p").style.opacity = "0";
//             document.querySelector(".purple p").style.opacity = "0";
//             joinRoom.style.display = "grid";
//             orangeButton.style.height = "25%";
//             selectionButton.style.height = "25%";
//             orangeButton.style.fontSize = "75px";
//             joinRoom.style.opacity = "1";
//             joinRoom.style.marginLeft = "0";
//             joinRoom.style.marginRight = "0";
//             orangeButton.classList.add("no-transition");
//             purpleElement.classList.add("no-transition");
//             orangeButton.style.width = "100%";
//             purpleElement.style.display = "none";
//             orangeButton.classList.remove("no-transition");
//             purpleElement.classList.remove("no-transition");
//             orangeButton.style.height = "25%";
//             selectionButton.style.height = "25%";

//             // Clear the interval after first run
//             clearInterval(interval);
//         }, 300);

//         // Cleanup function to clear interval
//         return () => {
//             clearInterval(interval);
//             socket.off("playerAnswerReceived");
//             socket.off("available-players");
//             socket.off("scoreUpdate");
//         };
//     }
// };
