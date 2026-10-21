import { useRef, useState } from 'react';
import '../styles/controls.css';

/* Seat map from the line-weight study:
   'after'  — what you can book is drawn boldest; your seat is the same colour, filled, with a person in it;
              booked seats step back to thin grey outlines.
   'before' — the common pattern: bold empty outlines for booked seats, pale fills for free ones, a third colour for yours.
   Every seat is a focusable button (roving tab index, arrow keys) and announces row, number, price and state. */

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PRICE = { A: 18, B: 18, C: 16, D: 16, E: 14, F: 14 };
export const DEFAULT_BOOKED = ['A3', 'A4', 'B5', 'B6', 'C1', 'C9', 'D4', 'D5', 'D6', 'E2', 'F7', 'F8'];

const Person = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4" fill="currentColor" /><path d="M4 22c.8-5 4-8 8-8s7.2 3 8 8z" fill="currentColor" /></svg>
);

export default function SeatMap({
  variant = 'after', cols = 10, rows = ROWS, booked = DEFAULT_BOOKED, max = 4,
  seatSize = 30, initial = ['C5', 'C6'], onChange, interactive = true, grey = false, label = 'Seat map',
}) {
  const [mine, setMine] = useState(initial);
  const [focus, setFocus] = useState(initial[0] || 'A1');
  const refs = useRef({});
  const aisle = Math.floor(cols / 2);

  const toggle = (id) => {
    if (!interactive || booked.includes(id)) return;
    setMine((m) => {
      let next = m.includes(id) ? m.filter((x) => x !== id) : [...m, id];
      if (next.length > max) next = next.slice(next.length - max);
      onChange && onChange(next);
      return next;
    });
  };
  const moveFocus = (id, dr, dc) => {
    const r = rows.indexOf(id[0]); const c = parseInt(id.slice(1), 10);
    const nr = Math.min(rows.length - 1, Math.max(0, r + dr)); const nc = Math.min(cols, Math.max(1, c + dc));
    const next = rows[nr] + nc; setFocus(next); refs.current[next] && refs.current[next].focus();
  };
  const onKey = (id) => (e) => {
    const k = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (k) { e.preventDefault(); moveFocus(id, k[0], k[1]); }
  };

  const total = mine.reduce((s, id) => s + (PRICE[id[0]] || 0), 0);
  const cls = (id) => {
    const b = booked.includes(id), m = mine.includes(id);
    if (variant === 'before') return b ? 'before-booked' : m ? 'before-mine' : 'before-free';
    return b ? 'booked' : m ? 'mine' : 'free';
  };
  const state = (id) => (booked.includes(id) ? 'booked' : mine.includes(id) ? 'selected' : 'available');

  return (
    <div className={`sm ${grey ? 'grey' : ''}`} style={{ '--seat': seatSize + 'px' }}>
      <div className="sm-screen in-sm" aria-hidden="true" />
      <span className="cap" aria-hidden="true">Screen</span>
      <div className="sm-rows" role="grid" aria-label={label}>
        {rows.map((r) => (
          <div className="sm-row" role="row" key={r}>
            <span className="sm-label" aria-hidden="true">{r}</span>
            {Array.from({ length: cols }, (_, i) => {
              const id = r + (i + 1);
              const st = state(id);
              return (
                <span key={id} role="gridcell" style={{ display: 'contents' }}>
                  {i === aisle && <span className="sm-gap" aria-hidden="true" />}
                  <button type="button" ref={(el) => (refs.current[id] = el)}
                    className={`seat ${cls(id)}`} tabIndex={interactive && focus === id ? 0 : -1}
                    aria-label={`Row ${r}, seat ${i + 1}, $${PRICE[r]}, ${st}`}
                    aria-pressed={st === 'selected'} aria-disabled={st === 'booked'}
                    onClick={() => { setFocus(id); toggle(id); }} onKeyDown={onKey(id)}>
                    {variant === 'after' && st === 'selected' && <Person key={id + 'p'} />}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {variant === 'after' && interactive && (
        <div role="status" className="cap" style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--display)', fontSize: 15, color: 'var(--ink)' }}>
          {mine.length ? `${mine.slice().sort().join(' · ')} · $${total}` : 'No seats selected yet'}
        </div>
      )}
    </div>
  );
}

export function SeatLegend({ variant = 'after' }) {
  const items = variant === 'after'
    ? [['Available', { border: '2.5px solid var(--seat-free)', background: 'color-mix(in srgb, var(--seat-free) 12%, transparent)' }],
       ['Yours', { background: 'var(--seat-free)' }],
       ['Booked', { border: '1px solid var(--ink-3)', opacity: .5 }]]
    : [['Available', { border: '1px solid #9DBFE3', background: '#D6E6F6' }],
       ['Yours', { background: '#E07B39' }],
       ['Booked', { border: '2.5px solid var(--ink)' }]];
  return (
    <div className="sm-legend cap">
      {items.map(([t, s]) => <span key={t}><i style={s} />{t}</span>)}
    </div>
  );
}
