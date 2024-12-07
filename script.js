const socket = io();

// Function to load messages from local storage
function loadMessages() {
    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const messagesContainer = document.querySelector('.chat-messages');
    savedMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        
        // Determine if the message is sent or received based on the username
        const messageClass = msg.username === localStorage.getItem('username') ? 'sent' : 'received';

        messageElement.classList.add('message', messageClass);
        messageElement.innerHTML = `
            <p>${msg.text}</p>
            <span class="timestamp">${msg.timestamp}</span>
        `;
        messagesContainer.appendChild(messageElement);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message on button click
document.getElementById('send-button').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (message) {
        const username = localStorage.getItem('username'); // Get the logged-in username
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


        // Emit the message to the server
        socket.emit('chatMessage', { text: message, username: username, timestamp: timestamp });

        // Clear the input field after sending the message
        input.value = '';
    }
});

// Display messages received and save to localStorage
socket.on('chatMessage', (msg) => {
    const messagesContainer = document.querySelector('.chat-messages');

    // Determine if the message is sent or received based on the username
    const messageClass = msg.username === localStorage.getItem('username') ? 'sent' : 'received';

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', messageClass);
    messageElement.innerHTML = `
        <p>${msg.text}</p>
        <span class="timestamp">${msg.timestamp}</span>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save to localStorage
    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    savedMessages.push(msg);
    localStorage.setItem('messages', JSON.stringify(savedMessages));
});

// Load saved messages on page load
window.addEventListener('load', loadMessages);

// Clear all messages
document.getElementById('clear-button').addEventListener('click', () => {
    // Clear the chat interface
    const messagesContainer = document.querySelector('.chat-messages');
    messagesContainer.innerHTML = '';

    // Clear messages from local storage
    localStorage.removeItem('messages');    
});
