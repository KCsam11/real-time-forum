export async function setupComment(postId) {
  const post = document.querySelector(`[data-post-id="${postId}"]`);
  if (!post) {
    console.error(`Aucun post trouvé avec data-post-id: ${postId}`);
    return;
  }

  const commentBtn = post.querySelector('.comment-btn');

  // 1. Vérifier si la section commentaires existe déjà
  let commentsSection = post.querySelector('.comments-section');
  if (commentsSection) {
    toggleComments(commentsSection, commentBtn);
    return;
  }

  // 2. Créer la nouvelle section de commentaires
  commentsSection = createCommentsSection(commentBtn);

  // 3. Charger les commentaires existants
  await loadExistingComments(postId, commentsSection);

  // 4. Créer et ajouter le formulaire
  const commentForm = createCommentForm(postId, commentsSection);
  commentsSection.appendChild(commentForm);

  // 5. Ajouter la section au post
  post.appendChild(commentsSection);

  // 6. Cacher le bouton commentaire
  commentBtn.style.display = 'none';
}

function toggleComments(commentsSection, commentBtn) {
  commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
  commentBtn.style.display = commentsSection.style.display === 'none' ? 'flex' : 'none';
}

function createCommentsSection(commentBtn) {
  const section = document.createElement('div');
  section.classList.add('comments-section');

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-comments-btn');
  closeButton.innerHTML = '&#x2715;';
  closeButton.onclick = () => {
    section.style.display = 'none';
    commentBtn.style.display = 'flex';
  };
  section.appendChild(closeButton);

  return section;
}

async function loadExistingComments(postId, commentsSection) {
  try {
    const url = `http://localhost:8080/api/comment/${postId}`;
    console.log('Chargement des commentaires depuis:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    let comments;
    try {
      const text = await response.text();
      // Get only the first JSON object from the response
      const jsonStr = text.split('\n')[0];
      comments = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      throw new Error('Format de réponse invalide');
    }

    console.log('Commentaires reçus:', comments);

    // Vider les commentaires existants
    const existingComments = commentsSection.querySelectorAll('.forum-comment-item-dark');
    existingComments.forEach((comment) => comment.remove());

    // Vérifier si nous avons des commentaires
    if (!Array.isArray(comments) || comments.length === 0) {
      const noCommentsMsg = document.createElement('p');
      noCommentsMsg.classList.add('no-comments-message');
      noCommentsMsg.textContent = 'Aucun commentaire pour le moment';
      commentsSection.appendChild(noCommentsMsg);
      return;
    }

    // Trier et afficher les commentaires
    comments
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach((comment) => {
        const commentElement = createCommentElement(comment);
        commentsSection.appendChild(commentElement);
      });
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires:', error);
    const errorMsg = document.createElement('p');
    errorMsg.classList.add('error-message');
    errorMsg.textContent = 'Erreur lors du chargement des commentaires';
    commentsSection.appendChild(errorMsg);
  }
}

function createCommentForm(postId, commentsSection) {
  const form = document.createElement('form');
  form.classList.add('forum-comment-form');

  const textarea = document.createElement('textarea');
  textarea.classList.add('forum-form-control-dark');
  textarea.placeholder = 'Écrivez votre commentaire...';
  textarea.rows = 3;
  form.appendChild(textarea);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('forum-btn', 'forum-btn-primary-dark');
  submitButton.textContent = 'Envoyer';
  form.appendChild(submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = textarea.value.trim();
    if (!content) return;

    try {
      const response = await fetch('http://localhost:8080/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_post: postId,
          content: content,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi du commentaire");

      const result = await response.json();
      const newComment = createCommentElement(result);
      commentsSection.insertBefore(newComment, form);
      textarea.value = '';
    } catch (error) {
      console.error('Erreur:', error);
    }
  });

  return form;
}

function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('forum-comment-item-dark');

  const commentHeader = document.createElement('div');
  commentHeader.classList.add('comment-header');

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('comment-username');
  usernameElement.textContent = comment.username;

  const dateElement = document.createElement('span');
  dateElement.classList.add('comment-date');
  dateElement.textContent = new Date(comment.created_at).toLocaleString();

  commentHeader.appendChild(usernameElement);
  commentHeader.appendChild(dateElement);

  const messageElement = document.createElement('p');
  messageElement.classList.add('comment-message');
  messageElement.textContent = comment.content;

  commentElement.appendChild(commentHeader);
  commentElement.appendChild(messageElement);

  return commentElement;
}
