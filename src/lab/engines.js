/* =========================================================
   Interaction Lab engines
   Ported from the material studies (Clay Toggle, Aluminium Toggle,
   Submit Button, Stepper, Rotary Switch, Date Picker). The physics,
   timing and sounds are unchanged; each factory now takes an element,
   and returns { destroy } so React can unmount it.
   ========================================================= */

const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- one animation loop for every control ---------- */
const loop = new Set();
let last = typeof performance !== 'undefined' ? performance.now() : 0;
let running = false;
function tick(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
  loop.forEach((f) => f(dt));
  if (loop.size) requestAnimationFrame(tick); else running = false;
}
function addLoop(f) { loop.add(f); if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } return () => loop.delete(f); }

/* ---------- screen reader announcements ---------- */
let liveEl = null;
export function announce(t) {
  if (!liveEl) {
    liveEl = document.createElement('div');
    liveEl.setAttribute('role', 'status'); liveEl.setAttribute('aria-live', 'polite'); liveEl.className = 'sr-only';
    document.body.appendChild(liveEl);
  }
  liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = t; }, 30);
}

/* ---------- sound, synthesised (union of every study's sounds) ---------- */
export const Snd = {
  ctx: null, on: false, buf: null, listeners: new Set(),
  set(v) { this.on = v; try { localStorage.setItem('alu-sound', v ? '1' : '0'); } catch (e) { /* */ } if (v) this.ensure(); this.listeners.forEach((l) => l(v)); },
  ensure() {
    if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.buf) { const n = Math.floor(this.ctx.sampleRate * 0.08), b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.buf = b; }
    return this.ctx;
  },
  hit(t, f, q, g, dur, type) {
    const c = this.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), a = c.createGain();
    s.buffer = this.buf; fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q;
    a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(g, t + 0.0008); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(a); a.connect(c.destination); s.start(t); s.stop(t + dur + 0.02);
  },
  tone(t, f, g, dur, type) {
    const c = this.ctx, o = c.createOscillator(), a = c.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(g, t + 0.002); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(a); a.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  },
  play(k, n) {
    if (!this.on) return; const c = this.ensure(); if (!c) return; const t = c.currentTime + 0.002;
    switch (k) {
      case 'snap': this.hit(t, 420, 0.9, 0.35, 0.035, 'lowpass'); this.hit(t, 2600, 3, 0.55, 0.018); this.hit(t + 0.008, 4300, 6, 0.35, 0.02); this.tone(t + 0.008, 6200, 0.03, 0.08); break;
      case 'press': this.hit(t, 1700, 2, 0.12, 0.012); break;
      case 'back': this.hit(t, 800, 1.2, 0.22, 0.025); break;
      case 'down': this.hit(t, 380, 0.9, 0.3, 0.03, 'lowpass'); this.hit(t, 2300, 3, 0.45, 0.016); this.hit(t + 0.006, 3900, 5, 0.25, 0.018); break;
      case 'up': this.hit(t, 2900, 4, 0.18, 0.012); break;
      case 'ok': this.hit(t, 2600, 3, 0.4, 0.018); this.tone(t + 0.01, 1568, 0.05, 0.16); this.tone(t + 0.09, 2093, 0.05, 0.22); break;
      case 'err': this.tone(t, 150, 0.12, 0.12, 'square'); this.tone(t + 0.17, 150, 0.12, 0.12, 'square'); break;
      case 'tick': this.hit(t, 3400, 6, 0.24, 0.009); this.hit(t, 1100, 2, 0.08, 0.012); break;
      case 'thunk': this.hit(t, 170, 0.8, 0.55, 0.07, 'lowpass'); this.hit(t, 520, 1.5, 0.14, 0.035); break;
      case 'plastic': this.hit(t, 260, 0.8, 0.4, 0.05, 'lowpass'); this.hit(t, 1150, 1.6, 0.32, 0.03); this.hit(t + 0.016, 900, 1.4, 0.12, 0.025); break;
      case 'rot-alu': this.hit(t, 420, 0.9, 0.32, 0.035, 'lowpass'); this.hit(t, 2600, 3, 0.55, 0.018); this.hit(t + 0.008, 4300, 6, 0.35, 0.02); this.tone(t + 0.008, 6200, 0.03, 0.09); break;
      case 'rot-back': this.hit(t, 700, 1.2, 0.18, 0.025); break;
      case 'cal-down': this.hit(t, 2600, 3, 0.32, 0.014); this.hit(t, 420, 1, 0.16, 0.02, 'lowpass'); break;
      case 'cal-up': this.hit(t, 3200, 4, 0.14, 0.01); break;
      case 'latch': this.hit(t, 330, 0.9, 0.34, 0.035, 'lowpass'); this.hit(t, 2100, 3, 0.4, 0.018); this.hit(t + 0.01, 3800, 5, 0.22, 0.018); break;
      case 'cal-tick': this.hit(t, 3400, 6, 0.22, 0.009); this.hit(t, 1100, 2, 0.08, 0.012); break;
      case 'relay': for (let i = 0; i < Math.min(n || 1, 12); i++) this.hit(t + i * 0.008, 4200, 7, 0.05, 0.006); break;
      case 'pop': this.hit(t, 2800, 3, 0.2, 0.012); this.hit(t + 0.012, 2400, 3, 0.16, 0.012); break;
      default:
    }
  },
};
if (typeof window !== 'undefined') {
  // a remembered "sound on" resumes on the first interaction (browsers need a gesture for audio)
  document.addEventListener('pointerdown', function once(e) {
    try { if (localStorage.getItem('alu-sound') === '1' && !Snd.on && !e.target.closest('.sound-btn')) Snd.set(true); } catch (_) { /* */ }
    document.removeEventListener('pointerdown', once, true);
  }, true);
}

/* small helper: listeners that are removed on destroy */
function binder() {
  const offs = [];
  return {
    on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); },
    off() { offs.forEach((f) => f()); },
  };
}

/* =========================================================
   Clay toggle — material study 01
   ========================================================= */
export function clayToggle(el, opts) {
  const o = Object.assign({ k: 300, zeta: 0.38, press: 0.16, tap: true, onChange: null }, opts);
  const knob = el.querySelector('.ct-knob'), floor = el.querySelector('.ct-floor');
  const on0 = el.getAttribute('aria-checked') === 'true';
  const s = { x: on0 ? 1 : 0, v: 0, target: on0 ? 1 : 0, p: 0, pv: 0, pressed: false, drag: null, anchor: on0 ? -1 : 1 };
  const PAD = 10; let W = 64, T = 88;
  function measure() { W = knob.offsetWidth || 64; T = el.clientWidth - 2 * PAD - W; }
  measure();
  function setTarget(t, silent) { s.target = t; el.setAttribute('aria-checked', String(t === 1)); if (!silent && o.onChange) o.onChange(t === 1); }
  function toggle() { setTarget(1 - s.target); }

  function step(dt) {
    const clay = !reduce;
    if (!(s.drag && s.drag.active)) {
      const zeta = reduce ? 1 : o.zeta, k = o.k, c = 2 * zeta * Math.sqrt(k), n = 4, h = dt / n;
      for (let i = 0; i < n; i++) { const a = k * (s.target - s.x) - c * s.v; s.v += a * h; s.x += s.v * h; }
      if (Math.abs(s.target - s.x) < 1e-4 && Math.abs(s.v) < 1e-3) { s.x = s.target; s.v = 0; }
    }
    const pt = (s.pressed && clay) ? 1 : 0, pk = 700, pc = 2 * 0.5 * Math.sqrt(pk), n2 = 3, h2 = dt / n2;
    for (let i = 0; i < n2; i++) { const a = pk * (pt - s.p) - pc * s.pv; s.pv += a * h2; s.p += s.pv * h2; }
    if (!s.pressed && Math.abs(s.p) < 1e-4 && Math.abs(s.pv) < 1e-3) { s.p = 0; s.pv = 0; }
    render(clay);
  }
  function render(clay) {
    const ROOM = 7; let pos = s.x * T, over = 0;
    if (pos > T) { over = pos - T; pos = T + Math.min(over, ROOM); } else if (pos < 0) { over = -pos; pos = -Math.min(over, ROOM); }
    let sx = 1, shift = 0;
    if (clay) {
      const ps = o.press * Math.max(0, s.p);
      const vs = Math.min(Math.abs(s.v) * T / 5000, 0.25);
      const squash = Math.min(Math.max(over - ROOM, 0) / W * 1.4 + over / W * 0.25, 0.18);
      sx = 1 + ps + vs - squash;
      shift = s.anchor * ps * W / 2;
      if (over > 0) shift += (s.x > 1 ? 1 : -1) * squash * W / 2;
    }
    sx = Math.max(sx, 0.6);
    knob.style.transform = `translate3d(${(pos + shift).toFixed(2)}px,0,0) scale(${sx.toFixed(4)},${(1 / sx).toFixed(4)})`;
    floor.style.opacity = Math.min(Math.max(s.x, 0), 1).toFixed(3);
  }

  const b = binder();
  b.on(el, 'pointerdown', (e) => {
    if (e.button !== 0) return;
    el.setPointerCapture(e.pointerId); el.focus({ preventScroll: true }); measure();
    s.pressed = true; s.anchor = s.target === 0 ? 1 : -1;
    s.drag = { x0: e.clientX, from: s.target, startX: s.x, active: false, t: performance.now() };
  });
  b.on(el, 'pointermove', (e) => {
    const d = s.drag; if (!d || !s.pressed) return;
    const dx = e.clientX - d.x0;
    if (!d.active && Math.abs(dx) > 4) d.active = true;
    if (d.active) {
      let nx = d.startX + dx / T;
      if (nx > 1) nx = 1 + (nx - 1) * 0.25;
      if (nx < 0) nx *= 0.25;
      const now = performance.now(), ddt = Math.max((now - d.t) / 1000, 1 / 240);
      s.v = s.v * 0.5 + ((nx - s.x) / ddt) * 0.5; s.x = nx; d.t = now;
    }
  });
  function release(cancel) {
    const d = s.drag; if (!d) return;
    s.pressed = false; s.drag = null;
    if (cancel) return;
    if (!d.active) { if (o.tap) toggle(); }
    else if ((d.from === 0 ? s.x : 1 - s.x) >= 0.3) setTarget(1 - d.from);
  }
  b.on(el, 'pointerup', () => release(false));
  b.on(el, 'pointercancel', () => release(true));
  b.on(el, 'lostpointercapture', () => { if (s.drag) release(true); });
  b.on(el, 'click', (e) => e.preventDefault());
  b.on(el, 'keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) { s.pressed = true; s.anchor = s.target === 0 ? 1 : -1; } } });
  b.on(el, 'keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (s.pressed) { s.pressed = false; toggle(); } } });
  b.on(el, 'blur', () => { if (s.pressed && !s.drag) s.pressed = false; });
  const onResize = () => measure(); window.addEventListener('resize', onResize);

  render(!reduce);
  const stop = addLoop(step);
  return {
    set(on) { const t = on ? 1 : 0; if (t !== s.target) setTarget(t, true); },
    destroy() { stop(); b.off(); window.removeEventListener('resize', onResize); },
  };
}

/* =========================================================
   Aluminium toggle — material study 02
   ========================================================= */
export function aluToggle(el, opts) {
  const o = Object.assign({ depth: 2.5, snap: 0.12, detent: 2.4, tap: true, onChange: null }, opts);
  const knob = el.querySelector('.hk-knob'), sh = el.querySelector('.hk-sh');
  const on0 = el.getAttribute('aria-checked') === 'true';
  const s = { x: on0 ? 1 : 0, on: on0, p: 0, pressed: false, anim: null, drag: null };
  const PAD = 8, KW = 72; let T = 96;
  function measure() { T = el.clientWidth - 2 * PAD - KW; }
  measure();
  el.classList.toggle('is-on', on0);

  function contact(on) { s.on = on; el.classList.toggle('is-on', on); Snd.play('snap'); }
  function run(to, kind, done) {
    const dist = Math.abs(to - s.x);
    if (dist < 1e-4) { s.x = to; if (done) done(); return; }
    const dur = kind === 'snap' ? o.snap * (0.35 + 0.65 * dist) : 0.09 * dist + 0.03;
    s.anim = { x0: s.x, x1: to, t: 0, dur, kind, done };
  }
  function commit(silent) {
    const to = s.on ? 0 : 1;
    el.setAttribute('aria-checked', String(to === 1));
    run(to, 'snap', () => contact(to === 1));
    if (!silent && o.onChange) o.onChange(to === 1);
    return to === 1;
  }
  function step(dt) {
    const target = s.pressed ? 1 : 0, rate = dt / 0.05;
    s.p = s.p < target ? Math.min(target, s.p + rate) : Math.max(target, s.p - rate);
    const a = s.anim;
    if (a) {
      a.t += dt; const u = Math.min(a.t / a.dur, 1);
      const e = a.kind === 'snap' ? (reduce ? 1 - Math.pow(1 - u, 2) : Math.pow(u, o.detent)) : 1 - Math.pow(1 - u, 2);
      s.x = a.x0 + (a.x1 - a.x0) * e;
      if (u >= 1) { s.x = a.x1; s.anim = null; if (a.done) a.done(); }
    }
    render();
  }
  function render() {
    const pos = s.x * T, dep = o.depth * s.p;
    knob.style.transform = `translate3d(${pos.toFixed(2)}px,${(dep * 0.3).toFixed(2)}px,0) scale(${(1 - dep * 0.012).toFixed(4)})`;
    knob.style.filter = dep > 0 ? `brightness(${(1 - dep * 0.025).toFixed(3)})` : '';
    sh.style.transform = `translate3d(${pos.toFixed(2)}px,0,0) scale(${(1 - dep * 0.05).toFixed(3)},${(1 - 0.14 * dep).toFixed(3)})`;
  }

  const b = binder();
  b.on(el, 'pointerdown', (e) => {
    if (e.button !== 0) return;
    el.setPointerCapture(e.pointerId); el.focus({ preventScroll: true }); measure();
    s.pressed = true; Snd.play('press');
    s.drag = { x0: e.clientX, from: s.on ? 1 : 0, startX: s.x, active: false, committed: false };
  });
  b.on(el, 'pointermove', (e) => {
    const d = s.drag; if (!d || !s.pressed || d.committed || s.anim) return;
    const dx = e.clientX - d.x0;
    if (!d.active && Math.abs(dx) > 4) d.active = true;
    if (!d.active) return;
    const nx = Math.min(1, Math.max(0, d.startX + (dx / T) * 0.6));
    s.x = nx;
    if ((d.from === 0 ? nx : 1 - nx) >= 0.5) { d.committed = true; commit(); }
  });
  function release(cancel) {
    const d = s.drag; if (!d) return;
    s.pressed = false; s.drag = null;
    if (d.committed) return;
    if (cancel) { run(d.from, 'back'); return; }
    if (!d.active) { if (o.tap) commit(); }
    else run(d.from, 'back', () => Snd.play('back'));
  }
  b.on(el, 'pointerup', () => release(false));
  b.on(el, 'pointercancel', () => release(true));
  b.on(el, 'lostpointercapture', () => { if (s.drag) release(true); });
  b.on(el, 'click', (e) => e.preventDefault());
  b.on(el, 'keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat && !s.pressed) { s.pressed = true; Snd.play('press'); } } });
  b.on(el, 'keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (s.pressed && !s.drag) { s.pressed = false; commit(); } } });
  b.on(el, 'blur', () => { if (s.pressed && !s.drag) s.pressed = false; });
  const onResize = () => measure(); window.addEventListener('resize', onResize);

  render();
  const stop = addLoop(step);
  return {
    set(on) { if (on !== s.on && !s.anim) commit(true); },
    destroy() { stop(); b.off(); window.removeEventListener('resize', onResize); },
  };
}

/* =========================================================
   Submit button — material study 03
   ========================================================= */
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const LBL = { save: { idle: 'Save changes', waiting: 'Saving', ok: `${CHECK}Saved`, err: 'Try again' }, pay: { idle: 'Pay $48.00', waiting: 'Paying', ok: `${CHECK}Paid`, err: 'Try again' } };
export function submitHTML(m, set = 'save') {
  const L = LBL[set];
  const lbls = `<span class="lbls"><span data-s="idle" class="on">${L.idle}</span><span data-s="waiting">${L.waiting}</span><span data-s="ok">${L.ok}</span><span data-s="err">${L.err}</span></span>`;
  if (m === 'clay') return `<button type="button" class="cb" data-phase="idle">${lbls}</button>`;
  return `<button type="button" class="ab" data-phase="idle"><span class="ab-led"></span><span class="ab-chrome"></span><span class="ab-face">${lbls}</span></button>`;
}
function setLabel(el, phase) {
  const k = phase === 'pending' ? 'idle' : phase;
  el.querySelectorAll('.lbls>span').forEach((x) => x.classList.toggle('on', x.dataset.s === k));
}
export function submitButton(el, m, opts) {
  const o = Object.assign({ delay: 150, min: 400, server: 900, outcome: 'ok', msg: null }, opts);
  let view;
  if (m === 'clay') {
    const s = { sx: 1, sy: 1, y: 0, vx: 0, vy: 0, vyy: 0, pressed: false, phase: 'idle', sag: 0, t: 0 };
    view = {
      phase(p) { s.phase = p; el.dataset.phase = p; setLabel(el, p); if (reduce) return; if (p === 'ok') { s.vx += 2.4; s.vy += 2.6; } if (p === 'err') s.sag = 0.26; },
      press(v) { s.pressed = v; el.classList.toggle('down', v); },
      frame(dt) {
        s.t += dt; let tx = 1, ty = 1, tyy = 0;
        if (s.pressed) { tx = 1.05; ty = 0.9; tyy = 2; }
        if (s.sag > 0) { s.sag -= dt; tx = 1.07; ty = 0.86; tyy = 3; }
        if (s.phase === 'waiting' && !s.pressed && !reduce) { const bb = 0.024 * Math.sin(s.t * 2 * Math.PI / 1.4); tx += bb; ty += bb; }
        if (reduce) { s.sx = tx; s.sy = ty; s.y = tyy; } else {
          const k = 300, c = 2 * 0.32 * Math.sqrt(k);
          for (let i = 0; i < 3; i++) { const h = dt / 3;
            s.vx += (k * (tx - s.sx) - c * s.vx) * h; s.sx += s.vx * h;
            s.vy += (k * (ty - s.sy) - c * s.vy) * h; s.sy += s.vy * h;
            s.vyy += (k * (tyy - s.y) - c * s.vyy) * h; s.y += s.vyy * h; }
        }
        el.style.transform = `translate3d(0,${s.y.toFixed(2)}px,0) scale(${s.sx.toFixed(4)},${s.sy.toFixed(4)})`;
      },
    };
  } else {
    const s = { a: 0, phase: 'idle', pressed: false };
    view = {
      phase(p) {
        s.phase = p; el.dataset.phase = p; setLabel(el, p);
        if (p === 'ok') Snd.play('ok');
        if (p === 'err') { Snd.play('err'); const led = el.querySelector('.ab-led'); led.style.animation = 'none'; void led.offsetWidth; led.style.animation = ''; }
      },
      press(v) { if (v === s.pressed) return; s.pressed = v; el.classList.toggle('down', v); Snd.play(v ? 'down' : 'up'); },
      frame(dt) { if (s.phase === 'waiting') { s.a = (s.a + dt * (reduce ? 120 : 330)) % 360; el.style.setProperty('--a', s.a.toFixed(1) + 'deg'); } },
    };
  }
  // controller: the shared rules
  let phase = 'idle', token = 0, shownAt = 0;
  const timers = [];
  const later = (f, ms) => timers.push(setTimeout(f, ms));
  function set(p) { phase = p; view.phase(p); }
  function start() {
    if (phase === 'pending' || phase === 'waiting') return;
    const my = ++token;
    if (o.msg) o.msg.textContent = '';
    set('pending');
    later(() => { if (my === token && phase === 'pending') { set('waiting'); shownAt = performance.now(); announce('Saving'); } }, o.delay);
    later(() => {
      if (my !== token) return;
      const finish = () => {
        if (my !== token) return;
        const ok = o.outcome === 'ok';
        set(ok ? 'ok' : 'err');
        announce(ok ? 'Saved' : 'Couldn’t save. Check your connection and try again.');
        if (!ok && o.msg) o.msg.textContent = 'Couldn’t save. The connection dropped, but your changes are still here.';
        if (ok) later(() => { if (my === token && phase === 'ok') set('idle'); }, 2000);
      };
      if (phase === 'waiting') { const left = o.min - (performance.now() - shownAt); if (left > 0) later(finish, left); else finish(); } else finish();
    }, o.server);
  }
  const b = binder();
  b.on(el, 'pointerdown', (e) => { if (e.button === 0) view.press(true); });
  const up = () => view.press(false);
  b.on(el, 'pointerup', up); b.on(el, 'pointerleave', up); b.on(el, 'pointercancel', up);
  b.on(el, 'keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) view.press(true); });
  b.on(el, 'keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') view.press(false); });
  b.on(el, 'click', () => start());
  const stop = addLoop((dt) => view.frame(dt));
  return { o, destroy() { stop(); b.off(); timers.forEach(clearTimeout); } };
}

/* =========================================================
   Stepper — material study 04
   ========================================================= */
const MINUS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5.5 12h13"/></svg>';
const PLUS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5.5v13M5.5 12h13"/></svg>';
export function stepperHTML(m, o) {
  const sb = `role="spinbutton" tabindex="0" aria-label="${o.label}" aria-valuemin="${o.min}" aria-valuemax="${o.max}" aria-valuenow="${o.value}"`;
  if (m === 'clay') return `<div class="sc" role="group" aria-label="${o.label}"><button type="button" class="k" data-k="minus" aria-label="Decrease">${MINUS}</button><div class="val" ${sb}><span class="num">${o.value}</span></div><button type="button" class="k" data-k="plus" aria-label="Increase">${PLUS}</button></div>`;
  const n = String(o.max).length;
  let drums = '';
  for (let i = 0; i < n; i++) drums += `<span class="drum"><span class="reel">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<span>${d}</span>`).join('')}</span></span>`;
  return `<div class="sa" role="group" aria-label="${o.label}"><button type="button" class="k" data-k="minus" aria-label="Decrease"><span class="face">${MINUS}</span></button><div class="val" ${sb}>${drums}</div><button type="button" class="k" data-k="plus" aria-label="Increase"><span class="face">${PLUS}</span></button></div>`;
}
export function stepper(root, m, opts) {
  const o = Object.assign({ delay: 400, startI: 170, minI: 40, ramp: 2.2, value: 3, min: 0, max: 20, label: 'Quantity' }, opts);
  const timers = [];
  let view;
  if (m === 'clay') {
    const num = root.querySelector('.num');
    const keys = {}; root.querySelectorAll('.k').forEach((k) => { keys[k.dataset.k] = { el: k, sx: 1, sy: 1, vx: 0, vy: 0, pressed: false, lim: 0 }; });
    const s = { sc: 1, vsc: 0, ox: 0, vox: 0 };
    view = {
      value(val, dir) { num.textContent = val; if (!reduce) s.vsc += dir * 5.5; },
      press(which, v) { const k = keys[which]; k.pressed = v; k.el.classList.toggle('down', v); },
      limit(which) { if (reduce) return; s.vox += (which === 'plus' ? 1 : -1) * 150; keys[which].lim = 0.16; },
      tick() {},
      limits(atMin, atMax) { keys.minus.el.classList.toggle('at-limit', atMin); keys.plus.el.classList.toggle('at-limit', atMax); },
      frame(dt) {
        if (reduce) { num.style.transform = ''; return; }
        const k = 420, c = 2 * 0.28 * Math.sqrt(k);
        for (let i = 0; i < 3; i++) { const h = dt / 3;
          s.vsc += (k * (1 - s.sc) - c * s.vsc) * h; s.sc += s.vsc * h;
          s.vox += (k * (0 - s.ox) - c * s.vox) * h; s.ox += s.vox * h; }
        num.style.transform = `translate3d(${s.ox.toFixed(2)}px,0,0) scale(${s.sc.toFixed(4)})`;
        Object.values(keys).forEach((kk) => {
          let tx = 1, ty = 1;
          if (kk.lim > 0) { kk.lim -= dt; tx = 1.2; ty = 0.76; } else if (kk.pressed) { tx = 1.08; ty = 0.88; }
          const k2 = 380, c2 = 2 * 0.3 * Math.sqrt(k2);
          for (let i = 0; i < 3; i++) { const h = dt / 3;
            kk.vx += (k2 * (tx - kk.sx) - c2 * kk.vx) * h; kk.sx += kk.vx * h;
            kk.vy += (k2 * (ty - kk.sy) - c2 * kk.vy) * h; kk.sy += kk.vy * h; }
          kk.el.style.transform = `scale(${kk.sx.toFixed(4)},${kk.sy.toFixed(4)})`;
        });
      },
    };
  } else {
    const n = String(o.max).length, H = 54;
    const cols = Array.from(root.querySelectorAll('.drum')).map((d) => ({ drum: d, strip: d.querySelector('.reel'), pos: 0, timer: null }));
    const keys = {}; root.querySelectorAll('.k').forEach((k) => { keys[k.dataset.k] = { el: k, down: false }; });
    const place = (col, p, ms) => { col.strip.style.transitionDuration = ms + 'ms'; col.strip.style.transform = `translate3d(0,${-p * H}px,0)`; col.pos = p; };
    const digits = (val) => String(val).padStart(n, '0').split('').map(Number);
    const lead = (val) => { const len = String(val).length; cols.forEach((c, i) => c.drum.classList.toggle('lead', i < n - len)); };
    view = {
      init(val) { digits(val).forEach((d, i) => place(cols[i], d, 0)); lead(val); },
      value(val, dir, interval) {
        const ds = digits(val);
        let ms = Math.min(110, (interval || 110) * 0.8); if (reduce) ms = 0;
        ds.forEach((t, i) => {
          const col = cols[i];
          if (col.timer) { clearTimeout(col.timer); col.timer = null; if (col.pos === 10) place(col, 0, 0); }
          const c = col.pos; if (t === c) return;
          if (dir > 0 && c === 9 && t === 0) { place(col, 10, ms); col.timer = setTimeout(() => { place(col, 0, 0); col.timer = null; }, ms + 20); timers.push(col.timer); }
          else if (dir < 0 && c === 0 && t === 9) { place(col, 10, 0); void col.strip.offsetHeight; place(col, 9, ms); }
          else place(col, t, ms);
        });
        lead(val);
      },
      press(which, v, atLimit) {
        const k = keys[which];
        if (v) { if (atLimit) return; k.down = true; k.el.classList.add('down'); Snd.play('down'); }
        else if (k.down) { k.down = false; k.el.classList.remove('down'); Snd.play('up'); }
      },
      limit() { Snd.play('thunk'); },
      tick() { Snd.play('tick'); },
      limits(atMin, atMax) { keys.minus.el.classList.toggle('at-limit', atMin); keys.plus.el.classList.toggle('at-limit', atMax); },
      frame() {},
    };
    view.init(o.value);
  }
  // controller
  const spin = root.querySelector('[role="spinbutton"]');
  let v = o.value, hold = null;
  view.limits(v <= o.min, v >= o.max);
  function set(nv, dir, interval) { v = nv; spin.setAttribute('aria-valuenow', v); view.value(v, dir, interval); view.limits(v <= o.min, v >= o.max); if (o.onChange) o.onChange(v); }
  function stepBy(d, repeat, interval) {
    const nv = Math.min(o.max, Math.max(o.min, v + d));
    if (nv === v) { view.limit(d > 0 ? 'plus' : 'minus'); announce(d > 0 ? `Maximum, ${o.max}` : `Minimum, ${o.min}`); return false; }
    set(nv, Math.sign(d), interval); if (repeat) view.tick(); return true;
  }
  function begin(which, shift) {
    const d = (which === 'plus' ? 1 : -1) * (shift ? 10 : 1);
    const atLimit = which === 'plus' ? v >= o.max : v <= o.min;
    view.press(which, true, atLimit);
    hold = { which, d, t0: performance.now(), timer: null };
    if (stepBy(d, false)) hold.timer = setTimeout(rep, o.delay);
  }
  function rep() {
    if (!hold) return;
    const t = Math.max(0, (performance.now() - hold.t0 - o.delay) / 1000);
    const u = Math.min(t / o.ramp, 1), e = u * u * (3 - 2 * u);
    const iv = o.startI + (o.minI - o.startI) * e;
    if (stepBy(hold.d, true, iv)) hold.timer = setTimeout(rep, iv);
  }
  function end() { if (!hold) return; clearTimeout(hold.timer); view.press(hold.which, false); hold = null; announce(`${o.label} ${v}`); }
  const b = binder();
  root.querySelectorAll('button[data-k]').forEach((btn) => {
    const which = btn.dataset.k;
    b.on(btn, 'pointerdown', (e) => { if (e.button !== 0) return; e.preventDefault(); btn.setPointerCapture(e.pointerId); btn.focus({ preventScroll: true }); begin(which, e.shiftKey); });
    b.on(btn, 'pointerup', end); b.on(btn, 'pointercancel', end); b.on(btn, 'lostpointercapture', end);
    b.on(btn, 'click', (e) => e.preventDefault());
    b.on(btn, 'keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat && !hold) begin(which, e.shiftKey); } });
    b.on(btn, 'keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); end(); } });
    b.on(btn, 'blur', end);
  });
  b.on(spin, 'keydown', (e) => {
    let d = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') d = 1;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') d = -1;
    else if (e.key === 'PageUp') d = 10;
    else if (e.key === 'PageDown') d = -10;
    else if (e.key === 'Home') d = o.min - v;
    else if (e.key === 'End') d = o.max - v;
    else return;
    e.preventDefault();
    if (d === 0) { stepBy(e.key === 'Home' ? -1 : 1, false); return; }
    const which = d > 0 ? 'plus' : 'minus';
    view.press(which, true, false); stepBy(d, e.repeat, e.repeat ? 60 : 110);
    setTimeout(() => view.press(which, false), 90);
  });
  const stop = addLoop((dt) => view.frame(dt));
  return { destroy() { stop(); b.off(); if (hold) clearTimeout(hold.timer); timers.forEach(clearTimeout); } };
}

/* =========================================================
   Rotary switch — material study 07
   ========================================================= */
export function rotaryHTML(m, label, on) {
  return `<button type="button" class="rs ${m === 'alu' ? 'alu' : 'plastic'}${on ? ' is-on' : ''}" role="switch" aria-checked="${!!on}" aria-label="${label}"><span class="rs-well"></span><span class="rs-shadow"></span><span class="rs-knob"><span class="rs-turnwrap"><span class="rs-turn"><span class="rs-bar"></span><span class="rs-line"></span></span></span></span></button>`;
}
export function rotary(el, m, opts) {
  const o = Object.assign({ onChange: null }, opts);
  const hard = m === 'alu';
  const turn = el.querySelector('.rs-turn'), bar = el.querySelector('.rs-bar');
  const on0 = el.getAttribute('aria-checked') === 'true';
  const s = { a: on0 ? 180 : 0, on: on0, anim: null, drag: null };
  function render() {
    turn.style.transform = `rotate(${s.a.toFixed(2)}deg)`;
    const r = s.a * Math.PI / 180, f = 0.7071 * (Math.cos(r) - Math.sin(r));
    const edge = (v) => (v >= 0 ? `rgba(255,255,255,${(0.35 + 0.6 * v).toFixed(3)})` : `rgba(0,0,0,${(0.12 + 0.3 * -v).toFixed(3)})`);
    bar.style.setProperty('--e1', edge(f)); bar.style.setProperty('--e2', edge(-f));
  }
  function contact(on) { s.on = on; el.classList.toggle('is-on', on); Snd.play(hard ? 'rot-alu' : 'plastic'); }
  function run(to, kind, done) {
    const dist = Math.abs(to - s.a) / 180;
    if (dist < 0.001) { s.a = to; render(); if (done) done(); return; }
    const base = kind === 'back' ? 0.14 : hard ? 0.16 : 0.26;
    s.anim = { a0: s.a, a1: to, t: 0, dur: base * (0.4 + 0.6 * dist), kind, done };
  }
  function commit() {
    const to = s.on ? 0 : 180, on = !s.on;
    el.setAttribute('aria-checked', String(on));
    announce(on ? 'On' : 'Off');
    run(to, 'turn', () => contact(on));
    if (o.onChange) o.onChange(on);
    return on;
  }
  function step(dt) {
    const a = s.anim; if (!a) return;
    a.t += dt; const u = Math.min(a.t / a.dur, 1);
    let e;
    if (reduce) e = u;
    else if (a.kind === 'back') e = 1 - Math.pow(1 - u, 2);
    else if (hard) e = Math.pow(u, 2.4);
    else e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    s.a = a.a0 + (a.a1 - a.a0) * e; render();
    if (u >= 1) { s.a = a.a1; s.anim = null; render(); if (a.done) a.done(); }
  }
  const angleAt = (e) => { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  const b = binder();
  b.on(el, 'pointerdown', (e) => {
    if (e.button !== 0 || s.anim) return;
    el.setPointerCapture(e.pointerId); el.focus({ preventScroll: true });
    s.drag = { prev: angleAt(e), acc: 0, start: s.a, from: s.on, active: false, committed: false };
  });
  b.on(el, 'pointermove', (e) => {
    const d = s.drag; if (!d || d.committed) return;
    const a = angleAt(e); let diff = a - d.prev; if (diff > 180) diff -= 360; if (diff < -180) diff += 360; d.prev = a; d.acc += diff;
    if (!d.active && Math.abs(d.acc) > 6) d.active = true;
    if (!d.active) return;
    s.a = Math.min(180, Math.max(0, d.start + d.acc * (hard ? 0.7 : 1))); render();
    const travelled = d.from ? 180 - s.a : s.a;
    if (hard && travelled >= 90) { d.committed = true; commit(); }
  });
  function release(cancel) {
    const d = s.drag; if (!d) return; s.drag = null;
    if (d.committed) return;
    if (!d.active) { if (!cancel) commit(); return; }
    const travelled = d.from ? 180 - s.a : s.a;
    if (!cancel && travelled >= 90) commit();
    else run(d.from ? 180 : 0, 'back', () => Snd.play('rot-back'));
  }
  b.on(el, 'pointerup', () => release(false));
  b.on(el, 'pointercancel', () => release(true));
  b.on(el, 'lostpointercapture', () => { if (s.drag) release(true); });
  b.on(el, 'click', (e) => e.preventDefault());
  b.on(el, 'keydown', (e) => {
    if (s.anim) { if ([' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault(); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); if (!s.on) commit(); else announce('Already on'); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); if (s.on) commit(); else announce('Already off'); }
  });
  render();
  const stop = addLoop(step);
  return { destroy() { stop(); b.off(); } };
}

/* =========================================================
   Date range picker — material study 05
   ========================================================= */
const D = (y, m, d) => new Date(y, m, d);
const key = (d) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const som = (d) => D(d.getFullYear(), d.getMonth(), 1);
const addM = (d, n) => D(d.getFullYear(), d.getMonth() + n, 1);
const addD = (d, n) => D(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dim = (d) => D(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const MS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WF = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmt = (d) => `${MS[d.getMonth()]} ${d.getDate()}`;
const full = (d) => `${WF[d.getDay()]}, ${MF[d.getMonth()]} ${d.getDate()}`;
const spanDays = (a, b) => Math.round((b - a) / 864e5) + 1;
const fromKey = (k) => new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100);
const LEFT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const RIGHT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

export function calendar(host, m, opts) {
  const _n = new Date(), TODAY = D(_n.getFullYear(), _n.getMonth(), _n.getDate());
  const o = Object.assign({ start: null, end: null }, opts);
  const st = { s: o.start, e: o.end, h: null, view: som(o.start || TODAY), focus: o.start || TODAY, ef: 0, efv: 0, efTarget: 0, efShown: false, ox: 0, oxv: 0 };
  const say = (t) => announce(t);
  const el = document.createElement('div');
  el.className = `cal ${m}`;
  const navInner = (svg) => (m === 'alu' ? `<span class="face">${svg}</span>` : svg);
  const titleHTML = m === 'alu'
    ? `<span class="mdrum"><span class="mwin"><span class="mreel">${MS.concat(['Jan']).map((x) => `<span>${x}</span>`).join('')}</span></span><span class="myear"></span></span>`
    : '<span class="title"></span>';
  el.innerHTML = `<div class="cal-head"><button type="button" class="nav prev" aria-label="Previous month">${navInner(LEFT)}</button>${titleHTML}<button type="button" class="nav next" aria-label="Next month">${navInner(RIGHT)}</button></div>
    <div class="cal-wd" aria-hidden="true">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x) => `<span>${x}</span>`).join('')}</div>
    <div class="cal-wrap"><div class="cal-move">${m === 'clay' ? '<div class="band"></div>' : ''}<div class="cal-grid" role="group" aria-label="Choose dates"></div></div></div>
    <div class="cal-sum"><span class="sumt"></span><button type="button" class="clear">Clear</button></div>`;
  host.appendChild(el);
  const grid = el.querySelector('.cal-grid'), move = el.querySelector('.cal-move'), band = el.querySelector('.band'), sum = el.querySelector('.sumt');
  const title = el.querySelector('.title'), reel = el.querySelector('.mreel'), year = el.querySelector('.myear');
  let cells = [], off = 0, reelPos = st.view.getMonth(), reelTimer = null;

  function render() {
    off = st.view.getDay(); const n = dim(st.view);
    let h = '';
    for (let i = 0; i < off; i++) h += '<span></span>';
    for (let d = 1; d <= n; d++) {
      const dt = D(st.view.getFullYear(), st.view.getMonth(), d);
      const inner = m === 'clay' ? `<span class="tile">${d}</span>` : `<span class="key">${d}</span>`;
      h += `<button type="button" class="day" data-k="${key(dt)}">${inner}</button>`;
    }
    grid.innerHTML = h;
    cells = Array.from(grid.querySelectorAll('.day'));
    if (title) title.textContent = `${MF[st.view.getMonth()]} ${st.view.getFullYear()}`;
    if (year) year.textContent = st.view.getFullYear();
    paint(true);
  }
  const idxOf = (d) => off + d.getDate() - 1;
  function visIdx(d, edge) {
    const a = key(som(st.view)), b2 = key(D(st.view.getFullYear(), st.view.getMonth() + 1, 0));
    if (key(d) < a) return edge === 'end' ? -1 : off;
    if (key(d) > b2) return edge === 'start' ? 999 : off + dim(st.view) - 1;
    return idxOf(d);
  }
  function paint(snap, cascade) {
    const s = st.s, e = st.e;
    let hi = e, pv = false;
    if (s && !e && st.h && key(st.h) > key(s)) { hi = st.h; pv = true; }
    const ks = s ? key(s) : 0, kh = hi ? key(hi) : 0;
    let litIndex = 0;
    cells.forEach((c) => {
      const k = +c.dataset.k, d = fromKey(k);
      const inR = s && hi && k > ks && k < kh;
      c.classList.toggle('s', !!s && k === ks);
      c.classList.toggle('e', !!e && k === key(e));
      c.classList.toggle('in', !!inR && !pv);
      c.classList.toggle('pv', !!inR && pv);
      c.classList.toggle('today', k === key(TODAY));
      if (m === 'alu') {
        const lit = !!inR && !pv;
        c.firstElementChild.style.transitionDelay = (lit && cascade) ? `${(litIndex++) * 8}ms` : '0ms';
        c.classList.toggle('lit', lit);
      }
      c.tabIndex = key(d) === key(st.focus) ? 0 : -1;
      let lab = `${full(d)}, ${d.getFullYear()}`;
      if (s && k === ks) lab += ', start date'; else if (e && k === key(e)) lab += ', end date'; else if (inR && !pv) lab += ', in range';
      c.setAttribute('aria-label', lab);
      c.setAttribute('aria-pressed', String(!!s && (k === ks || (e && k === key(e)))));
    });
    if (!cells.some((c) => c.tabIndex === 0) && cells[0]) cells[0].tabIndex = 0;
    if (s && e) sum.innerHTML = `<b>${fmt(s)} – ${fmt(e)}</b> <span class="muted">· ${spanDays(s, e)} days</span>`;
    else if (s) sum.innerHTML = `<b>${fmt(s)} –</b> <span class="muted">choose an end date</span>`;
    else sum.innerHTML = '<span class="muted">Choose a start date</span>';
    if (band) {
      band.classList.toggle('preview', pv);
      if (s && hi && key(hi) > key(s)) {
        const si = visIdx(s, 'start'), ei = visIdx(hi, 'end');
        if (si > ei || si === 999 || ei === -1) st.efShown = false;
        else {
          if (!st.efShown) { st.ef = snap ? ei : si; st.efv = 0; } else if (snap) { st.ef = ei; st.efv = 0; }
          st.si = si; st.efTarget = ei; st.efShown = true;
        }
      } else st.efShown = false;
      drawBand();
    }
  }
  const cw = () => (cells[0] ? cells[0].offsetWidth : 48);
  const pool = [];
  function drawBand(vel) {
    if (!band) return;
    const segs = [];
    if (st.efShown) {
      const si = st.si, ef = Math.max(st.ef, si), w = cw();
      const thin = Math.min(Math.abs(vel || 0) * 0.012, 0.3);
      for (let r = Math.floor(si / 7); r <= Math.floor(ef / 7); r++) {
        const a = Math.max(si, r * 7), b2 = Math.min(ef, r * 7 + 6);
        if (b2 < a) continue;
        const x0 = (a - r * 7) * w + 3, x1 = (b2 - r * 7 + 1) * w - 3;
        const hBase = w - 12, hh = hBase * (1 - thin);
        segs.push([x0, r * w + 6 + (hBase - hh) / 2, Math.max(x1 - x0, w - 6), hh]);
      }
    }
    while (pool.length < segs.length) { const i = document.createElement('i'); band.appendChild(i); pool.push(i); }
    pool.forEach((i, n) => {
      const sg = segs[n];
      if (!sg) { i.style.display = 'none'; return; }
      i.style.display = 'block'; i.style.left = sg[0] + 'px'; i.style.top = sg[1] + 'px'; i.style.width = sg[2] + 'px'; i.style.height = sg[3] + 'px';
    });
  }
  function frame(dt) {
    if (m !== 'clay') return;
    if (st.efShown) {
      if (reduce) { st.ef = st.efTarget; st.efv = 0; } else {
        const k = 240, c = 2 * 0.5 * Math.sqrt(k);
        for (let i = 0; i < 3; i++) { const h = dt / 3; st.efv += (k * (st.efTarget - st.ef) - c * st.efv) * h; st.ef += st.efv * h; }
        if (Math.abs(st.efTarget - st.ef) < 0.002 && Math.abs(st.efv) < 0.01) { st.ef = st.efTarget; st.efv = 0; }
      }
      drawBand(st.efv);
    }
    if (st.ox !== 0 || st.oxv !== 0) {
      const k = 320, c = 2 * 0.42 * Math.sqrt(k);
      for (let i = 0; i < 3; i++) { const h = dt / 3; st.oxv += (k * (0 - st.ox) - c * st.oxv) * h; st.ox += st.oxv * h; }
      if (Math.abs(st.ox) < 0.05 && Math.abs(st.oxv) < 0.05) { st.ox = 0; st.oxv = 0; }
      move.style.transform = `translate3d(${st.ox.toFixed(2)}px,0,0)`;
      move.style.opacity = String(Math.max(0.35, 1 - Math.abs(st.ox) / 90));
    }
  }
  function placeReel(p, ms) { reel.style.transitionDuration = ms + 'ms'; reel.style.transform = `translate3d(0,${-p * 30}px,0)`; reelPos = p; }
  function go(dir) {
    const from = st.view.getMonth();
    st.view = addM(st.view, dir);
    if (m === 'clay' && !reduce) { st.ox = dir * 70; st.oxv = 0; }
    if (m === 'alu') {
      const to = st.view.getMonth(); const ms = reduce ? 0 : 130;
      if (reelTimer) { clearTimeout(reelTimer); reelTimer = null; if (reelPos === 12) placeReel(0, 0); }
      if (dir > 0 && from === 11) { placeReel(12, ms); reelTimer = setTimeout(() => { placeReel(0, 0); reelTimer = null; }, ms + 20); }
      else if (dir < 0 && from === 0) { placeReel(12, 0); void reel.offsetHeight; placeReel(11, ms); }
      else placeReel(to, ms);
      Snd.play('cal-tick');
    }
    render();
    say(`${MF[st.view.getMonth()]} ${st.view.getFullYear()}`);
  }
  function choose(d) {
    st.focus = d;
    const hadS = st.s;
    if (!st.s || st.e) {
      if (m === 'alu' && hadS) Snd.play('pop');
      st.s = d; st.e = null; st.h = null;
      if (m === 'alu') Snd.play('latch');
      say(`Start date, ${full(d)}. Now choose an end date.`); paint();
    } else if (key(d) < key(st.s)) {
      if (m === 'alu') { Snd.play('pop'); Snd.play('latch'); }
      st.s = d; st.h = null;
      say(`Start date moved to ${full(d)}. Now choose an end date.`); paint();
    } else {
      st.e = d; st.h = null;
      if (m === 'alu') { Snd.play('latch'); Snd.play('relay', spanDays(st.s, d) - 2); }
      say(`Selected ${fmt(st.s)} to ${fmt(d)}, ${spanDays(st.s, d)} days.`); paint(false, true);
    }
  }
  function clear() { if (m === 'alu' && st.s) Snd.play('pop'); st.s = st.e = st.h = null; paint(); say('Selection cleared. Choose a start date.'); }
  function moveFocus(d) {
    st.focus = d;
    if (d.getMonth() !== st.view.getMonth() || d.getFullYear() !== st.view.getFullYear()) go(key(d) > key(st.view) ? 1 : -1);
    if (st.s && !st.e && key(d) > key(st.s)) st.h = d;
    paint();
    const c = cells.find((x) => +x.dataset.k === key(d)); if (c) c.focus();
    let t = full(d); if (st.s && !st.e && key(d) > key(st.s)) t += `, would select ${spanDays(st.s, d)} days`;
    say(t);
  }
  const b = binder();
  b.on(grid, 'click', (e) => { const c = e.target.closest('.day'); if (!c) return; choose(fromKey(+c.dataset.k)); });
  b.on(grid, 'pointerover', (e) => {
    const c = e.target.closest('.day'); if (!c || !st.s || st.e) return;
    const k = +c.dataset.k; if (st.h && key(st.h) === k) return;
    st.h = fromKey(k); paint();
  });
  b.on(grid, 'pointerleave', () => { if (st.h) { st.h = null; paint(); } });
  if (m === 'alu') {
    b.on(grid, 'pointerdown', (e) => { const c = e.target.closest('.day'); if (!c || e.button !== 0) return; c.classList.add('down'); Snd.play('cal-down'); });
    const up = () => { grid.querySelectorAll('.day.down').forEach((c) => { c.classList.remove('down'); if (!c.classList.contains('s') && !c.classList.contains('e')) Snd.play('cal-up'); }); };
    b.on(grid, 'pointerup', () => setTimeout(up, 0)); b.on(grid, 'pointerleave', up);
  }
  b.on(grid, 'keydown', (e) => {
    const f = st.focus; let nd = null;
    const stp = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (stp) nd = addD(f, stp);
    else if (e.key === 'PageUp') { const t = addM(f, -1); nd = D(t.getFullYear(), t.getMonth(), Math.min(f.getDate(), dim(t))); }
    else if (e.key === 'PageDown') { const t = addM(f, 1); nd = D(t.getFullYear(), t.getMonth(), Math.min(f.getDate(), dim(t))); }
    else if (e.key === 'Home') nd = addD(f, -f.getDay());
    else if (e.key === 'End') nd = addD(f, 6 - f.getDay());
    else if (e.key === 'Escape' && st.s && !st.e) { e.preventDefault(); clear(); return; }
    if (nd) { e.preventDefault(); moveFocus(nd); }
  });
  b.on(grid, 'focusin', (e) => { const c = e.target.closest('.day'); if (c) st.focus = fromKey(+c.dataset.k); });
  b.on(el.querySelector('.prev'), 'click', () => go(-1));
  b.on(el.querySelector('.next'), 'click', () => go(1));
  b.on(el.querySelector('.clear'), 'click', clear);
  if (reel) placeReel(st.view.getMonth(), 0);
  render();
  const stop = addLoop(frame);
  return { destroy() { stop(); b.off(); if (reelTimer) clearTimeout(reelTimer); el.remove(); } };
}
