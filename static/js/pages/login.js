import { navigate } from '../navigation.js';

export function login() {
  const template = `
       <div class="login-page">
      <div class="login-container">
        <h2>Se connecter à <span class="login-logo">RT<span class="logo-highlight">F</span></span></h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="username">Identifiant</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button class="btn" type="submit">Se connecter</button>
          <p class="form-footer">
            Pas encore de compte ? <a href="#" id="registerLink">S'inscrire</a>
          </p>
        </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Ici vous pourrez ajouter la validation du login
        console.log('Login attempt:', { username, password });

        // Redirection vers la page home après le login
        navigate('/home');
      });
    }

    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/register');
      });
    }
  }, 0);

  return template;
}
