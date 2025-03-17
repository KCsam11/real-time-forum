import { navigate } from '../navigation.js';

export function register() {
  const template = `
    <div class="login-page">
      <div class="login-container register-container">
        <h2>S'inscrire sur <span class="login-logo">RT<span class="logo-highlight">F</span></span></h2>
        <form id="register-form">
          <div class="form-group">
            <label for="reg-username">Nom d'utilisateur</label>
            <input type="text" id="reg-username" name="username" required>
          </div>
          <div class="form-group">
            <label for="reg-email">Email</label>
            <input type="email" id="reg-email" name="email" required>
          </div>
          <div class="form-group">
            <label for="reg-password">Mot de passe</label>
            <div class="password-input-container">
              <input type="password" id="reg-password" name="password" required>
              
            </div>
          </div>
          <div class="form-group">
            <label for="reg-confirm-password">Confirmer le mot de passe</label>
            <div class="password-input-container">
              <input type="password" id="reg-confirm-password" name="confirm-password" required>
    
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="reg-firstname">Prénom</label>
              <input type="text" id="reg-firstname" name="firstname" required>
            </div>
            <div class="form-group">
              <label for="reg-lastname">Nom</label>
              <input type="text" id="reg-lastname" name="lastname" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="reg-age">Âge</label>
              <input type="number" id="reg-age" name="age" min="18" max="120" required>
            </div>
            <div class="form-group">
              <label for="reg-genre">Genre</label>
              <select id="reg-genre" name="genre" required>
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn">S'inscrire</button>
          <p class="form-footer">
            Déjà inscrit ? <a href="#" id="loginLink">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  `;
  setTimeout(() => {
    const registerForm = document.getElementById('register-form');
    const loginLink = document.getElementById('loginLink');

    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData);
        console.log(data);

        // Validation basique
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
            navigate('login');
          } else {
            const error = await response.json();
            alert(error.message || "Erreur lors de l'inscription");
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert("Erreur lors de l'inscription");
        }
      });
    }
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('login');
      });
    }
  }, 0);
  return template;
}
