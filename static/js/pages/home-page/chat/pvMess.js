export const privateMessage = (data) => {
  if (!data || !Array.isArray(data) || data.length < 3) return;

  const [msg, user, timestamp] = data;

  console.log('📩 Nouveau message privé reçu de :', user, '| Message :', msg, '| Heure :', timestamp);

  // Cherche la modal correspondant à l’utilisateur
  const modal = document.getElementById(`chat-modal-${user}`);
  if (!modal) {
    return;
  }

  // Vérifie l'utilisateur affiché dans la modal (optionnel si tu veux être sûr)
  const chatUser = modal.querySelector('.chat-user').textContent;
  if (chatUser !== user) {
    return;
  }

  // Sélectionne le body du chat
  const chatBody = modal.querySelector('#chat-body');

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

  // Crée un élément de message reçu
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', 'received');
  messageElement.innerHTML = `
        <p>${msg}</p>
        <small class="chat-time">${formattedTime}</small>
    `;

  // Ajoute le message au chat
  chatBody.appendChild(messageElement);

  // Fait défiler vers le dernier message
  chatBody.scrollTop = chatBody.scrollHeight;
};
