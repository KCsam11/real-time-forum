import { setupChat } from './setupMsg.js';

export function setupUsersList(onlineUsers = []) {
  const section = document.createElement('div');
  section.className = 'users-section';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement des utilisateurs...';
  section.appendChild(loading);

  fetch('http://localhost:8080/api/users', {
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
      console.log('Tous les utilisateurs:', users);
      console.log('Utilisateurs en ligne:', onlineUsers);

      const usersList = document.createElement('div');
      usersList.className = 'users-list';
      section.appendChild(usersList);

      // Marquer chaque utilisateur avec son statut en ligne
      const usersWithStatus = users.map((user) => ({
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

      console.log('Vérification du tri (connectés en premier) :', usersWithStatus);

      usersList.innerHTML = '';

      usersWithStatus.forEach((user) => {
        console.log(`User ${user.name} online status:`, user.isOnline);

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

  return section;
}

// pour mettre à jour le statut en ligne
export function updateOnlineStatus(userName, isOnline) {
  const userItem = document.querySelector(`.user-item[data-username="${userName}"]`);
  if (userItem) {
    const userStatus = userItem.querySelector('.user-status');
    if (userStatus) {
      console.log(`Found status element for ${userName}`);
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
      return 0;
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
