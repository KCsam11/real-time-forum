import { setupChat } from './chat/setupMsg.js';

export function setupUsersList(onlineUsers = []) {
  const section = document.createElement('div');
  section.className = 'users-section';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement des utilisateurs...';
  section.appendChild(loading);

  fetch('http://217.154.67.147:3123/api/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((users) => {
      section.removeChild(loading);

      const usersList = document.createElement('div');
      usersList.className = 'users-list';
      section.appendChild(usersList);

      fetch('http://217.154.67.147:3123/api/current-user', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Vérifier le Content-Type de la réponse
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("La réponse n'est pas du JSON!");
          }
          return response.json();
        })
        .then((currentUser) => {
          const filteredUsers = users.filter((user) => user.id !== currentUser.data.ID);

          // Marquer chaque utilisateur avec son statut en ligne
          const usersWithStatus = filteredUsers.map((user) => ({
            ...user,
            isOnline: Array.isArray(onlineUsers) && onlineUsers.includes(user.name),
          }));

          // Placer les utilisateurs connectés en premier
          usersWithStatus.sort((a, b) => {
            if (a.isOnline !== b.isOnline) {
              return a.isOnline ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          });

          usersList.innerHTML = '';

          usersWithStatus.forEach((user) => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.setAttribute('data-user-id', user.id);
            userItem.setAttribute('data-username', user.name);

            const avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            avatar.textContent = user.name.charAt(0).toUpperCase();

            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';

            const userName = document.createElement('div');
            userName.className = 'user-name';
            userName.textContent = user.name;

            const userStatus = document.createElement('div');
            userStatus.className = 'user-status';

            if (user.isOnline) {
              userStatus.classList.add('online');
              userStatus.textContent = 'En ligne';
            } else {
              userStatus.textContent = 'Déconnecté(e)';
            }

            userInfo.appendChild(userName);
            userInfo.appendChild(userStatus);
            userItem.appendChild(avatar);
            userItem.appendChild(userInfo);
            usersList.appendChild(userItem);

            if (user.isOnline) {
              updateOnlineStatus(user.name, true);
            }

            const chatHandler = () => {
              const username = user.name;
              const userId = user.id;
              setupChat(username, userId);
              // usersList.classList.add(`chat-open-${userId}`);
            };
            userItem.addEventListener('click', chatHandler);
          });
        })
        .catch((error) => {
          console.error('Erreur:', error);
          section.innerHTML = '';
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error';
          errorMsg.textContent = `Erreur lors de la récupération des utilisateurs: ${error.message}`;
          section.appendChild(errorMsg);
        });
    });

  return section;
}

// pour mettre à jour le statut en ligne
export function updateOnlineStatus(userName, isOnline) {
  const userItem = document.querySelector(`.user-item[data-username="${userName}"]`);
  if (userItem) {
    const userStatus = userItem.querySelector('.user-status');
    if (userStatus) {
      userStatus.textContent = isOnline ? 'En ligne' : 'Déconnecté(e)';

      if (isOnline) {
        userStatus.classList.add('online');
      } else {
        userStatus.classList.remove('online');
      }
    }

    // Gérer l'indicateur de statut
    let statusIndicator = userItem.querySelector('.status-indicator');
    if (isOnline) {
      if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.className = 'status-indicator online';
        userItem.appendChild(statusIndicator);
      }
    } else if (statusIndicator) {
      statusIndicator.remove();
    }
  }

  // Réorganiser tous les éléments après la mise à jour
  const usersList = document.querySelector('.users-list');
  if (usersList) {
    const items = Array.from(usersList.children);
    const sortedItems = items.sort((a, b) => {
      const aOnline = a.querySelector('.user-status.online') !== null;
      const bOnline = b.querySelector('.user-status.online') !== null;
      if (aOnline !== bOnline) return aOnline ? -1 : 1;
      // Tri alphabétique par nom pour les deux utilisateurs ayant le même statut en ligne
      const aName = a.querySelector('.user-name')?.textContent.toLowerCase() || '';
      const bName = b.querySelector('.user-name')?.textContent.toLowerCase() || '';
      return aName.localeCompare(bName);
    });

    // Préserver les éléments et leurs états
    while (usersList.firstChild) {
      usersList.removeChild(usersList.firstChild);
    }
    sortedItems.forEach((item) => usersList.appendChild(item));
  }
}

// pour le bouton toggle
export function btnToggle() {
  const toggleUsersBtn = document.getElementById('toggleUsersBtn');
  const div4 = document.querySelector('.div4');

  if (toggleUsersBtn) {
    toggleUsersBtn.addEventListener('click', () => {
      div4.classList.toggle('collapsed');
    });
  }
}
