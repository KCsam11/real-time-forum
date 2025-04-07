// import { messageModal } from './messageModal.js';
// import { createMessageElement } from './messageGenerique.js';
// import { formatDate } from './messageGenerique.js';
// import { refreshConversations } from '../home-components/body.js';

// export const majMessage = (data) => {
//   if (!data || !Array.isArray(data) || data.length < 3) return;

//   const [msg, user, timestamp] = data;
//   const sectionContent = document.querySelector('#messages-id');
//   let chatUser = document.getElementById(`chat-${user}`);

//   // Log pour debug
//   console.log('📝 Mise à jour message :', { msg, user, timestamp });

//   // Formatage de la date en français
//   const date = new Date(timestamp);
//   const formattedTime = date
//     .toLocaleString('fr-FR', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     })
//     .replace(',', '');

//   // Vérifie si la modal est ouverte
//   const userModal = document.getElementById(`chat-modal-${user}`);

//   // Mise à jour d'une conversation existante
//   const updateConversation = (conversationElem) => {
//     // Mise à jour du contenu
//     conversationElem.querySelector('.last-message').innerHTML = `<strong>${user}:</strong> ${msg}`;
//     conversationElem.querySelector('.message-date').textContent = formattedTime;

//     // Gestion de la notification
//     // if (!userModal) {
//     //   let notificationDot = conversationElem.querySelector('.notification-dot');
//     //   if (!notificationDot) {
//     //     notificationDot = createNotificationDot();
//     //     conversationElem.appendChild(notificationDot);
//     //   }
//     // }

//     // Remonter la conversation en haut
//     conversationElem.remove();
//     sectionContent.prepend(conversationElem);
//     console.log('🔄 Conversation mise à jour et remontée:', user);
//   };

//   if (chatUser) {
//     updateConversation(chatUser);
//   } else {
//     // Création d'une nouvelle conversation
//     const newConversation = createMessageElement(
//       {
//         username: user,
//         last_sender: user,
//         last_message: msg,
//         last_message_date: timestamp,
//       },
//       messageModal
//     );

//     // Ajouter la notification si nécessaire
//     if (!userModal) {
//       newConversation.appendChild(createNotificationDot());
//     }

//     // Ajouter en haut de la liste
//     sectionContent.prepend(newConversation);
//     console.log('✨ Nouvelle conversation créée:', user);

//     // Rafraîchir la liste des conversations
//     refreshConversations();
//   }
// };

// // Création du point de notification
// const createNotificationDot = () => {
//   const dot = document.createElement('span');
//   dot.classList.add('notification-dot');
//   return dot;
// };

// // Ajout du CSS pour la notification si pas déjà présent
// const style = document.createElement('style');
// style.textContent = `
//   .notification-dot {
//     position: absolute;
//     top: 10px;
//     right: 10px;
//     width: 8px;
//     height: 8px;
//     background-color: #772ce8;
//     border-radius: 50%;
//     animation: pulse 1.5s infinite;
//   }

//   @keyframes pulse {
//     0% { transform: scale(0.95); opacity: 0.9; }
//     50% { transform: scale(1.05); opacity: 0.5; }
//     100% { transform: scale(0.95); opacity: 0.9; }
//   }
// `;
// document.head.appendChild(style);
