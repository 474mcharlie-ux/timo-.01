const dialog = document.querySelector('.waitlist-dialog');
const openButtons = document.querySelectorAll('[data-dialog-open]');
const closeButton = document.querySelector('.dialog-close');
const form = document.querySelector('#waitlist-form');
const message = document.querySelector('.form-message');
const menu = document.querySelector('.menu-button');
const orbit = document.querySelector('.hero-orbit');

openButtons.forEach((button) => button.addEventListener('click', () => dialog.showModal()));
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = form.querySelector('input').value;
  message.textContent = `You’re on the list — we’ll write to ${email}.`;
  form.querySelector('input').setAttribute('disabled', '');
  form.querySelector('button').setAttribute('disabled', '');
});

menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('.desktop-nav').classList.toggle('mobile-open', !expanded);
});

if (orbit && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 18;
    const y = (event.clientY / window.innerHeight - .5) * 18;
    orbit.style.setProperty('--pointer-x', `${x}px`);
    orbit.style.setProperty('--pointer-y', `${y}px`);
  }, { passive: true });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
