import { navigate } from '../navigation.js';

export function home() {
  const template = `
  <div class="parent">

    <div class="div2">
        <div class="create-post-section">
        <button id="createPostBtn" class="create-post-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            Créer un nouveau post
        </button>
      </div>
      <div class="test-buttons">
        <button id="testMsgBtn" class="btn">Ajouter un message</button>
        <button id="testNotifBtn" class="btn">Ajouter une notification</button>
      </div>
      </div>

      <div class="div6">
      <div class="logo">RT<span>F</span></div>
          <div style="margin-left: auto; display: flex; align-items: center; gap: 16px;">

            <div class="message-container">
                    <button class="message-btn" title="Messages" id="msgBtn">
                        <div class="message-wrapper">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7.828 13 10 15.172 12.172 13H15V5H5v8h2.828zM10 18l-3-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-3 3z"/>
                            </svg>
                            <span class="message-badge" id="msgCount">0</span>
                        </div>
                        <span class="tooltip">Messages</span>
                    </button>
                    <div class="message-panel" id="msgPanel">
                        <div class="message-header">
                        </div>
                        <div class="message-list" id="msgList">
                            <div class="user-item" data-username="Alice">
                                <div class="user-avatar">A</div>
                                <div class="user-info">
                                    <div class="user-name">Alice</div>
                                    <div class="user-status">Nouveau message</div>
                                </div>
                            </div>
                            <div class="user-item" data-username="Bob">
                                <div class="user-avatar">B</div>
                                <div class="user-info">
                                    <div class="user-name">Bob</div>
                                    <div class="user-status">2 nouveaux messages</div>
                                </div>
                            </div>
                            <div class="user-item" data-username="Charlie">
                                <div class="user-avatar">C</div>
                                <div class="user-info">
                                    <div class="user-name">Charlie</div>
                                    <div class="user-status">3 nouveaux messages</div>
                                </div>
                            </div>
                      </div>
                    </div>
                </div>
        
              <div class="notification-container">
                  <button class="notification-btn" title="Notifications" id="notifBtn">
                      <div class="notification-wrapper">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M4 3h12l2 4v10H2V7l2-4zm.236 4H8v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7h3.764l-1-2H5.236l-1 2zM16 9h-2.17A3.001 3.001 0 0 1 11 11H9a3.001 3.001 0 0 1-2.83-2H4v6h12V9z"/>
                          </svg>
                          <span class="notification-badge" id="notifCount">0</span>
                      </div>
                      <span class="tooltip">Notifications</span>
                  </button>
                  <div class="notification-panel" id="notifPanel">
                      <div class="notification-header">
                          <h3>Notifications</h3>
                      </div>
                      <div class="notification-list" id="notifList">
                          <p class="no-notifications">Pas de nouvelles notifications</p>
                      </div>
                  </div>
              </div>

              <button id="logoutBtn" class="btn logout-btn">
                  <img src="static/images/logout.png" alt="logout" class="logout-icon">
                  <span>Déconnexion</span>
              </button>

          </div>
      </div>
      
      <div class="div4">
        <div class="users-section">
            <div class="section-header">
                <h3>Utilisateurs</h3>
                <button class="toggle-users-btn" id="toggleUsersBtn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z"/>
                </svg>
                </button>
            </div>
          </div>

            <div class="users-list" id="onlineUsers">
                <div class="user-item">
                    <div class="user-avatar">D</div>
                    <div class="user-info">
                        <div class="user-name">David</div>
                        <div class="user-status">En ligne</div>
                    </div>
                    <div class="status-indicator online"></div>
                </div>
                <div class="user-item">
                    <div class="user-avatar">E</div>
                    <div class="user-info">
                        <div class="user-name">Emma</div>
                        <div class="user-status">Déconnecté(e)</div>
                    </div>
                </div>
                <div class="user-item">
                    <div class="user-avatar">F</div>
                    <div class="user-info">
                        <div class="user-name">Frank</div>
                        <div class="user-status">En ligne</div>
                    </div>
                    <div class="status-indicator online"></div>
                </div>
            </div>
        </div>
      </div>
 
    <div class="chat-container" id="chatContainer">
            <div class="chat-header">
               <div class="chat-header-left">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="chat-header-icon">
                <path d="M7.828 13 10 15.172 12.172 13H15V5H5v8h2.828zM10 18l-3-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-3 3z"/>
                </svg>
                <h3>Chat</h3>
              </div>
                <button class="chat-close-btn" id="chatCloseBtn">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="no-messages">Pas de messages</div>
            </div>
            <div class="chat-input-container">
                <textarea 
                    class="chat-input" 
                    placeholder="Envoyer un message"
                    id="chatInput"
                    rows="1"
                ></textarea>
                <button class="chat-send-btn" id="chatSendBtn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M15 8L1 14V9L15 8ZM15 8L1 2V7L15 8Z"/>
                    </svg>
                </button>
            </div>
        </div>
  </div>
`;

  setTimeout(() => {
    setupNotif();
    setupMsg();
    setupChat();
    setupLogout();
    setupUsersList();
    setupCreatePost();
  }, 0);

  return template;
}

function setupNotif() {
  let notifCount = 0;
  const notifCountElement = document.getElementById('notifCount');
  const testNotifBtn = document.getElementById('testNotifBtn');
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  const notifList = document.getElementById('notifList');

  // Gérer le clic sur le bouton de notification
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      notifPanel.classList.toggle('show');
      if (notifCount > 0) {
        notifCount = 0;
        notifCountElement.textContent = '0';
        notifCountElement.style.display = 'none';
      }
    });
  }

  // Fermer le panel si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-container')) {
      notifPanel.classList.remove('show');
    }
  });

  if (testNotifBtn) {
    testNotifBtn.addEventListener('click', () => {
      notifCount++;
      if (notifCountElement) {
        notifCountElement.textContent = notifCount;
        notifCountElement.style.display = 'flex';
      }
      // Ajouter une nouvelle notification au panel
      const newNotif = document.createElement('div');
      newNotif.className = 'notification-item';
      newNotif.innerHTML = `Nouvelle notification #${notifCount}`;
      notifList.innerHTML = '';
      notifList.appendChild(newNotif);
    });
  }
}

function setupMsg() {
  let msgCount = 0;
  const msgCountElement = document.getElementById('msgCount');
  const msgBtn = document.getElementById('msgBtn');
  const msgPanel = document.getElementById('msgPanel');
  const chatContainer = document.getElementById('chatContainer');
  const userItems = msgPanel.querySelectorAll('.user-item');
  const testMsgBtn = document.getElementById('testMsgBtn');

  if (msgBtn) {
    msgBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêche la propagation du clic
      msgPanel.classList.toggle('show');
      // On retire la remise à zéro du compteur ici
    });
  }

  // Gérer le clic sur un utilisateur
  userItems.forEach((item) => {
    item.addEventListener('click', () => {
      const userName = item.querySelector('.user-name').textContent;
      chatContainer.classList.add('show-chat');
      document.querySelector('.chat-header-left h3').textContent = userName;
      msgPanel.classList.remove('show');
      // On remet le compteur à zéro uniquement quand on ouvre un chat
      if (msgCount > 0) {
        msgCount = 0;
        msgCountElement.textContent = '0';
        msgCountElement.style.display = 'none';
      }
    });
  });

  if (testMsgBtn) {
    testMsgBtn.addEventListener('click', () => {
      msgCount++;
      if (msgCountElement) {
        msgCountElement.textContent = msgCount;
        msgCountElement.style.display = 'flex';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.message-container')) {
      msgPanel.classList.remove('show');
    }
  });
}

function setupChat() {
  const chatContainer = document.getElementById('chatContainer');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatContainer.classList.remove('show-chat');
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = chatInput.scrollHeight + 'px';
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendMessage);
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message';
      messageElement.innerHTML = `
        <span class="username">User</span>
        <span class="message-text">${message}</span>
      `;
      chatMessages.innerHTML = ''; // Enlève le message "Pas de messages"
      chatMessages.appendChild(messageElement);
      chatInput.value = '';
      chatInput.style.height = 'auto';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      navigate('/login');
    });
  }
}

function setupUsersList() {
  const toggleUsersBtn = document.getElementById('toggleUsersBtn');
  const div4 = document.querySelector('.div4');

  if (toggleUsersBtn) {
    toggleUsersBtn.addEventListener('click', () => {
      div4.classList.toggle('collapsed');
    });
  }
}

function setupCreatePost() {
  const createPostBtn = document.getElementById('createPostBtn');
  const mainContent = document.querySelector('.div2');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Créer un nouveau post</h3>
        <button class="modal-close-btn">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <select class="post-category" required>
          <option value="">Sélectionner une catégorie</option>
          <option value="general">Général</option>
          <option value="question">Question</option>
          <option value="discussion">Discussion</option>
        </select>
        <textarea 
          class="post-content" 
          placeholder="Contenu du post..."
          rows="6"
          required
        ></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn cancel-btn">Annuler</button>
        <button class="btn submit-btn">Publier</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Create posts container
  const postsContainer = document.createElement('div');
  postsContainer.className = 'posts-container';
  mainContent.appendChild(postsContainer);

  createPostBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  const closeBtn = modal.querySelector('.modal-close-btn');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const submitBtn = modal.querySelector('.submit-btn');

  [closeBtn, cancelBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  });

  submitBtn.addEventListener('click', () => {
    const category = modal.querySelector('.post-category').value;
    const content = modal.querySelector('.post-content').value;

    if (category && content.trim()) {
      const post = createPost({
        username: 'User123', // Fake username for testing
        category,
        content,
        timestamp: new Date().toLocaleString(),
      });
      postsContainer.insertBefore(post, postsContainer.firstChild);
      modal.classList.remove('show');
      modal.querySelector('.post-category').value = '';
      modal.querySelector('.post-content').value = '';
    }
  });
}

function createPost(postData) {
  const post = document.createElement('div');
  post.className = 'post';
  post.innerHTML = `
    <div class="post-header">
      <div class="post-user">
        <div class="user-avatar">${postData.username[0]}</div>
        <div class="post-user-info">
          <div class="post-username">${postData.username}</div>
          <div class="post-timestamp">${postData.timestamp}</div>
        </div>
      </div>
      <div class="post-category-tag">${postData.category}</div>
    </div>
    <div class="post-content">${postData.content}</div>
  `;
  return post;
}
