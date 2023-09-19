document.querySelector('.chat-input input').addEventListener('keydown', async function(event) {

    // Check if the key pressed is "ENTER" and the input field is not empty
    console.log('HERE!')
    if (event.keyCode === 13 && this.value.trim() !== '') {

        let playerMessage = this.value.trim();

        // Clear the input field
        this.value = '';
        event.preventDefault();

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

        // Load "writing" animation
        let loadingCard = document.createElement('div');
        let loadingInterval = writingAnimation(chatWindow, loadingCard);

        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Make an asynchronous HTTP POST request to get the bot's response
        try {
            let response = await fetch('https://localhost:5050', {
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
        } finally {
            chatWindow.removeChild(loadingCard);
            clearInterval(loadingInterval);
        }

        // Create bot response card
        let botCard = document.createElement('div');
        botCard.classList.add('bot-response');
        botCard.innerHTML = `
            <img src="img/NPC.jpg" style="width: 45px; height: 45px;border-radius: 45px;">
            <div class="b-contenido">${botMessage}</div>
        `;

        // Append the bot card to the chat window
        chatWindow.appendChild(botCard);
    }
});


// Get all buttons with the class "plan-option"
const buttons = document.querySelectorAll('.plan-option');

// Add an event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove the "selected" class from all buttons
        buttons.forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add the "selected" class to the clicked button
        this.classList.add('selected');
    });
});

// Logic within the loading function
function writingAnimation(chatWindow, loadingCard) {
    
    loadingCard.classList.add('bot-response');
    loadingCard.innerHTML = `
        <img src="img/NPC.jpg" style="width: 45px; height: 45px;border-radius: 45px;">
        <div class="b-contenido" style="min-width:2rem; font-weight:700">.</div>
    `;
    chatWindow.appendChild(loadingCard);

    let loadingText = loadingCard.querySelector('.b-contenido');
    let dotCount = 1;
    let loadingInterval = setInterval(() => {
        loadingText.textContent = '.'.repeat(dotCount);
        dotCount = (dotCount % 3) + 1;
    }, 300);

    return loadingInterval
}

// Typing effect for the first message
function typeMessage(element, message, index = 0) {
    if (index < message.length) {
        element.textContent += message[index];
        setTimeout(() => typeMessage(element, message, index + 1), Math.random()*30 + 20); // adjust the 50ms for faster/slower typing
    }
}

// Display the fixed message at the top with a typing effect
const fixedMessageElement = document.getElementById('fixedMessage');
const fixedMessageText = "Greetings, traveler! I am Merlin, the enigmatic enchanter, and this humble establishment is Merlin's Mystical Emporium, where magic intertwines with wonder. What brings you to this mystical realm today? Are you in search of enchanted artifacts, potent potions, or perhaps a spell to unlock hidden potential?\n How may I assist you on this extraordinary day?"; // Add the full message here
typeMessage(fixedMessageElement, fixedMessageText);