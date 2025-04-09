import { initializeMessagePanel } from './setupConver.js';

export function setupMsgPanel() {
  const msgBtn = document.getElementById('msgBtn');
  const msgNotifPanel = document.getElementById('msgPanel');

  // Ouverture du panneau de conversation sans notifications
  msgBtn.addEventListener('click', async () => {
    msgNotifPanel.classList.add('active');
    const conversationPanel = document.querySelector('.conversation-panel');
    if (conversationPanel) {
      conversationPanel.style.display = 'flex';
    }
    // Initialiser le panneau de conversation
    await initializeMessagePanel();
  });

  document.addEventListener('click', (e) => {
    if (!msgBtn.contains(e.target) && !msgNotifPanel.contains(e.target)) {
      msgNotifPanel.classList.remove('active');
    }
  });

  // Chargement initial du panneau de conversation (si nécessaire)
  initializeMessagePanel();

  // Retourner les éléments nécessaires pour une gestion externe
  return {
    msgNotifPanel,
  };
}

export async function openConversation(username) {
  try {
    // Active le panneau de messages/conversation
    const msgPanel = document.getElementById('msgPanel');
    msgPanel.classList.add('active');

    const conversationPanel = document.querySelector('.conversation-panel');
    if (conversationPanel) {
      conversationPanel.style.display = 'flex';
    }

    // Déclencher l'événement d'ouverture de conversation
    const event = new CustomEvent('openConversation', {
      detail: { username },
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error("❌ Erreur lors de l'ouverture de la conversation:", error);
  }
}
