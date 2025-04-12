import { setupMsgPanel } from '../conversacion/conv.js';
import { createHome } from './homeTemplate.js';
import { setupLogout } from '../login_register_logout/logout.js';
import { setupNotif } from '../notification/setupNotif.js';
import { setupUsersList, btnToggle } from '../usersList.js';
import { initializePostCreation } from '../post/createPost.js';
import { getAllPosts } from '../post/getPost.js';

export const home = () => {
  const homePage = createHome();
  document.body.innerHTML = '';
  document.body.appendChild(homePage);
  setupComponents();
};

function setupComponents() {
  setupLogout();
  btnToggle();
  setupNotif();
  setupMsgPanel();

  initializePostCreation(); // Initialize post creation functionality

  getAllPosts();

  const usersContainer = document.getElementById('onlineUsers');
  if (usersContainer) {
    const onlineUsers = []; // Liste des IDs des utilisateurs connectés
    const dynamicUsers = setupUsersList(onlineUsers);
    usersContainer.parentNode.replaceChild(dynamicUsers, usersContainer);
  }
}
