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
      console.log('🔔 Notifications chargées:', notifications.notifications);

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
      notifItem.innerHTML = `
              <div class="notification-content">
                  <p>${notif.sender}</p>
                  <span class="notification-time">${formatDate(notif.created_at)}</span>
              </div>
          `;
      notifItem.addEventListener('click', () => {
        markAsRead(notif.id);
      });
      notifList.appendChild(notifItem);
    });
  }

  async function markAsRead(notifId) {
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
      console.error('❌ Erreur marquage notification:', error);
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
  notifBtn.addEventListener('click', async () => {
    console.log('Clic sur le bouton de notification');
    notifPanel.classList.add('show');
    // Réinitialiser le compteur
    notifCount.textContent = '0';
    notifCount.style.display = 'none';

    // Load notifications when clicking the button
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
      updateNotificationDisplay(data.notifications);
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
