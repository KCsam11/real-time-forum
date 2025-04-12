import { home } from './home-page/home/home.js';
import { setupUsersList } from './home-page/usersList.js';
import { updateOnlineStatus } from './home-page/usersList.js';
import { login } from './home-page/login_register_logout/login.js';
import { privateMessage } from './home-page/chat/pvMess.js';
import { setupNotif } from './home-page/notification/setupNotif.js';
import { notif } from './home-page/notification/notif.js';
import { setupMsgPanel } from './home-page/conversacion/conv.js';

export let socket = null;

export const router = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    closeWebSocket();
  }

  // 📡 Création d'une nouvelle connexion WebSocket
  socket = new WebSocket('ws://localhost:3123/ws');

  socket.onopen = () => {
    console.log('✅ WebSocket connecté !');
    home(); // Charge la page d'accueil
    socket.send(JSON.stringify({ type: 'get_user' })); // Demande la liste des utilisateurs

    setupMsgPanel(); // Met à jour les notifications de message
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
        console.log('📩 Message privé reçu :', data.content);
        privateMessage(data.content);
      }
      if (data.type === 'notification') {
        notif(data.notification.sender_id, data.notification.id);
        setupMsgPanel();
      }

      if (data.type === 'is_typing' || data.type === 'is_not_typing') {
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
