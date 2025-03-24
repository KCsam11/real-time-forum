import { home } from './pages/home-page/home.js';
import { setupUsersList } from './pages/home-page/usersList.js';
import { updateOnlineStatus } from './pages/home-page/usersList.js';
import { login } from './pages/login.js';
// import { privateMessage } from './pages/home-page/chat/pvMess.js';
// import { majMessage } from './pages/home-page/chat/pvMess.js';

export let socket = null;

export const router = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    closeWebSocket();
  }

  // 📡 Création d'une nouvelle connexion WebSocket
  socket = new WebSocket('ws://localhost:8080/ws');

  socket.onopen = () => {
    console.log('✅ WebSocket connecté !');
    home(); // Charge la page d'accueil
    socket.send(JSON.stringify({ type: 'get_user' })); // Demande la liste des utilisateurs

    // refreshConversations(); // Met à jour les conversations
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📩 Message WebSocket reçu :', data);

      if (data.type === 'connected_users' || data.type === 'new_user') {
        if (data.content.length > 0 && data.content[0] !== 'No users connected') {
          console.log('👥 Liste des utilisateurs connectés :', data.content);
          setupUsersList(data.content);
        }
      }

      if (data.type === 'user_disconnected') {
        if (data.content.length > 0 && data.content[0] !== 'No users connected') {
          console.log('🚪 Utilisateur déconnecté :', data.content);
          updateOnlineStatus(data.content, false);
        }
      }
      if (data.type === 'private') {
        //privateMessage(data.content);
        //majMessage(data.content);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la réception du message WebSocket :', error);
    }
  };
  socket.onerror = (error) => {
    console.error('⚠️ Erreur WebSocket :', error);
    login();
  };

  socket.onclose = (event) => {
    console.warn('🔌 WebSocket fermé :', event.reason);
    login();
  };
};

// 🔥 Fonction pour fermer proprement le WebSocket
export const closeWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('🛑 Fermeture du WebSocket...');
    socket.close(1000, "Déconnexion de l'utilisateur");
    socket = null; // Réinitialisation pour éviter d'appeler des événements sur un socket fermé
  }
};
