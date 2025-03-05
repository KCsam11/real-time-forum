import { navigate } from '../navigation.js';

export function login() {
  const template = `
        <div class="login-page">
            <div class="login-container">
                <h2>Login</h2>
                <form id="loginForm">
                    <input type="text" id="username" placeholder="Username" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <button class="btn" type="submit">Login</button>
                </form>
                <p class="form-footer">
                    Don't have an account? <a href="#" id="registerLink">Register here</a>
                </p>
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
