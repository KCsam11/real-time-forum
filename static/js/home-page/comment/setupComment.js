export function setupComment(postId) {
  const post = document.querySelector(`[data-post-id="${postId}"]`);
  if (!post) {
    console.error(`Aucun post trouvé avec data-post-id: ${postId}`);
    return;
  }
  if (post.querySelector('.forum-comment-form')) return;

  const commentForm = document.createElement('form');
  commentForm.classList.add('forum-comment-form');

  // Ligne pour le champ de saisie
  const formRow = document.createElement('div');
  formRow.classList.add('forum-form-row');

  // Création du textarea pour commenter
  const commentInput = document.createElement('textarea');
  commentInput.classList.add('forum-form-control-dark'); // Utilisez ce sélecteur pour un style dark
  commentInput.name = 'comment';
  commentInput.placeholder = 'Écrivez votre commentaire...';
  commentInput.rows = 3;
  formRow.appendChild(commentInput);
  commentForm.appendChild(formRow);

  // Ligne pour le bouton
  const buttonRow = document.createElement('div');
  buttonRow.classList.add('forum-button-row');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.classList.add('forum-btn', 'forum-btn-primary-dark'); // Bouton adapté au thème sombre
  submitBtn.textContent = 'Envoyer';
  buttonRow.appendChild(submitBtn);
  commentForm.appendChild(buttonRow);

  // Insertion du formulaire dans le post
  post.appendChild(commentForm);

  // Gestion de la soumission du formulaire
  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const commentText = commentInput.value.trim();
    if (commentText === '') return;

    // Création d'un élément pour afficher le commentaire
    const commentElement = document.createElement('div');
    commentElement.classList.add('forum-comment-item-dark'); // Style pour le commentaire en thème sombre
    commentElement.textContent = commentText;

    // Insertion du commentaire dans le post (ou dans une zone dédiée)
    post.appendChild(commentElement);

    // Réinitialisation du champ de saisie
    commentInput.value = '';
  });
}
