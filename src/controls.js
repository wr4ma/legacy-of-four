export const input = { dx: 0, dy: 0, attack: false, special: false, switchTo: null, start: false };
const keys = {}, btn = { atk: false, sp: false }, stick = { dx: 0, dy: 0, id: null };

export function initControls(cv) {
  addEventListener('keydown', e => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
    if (e.repeat) return;
    keys[e.code] = true;
    const n = e.code.startsWith('Digit') ? +e.code.slice(5) : 0;
    if (n >= 1 && n <= 4) input.switchTo = n - 1;
    if (e.code === 'KeyE' || e.code === 'Tab') input.switchTo = 'next';
    if (e.code === 'Enter' || e.code === 'Space') input.start = true;
  });
  addEventListener('keyup', e => { keys[e.code] = false; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  cv.addEventListener('pointerdown', () => { input.start = true; });

  const hold = (id, key) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', e => { e.preventDefault(); btn[key] = true; input.start = true; });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, () => { btn[key] = false; });
  };
  hold('btnAtk', 'atk'); hold('btnSp', 'sp');
  document.getElementById('btnSw').addEventListener('pointerdown', e => { e.preventDefault(); input.switchTo = 'next'; input.start = true; });

  const st = document.getElementById('stick'), knob = document.getElementById('knob');
  const move = e => {
    const r = st.getBoundingClientRect(), R = r.width / 2;
    let x = e.clientX - (r.left + R), y = e.clientY - (r.top + R);
    const m = Math.hypot(x, y); if (m > R) { x = x / m * R; y = y / m * R; }
    stick.dx = x / R; stick.dy = y / R;
    knob.style.transform = `translate(${x}px,${y}px)`;
  };
  const end = () => { stick.dx = stick.dy = 0; stick.id = null; knob.style.transform = ''; };
  st.addEventListener('pointerdown', e => { e.preventDefault(); stick.id = e.pointerId; st.setPointerCapture(e.pointerId); input.start = true; move(e); });
  st.addEventListener('pointermove', e => { if (e.pointerId === stick.id) move(e); });
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
}

export function pollInput() {
  const k = (a, b) => (keys[a] || keys[b] ? 1 : 0);
  const kx = k('KeyD', 'ArrowRight') - k('KeyA', 'ArrowLeft'), ky = k('KeyS', 'ArrowDown') - k('KeyW', 'ArrowUp');
  input.dx = kx || stick.dx; input.dy = ky || stick.dy;
  input.attack = !!(keys.Space || keys.KeyJ || btn.atk);
  input.special = !!(keys.KeyK || keys.ShiftLeft || btn.sp);
}
