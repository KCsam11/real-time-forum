import { setupNotif } from './setupNotif.js';

export const notif = async (senderId, notificationId) => {
  let notificationBadge = document.getElementById('notifCount');
  const notificationBtn = document.getElementById('notifBtn');

  // Check if notification elements exist
  if (!notificationBtn || !notificationBadge) {
    console.warn('Notification elements not found');
    return;
  }

  const chatContainer = document.querySelector('.chat-container');
  const activeChatUserId = chatContainer?.getAttribute('data-user-id');
  console.log('Chat container:', chatContainer);
  console.log('Active chat sender ID:', activeChatUserId);
  console.log('Sender ID:', senderId);

  // Si le chat est actif avec ce user, marquer la notification comme lue
  if (chatContainer && activeChatUserId === senderId) {
    try {
      // Appel à l'API pour marquer comme lu
      await fetch('http://localhost:8080/api/notif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: notificationId,
        }),
        credentials: 'include',
      });
      console.log('Notification marquée comme lue automatiquement');
      return false; // Ne pas incrémenter le compteur
    } catch (error) {
      console.error('Erreur lors du marquage automatique:', error);
    }
  }

  // Increment notification count
  let currentCount = parseInt(notificationBadge.textContent);
  notificationBadge.textContent = currentCount + 1;

  // Show the badge if it was hidden
  notificationBadge.style.display = 'block';

  // Add click handler to reset notifications
  notificationBtn.addEventListener('click', () => {
    notificationBadge.textContent = '0';
    notificationBadge.style.display = 'none';

    // Clear the "no notifications" message if it exists
    const notifList = document.getElementById('notifList');
    if (notifList) {
      const noNotif = notifList.querySelector('.no-notifications');
      if (noNotif) {
        noNotif.style.display = 'none';
      }
    }
  });
  setupNotif();
};
