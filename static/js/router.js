import { navigate } from './navigation.js';
import { home } from './pages/home-page/home.js';
import { login } from './pages/login.js';
import { register } from './pages/register.js';

// const routes = {
//   '/': login,
//   '/home': home,
//   '/login': login,
//   '/register': register,
// };

export let socket = null;

export const router = () => {
  const app = document.getElementById('app');

  // 🔌 Si un WebSocket est déjà ouvert, on le ferme avant d'en créer un nouveau
  if (socket && socket.readyState === WebSocket.OPEN) {
    closeWebSocket();
  }

  // 📡 Création d'une nouvelle connexion WebSocket
  socket = new WebSocket('ws://localhost:8080/ws');

  socket.onopen = () => {
    console.log('✅ WebSocket connecté !');
    app.innerHTML = home(); // Charge la page d'accueil
    socket.send(JSON.stringify({ type: 'get_user' })); // Demande la liste des utilisateurs

    // refreshConversations(); // Met à jour les conversations
  };
  socket.onerror = (error) => {
    console.error('⚠️ Erreur WebSocket :', error);
    app.innerHTML = login();
  };
  socket.onclose = (event) => {
    console.warn('🔌 WebSocket fermé :', event.reason);
    app.innerHTML = login();
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
