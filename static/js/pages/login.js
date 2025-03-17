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
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifiant = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
          const response = await fetch('http://localhost:8080/login', {
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
          } else {
            navigate('/home');
          }
        } catch (error) {
          console.error('Erreur de connexion:', error);
          alert('Erreur lors de la connexion');
        }
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
