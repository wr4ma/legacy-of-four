export const input = { dx: 0, dy: 0, atk: false, jump: false, sp: false, tap: null, nav: null, any: false };
const k = {}, edge = {}, stick = { dx: 0, dy: 0, id: null };
const MAP = { KeyJ: 'atk', KeyZ: 'atk', Space: 'atk', KeyK: 'jump', KeyX: 'jump', KeyL: 'sp', KeyC: 'sp' };
const NAV = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Enter: 'ok', Space: 'ok' };

export function initControls(cv) {
  // matikan zoom (double-tap, pinch) di iOS/Brave
  const stop = e => e.preventDefault();
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend', 'dblclick']) document.addEventListener(ev, stop, { passive: false });
  document.addEventListener('touchmove', stop, { passive: false });
  let lastTap = 0;
  document.addEventListener('touchend', e => { const n = Date.now(); if (n - lastTap < 400) e.preventDefault(); lastTap = n; }, { passive: false });
  addEventListener('keydown', e => {
    if (NAV[e.code] || e.code.startsWith('Arrow')) e.preventDefault();
    k[e.code] = 1; if (e.repeat) return; edge.any = 1;
    if (MAP[e.code]) edge[MAP[e.code]] = 1;
    if (NAV[e.code]) edge.nav = NAV[e.code];
  });
  addEventListener('keyup', e => { k[e.code] = 0; });
  addEventListener('blur', () => { for (const c in k) k[c] = 0; });
  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect();
    edge.tap = { x: (e.clientX - r.left) / r.width * cv.width, y: (e.clientY - r.top) / r.height * cv.height };
  });
  for (const [id, n] of [['btnAtk', 'atk'], ['btnJump', 'jump'], ['btnSp', 'sp']])
    { const b = document.getElementById(id); b.addEventListener('pointerdown', e => { e.preventDefault(); edge[n] = 1; edge.nav = 'ok'; b.classList.add('on'); });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) b.addEventListener(ev, () => b.classList.remove('on')); }
  const fs = document.getElementById('fs'), de = document.documentElement;
  const canFs = !!(de.requestFullscreen || de.webkitRequestFullscreen) && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
  if (fs && canFs) {
    fs.style.display = 'block';
    fs.addEventListener('pointerdown', async e => {
      e.preventDefault(); e.stopPropagation();
      try {
        if (document.fullscreenElement || document.webkitFullscreenElement) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        else { await (de.requestFullscreen || de.webkitRequestFullscreen).call(de); try { await screen.orientation.lock('landscape'); } catch (_) {} }
      } catch (_) {}
    });
  }
  const st = document.getElementById('stick'), knob = document.getElementById('knob');
  const move = e => {
    const r = st.getBoundingClientRect(), R = r.width / 2;
    let x = e.clientX - (r.left + R), y = e.clientY - (r.top + R); const m = Math.hypot(x, y);
    if (m > R) { x = x / m * R; y = y / m * R; }
    stick.dx = x / R; stick.dy = y / R; knob.style.transform = `translate(${x * 0.55}px,${y * 0.55}px)`;
  };
  const end = () => { stick.dx = stick.dy = 0; stick.id = null; knob.style.transform = ''; };
  st.addEventListener('pointerdown', e => { e.preventDefault(); stick.id = e.pointerId; st.setPointerCapture(e.pointerId); move(e); });
  st.addEventListener('pointermove', e => { if (e.pointerId === stick.id) move(e); });
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
}

export function pollInput() {
  const a = (x, y) => (k[x] || k[y] ? 1 : 0);
  input.dx = (a('KeyD', 'ArrowRight') - a('KeyA', 'ArrowLeft')) || stick.dx;
  input.dy = (a('KeyS', 'ArrowDown') - a('KeyW', 'ArrowUp')) || stick.dy;
  input.atk = !!edge.atk; input.jump = !!edge.jump; input.sp = !!edge.sp;
  input.any = !!edge.any; input.tap = edge.tap || null; input.nav = edge.nav || null;
  for (const n in edge) delete edge[n];
}
