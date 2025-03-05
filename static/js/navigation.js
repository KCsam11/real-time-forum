export function navigate(path) {
  window.history.pushState({}, '', path);
  const event = new PopStateEvent('popstate');
  window.dispatchEvent(event);
}
