import { setupMsgPanel } from '../conversacion/addNotifComment.js';
import { createHome } from './homeTemplate.js';
import { setupLogout } from '../login_register_logout/logout.js';
import { setupNotif } from '../notification/setupNotif.js';
import { setupUsersList, btnToggle } from '../usersList.js';
import { initializePostCreation } from '../post/createPost.js';
import { getAllPosts } from '../post/getPost.js';
import { setupLikeDislike } from '../like_dislike/setupLike_dislike.js';
//import { refreshConversations } from './conversacion/setupConver.js';

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
