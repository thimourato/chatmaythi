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
console.log("Firebase inicializado com sucesso");

const db = firebase.firestore();
const storage = firebase.storage();

// Verificar se o script está carregado
console.log("Script.js carregado");

// Enviar mensagem de texto
document.getElementById('send-button').addEventListener('click', function() {
    const userName = document.getElementById('user-name').value.trim();
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (userName !== '' && messageText !== '') {
        db.collection('messages').add({
            user: userName,
            text: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("Mensagem enviada com sucesso");
        }).catch(error => {
            console.error("Erro ao enviar mensagem: ", error);
        });
        messageInput.value = '';
    }
});

// Enviar foto
document.getElementById('file-input').addEventListener('change', function(event) {
    const userName = document.getElementById('user-name').value.trim();
    const file = event.target.files[0];
    if (userName !== '' && file) {
        const storageRef = storage.ref('images/' + file.name);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                db.collection('messages').add({
                    user: userName,
                    imageUrl: url,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    console.log("Foto enviada com sucesso");
                }).catch(error => {
                    console.error("Erro ao enviar foto: ", error);
                });
            });
        }).catch(error => {
            console.error("Erro ao fazer upload da foto: ", error);
        });
    }
});

// Exibir mensagens com o nome do usuário
db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    snapshot.forEach(doc => {
        const message = doc.data();
        const messageElement = document.createElement('div');
        if (message.user) {
            const userElement = document.createElement('strong');
            userElement.textContent = message.user + ': ';
            messageElement.appendChild(userElement);
        }
        if (message.text) {
            messageElement.appendChild(document.createTextNode(message.text));
        } else if (message.imageUrl) {
            const img = document.createElement('img');
            img.src = message.imageUrl;
            img.style.maxWidth = '100%';
            messageElement.appendChild(img);
        }
        messagesContainer.appendChild(messageElement);
    });
});
