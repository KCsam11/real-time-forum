export function setupNotif() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  const notifCount = document.getElementById('notifCount');
  const notifList = document.getElementById('notifList');

  // Fonction pour charger les notifications
  async function loadNotifications() {
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

      updateNotificationDisplay(notifications.notifications);
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
    }
  }

  function updateNotificationDisplay(notifications) {
    // Mise à jour du compteur
    const unreadCount = notifications.filter((notif) => !notif.read).length;
    notifCount.textContent = unreadCount;
    notifCount.style.display = unreadCount > 0 ? 'flex' : 'none';

    // Mise à jour de la liste
    notifList.innerHTML = '';
    if (notifications.length === 0) {
      notifList.innerHTML = `
            <div class="empty-notifications">
                <img src="https://assets.twitch.tv/assets/all_caught_up-ad8f3f09b1a1e5e62130.svg" 
                     alt="No notifications" 
                     class="empty-notifications-image">
                <p class="no-notifications">Pas de nouvelles notifications</p>
            </div>
        `;

      // Add styles for empty state
      const style = document.createElement('style');
      style.textContent = `
            .empty-notifications {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                text-align: center;
            }
            .empty-notifications-image {
                width: 120px;
                height: auto;
                margin-bottom: 8px;
            }
            .no-notifications {
                color: #6a7480;
                font-size: 12px;
                margin: 0;
            }
        `;
      document.head.appendChild(style);
      return;
    }

    notifications.forEach((notif) => {
      const notifItem = document.createElement('div');
      notifItem.className = `notification-item ${!notif.read ? 'unread' : ''}`;

      // Choose icon based on notification type
      let iconSVG;
      switch (notif.type) {
        case 'message':
          iconSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-right-text-fill" viewBox="0 0 16 16">
        <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1"/>
      </svg>`;
          break;
        default:
      }
      notifItem.innerHTML = `
      <div class="notification-content">
          <div class="notification-icon">${iconSVG}</div>
          <div class="notification-info">
              <p class="notification-text"><strong>${notif.sender}</strong> </p>
              <span class="notification-time">${formatDate(notif.created_at)}</span>
          </div>
      </div>
    `;
      notifItem.addEventListener('click', () => {
        //markAsRead(notif.id);
      });
      notifList.appendChild(notifItem);
    });
  }

  async function markAsRead(notifId, markAll = false) {
    try {
      const requestBody = {
        notification_id: notifId,
        mark_all: markAll,
      };

      const response = await fetch('http://localhost:8080/api/notif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      //await loadNotifications();
    } catch (error) {
      console.error('❌ Error:', error);
      notifList.innerHTML = '<p class="no-notifications">Error updating notifications</p>';
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
  const messageNotitBtn = document.querySelector('.message-btn');
  if (messageNotitBtn) {
    messageNotitBtn.addEventListener('click', () => {
      notifPanel.classList.remove('show');
    });
  }

  notifBtn.addEventListener('click', async () => {
    console.log('Clic sur le bouton de notification');
    notifPanel.classList.add('show');

    // D'abord charger les notifications
    try {
      const response = await fetch('http://localhost:8080/api/notif', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log('Notifications:', data.notifications);
      updateNotificationDisplay(data.notifications);

      // Ensuite marquer comme lu
      await markAsRead(0, true);

      // Finalement, masquer le compteur
      notifCount.textContent = '0';
      notifCount.style.display = 'none';
    } catch (error) {
      console.error('Error loading notifications:', error);
      notifList.innerHTML = '<p class="no-notifications">Error loading notifications</p>';
    }
  });

  document.addEventListener('click', (e) => {
    if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('show');
      loadNotifications();
    }
  });

  // Initial load
  loadNotifications();

  // Retourner les éléments nécessaires pour la gestion externe
  return {
    loadNotifications,
    notifCount,
  };
}
