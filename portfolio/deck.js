// Cieva deck runtime: fit-to-viewport scaling, navigation, deep links, notes.
(() => {
  const W = 1920, H = 1080;
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const hud = document.getElementById('hud');
  const notes = document.getElementById('notes');
  let index = 0, hudTimer;

  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }

  function showHud() {
    hud.textContent = `${index + 1} / ${slides.length}  ·  ←/→  ·  N notes`;
    hud.classList.add('is-visible');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('is-visible'), 1800);
  }

  function go(i, { silent } = {}) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((el, n) => el.classList.toggle('is-active', n === index));
    notes.textContent = slides[index].dataset.notes || '';
    history.replaceState(null, '', `#${index + 1}`);
    if (!silent) showHud();
  }

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) go(index + 1);
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) go(index - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'n' || k === 'N') notes.classList.toggle('is-open');
    else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    else if (/^[1-9]$/.test(k)) go(Number(k) - 1);
    else return;
    e.preventDefault();
  });

  // Tap / click: left third goes back, the rest goes forward.
  addEventListener('click', (e) => {
    if (e.target.closest('a, button, .notes')) return;
    go(e.clientX < innerWidth / 3 ? index - 1 : index + 1);
  });

  addEventListener('hashchange', () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (n && n - 1 !== index) go(n - 1);
  });
  addEventListener('mousemove', showHud);
  addEventListener('resize', fit);

  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, { silent: true });
})();
