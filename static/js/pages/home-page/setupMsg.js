import { socket } from '../../router.js';

let activeChat = null;
let isTypingSent = false;

export async function setupChat(username, userId, parentContainer = document.querySelector('.parent')) {
  if (activeChat && activeChat.getAttribute('data-user-id') === userId.toString()) {
    return;
  }
  // Si un autre chat est déjà ouvert, le fermer
  if (activeChat) {
    activeChat.classList.add('hide-chat');
    setTimeout(() => {
      activeChat.remove();
      createNewChat();
    }, 300);
  } else {
    createNewChat();
  }
  // Add this helper function at the top level
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date
      .toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(',', '');
  }

  async function createNewChat() {
    // Check if chat already exists for this specific user
    let chatContainer = document.querySelector(`.chat-container[data-user-id="${userId}"]`);
    if (chatContainer) {
      chatContainer.classList.add('show-chat');
      activeChat = chatContainer;

      return;
    }

    // Create new chat with unique ID
    const chatId = `chat-${username}`;
    const chat = `
    <div class="chat-container" id="${chatId}" data-user-id="${username}">
      <div class="chat-header">
        <div class="chat-header-left">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="chat-header-icon">
            <path d="M7.828 13 10 15.172 12.172 13H15V5H5v8h2.828zM10 18l-3-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-3 3z"/>
          </svg>
          <h3>${username}</h3>
        </div>
        <div class="typing-status" id="typing-${userId}" style="display: none;">
          <small>En train d'écrire...</small>
        </div>
        <button class="chat-close-btn" data-chat-id="${chatId}">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <div class="chat-messages" id="messages-${userId}">
        <div class="no-messages">Pas de messages</div>
      </div>
      <div class="chat-input-container">
        <textarea 
          class="chat-input" 
          placeholder="Envoyer un message à @${username}"
          id="input-${userId}"
          rows="1"
        ></textarea>
        <button class="chat-send-btn" data-user-id="${userId}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M15 8L1 14V9L15 8ZM15 8L1 2V7L15 8Z"/>
          </svg>
        </button>
      </div>
    </div>`;

    parentContainer.insertAdjacentHTML('beforeend', chat);

    // Initialize specific chat elements
    chatContainer = document.getElementById(chatId);
    activeChat = chatContainer;
    const chatCloseBtn = chatContainer.querySelector('.chat-close-btn');
    const chatInput = document.getElementById(`input-${userId}`);
    const chatSendBtn = chatContainer.querySelector('.chat-send-btn');
    const chatMessages = document.getElementById(`messages-${userId}`);

    // // Load existing messages
    const loadMess = async () => {
      const url = `http://localhost:8080/api/messages?user=${username}`;
      console.log('📡 Requête GET envoyée à :', url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include', // Pour envoyer les cookies
        });

        console.log('🔄 Réponse HTTP reçue :', response.status);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        const messages = await response.json();
        console.log('✅ Messages reçus :', messages);

        // Nettoyer la zone d'affichage
        chatMessages.innerHTML = '';

        if (!messages || messages.length === 0) {
          chatMessages.innerHTML = `<p class="no-messages">
                    Pas de messages
                </p>`;
          return;
        }

        // Fonction throttle pour limiter la fréquence d'exécution
        function throttle(func, delay) {
          let lastCall = 0;
          return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
              lastCall = now;
              return func(...args);
            }
          };
        }
        // Stocker tous les messages pour gérer la pagination
        const allMessages = messages;
        let displayedCount = 10;

        // Affichage initial (les 10 derniers messages)
        const initialMessages = allMessages.slice(-displayedCount);
        initialMessages.forEach(({ sender, message, date }) => {
          const messageElement = document.createElement('div');
          messageElement.classList.add('chat-message', sender === username ? 'received' : 'own-message');
          messageElement.innerHTML = `
        <span class="message-text">${message}</span>
        <span class="message-time">${formatDate(date)}</span>
      `;
          chatMessages.appendChild(messageElement);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatMessages.addEventListener(
          'scroll',
          throttle(() => {
            if (chatMessages.scrollTop < 50 && displayedCount < allMessages.length) {
              console.log('📡 Chargement de 10 messages plus anciens...');
              const oldScrollHeight = chatMessages.scrollHeight;

              setTimeout(() => {
                const newCount = Math.min(displayedCount + 10, allMessages.length);
                const newMessages = allMessages.slice(allMessages.length - newCount, allMessages.length - displayedCount);

                newMessages.forEach(({ sender, message, date }) => {
                  const messageElement = document.createElement('div');
                  messageElement.classList.add('chat-message', sender === username ? 'received' : 'own-message');
                  messageElement.innerHTML = `
                  <span class="message-text">${message}</span>
                  <span class="message-time">${formatDate(date)}</span>
                `;
                  chatMessages.insertBefore(messageElement, chatMessages.firstChild);
                });

                displayedCount = newCount;
                chatMessages.scrollTop = chatMessages.scrollHeight - oldScrollHeight;
              }, 300);
            }
          }, 300)
        );
      } catch (error) {
        chatMessages.innerHTML = `
        <div class="chat-message received">
          Erreur lors du chargement des messages.
        </div>`;
        console.error('❌ Erreur lors du chargement des messages :', error);
      }
    };

    await loadMess();

    // 📌 Fonction d'envoi de message
    const sendMessage = async () => {
      const messageText = chatInput.value.trim();
      if (messageText === '') {
        console.log('⚠️ Message vide, envoi annulé.');
        return;
      }

      console.log('📩 Envoi du message :', messageText);

      // Création de la date pour le message envoyé
      const now = new Date();
      const formattedTime = formatDate(now);

      // Ajout immédiat du message côté client
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message', 'own-message');
      messageElement.innerHTML = `
      <span class="message-text">${messageText}</span>
      <span class="message-time">${formattedTime}</span>
  `;
      chatMessages.appendChild(messageElement);

      // Vider l'input et scroller en bas
      chatInput.value = '';
      // chatInput.style.height = 'auto';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Envoyer le message au serveur
      try {
        const response = await fetch('http://localhost:8080/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiver: username, message: messageText }),
        });

        console.log('📡 Réponse POST reçue :', response.status);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        //MessageStorage.saveMessage(userId, messageText, true);

        const messageTrailing = JSON.stringify({
          type: 'is_not_typing',
          content: username,
        });
        socket.send(messageTrailing);
        isTypingSent = false;

        console.log('✅ Message envoyé avec succès et conversations rafraîchies !');
      } catch (error) {
        console.error("❌ Erreur d'envoi du message :", error);
      }
    };

    if (chatInput) {
      chatInput.addEventListener('input', () => {
        sendTypingStatus(true);
        debouncedStopTyping();
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
      });

      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
          sendTypingStatus(false);
        }
      });
      chatSendBtn.addEventListener('click', (e) => {
        {
          e.preventDefault();
          sendMessage();
          sendTypingStatus(false);
        }
      });
    }

    // Show chat
    chatContainer.classList.add('show-chat');

    // Add event listeners
    chatCloseBtn?.addEventListener('click', () => {
      chatContainer.classList.add('hide-chat');
      setTimeout(() => {
        chatContainer.remove();
        activeChat = null;
      }, 300);
    });
  }

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function sendTypingStatus(isTyping) {
    if (isTyping && !isTypingSent) {
      socket.send(
        JSON.stringify({
          type: 'is_typing',
          content: username,
        })
      );
      isTypingSent = true;
    } else if (!isTyping && isTypingSent) {
      socket.send(
        JSON.stringify({
          type: 'is_not_typing',
          content: username,
        })
      );
      isTypingSent = false;
    }
  }

  const debouncedStopTyping = debounce(() => sendTypingStatus(false), 1000);

  // Add WebSocket message handler
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'is_typing' && data.content === username) {
      document.getElementById(`typing-${userId}`).style.display = 'block';
    } else if (data.type === 'is_not_typing' && data.content === username) {
      document.getElementById(`typing-${userId}`).style.display = 'none';
    }
  });
}
