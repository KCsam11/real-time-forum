export function setupLikeDislike() {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;

  const posts = postsContainer.querySelectorAll('.post');

  posts.forEach((postContainer) => {
    const likeBtn = postContainer.querySelector('.action-btn.like-btn');
    const dislikeBtn = postContainer.querySelector('.action-btn.dislike-btn');
    const postId = postContainer.getAttribute('data-post-id');

    // Initialiser l'état au chargement
    initializeState();

    async function initializeState() {
      const state = await getCurrentState();
      if (state) {
        updateButtonStates(state);
      }
    }

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

    function updateButtonStates(state) {
      // Mettre à jour le bouton like
      likeBtn.classList.toggle('liked', state.liked);
      likeBtn.querySelector('span').innerText = state.likes;

      // Mettre à jour le bouton dislike
      dislikeBtn.classList.toggle('disliked', state.disliked);
      dislikeBtn.querySelector('span').innerText = state.dislikes;
    }

    likeBtn.addEventListener('click', async () => {
      try {
        if (!likeBtn.classList.contains('liked')) {
          const response = await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'like',
              id: parseInt(postId),
            }),
          });

          if (response.ok) {
            const newState = await getCurrentState();
            if (newState) {
              updateButtonStates(newState);
            }
          }
        } else {
          const response = await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'unlike',
              id: parseInt(postId),
            }),
          });

          if (response.ok) {
            const newState = await getCurrentState();
            if (newState) {
              updateButtonStates(newState);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du like:", error.message);
      }
    });

    dislikeBtn.addEventListener('click', async () => {
      try {
        if (!dislikeBtn.classList.contains('disliked')) {
          const response = await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'dislike',
              id: parseInt(postId),
            }),
          });

          if (response.ok) {
            const newState = await getCurrentState();
            if (newState) {
              updateButtonStates(newState);
            }
          }
        } else {
          const response = await fetch('http://localhost:8080/api/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'post',
              content_type: 'undislike',
              id: parseInt(postId),
            }),
          });

          if (response.ok) {
            const newState = await getCurrentState();
            if (newState) {
              updateButtonStates(newState);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du dislike:", error.message);
      }
    });
  });
}
