import { initializeMessagePanel } from './setupConver.js';

export function setupMsgNotif() {
  const msgBtn = document.getElementById('msgBtn');
  const msgNotifPanel = document.getElementById('msgPanel');
  const msgNotifCount = document.getElementById('msgNotifCount');
  const msgList = document.getElementById('msgList');

  async function loadMessageNotifications() {
    try {
      const response = await fetch('http://localhost:8080/api/notif', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const notifications = await response.json();
      const messageNotifications = notifications.notifications.filter((notif) => notif.type === 'message');

      console.log('💬 Notifications messages chargées:', messageNotifications);

      updateMessageNotificationDisplay(messageNotifications);
    } catch (error) {
      console.error('❌ Erreur chargement notifications messages:', error);
    }
  }

  function updateMessageNotificationDisplay(notifications) {
    if (msgNotifCount) {
      const unreadCount = notifications.filter((notif) => !notif.read && !notif.is_sender).length;
      msgNotifCount.textContent = unreadCount;
      msgNotifCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // Mise à jour de la liste
    msgList.innerHTML = '';
    if (notifications.length === 0) {
      msgList.innerHTML = `
            <div class="empty-notifications">
                <img src="https://assets.twitch.tv/assets/all_caught_up-ad8f3f09b1a1e5e62130.svg"
                     alt="No messages"
                     class="empty-notifications-image">
                <p class="no-notifications">Pas de nouveaux messages</p>
            </div>
        `;
      return;
    }

    // Regrouper les notifications par expéditeur
    const notificationsByUser = notifications.reduce((acc, notif) => {
      if (!notif.read && !notif.is_sender) {
        if (!acc[notif.sender] || new Date(notif.created_at) > new Date(acc[notif.sender].created_at)) {
          acc[notif.sender] = notif;
        }
      }
      return acc;
    }, {});

    // Convertir l'objet en tableau et trier par date
    const sortedNotifications = Object.values(notificationsByUser).sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    sortedNotifications.forEach((notif) => {
      const msgNotifItem = document.createElement('div');
      msgNotifItem.className = `message-notification-item unread`;

      msgNotifItem.innerHTML = `
            <div class="message-notification-content">
                <div class="message-user-info">
                    <div class="avatar-letter">${notif.sender.charAt(0).toUpperCase()}</div>
                    <p>${notif.sender}</p>
                </div>
                <span class="message-preview">${notif.message}</span>
                <span class="message-time">${formatDate(notif.created_at)}</span>
            </div>
        `;

      msgNotifItem.addEventListener('click', () => {
        markMessageAsRead(notif.id);
        console.log('Notification marquée comme lue:', notif.sender);
        // openConversation(notif.sender);
      });

      msgList.appendChild(msgNotifItem);
    });
  }

  async function markMessageAsRead(notifId) {
    try {
      const response = await fetch('http://localhost:8080/api/notif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notifId }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('❌ Erreur marquage notification message:', error);
    }
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Event Listeners
  msgBtn.addEventListener('click', async () => {
    console.log('msgBtn clicked');
    const notifPanel = document.getElementById('notifPanel');
    if (notifPanel && notifPanel.classList.contains('show')) {
      notifPanel.classList.remove('show');
    }

    console.log('Clic sur le bouton de messages');
    msgNotifPanel.classList.add('active');
    // S'assurer que le panneau de conversation est visible quand le panneau est actif
    const conversationPanel = document.querySelector('.conversation-panel');
    if (msgNotifPanel.classList.contains('active')) {
      if (conversationPanel) {
        conversationPanel.style.display = 'flex';
      }

      // Réinitialiser le compteur
      msgNotifCount.textContent = '0';
      msgNotifCount.style.display = 'none';

      // Charger les notifications et initialiser le panneau
      await Promise.all([loadMessageNotifications(), initializeMessagePanel()]);
    } else {
      // Cacher le panneau de conversation quand on ferme
      if (conversationPanel) {
        conversationPanel.style.display = 'none';
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!msgBtn.contains(e.target) && !msgNotifPanel.contains(e.target)) {
      msgNotifPanel.classList.remove('active');
    }
  });

  // Initial load
  loadMessageNotifications();
  initializeMessagePanel();

  // Retourner les éléments nécessaires pour la gestion externe
  return {
    loadMessageNotifications,
    msgNotifCount,
  };
}

// Modifiez également la fonction openConversation :
async function openConversation(username) {
  try {
    // Fermer le panneau de notifications s'il est ouvert
    const notifPanel = document.getElementById('notifPanel');
    if (notifPanel && notifPanel.classList.contains('show')) {
      notifPanel.classList.remove('show');
    }

    // Activer le panneau de messages
    const msgPanel = document.getElementById('msgPanel');
    msgPanel.classList.add('active');

    // S'assurer que le panneau de conversation est visible
    const conversationPanel = document.querySelector('.conversation-panel');
    if (conversationPanel) {
      conversationPanel.style.display = 'flex';
    }

    // Déclencher l'événement pour ouvrir la conversation
    const event = new CustomEvent('openConversation', {
      detail: { username: username },
    });
    document.dispatchEvent(event);

    // Forcer le panneau de messages à rester ouvert
    const msgNotifPanel = document.getElementById('msgPanel');
    if (msgNotifPanel) {
      msgNotifPanel.classList.add('active');
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ouverture de la conversation:", error);
  }
}
