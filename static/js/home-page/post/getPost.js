import { setupComment } from '../comment/setupComment.js';
import { setupLikeDislike } from '../like_dislike/setupLike_dislike.js';

export async function getAllPosts() {
  try {
    const response = await fetch('http://localhost:8080/api/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

function displayPosts(posts) {
  const mainContent = document.querySelector('.div2');
  let postsContainer = document.getElementById('posts-container');

  if (!postsContainer) {
    postsContainer = document.createElement('div');
    postsContainer.id = 'posts-container';
    postsContainer.className = 'posts-container';
    mainContent.appendChild(postsContainer);
  }

  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="no-posts">Aucun post disponible</p>';
    return;
  }

  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
  setupLikeDislike();
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.setAttribute('data-post-id', post.id); // Important pour identifier le post

  postDiv.innerHTML = `
  <div class="post-header">
    <div class="post-user">
      <div class="user-avatar">${post.username ? post.username[0] : 'U'}</div>
      <div class="post-user-info">
        <div class="post-username">${post.username || 'Unknown User'}</div>
        <div class="post-timestamp">${new Date(post.created_at).toLocaleString()}</div>
      </div>
    </div>
    <div class="post-category-tag">${post.category || 'General'}</div>
  </div>
  <div class="post-content">${post.content}</div>
  <div class="post-actions">
    <button class="action-btn like-btn" title="J'aime">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
             class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
        </svg>
        <span class="like-count">${post.likes || 0}</span>
    </button>
    <button class="action-btn dislike-btn" title="Je n'aime pas">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
            <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.4 9.4 0 0 1-.062 4.509c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
        </svg>
        <span class="dislike-count">${post.dislikes || 0}</span>
    </button>
    <button class="action-btn comment-btn" title="Commenter" style="display: flex; align-items: center; gap: 5px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
           class="bi bi-chat" viewBox="0 0 16 16">
        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
      </svg>
      <span>Commenter</span>
    </button>
  </div>
  `;

  if (post.hasLiked) {
    postDiv.querySelector('.like-btn').classList.add('liked');
  }
  if (post.hasDisliked) {
    postDiv.querySelector('.dislike-btn').classList.add('disliked');
  }
  // Ajout de l'événement pour afficher le formulaire de commentaire
  const commentBtn = postDiv.querySelector('.comment-btn');
  commentBtn.addEventListener('click', () => {
    console.log('Comment button clicked for post ID:', post.id);
    // Utilisation de la fonction setupComment en passant l'id du post
    setupComment(post.id);

    // Optionnel : masquer le bouton après affichage du formulaire
    commentBtn.style.display = 'none';
  });

  return postDiv;
}
