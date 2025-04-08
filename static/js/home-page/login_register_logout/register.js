import { login } from './login.js';

export const register = () => {
  // Clear existing content
  document.body.innerHTML = '';

  // Create main containers
  const loginPage = document.createElement('div');
  loginPage.className = 'login-page';

  const loginContainer = document.createElement('div');
  loginContainer.className = 'login-container register-container';

  // Create header
  const header = document.createElement('h2');
  header.textContent = "S'inscrire sur ";
  const logoSpan = document.createElement('span');
  logoSpan.className = 'login-logo';
  logoSpan.textContent = 'RT';
  const highlightSpan = document.createElement('span');
  highlightSpan.className = 'logo-highlight';
  highlightSpan.textContent = 'F';
  logoSpan.appendChild(highlightSpan);
  header.appendChild(logoSpan);

  // Create form
  const form = document.createElement('form');
  form.id = 'register-form';

  // Create form groups
  const formGroups = [
    { label: "Nom d'utilisateur", type: 'text', id: 'reg-username', name: 'username' },
    { label: 'Email', type: 'email', id: 'reg-email', name: 'email' },
    { label: 'Mot de passe', type: 'password', id: 'reg-password', name: 'password' },
    { label: 'Confirmer le mot de passe', type: 'password', id: 'reg-confirm-password', name: 'confirm-password' },
  ];

  formGroups.forEach((group) => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = group.id;
    label.textContent = group.label;

    const input = document.createElement('input');
    input.type = group.type;
    input.id = group.id;
    input.name = group.name;
    input.required = true;

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  // Create name row
  const nameRow = document.createElement('div');
  nameRow.className = 'form-row';

  const firstNameGroup = createFormGroup('Prénom', 'text', 'reg-firstname', 'firstname');
  const lastNameGroup = createFormGroup('Nom', 'text', 'reg-lastname', 'lastname');

  nameRow.appendChild(firstNameGroup);
  nameRow.appendChild(lastNameGroup);
  form.appendChild(nameRow);

  // Create age and gender row
  const infoRow = document.createElement('div');
  infoRow.className = 'form-row';

  const ageGroup = createFormGroup('Âge', 'number', 'reg-age', 'age');
  const ageInput = ageGroup.querySelector('input');
  ageInput.min = '18';
  ageInput.max = '120';

  const genreGroup = document.createElement('div');
  genreGroup.className = 'form-group';
  const genreLabel = document.createElement('label');
  genreLabel.htmlFor = 'reg-genre';
  genreLabel.textContent = 'Genre';
  const genreSelect = document.createElement('select');
  genreSelect.id = 'reg-genre';
  genreSelect.name = 'genre';
  genreSelect.required = true;

  const options = [
    { value: '', text: 'Sélectionner' },
    { value: 'male', text: 'Homme' },
    { value: 'female', text: 'Femme' },
    { value: 'other', text: 'Autre' },
  ];

  options.forEach((opt) => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.text;
    genreSelect.appendChild(option);
  });

  genreGroup.appendChild(genreLabel);
  genreGroup.appendChild(genreSelect);

  infoRow.appendChild(ageGroup);
  infoRow.appendChild(genreGroup);
  form.appendChild(infoRow);

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn';
  submitButton.textContent = "S'inscrire";
  form.appendChild(submitButton);

  // Login link
  const footer = document.createElement('p');
  footer.className = 'form-footer';
  footer.textContent = 'Déjà inscrit ? ';
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.id = 'loginLink';
  loginLink.textContent = 'Se connecter';
  footer.appendChild(loginLink);
  form.appendChild(footer);

  // Add event listeners
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (data.password !== data['confirm-password']) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        login();
      } else {
        const error = await response.json();
        alert(error.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'inscription");
    }
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    login();
  });

  // Assemble and append elements
  loginContainer.appendChild(header);
  loginContainer.appendChild(form);
  loginPage.appendChild(loginContainer);
  document.body.appendChild(loginPage);
};

// Helper function to create form groups
function createFormGroup(labelText, type, id, name) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.name = name;
  input.required = true;

  group.appendChild(label);
  group.appendChild(input);

  return group;
}
