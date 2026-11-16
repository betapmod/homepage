const toggle = document.querySelector('.sparkle-toggle');
const starLayer = document.querySelector('.page-stars');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let sparklesEnabled = !reducedMotion.matches;

function updateToggle() {
  toggle.setAttribute('aria-pressed', String(sparklesEnabled));
  toggle.setAttribute('aria-label', sparklesEnabled ? 'Tắt hiệu ứng lấp lánh' : 'Bật hiệu ứng lấp lánh');
}

updateToggle();
toggle.addEventListener('click', () => {
  sparklesEnabled = !sparklesEnabled;
  updateToggle();
});

document.addEventListener('click', (event) => {
  if (!sparklesEnabled || event.target.closest('a, button')) return;
  const star = document.createElement('span');
  star.className = 'click-star';
  star.textContent = Math.random() > 0.5 ? '✦' : '✧';
  star.style.left = `${event.clientX}px`;
  star.style.top = `${event.clientY}px`;
  starLayer.append(star);
  star.addEventListener('animationend', () => star.remove(), { once: true });
});

const card = document.querySelector('[data-tilt]');
card.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
});
card.addEventListener('pointerleave', () => {
  card.style.transform = '';
});
