import { router } from '../../router.js';
import { register } from './register.js';

export const login = () => {
  document.body.innerHTML = '';

  // Create main container
  const loginPage = document.createElement('div');
  loginPage.className = 'login-page';

  const loginContainer = document.createElement('div');
  loginContainer.className = 'login-container';

  // Create header
  const header = document.createElement('h2');
  const logoSpan = document.createElement('span');
  logoSpan.className = 'login-logo';
  logoSpan.textContent = 'RT';
  const highlightSpan = document.createElement('span');
  highlightSpan.className = 'logo-highlight';
  highlightSpan.textContent = 'F';
  header.textContent = 'Se connecter à ';
  logoSpan.appendChild(highlightSpan);
  header.appendChild(logoSpan);

  // Create form
  const form = document.createElement('form');
  form.id = 'loginForm';

  // Username field
  const usernameGroup = document.createElement('div');
  usernameGroup.className = 'form-group';
  const usernameLabel = document.createElement('label');
  usernameLabel.htmlFor = 'username';
  usernameLabel.textContent = 'Identifiant';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'username';
  usernameInput.name = 'username';
  usernameInput.required = true;
  usernameGroup.appendChild(usernameLabel);
  usernameGroup.appendChild(usernameInput);

  // Password field
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  const passwordLabel = document.createElement('label');
  passwordLabel.htmlFor = 'password';
  passwordLabel.textContent = 'Mot de passe';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.className = 'btn';
  submitButton.type = 'submit';
  submitButton.textContent = 'Se connecter';

  // Register link
  const footer = document.createElement('p');
  footer.className = 'form-footer';
  footer.textContent = 'Pas encore de compte ? ';
  const registerLink = document.createElement('a');
  registerLink.href = '#';
  registerLink.id = 'registerLink';
  registerLink.textContent = "S'inscrire";
  footer.appendChild(registerLink);

  // Assemble form
  form.appendChild(usernameGroup);
  form.appendChild(passwordGroup);
  form.appendChild(submitButton);
  form.appendChild(footer);

  // Assemble page
  loginContainer.appendChild(header);
  loginContainer.appendChild(form);
  loginPage.appendChild(loginContainer);

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page
    log(usernameInput.value, passwordInput.value);
  });

  registerLink.addEventListener('click', (e) => {
    register();
  });

  document.body.appendChild(loginPage);
};

const log = async (identifiant, password) => {
  try {
    const response = await fetch('http://217.154.67.147:3123/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifiant: identifiant,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status} ${response.statusText}`);
    }
    router();
  } catch (error) {
    console.error('Erreur de connexion:', error);
    alert('Erreur lors de la connexion');
  }
};
