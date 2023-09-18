document.querySelector('.chat-input input').addEventListener('keydown', async function(event) {
    // Check if the key pressed is "ENTER" and the input field is not empty
    console.log('HERE!')
    if (event.keyCode === 13 && this.value.trim() !== '') {
        event.preventDefault();

        let playerMessage = this.value.trim();

        // Create player chat card
        let playerCard = document.createElement('div');
        playerCard.classList.add('player-input');
        playerCard.innerHTML = `
            <div class="p-contenido">${playerMessage}</div>
            <img src="img/player.jpg" style="width: 45px; height: 45px;border-radius: 45px;">
        `;

        // Append the player card to the chat window
        let chatWindow = document.querySelector('.chat-window');
        chatWindow.appendChild(playerCard);

        let botMessage;

        let loadingCard = document.createElement('div');
        loadingCard.classList.add('bot-response');
        loadingCard.innerHTML = `
            <img src="img/NPC.jpg" style="width: 45px; height: 45px;border-radius: 45px;">
            <div class="b-contenido">.</div>
        `;
        chatWindow.appendChild(loadingCard);

        let loadingText = loadingCard.querySelector('.b-contenido');
        let dotCount = 1;
        let loadingInterval = setInterval(() => {
            loadingText.textContent = '.'.repeat(dotCount);
            dotCount = (dotCount % 3) + 1;
        }, 500);

        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Make an asynchronous HTTP POST request to get the bot's response
        try {
            let response = await fetch('https://dummyapi.com/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerInput: playerMessage
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            let data = await response.json();
            botMessage = data.botResponse; // Assuming the API returns an object with a 'botResponse' key

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
            botMessage = "HERE GOES THE RESPONSE"; // Default message for bot response in case of an error
        }

        chatWindow.removeChild(loadingCard);
        clearInterval(loadingInterval);

        // Create bot response card
        let botCard = document.createElement('div');
        botCard.classList.add('bot-response');
        botCard.innerHTML = `
            <img src="img/NPC.jpg" style="width: 45px; height: 45px;border-radius: 45px;">
            <div class="b-contenido">${botMessage}</div>
        `;

        // Append the bot card to the chat window
        chatWindow.appendChild(botCard);

        // Clear the input field
        this.value = '';

        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Use Web Speech API to reproduce the bot's response as voice
        // Fetch all available voices
        window.speechSynthesis.onvoiceschanged = function() {
            let voices = window.speechSynthesis.getVoices();
            let maleVoices = voices.filter(voice => voice.name.toLowerCase().includes('male') || voice.lang.includes('en-US'));
        
            if (maleVoices.length > 0) {
                let speech = new SpeechSynthesisUtterance(botMessage);
                speech.voice = maleVoices[0];
                speech.pitch = 0.7;  // Adjust to make the voice low-tone
                window.speechSynthesis.speak(speech);
            }
        };
        
        // This line ensures that if the voices are already loaded before the event listener is set, the event still gets triggered
        window.speechSynthesis.getVoices();

        console.log(voices)

        // Filter for male voices (this is a bit heuristic and may need adjustments based on the available voices in the browser)
        let maleVoices = voices.filter(voice => voice.name.toLowerCase().includes('male') || voice.lang.includes('en-US'));

        // If male voices are available, pick the first one
        if (maleVoices.length > 0) {
            speech.voice = maleVoices[0];
        }

        // Set pitch to make the voice low-tone (1.0 is the default pitch, lower values make the tone lower)
        speech.pitch = 0.1;

        // Speak out the message
        window.speechSynthesis.speak(speech);

    }
});
