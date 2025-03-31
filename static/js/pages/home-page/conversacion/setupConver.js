import { setupChat } from '../chat/setupMsg.js';

export function initializeMessagePanel() {
  const msgBtn = document.getElementById('msgBtn');
  const msgPanel = document.getElementById('msgPanel');
  const msgList = document.getElementById('msgList');

  // Toggle message panel visibility
  msgBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    msgPanel.classList.toggle('active');
    if (msgPanel.classList.contains('active')) {
      loadConversations();
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!msgPanel.contains(e.target) && !msgBtn.contains(e.target)) {
      msgPanel.classList.remove('active');
    }
  });

  async function loadConversations() {
    try {
      const response = await fetch('/api/conversation');
      const conversations = await response.json();
      console.log('Conversations:', conversations);

      if (conversations.length === 0) {
        msgList.innerHTML = '<p class="no-messages">Aucune conversation</p>';
        return;
      }

      msgList.innerHTML = conversations
        .map((conv) => {
          // Rechercher l'élément utilisateur dans la liste des utilisateurs
          const userElement = document.querySelector(`.user-item[data-username="${conv.username}"]`);
          // Vérifier si l'utilisateur a la classe "online" dans son statut
          const isOnline = userElement?.querySelector('.user-status.online') !== null;
          console.log('isOnline:', isOnline);
          return `
            <div class="conversation-item" data-user-id="${conv.username}">
                <div class="conversation-avatar">
                    <div class="avatar-letter">${conv.username.charAt(0).toUpperCase()}</div>
                    <span class="status-dot ${isOnline ? 'online' : 'offline'}"></span>
                </div>
                <div class="conversation-info">
                    <span class="username">${conv.username}</span>
                    <span class="last-message">${conv.last_message}</span>
                </div>
                <span class="message-time">${formatMessageTime(conv.last_message_date)}</span>
            </div>
          `;
        })
        .join('');

      // Add click event for each conversation
      document.querySelectorAll('.conversation-item').forEach((item) => {
        item.addEventListener('click', () => {
          const username = item.dataset.userId; // Puisque nous stockons le username dans data-user-id
          const conversationItem = item.querySelector('.username').textContent;
          openChat(conversationItem, username);
        });
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
      msgList.innerHTML = '<p class="error-message">Erreur de chargement des conversations</p>';
    }
  }

  function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  function openChat(username, userId) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) {
      // Créer dynamiquement le conteneur de chat s'il n'existe pas
      const newChatContainer = document.createElement('div');
      newChatContainer.id = 'chatContainer';
      newChatContainer.className = 'chat-container';
      document.body.appendChild(newChatContainer);

      // Maintenant on peut utiliser le conteneur nouvellement créé
      newChatContainer.style.display = 'flex';
      setupChat(username, userId);
    } else {
      chatContainer.style.display = 'flex';
      setupChat(username, userId);
    }
  }
}
