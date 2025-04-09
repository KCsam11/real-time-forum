export function setupLikeDislike() {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;

  const posts = postsContainer.querySelectorAll('.post');

  posts.forEach((postContainer) => {
    const likeBtn = postContainer.querySelector('.action-btn.like-btn');
    const dislikeBtn = postContainer.querySelector('.action-btn.dislike-btn');
    const postId = postContainer.getAttribute('data-post-id');

    async function getCurrentState() {
      try {
        const response = await fetch('http://localhost:8080/api/event', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'post',
            content_type: 'get_state',
            id: parseInt(postId),
          }),
        });

        return await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération de l'état:", error);
        return null;
      }
    }
    likeBtn.addEventListener('click', async () => {
      try {
        if (!likeBtn.classList.contains('liked')) {
          // Ajouter le like : envoyer l'event qui pourra générer la notif
          await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'like',
              id: parseInt(postId),
            }),
          });
          likeBtn.classList.add('liked');
          // Met à jour le compteur en utilisant la valeur affichée
          likeBtn.querySelector('span').innerText = parseInt(likeBtn.querySelector('span').innerText) + 1;
          if (dislikeBtn.classList.contains('disliked')) {
            dislikeBtn.classList.remove('disliked');
            dislikeBtn.querySelector('span').innerText = parseInt(dislikeBtn.querySelector('span').innerText) - 1;
          }
        } else {
          // Suppression du like : mise à jour de l'interface sans envoyer d'event
          likeBtn.classList.remove('liked');
          likeBtn.querySelector('span').innerText = parseInt(likeBtn.querySelector('span').innerText) - 1;
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du like:", error.message);
      }
    });

    dislikeBtn.addEventListener('click', async () => {
      try {
        if (!dislikeBtn.classList.contains('disliked')) {
          // Ajouter le dislike : envoyer l'event qui pourra générer la notif
          await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'dislike',
              id: parseInt(postId),
            }),
          });
          dislikeBtn.classList.add('disliked');
          dislikeBtn.querySelector('span').innerText = parseInt(dislikeBtn.querySelector('span').innerText) + 1;
          if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('span').innerText = parseInt(likeBtn.querySelector('span').innerText) - 1;
          }
        } else {
          // Suppression du dislike : mise à jour de l'interface sans envoyer d'event
          dislikeBtn.classList.remove('disliked');
          dislikeBtn.querySelector('span').innerText = parseInt(dislikeBtn.querySelector('span').innerText) - 1;
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du dislike:", error.message);
      }
    });
  });
}
