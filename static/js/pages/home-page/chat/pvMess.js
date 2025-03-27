export const privateMessage = (data) => {
  if (!data || !Array.isArray(data) || data.length < 3) return;

  const [msg, user, timestamp] = data;

  console.log('📩 Nouveau message privé reçu de :', user, '| Message :', msg, '| Heure :', timestamp);

  // Cherche le conteneur de chat correspondant à l'utilisateur
  const chatContainer = document.querySelector(`.chat-container[data-user-id="${user}"]`);

  if (!chatContainer) {
    // Try alternative selectors
    const activeChat = document.querySelector('.chat-container.show-chat');
    if (!activeChat) {
      console.log('❌ Aucun chat actif trouvé');
      return;
    }
    return;
  }

  // Get messages container
  const chatMessages = chatContainer.querySelector('.chat-messages') || document.getElementById(`messages-${user}`);

  if (!chatMessages) {
    console.log('❌ Zone de messages non trouvée');
    return;
  }

  // Formatage de la date
  const date = new Date(timestamp);
  const formattedTime = date
    .toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(',', '');

  // Crée un élément de message reçu avec animation
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', 'received', 'new-message');
  messageElement.innerHTML = `
    <span class="message-text">${msg}</span>
    <span class="message-time">${formattedTime}</span>
  `;

  // Ajoute le message au chat
  chatMessages.appendChild(messageElement);

  // Fait défiler vers le dernier message
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // if (!document.hasFocus() || document.hidden) {
  //   const audio = new Audio('/static/notif.mp3');
  //   audio.volume = 0.5;
  //   audio.play().catch(() => console.log('🔇 Lecture audio bloquée'));
  // }
};
