import { closeWebSocket } from '../../router.js';
import { login } from './login.js';

export function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la déconnexion');
        }

        closeWebSocket();
        login();
      } catch (error) {
        console.error('Erreur lors de la requête de déconnexion :', error);
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
      }
    });
  }
}
