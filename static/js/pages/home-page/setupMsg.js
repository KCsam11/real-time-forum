export function setupChat(username, userId) {
  // Check if chat already exists
  let chatContainer = document.getElementById('chatContainer');
  if (chatContainer) {
    // Update existing chat
    chatContainer.classList.add('show-chat');
    const chatHeaderTitle = chatContainer.querySelector('.chat-header-left h3');
    if (chatHeaderTitle) {
      chatHeaderTitle.textContent = username;
    }
    return;
  }

  // Create new chat
  const chat = `
      <div class="chat-container" id="chatContainer">
        <div class="chat-header">
          <div class="chat-header-left">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="chat-header-icon">
              <path d="M7.828 13 10 15.172 12.172 13H15V5H5v8h2.828zM10 18l-3-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-3 3z"/>
            </svg>
            <h3>${username}</h3>
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
      </div>`;

  document.body.insertAdjacentHTML('beforeend', chat);

  // Initialize chat elements
  chatContainer = document.getElementById('chatContainer');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Show chat
  chatContainer.classList.add('show-chat');

  // Store current chat user
  chatContainer.dataset.userId = userId;
  chatContainer.dataset.username = username;

  // Add event listeners
  chatCloseBtn?.addEventListener('click', () => {
    chatContainer.classList.add('hide-chat');
    setTimeout(() => {
      chatContainer.remove(); // Supprime complètement le chat du DOM
    }, 300);
  });

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
