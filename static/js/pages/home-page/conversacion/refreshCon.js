export const refreshConversations = (data) => {
  if (!data || !Array.isArray(data) || data.length < 3) return;

  const [msg, user, timestamp] = data;
  const msgList = document.getElementById('msgList');
  let conversationItem = document.querySelector(`.conversation-item[data-user-id="${user}"]`);

  // Log pour debug
  console.log('📝 Mise à jour message :', { msg, user, timestamp });

  const updateConversation = (conversationElem) => {
    // Mise à jour du dernier message
    conversationElem.querySelector('.last-message').textContent = msg;
    // Mise à jour de l'heure
    conversationElem.querySelector('.message-time').textContent = formatMessageTime(timestamp);

    // Remonter la conversation en haut
    conversationElem.remove();
    msgList.insertBefore(conversationElem, msgList.firstChild);
  };

  if (conversationItem) {
    updateConversation(conversationItem);
  } else {
    // Créer une nouvelle conversation
    const newConversation = document.createElement('div');
    newConversation.className = 'conversation-item';
    newConversation.setAttribute('data-user-id', user);

    newConversation.innerHTML = `
        <div class="conversation-avatar">
          <div class="avatar-letter">${user.charAt(0).toUpperCase()}</div>
          <span class="status-dot offline"></span>
        </div>
        <div class="conversation-info">
          <span class="username">${user}</span>
          <span class="last-message">${msg}</span>
        </div>
        <span class="message-time">${formatMessageTime(timestamp)}</span>
      `;

    // Ajouter en haut de la liste
    msgList.insertBefore(newConversation, msgList.firstChild);

    // Ajouter l'événement click
    newConversation.addEventListener('click', () => {
      const username = user;
      const userId = user;
      openChat(username, userId);
    });
  }
};

function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}
