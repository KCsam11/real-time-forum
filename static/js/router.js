import { home } from './pages/home-page/home.js';
import { setupUsersList } from './pages/home-page/usersList.js';
import { updateOnlineStatus } from './pages/home-page/usersList.js';
import { login } from './pages/login.js';
import { privateMessage } from './pages/home-page/chat/pvMess.js';
import { setupNotif } from './pages/home-page/notification/setupNotif.js';
import { notif } from './pages/home-page/notification/notif.js';
// import { refreshConversations } from './pages/home-page/conversacion/refreshCon.js';
//import { initializeMessagePanel } from './pages/home-page/conversacion/setupConver.js';
import { setupMsgNotif } from './pages/home-page/conversacion/addNotifComment.js';
//import { setupMsgNotif } from './pages/home-page/conversacion/addNotifComment.js';

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

    setupMsgNotif(); // Met à jour les notifications de message
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
        //majMessage(data.content);
      }
      if (data.type === 'notification') {
        console.log('🔔 Notification reçue :', data.notification);
        notif(data.notification.sender_id, data.notification.id);
        console.log('Notification:', data.notification);
        setupMsgNotif();
        //initializeMessagePanel();
        //setupMsgNotif();
      }

      if (data.type === 'is_typing' || data.type === 'is_not_typing') {
        // bubbleAnim(data.content, data.is_typing);
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
