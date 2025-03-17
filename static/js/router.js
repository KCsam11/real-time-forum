import { home } from './pages/home-page/home.js';
import { login } from './pages/login.js';
import { register } from './pages/register.js';

const routes = {
  '/': login,
  '/home': home,
  '/login': login,
  '/register': register,
};

function router() {
  const path = window.location.pathname || '/';
  const page = routes[path] || routes['/'];
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = page();
  }
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);

export { router };
