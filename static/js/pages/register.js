import { navigate } from '../navigation.js';

export function register() {
  const content = `
        <div class="login-page">
            <div class="login-container">
                <h2>Register</h2>
                <form id="registerForm">
                    <input type="text" id="username" placeholder="Username" required>
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                    <button class="btn" type="submit">Register</button>
                </form>
                <p class="form-footer">
                    Already have an account? <a href="#" id="loginLink">Login here</a>
                </p>
            </div>
        </div>
    `;

  setTimeout(() => {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/login');
      });
    }
  });

  return content;
}
