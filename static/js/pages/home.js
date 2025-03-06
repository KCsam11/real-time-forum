import { navigate } from '../navigation.js';

export function home() {
  const template = `
  <div class="parent">
      <div class="div6">
          <div style="margin-left: auto; display: flex; align-items: center; gap: 16px;">
              <button class="notification-btn" title="Notifications">
                  <div class="notification-wrapper">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 3h12l2 4v10H2V7l2-4zm.236 4H8v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7h3.764l-1-2H5.236l-1 2zM16 9h-2.17A3.001 3.001 0 0 1 11 11H9a3.001 3.001 0 0 1-2.83-2H4v6h12V9z"/>
                      </svg>
                      <span class="notification-badge" id="notifCount">0</span>
                  </div>
                  <span class="tooltip">Notifications</span>
              </button>
              <button id="logoutBtn" class="btn logout-btn">
                  <img src="static/images/logout.png" alt="logout" class="logout-icon">
                  <span>Déconnexion</span>
              </button>
          </div>
      </div>
      <div class="div4"></div>
      <div class="div2">
          <button id="testNotifBtn" class="btn">Ajouter une notification</button>
      </div>
  </div>
`;

  setTimeout(() => {
    let notifCount = 0;
    const notifCountElement = document.getElementById('notifCount');
    const testNotifBtn = document.getElementById('testNotifBtn');

    if (testNotifBtn) {
      testNotifBtn.addEventListener('click', () => {
        notifCount++;
        if (notifCountElement) {
          notifCountElement.textContent = notifCount;
          notifCountElement.style.display = notifCount > 0 ? 'flex' : 'none';
        }
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        navigate('/login');
      });
    }
  }, 0);

  return template;
}
