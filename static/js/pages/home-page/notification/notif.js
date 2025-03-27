export const notif = () => {
  let notificationBadge = document.getElementById('notifCount');
  const notificationBtn = document.getElementById('notifBtn');

  // Check if notification elements exist
  if (!notificationBtn || !notificationBadge) {
    console.warn('Notification elements not found');
    return;
  }

  const chatContainer = document.querySelector('.chat-container');
  console.log('chatContainer:', chatContainer);
  if (chatContainer) return false;

  // Increment notification count
  let currentCount = parseInt(notificationBadge.textContent);
  notificationBadge.textContent = currentCount + 1;

  // Show the badge if it was hidden
  notificationBadge.style.display = 'block';

  // Add click handler to reset notifications
  notificationBtn.addEventListener('click', () => {
    notificationBadge.textContent = '0';
    notificationBadge.style.display = 'none';

    // Clear the "no notifications" message if it exists
    const notifList = document.getElementById('notifList');
    if (notifList) {
      const noNotif = notifList.querySelector('.no-notifications');
      if (noNotif) {
        noNotif.style.display = 'none';
      }
    }
  });
};
