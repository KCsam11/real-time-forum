import { home } from './pages/home.js';
import { login } from './pages/login.js';
import { register } from './pages/register.js';

const routes = {
  '/': home,
  '/home': home,
  '/login': login,
  '/register': register,
};

function router() {
  const path = window.location.pathname || '/';
  console.log('path:', path);
  console.log('routes[path]:', routes[path]);
  const page = routes[path] || routes['/'];
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = page();
  }
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);

export { router };
