const slides = Array.from(document.querySelectorAll('.slide'));
const counter = document.getElementById('counter');
const dpBar = document.getElementById('dpBar');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let current = 0;
const initialHash = parseInt(location.hash.replace('#s', ''), 10);
if (!Number.isNaN(initialHash) && initialHash >= 1 && initialHash <= slides.length) current = initialHash - 1;

function show(idx, dir = 'forward') {
  if (idx < 0 || idx >= slides.length) return;
  const out = slides[current];
  const nxt = slides[idx];
  if (out !== nxt) {
    out.classList.remove('active');
    out.classList.toggle('exit-left', dir === 'forward');
    setTimeout(() => out.classList.remove('exit-left'), 600);
  }
  nxt.classList.add('active');
  current = idx;
  counter.textContent = (idx + 1) + ' / ' + slides.length;
  dpBar.style.width = ((idx + 1) / slides.length * 100) + '%';
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === slides.length - 1;
  history.replaceState(null, '', '#s' + (idx + 1));
}

prevBtn.addEventListener('click', () => show(current - 1, 'back'));
nextBtn.addEventListener('click', () => show(current + 1, 'forward'));
document.getElementById('edgeLeft').addEventListener('click', () => show(current - 1, 'back'));
document.getElementById('edgeRight').addEventListener('click', () => show(current + 1, 'forward'));

const deckNav = document.getElementById('deckNav');
const deckHelp = document.getElementById('deckHelp');
let idleTimer = null;
function wakeNav() {
  deckNav.classList.remove('hidden');
  deckHelp.classList.remove('hidden');
  document.body.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    deckNav.classList.add('hidden');
    deckHelp.classList.add('hidden');
    document.body.classList.add('idle');
  }, 2500);
}
['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'].forEach(ev => document.addEventListener(ev, wakeNav, { passive: true }));
wakeNav();

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea,select')) return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); show(current + 1, 'forward'); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show(current - 1, 'back'); }
  else if (e.key === 'Home') { e.preventDefault(); show(0, 'back'); }
  else if (e.key === 'End') { e.preventDefault(); show(slides.length - 1, 'forward'); }
});

let touchX = null;
document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 60) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 'forward' : 'back');
  touchX = null;
}, { passive: true });

window.addEventListener('hashchange', () => {
  const i = parseInt(location.hash.replace('#s', ''), 10);
  if (!Number.isNaN(i) && i >= 1 && i <= slides.length && i - 1 !== current) show(i - 1, i - 1 > current ? 'forward' : 'back');
});

if (matchMedia('(max-width:768px)').matches) {
  deckNav.classList.add('hidden');
  deckHelp.classList.add('hidden');
} else {
  show(current);
}
