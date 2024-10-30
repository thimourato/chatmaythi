// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAuv_ANVmrcjvwj_NfuuBGxKi4rgW5RLso",
    authDomain: "webapp-mensagens.firebaseapp.com",
    projectId: "webapp-mensagens",
    storageBucket: "webapp-mensagens.appspot.com",
    messagingSenderId: "1049177309919",
    appId: "1:1049177309919:web:96a04a28baee1ce89adf6a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Código existente para enviar e exibir mensagens
document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        db.collection('messages').add({
            text: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
});

// Enviar foto
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const storageRef = storage.ref('images/' + file.name);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                db.collection('messages').add({
                    imageUrl: url,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        });
    }
});

// Exibir mensagens
db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    snapshot.forEach(doc => {
        const message = doc.data();
        const messageElement = document.createElement('div');
        if (message.text) {
            messageElement.textContent = message.text;
        } else if (message.imageUrl) {
            const img = document.createElement('img');
            img.src = message.imageUrl;
            img.style.maxWidth = '100%';
            messageElement.appendChild(img);
        }
        messagesContainer.appendChild(messageElement);
    });
});
