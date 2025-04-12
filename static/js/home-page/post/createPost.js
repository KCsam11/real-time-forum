import { router } from '../../router.js';

export function initializePostCreation() {
  // Create modal element
  const modal = createModalElement();
  document.body.appendChild(modal);

  // Attach event listeners
  attachEventListeners(modal);
}

function createModalElement() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
  <div class="modal-content">
      <div class="modal-header">
          <h3>Créer un nouveau post</h3>
          <button class="modal-close-btn">
              <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2"/>
              </svg>
          </button>
      </div>
      <div class="modal-body">
          <div class="form-group category-group">
              <select class="post-category-select" id="categorySelect">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="general">Général</option>
                  <option value="question">Question</option>
                  <option value="discussion">Discussion</option>
                  <option value="custom">Autre (personnalisé)</option>
              </select>
              <input type="text" 
                     class="post-category-input" 
                     id="customCategory"
                     placeholder="Écrivez votre catégorie"
                     style="display: none;">
          </div>
          <div class="form-group">
              <textarea
                  class="post-content"
                  placeholder="Que voulez-vous partager ?"
                  rows="6"
                  required
              ></textarea>
          </div>
      </div>
      <div class="modal-footer">
          <button class="btn cancel-btn">Annuler</button>
          <button class="btn submit-btn">Publier</button>
      </div>
  </div>
`;
  // Add event listener for category select
  const categorySelect = modal.querySelector('#categorySelect');
  const customCategoryInput = modal.querySelector('#customCategory');

  categorySelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      customCategoryInput.style.display = 'block';
      customCategoryInput.required = true;
    } else {
      customCategoryInput.style.display = 'none';
      customCategoryInput.required = false;
    }
  });

  return modal;
}

function attachEventListeners(modal) {
  const createPostBtn = document.getElementById('createPostBtn');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const submitBtn = modal.querySelector('.submit-btn');

  createPostBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  [closeBtn, cancelBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(modal);
    });
  });

  submitBtn.addEventListener('click', () => {
    handlePostSubmission(modal);
  });
}

async function handlePostSubmission(modal) {
  const categorySelect = modal.querySelector('.post-category-select');
  const customCategory = modal.querySelector('#customCategory');
  const content = modal.querySelector('.post-content').value.trim();

  let category = categorySelect.value;
  if (category === 'custom') {
    category = customCategory.value.trim();
  }

  if (!category || !content) {
    showError('Veuillez remplir tous les champs');
    return;
  }

  try {
    const response = await fetch('http://217.154.67.147:3123/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: category, content: content }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du post.');
    }

    closeModal(modal);
    resetForm(modal);
    router();
  } catch (error) {
    console.error('Erreur :', error);
    showError('Une erreur est survenue. Réessayez.');
  }
}

function showError(message) {
  // You can implement your own error display logic here
  alert(message);
}

function closeModal(modal) {
  modal.classList.remove('show');
}

function resetForm(modal) {
  modal.querySelector('.post-category-select').value = '';
  modal.querySelector('#customCategory').value = '';
  modal.querySelector('#customCategory').style.display = 'none';
  modal.querySelector('.post-content').value = '';
}
