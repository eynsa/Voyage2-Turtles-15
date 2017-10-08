document.addEventListener('DOMContentLoaded', () => {
  let params = new URLSearchParams(window.location.search);
  if (params.has('url')) {
    let subtitle = document.querySelector('h3.subtitle');
    subtitle.textContent = params.get('url');
  }
});
