import { setupChat } from '../chat/setupMsg.js';

export function initializeMessagePanel() {
  const msgBtn = document.getElementById('msgBtn');
  const msgPanel = document.getElementById('msgPanel');
  const msgList = document.getElementById('msgList');

  const msgPanelActif = document.querySelector('.message-panel.active');
  if (msgPanelActif) {
    loadConversations();
    console.log('Le panneau de message est déjà actif.');
  }

  async function loadConversations() {
    try {
      const response = await fetch('/api/conversation');
      const conversations = await response.json();

      // // Compter les messages non lus par utilisateur
      // const unreadMessageCount = conversations.reduce((acc, conv) => {
      //   if (!conv.is_read) {
      //     // Assurez-vous d'avoir cette propriété dans vos données
      //     acc[conv.username] = (acc[conv.username] || 0) + 1;
      //   }
      //   return acc;
      // }, {});

      const hasMessages = conversations.some((conv) => conv.last_message && conv.last_message.trim() !== '');
      if (!hasMessages) {
        msgList.innerHTML = '<p class="no-messages">Aucun message</p>';
        return;
      }

      // Trier les conversations par date de dernier message
      const sortedConversations = conversations.sort((a, b) => {
        const dateA = new Date(a.last_message_date);
        const dateB = new Date(b.last_message_date);
        return dateB - dateA; // Tri décroissant (plus récent en premier)
      });

      msgList.innerHTML = sortedConversations
        .map((conv) => {
          const userElement = document.querySelector(`.user-item[data-username="${conv.username}"]`);
          const isOnline = userElement?.querySelector('.user-status.online') !== null;
          if (conv.last_message === '' && conv.last_message_date === '') {
            return null;
          }

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
        .filter((item) => item !== null)
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
