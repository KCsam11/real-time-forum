import { createHome } from './homeTemplate.js';
import { setupLogout } from './logout.js';
import { setupUsersList, btnToggle } from './usersList.js';

export const home = () => {
  const homePage = createHome();
  document.body.innerHTML = '';
  document.body.appendChild(homePage);
  setupComponents();
};

function setupComponents() {
  setupLogout();

  btnToggle();

  const usersContainer = document.getElementById('onlineUsers');
  if (usersContainer) {
    // Récupérer la liste des utilisateurs en ligne depuis votre websocket ou autre source
    const onlineUsers = []; // Liste des IDs des utilisateurs connectés
    const dynamicUsers = setupUsersList(onlineUsers);
    usersContainer.parentNode.replaceChild(dynamicUsers, usersContainer);
  }
}

// function setupNotif() {
//   let notifCount = 0;
//   const notifCountElement = document.getElementById('notifCount');
//   const testNotifBtn = document.getElementById('testNotifBtn');
//   const notifBtn = document.getElementById('notifBtn');
//   const notifPanel = document.getElementById('notifPanel');
//   const notifList = document.getElementById('notifList');

//   // Gérer le clic sur le bouton de notification
//   if (notifBtn) {
//     notifBtn.addEventListener('click', () => {
//       notifPanel.classList.toggle('show');
//       if (notifCount > 0) {
//         notifCount = 0;
//         notifCountElement.textContent = '0';
//         notifCountElement.style.display = 'none';
//       }
//     });
//   }

//   // Fermer le panel si on clique ailleurs
//   document.addEventListener('click', (e) => {
//     if (!e.target.closest('.notification-container')) {
//       notifPanel.classList.remove('show');
//     }
//   });

//   if (testNotifBtn) {
//     testNotifBtn.addEventListener('click', () => {
//       notifCount++;
//       if (notifCountElement) {
//         notifCountElement.textContent = notifCount;
//         notifCountElement.style.display = 'flex';
//       }
//       // Ajouter une nouvelle notification au panel
//       const newNotif = document.createElement('div');
//       newNotif.className = 'notification-item';
//       newNotif.innerHTML = `Nouvelle notification #${notifCount}`;
//       notifList.innerHTML = '';
//       notifList.appendChild(newNotif);
//     });
//   }
// }

// function setupMsg() {
//   let msgCount = 0;
//   const msgCountElement = document.getElementById('msgCount');
//   const msgBtn = document.getElementById('msgBtn');
//   const msgPanel = document.getElementById('msgPanel');
//   const chatContainer = document.getElementById('chatContainer');
//   const userItems = msgPanel.querySelectorAll('.user-item');
//   const testMsgBtn = document.getElementById('testMsgBtn');

//   if (msgBtn) {
//     msgBtn.addEventListener('click', (e) => {
//       e.stopPropagation(); // Empêche la propagation du clic
//       msgPanel.classList.toggle('show');
//       // On retire la remise à zéro du compteur ici
//     });
//   }

//   // Gérer le clic sur un utilisateur
//   userItems.forEach((item) => {
//     item.addEventListener('click', () => {
//       const userName = item.querySelector('.user-name').textContent;
//       chatContainer.classList.add('show-chat');
//       document.querySelector('.chat-header-left h3').textContent = userName;
//       msgPanel.classList.remove('show');
//       // On remet le compteur à zéro uniquement quand on ouvre un chat
//       if (msgCount > 0) {
//         msgCount = 0;
//         msgCountElement.textContent = '0';
//         msgCountElement.style.display = 'none';
//       }
//     });
//   });

//   if (testMsgBtn) {
//     testMsgBtn.addEventListener('click', () => {
//       msgCount++;
//       if (msgCountElement) {
//         msgCountElement.textContent = msgCount;
//         msgCountElement.style.display = 'flex';
//       }
//     });
//   }

//   document.addEventListener('click', (e) => {
//     if (!e.target.closest('.message-container')) {
//       msgPanel.classList.remove('show');
//     }
//   });
// }

// function setupChat() {
//   const chatContainer = document.getElementById('chatContainer');
//   const chatCloseBtn = document.getElementById('chatCloseBtn');
//   const chatInput = document.getElementById('chatInput');
//   const chatSendBtn = document.getElementById('chatSendBtn');
//   const chatMessages = document.getElementById('chatMessages');

//   if (chatCloseBtn) {
//     chatCloseBtn.addEventListener('click', () => {
//       chatContainer.classList.remove('show-chat');
//       chatContainer.classList.add('hide-chat');
//       setTimeout(() => chatContainer.classList.remove('hide-chat'), 300); // Remove class after animation
//     });
//   }

//   if (chatInput) {
//     chatInput.addEventListener('keypress', (e) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//       }
//     });

//     // Auto-resize textarea
//     chatInput.addEventListener('input', () => {
//       chatInput.style.height = 'auto';
//       chatInput.style.height = chatInput.scrollHeight + 'px';
//     });
//   }

//   if (chatSendBtn) {
//     chatSendBtn.addEventListener('click', sendMessage);
//   }

//   function sendMessage() {
//     const message = chatInput.value.trim();
//     if (message) {
//       const messageElement = document.createElement('div');
//       messageElement.className = 'chat-message';
//       messageElement.innerHTML = `
//         <span class="username">User</span>
//         <span class="message-text">${message}</span>
//       `;
//       chatMessages.innerHTML = ''; // Enlève le message "Pas de messages"
//       chatMessages.appendChild(messageElement);
//       chatInput.value = '';
//       chatInput.style.height = 'auto';
//       chatMessages.scrollTop = chatMessages.scrollHeight;
//     }
//   }
// }

// function setupUsersList() {
//   const toggleUsersBtn = document.getElementById('toggleUsersBtn');
//   const div4 = document.querySelector('.div4');

//   if (toggleUsersBtn) {
//     toggleUsersBtn.addEventListener('click', () => {
//       div4.classList.toggle('collapsed');
//     });
//   }
// }

// function setupCreatePost() {
//   const createPostBtn = document.getElementById('createPostBtn');
//   const mainContent = document.querySelector('.div2');
//   const modal = document.createElement('div');
//   modal.className = 'modal';
//   modal.innerHTML = `
//     <div class="modal-content">
//       <div class="modal-header">
//         <h3>Créer un nouveau post</h3>
//         <button class="modal-close-btn">
//           <svg width="20" height="20" viewBox="0 0 20 20">
//             <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2"/>
//           </svg>
//         </button>
//       </div>
//       <div class="modal-body">
//         <select class="post-category" required>
//           <option value="">Sélectionner une catégorie</option>
//           <option value="general">Général</option>
//           <option value="question">Question</option>
//           <option value="discussion">Discussion</option>
//         </select>
//         <textarea
//           class="post-content"
//           placeholder="Contenu du post..."
//           rows="6"
//           required
//         ></textarea>
//       </div>
//       <div class="modal-footer">
//         <button class="btn cancel-btn">Annuler</button>
//         <button class="btn submit-btn">Publier</button>
//       </div>
//     </div>
//   `;

//   document.body.appendChild(modal);

//   // Create posts container
//   const postsContainer = document.createElement('div');
//   postsContainer.className = 'posts-container';
//   mainContent.appendChild(postsContainer);

//   createPostBtn.addEventListener('click', () => {
//     modal.classList.add('show');
//   });

//   const closeBtn = modal.querySelector('.modal-close-btn');
//   const cancelBtn = modal.querySelector('.cancel-btn');
//   const submitBtn = modal.querySelector('.submit-btn');

//   [closeBtn, cancelBtn].forEach((btn) => {
//     btn.addEventListener('click', () => {
//       modal.classList.remove('show');
//     });
//   });

//   submitBtn.addEventListener('click', () => {
//     const category = modal.querySelector('.post-category').value;
//     const content = modal.querySelector('.post-content').value;

//     if (category && content.trim()) {
//       const post = createPost({
//         username: 'User123', // Fake username for testing
//         category,
//         content,
//         timestamp: new Date().toLocaleString(),
//       });
//       postsContainer.insertBefore(post, postsContainer.firstChild);
//       modal.classList.remove('show');
//       modal.querySelector('.post-category').value = '';
//       modal.querySelector('.post-content').value = '';
//     }
//   });
// }

// function createPost(postData) {
//   const post = document.createElement('div');
//   post.className = 'post';
//   post.innerHTML = `
//     <div class="post-header">
//       <div class="post-user">
//         <div class="user-avatar">${postData.username[0]}</div>
//         <div class="post-user-info">
//           <div class="post-username">${postData.username}</div>
//           <div class="post-timestamp">${postData.timestamp}</div>
//         </div>
//       </div>
//       <div class="post-category-tag">${postData.category}</div>
//     </div>
//     <div class="post-content">${postData.content}</div>
//   `;
//   return post;
// }
