// Dev tools (bawah layar game): bunuh semua musuh, bunuh pemain, lewati stage. Sembunyikan dengan tombol DEV (diingat).
import { STAGES } from './level.js';
export function initDev(G) {
  const bar = document.createElement('div'); bar.id = 'dev';
  bar.innerHTML = '<button class="dt" id="devT">DEV</button><div class="tools"><button data-a="kill">&#x2620; Bunuh musuh</button><button data-a="self">&#x1F480; Bunuh diri</button><button data-a="skip">&#x23ED; Lewati stage</button></div>';
  const scr = document.getElementById('screen'); (scr && scr.parentNode ? scr.parentNode : document.body).insertBefore(bar, scr ? scr.nextSibling : null);
  const put = v => { document.body.classList.toggle('devoff', !v); try { localStorage.setItem('lof_dev', v ? '1' : '0'); } catch (_) {} };
  let on = true; try { on = localStorage.getItem('lof_dev') !== '0'; } catch (_) {} put(on);
  bar.querySelector('#devT').addEventListener('click', () => put(document.body.classList.contains('devoff')));
  bar.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'kill') { for (const e of G.ents) if (e.hp > 0) { e.hp = 0; G.score += e.score || 0; } }
    else if (a === 'self') { if (G.state === 'play' && G.p && G.p.hp > 0) G.p.hp = 0; }
    else if (a === 'skip') { if (G.state === 'play') { G.ents.length = 0; G.shots.length = 0; G.locked = false; G.state = G.stage >= STAGES.length - 1 ? 'win' : 'clear'; G.t2 = 3; } }
  }));
}
