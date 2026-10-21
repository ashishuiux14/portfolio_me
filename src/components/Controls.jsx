import { useEffect, useRef, useState } from 'react';
import '../styles/controls.css';

/* Toggle — role="switch". material: 'clay' | 'alu' */
export function Toggle({ checked, onChange, material = 'clay', label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label}
      className={`tg tg-${material}`} onClick={() => onChange(!checked)}>
      <span className={`knob ${material === 'alu' ? 'brushed' : ''}`} />
    </button>
  );
}

/* Stepper — changes on press, 400 ms before repeating, speeds up while held.
   Keyboard on the value: arrows, PageUp/Down (±10), Home/End. */
export function Stepper({ value, onChange, min = 0, max = 99, material = 'clay', label = 'Quantity' }) {
  const valRef = useRef(value);
  const timer = useRef(null);
  const [fx, setFx] = useState('');
  const [held, setHeld] = useState(null);
  valRef.current = value;

  const step = (d) => {
    const next = Math.min(max, Math.max(min, valRef.current + d));
    if (next === valRef.current) { setFx('shake'); return false; }
    valRef.current = next; onChange(next); setFx('bump'); return true;
  };
  const stop = () => { clearTimeout(timer.current); timer.current = null; setHeld(null); };
  const start = (d) => (e) => {
    e.preventDefault();
    setHeld(d);
    if (!step(d)) return;
    let delay = 400;
    const loop = () => { if (!step(d)) return stop(); delay = Math.max(40, delay * 0.82); timer.current = setTimeout(loop, delay); };
    timer.current = setTimeout(loop, delay);
  };
  useEffect(() => stop, []);
  useEffect(() => { if (fx) { const t = setTimeout(() => setFx(''), 320); return () => clearTimeout(t); } }, [fx, value]);

  const onKey = (e) => {
    const map = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
    if (map[e.key]) { e.preventDefault(); step(e.shiftKey ? map[e.key] * 10 : map[e.key]); }
    if (e.key === 'Home') { e.preventDefault(); onChange(min); }
    if (e.key === 'End') { e.preventDefault(); onChange(max); }
  };
  const pad = (n) => (n < 10 ? '0' + n : String(n));
  return (
    <div className={`stp ${material === 'alu' ? 'stp-alu' : 'in-sm'}`}>
      <button type="button" className={`stp-btn ${held === -1 ? 'held' : ''}`} aria-label={`Decrease ${label.toLowerCase()}`}
        onPointerDown={start(-1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(-1); } }}
        disabled={value <= min}>−</button>
      <span className={`stp-val ${fx}`} role="spinbutton" tabIndex={0} aria-label={label}
        aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} onKeyDown={onKey}>{pad(value)}</span>
      <button type="button" className={`stp-btn ${held === 1 ? 'held' : ''}`} aria-label={`Increase ${label.toLowerCase()}`}
        onPointerDown={start(1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(1); } }}
        disabled={value >= max}>+</button>
    </div>
  );
}

/* Rotary — a two-position switch you turn. Red line left = off, green right = on. */
export function Rotary({ on, onChange, material = 'plastic', size = 96, label = 'Rotary switch' }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label}
      className={`rot rot-${material}`} style={{ width: size, height: size }}
      onClick={() => onChange(!on)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(false); }
      }}>
      <span className="well" />
      <span className={`knob ${material === 'alu' ? 'brushed' : ''}`} style={{ transform: `rotate(${on ? 180 : 0}deg)` }}>
        <span className="bar" /><span className="line" />
      </span>
    </button>
  );
}

/* Submit — take the press, show it's working, say how it went.
   Width never changes; nothing shown for 150 ms; waiting shown ≥ 400 ms; busy ignores presses. */
export function SubmitButton({ material = 'clay', outcome = 'ok', label = 'Save' }) {
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState('');
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const go = () => {
    if (state === 'busy') return;
    setMsg('');
    later(() => { setState('busy'); setMsg('Saving…'); }, 150);
    later(() => {
      setState(outcome);
      setMsg(outcome === 'ok' ? 'Saved' : 'Couldn’t save. You’re offline; try again when you’re back.');
      later(() => setState('idle'), 1800);
    }, 150 + 900);
  };
  const text = state === 'busy' ? 'Saving' : state === 'ok' ? '✓ Saved' : state === 'err' ? 'Not saved' : label;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button type="button" className={`sb sb-${material} ${state}`} onClick={go} aria-busy={state === 'busy'}>{text}</button>
      <span role="status" className="cap" style={{ minHeight: 18, textAlign: 'center', maxWidth: 240, textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--display)', fontSize: 14 }}>{msg}</span>
    </div>
  );
}

/* DateRange — preview after the first click; a click before the start becomes the new start. */
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function DateRange() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [hover, setHover] = useState(null);
  const key = (d) => d.y * 10000 + d.m * 100 + d.d;
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push({ y: view.y, m: view.m, d });

  const pick = (c) => {
    if (!start || end) { setStart(c); setEnd(null); return; }
    if (key(c) < key(start)) { setStart(c); return; }
    setEnd(c);
  };
  const span = start && end ? Math.round((new Date(end.y, end.m, end.d) - new Date(start.y, start.m, start.d)) / 864e5) + 1 : 0;
  const fmt = (c) => `${MONTHS[c.m].slice(0, 3)} ${c.d}`;
  const lo = start ? key(start) : 0;
  const hi = end ? key(end) : hover && start && key(hover) > lo ? key(hover) : 0;
  const move = (dm) => setView((v) => { const d = new Date(v.y, v.m + dm, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  return (
    <div className="dr up">
      <div className="dr-head">
        <button type="button" className="round-btn up-sm press" style={{ border: 0 }} onClick={() => move(-1)} aria-label="Previous month">‹</button>
        <b style={{ fontWeight: 500 }}>{MONTHS[view.m]} {view.y}</b>
        <button type="button" className="round-btn up-sm press" style={{ border: 0 }} onClick={() => move(1)} aria-label="Next month">›</button>
      </div>
      <div className="dr-grid" onMouseLeave={() => setHover(null)}>
        {DOW.map((d) => <span key={d} className="dr-dow">{d}</span>)}
        {cells.map((c, i) => {
          if (!c) return <span key={'e' + i} />;
          const k = key(c);
          const isStart = start && k === lo;
          const isEnd = (end && k === key(end)) || (!end && hi && k === hi);
          const inside = hi && k > lo && k < hi;
          const cls = ['dr-day', isStart && 'start', isEnd && 'end', inside && (end ? 'inrange' : 'preview'),
            (isStart || isEnd) && hi && (end ? 'inrange' : 'preview'),
            c.y === today.getFullYear() && c.m === today.getMonth() && c.d === today.getDate() && 'today'].filter(Boolean).join(' ');
          return (
            <button key={k} type="button" className={cls} onClick={() => pick(c)} onMouseEnter={() => setHover(c)}
              aria-pressed={!!(isStart || isEnd)} aria-label={`${MONTHS[c.m]} ${c.d}, ${c.y}`}>
              <span>{c.d}</span>
            </button>
          );
        })}
      </div>
      <div role="status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 26 }}>
        <span>{start ? (end ? `${fmt(start)} – ${fmt(end)}` : `${fmt(start)} – choose end`) : 'Add dates'}</span>
        <span className="cap">{span ? `${span} days` : ''}</span>
      </div>
    </div>
  );
}
