document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        const messageElement = document.createElement('div');
        messageElement.textContent = messageText;
        document.getElementById('messages').appendChild(messageElement);
        messageInput.value = '';
    }
});

