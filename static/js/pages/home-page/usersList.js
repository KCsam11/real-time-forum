// Objet: Gestion de la liste des utilisateurs
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

      users.forEach((user) => {
        const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user.name);
        console.log(`User ${user.name} online status:`, isOnline);

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
        if (isOnline) {
          userStatus.classList.add('online');
        }
        userStatus.textContent = isOnline ? 'En ligne' : 'Déconnecté(e)';

        userInfo.appendChild(userName);
        userInfo.appendChild(userStatus);
        userItem.appendChild(avatar);
        userItem.appendChild(userInfo);

        usersList.appendChild(userItem);

        if (isOnline) {
          updateOnlineStatus(user.name, true);
        }

        usersList.appendChild(userItem);
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
  console.log(`Updating status for ${userName} to ${isOnline}`);

  // Sélectionner l'élément par le nom d'utilisateur
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
    if (isOnline && !statusIndicator) {
      statusIndicator = document.createElement('div');
      statusIndicator.className = 'status-indicator online';
      userItem.appendChild(statusIndicator);
    } else if (!isOnline && statusIndicator) {
      statusIndicator.remove();
    }
  } else {
    console.log(`User item not found for ${userName}`);
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
