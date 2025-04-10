export function setupNotif() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  const notifCount = document.getElementById('notifCount');
  const notifList = document.getElementById('notifList');

  // Ajout du bouton de fermeture (croix) dans le panneau
  const closeNotifBtn = document.createElement('button');
  closeNotifBtn.className = 'notif-close';
  closeNotifBtn.innerHTML = '&times;';
  closeNotifBtn.addEventListener('click', () => {
    notifPanel.classList.remove('show');
  });
  notifPanel.insertBefore(closeNotifBtn, notifPanel.firstChild);

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
        case 'like':
          iconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
            </svg>`;
          break;
        case 'dislike':
          iconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065c.463-.116.874-.456 1.012-.965.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
            </svg>`;
          break;
        case 'comment':
          iconSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
      </svg>`;
          break;
        default:
      }
      notifItem.innerHTML = `
      <div class="notification-content">
          <div class="notification-icon">${iconSVG}</div>
          <div class="notification-info">
              <p class="notification-text"><strong>${notif.sender}</strong></p>
              <span class="notification-time">${formatDate(notif.created_at)}</span>
          </div>
          <div class="notification-actions">
              <button class="delete-notif" data-notif-id="${notif.id}" title="Supprimer la notification">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
              </button>
          </div>
      </div>
`;

      // Ajoutez le gestionnaire d'événements pour le bouton de suppression
      const deleteBtn = notifItem.querySelector('.delete-notif');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Empêche la propagation du clic
        await markAsRead(notif.id);
        loadNotifications(); // Recharge les notifications après la suppression
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
    } catch (error) {
      console.error('Error loading notifications:', error);
      notifList.innerHTML = '<p class="no-notifications">Error loading notifications</p>';
    }
  });

  // document.addEventListener('click', (e) => {
  //   console.log('Clic sur le document');
  //   if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
  //     notifPanel.classList.remove('show');
  //     loadNotifications();
  //   }
  // });

  // Initial load
  loadNotifications();

  // Retourner les éléments nécessaires pour la gestion externe
  return {
    loadNotifications,
    notifCount,
  };
}
