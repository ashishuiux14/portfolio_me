import { useCallback, useRef, useState } from 'react';
import './crosshair.css';

/* Two canvases with the same three objects. One uses a CAD-style crosshair with
   a pickbox, object snap (endpoint, midpoint, centre, quadrant), tracking lines,
   grid and live coordinates; the other uses a plain arrow, like Figma.
   Objects can be selected, moved, resized and rotated in both. */

export const W = 600, H = 400, GRID = 20;
export const SWATCHES = [
  { name: 'Blue', hex: '#3D8BFF' },
  { name: 'Green', hex: '#3BD16F' },
  { name: 'Red', hex: '#FF5050' },
  { name: 'Magenta', hex: '#FF4FD8' },
];
export const DEFAULTS = { size: 100, pickbox: 5, marker: 14, pickColor: '#3D8BFF', snapColor: '#3BD16F', bg: 'dark', grid: true, snap: true };

export const START = [
  { id: 'card', kind: 'card', name: 'Card', x: 60, y: 60, w: 220, h: 128, r: 0 },
  { id: 'avatar', kind: 'circle', name: 'Avatar', x: 400, y: 60, w: 80, h: 80, r: 0 },
  { id: 'btn', kind: 'button', name: 'Button', x: 327, y: 243, w: 160, h: 48, r: 0 },
];
const MIN = { card: [120, 80], circle: [24, 24], button: [80, 32] };

const rad = (d) => (d * Math.PI) / 180;
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const centre = (e) => [e.x + e.w / 2, e.y + e.h / 2];

// snap points of an object, in canvas coordinates
function pointsOf(e) {
  const [cx, cy] = centre(e); const a = rad(e.r); const hw = e.w / 2, hh = e.h / 2;
  const at = (lx, ly, type) => { const [dx, dy] = rot(lx, ly, a); return { x: cx + dx, y: cy + dy, type }; };
  if (e.kind === 'circle') return [at(0, 0, 'cen'), at(0, -hh, 'quad'), at(hw, 0, 'quad'), at(0, hh, 'quad'), at(-hw, 0, 'quad')];
  return [
    at(-hw, -hh, 'end'), at(hw, -hh, 'end'), at(hw, hh, 'end'), at(-hw, hh, 'end'),
    at(0, -hh, 'mid'), at(hw, 0, 'mid'), at(0, hh, 'mid'), at(-hw, 0, 'mid'), at(0, 0, 'cen'),
  ];
}

/* Find the correction for a set of own points. Priority, like AutoCAD:
   1 land on an object snap point, 2 line up with one (tracking), 3 the grid. */
function nearest(own, targets, limit) {
  let best = null;
  own.forEach((o) => targets.forEach((t) => {
    const d = Math.hypot(t.x - o.x, t.y - o.y);
    if (d <= limit && (!best || d < best.d)) best = { d, dx: t.x - o.x, dy: t.y - o.y, marker: t };
  }));
  return best;
}
function snapTo(own, targets, aperture, grid = [], track = 6) {
  const hit = nearest(own, targets, aperture);
  if (hit) return { dx: hit.dx, dy: hit.dy, marker: hit.marker, lines: [] };
  let bx = null, by = null;
  own.forEach((o) => targets.forEach((t) => {
    const ax = Math.abs(t.x - o.x), ay = Math.abs(t.y - o.y);
    if (ax <= track && (!bx || ax < bx.a)) bx = { a: ax, d: t.x - o.x, t, o };
    if (ay <= track && (!by || ay < by.a)) by = { a: ay, d: t.y - o.y, t, o };
  }));
  if (bx || by) {
    const lines = [];
    if (bx) lines.push({ x1: bx.t.x, y1: bx.t.y, x2: bx.t.x, y2: bx.o.y + (by ? by.d : 0) });
    if (by) lines.push({ x1: by.t.x, y1: by.t.y, x2: by.o.x + (bx ? bx.d : 0), y2: by.t.y });
    return { dx: bx ? bx.d : 0, dy: by ? by.d : 0, marker: null, lines };
  }
  const g = nearest(own, grid, aperture);
  if (g) return { dx: g.dx, dy: g.dy, marker: g.marker, lines: [] };
  return { dx: 0, dy: 0, marker: null, lines: [] };
}

function gridNear(pts) {
  return pts.map((p) => ({ x: Math.round(p.x / GRID) * GRID, y: Math.round(p.y / GRID) * GRID, type: 'grid' }));
}

function hitTest(els, x, y, pad) {
  for (let i = els.length - 1; i >= 0; i--) {
    const e = els[i]; const [cx, cy] = centre(e);
    const [lx, ly] = rot(x - cx, y - cy, -rad(e.r));
    if (e.kind === 'circle') {
      const rx = e.w / 2 + pad, ry = e.h / 2 + pad;
      if ((lx * lx) / (rx * rx) + (ly * ly) / (ry * ry) <= 1) return e.id;
    } else if (Math.abs(lx) <= e.w / 2 + pad && Math.abs(ly) <= e.h / 2 + pad) return e.id;
  }
  return null;
}

function Marker({ m, size, color }) {
  const s = size / 2;
  const common = { fill: 'none', stroke: color, strokeWidth: 2 };
  if (m.type === 'end') return <rect x={m.x - s} y={m.y - s} width={size} height={size} {...common} />;
  if (m.type === 'mid') return <path d={`M${m.x} ${m.y - s * 1.15}L${m.x + s} ${m.y + s * 0.7}H${m.x - s}Z`} {...common} />;
  if (m.type === 'cen') return <circle cx={m.x} cy={m.y} r={s} {...common} />;
  if (m.type === 'quad') return <path d={`M${m.x} ${m.y - s}L${m.x + s} ${m.y}L${m.x} ${m.y + s}L${m.x - s} ${m.y}Z`} {...common} />;
  return <path d={`M${m.x - s} ${m.y - s}L${m.x + s} ${m.y + s}M${m.x + s} ${m.y - s}L${m.x - s} ${m.y + s}`} {...common} />;
}
const SNAPNAME = { end: 'Endpoint', mid: 'Midpoint', cen: 'Centre', quad: 'Quadrant', grid: 'Grid' };

function Shape({ e, dark }) {
  const [cx, cy] = centre(e);
  const t = `translate(${cx} ${cy}) rotate(${e.r}) translate(${-e.w / 2} ${-e.h / 2})`;
  if (e.kind === 'circle') {
    return (
      <g transform={t}>
        <ellipse cx={e.w / 2} cy={e.h / 2} rx={e.w / 2} ry={e.h / 2} fill="#4E7FB8" />
        <text x={e.w / 2} y={e.h / 2 + 6} textAnchor="middle" className="cx-t" fill="#fff" style={{ fontSize: 17, fontWeight: 500 }}>PK</text>
      </g>
    );
  }
  if (e.kind === 'button') {
    return (
      <g transform={t}>
        <rect width={e.w} height={e.h} rx={Math.min(e.h / 2, 24)} fill="#D9572B" />
        <text x={e.w / 2} y={e.h / 2 + 5.5} textAnchor="middle" className="cx-t" fill="#fff" style={{ fontSize: 16, fontWeight: 500 }}>Book visit</text>
      </g>
    );
  }
  return (
    <g transform={t}>
      <rect width={e.w} height={e.h} rx="14" fill="#FFFFFF" stroke={dark ? 'none' : '#DCD7D2'} />
      <text x="16" y="30" className="cx-t" fill="#2A2724" style={{ fontSize: 16, fontWeight: 500 }}>Site visit</text>
      <text x="16" y="50" className="cx-t" fill="#6B635C" style={{ fontSize: 13 }}>Pune · 06:40</text>
      <path d={`M16 64H${e.w - 16}`} stroke="#E6E1DC" />
      <rect x="16" y={e.h - 40} width="82" height="24" rx="12" fill="#E5F4EA" />
      <text x="57" y={e.h - 23.5} textAnchor="middle" className="cx-t" fill="#24683F" style={{ fontSize: 12, fontWeight: 500 }}>Confirmed</text>
    </g>
  );
}

export default function CadWindow({ mode, settings, els, setEls }) {
  const cross = mode === 'cross';
  const s = settings;
  const svg = useRef(null);
  const [sel, setSel] = useState(null);
  const [ptr, setPtr] = useState(null);       // raw pointer, canvas coords
  const [guides, setGuides] = useState({ marker: null, lines: [] });
  const [angle, setAngle] = useState(null);
  const drag = useRef(null);

  const dark = cross && s.bg === 'dark';
  const aperture = Math.max(8, s.pickbox * 2 + 4);
  const toCanvas = (ev) => {
    const b = svg.current.getBoundingClientRect();
    return { x: ((ev.clientX - b.left) / b.width) * W, y: ((ev.clientY - b.top) / b.height) * H };
  };
  const update = useCallback((id, fn) => setEls((list) => list.map((e) => (e.id === id ? { ...e, ...fn(e) } : e))), [setEls]);

  // where the crosshair actually sits (object snap applied when idle)
  let cursor = ptr;
  let idle = { marker: null, lines: [] };
  if (cross && ptr && !drag.current && s.snap) {
    const res = snapTo([{ x: ptr.x, y: ptr.y }], els.flatMap(pointsOf), aperture);
    cursor = { x: ptr.x + res.dx, y: ptr.y + res.dy };
    idle = res;
  }
  const show = drag.current ? guides : idle;
  const hover = cross && cursor && !drag.current ? hitTest(els, cursor.x, cursor.y, s.pickbox) : null;

  const down = (ev) => {
    const p = toCanvas(ev);
    const at = cross && s.snap && cursor ? cursor : p;
    const h = ev.target.closest('[data-h]');
    const r = ev.target.closest('[data-rot]');
    if (sel && (h || r)) {
      const e = els.find((x) => x.id === sel);
      const [cx, cy] = centre(e);
      if (r) drag.current = { type: 'rot', id: e.id, cx, cy };
      else {
        const [hx, hy] = h.dataset.h.split(',').map(Number);
        const [ax, ay] = rot((-hx * e.w) / 2, (-hy * e.h) / 2, rad(e.r));
        drag.current = { type: 'size', id: e.id, hx, hy, ax: cx + ax, ay: cy + ay, w: e.w, h: e.h, r: e.r, kind: e.kind };
      }
    } else {
      const id = hitTest(els, at.x, at.y, cross ? s.pickbox : 0);
      setSel(id);
      if (id) {
        const e = els.find((x) => x.id === id);
        drag.current = { type: 'move', id, ox: at.x - e.x, oy: at.y - e.y };
        setEls((list) => [...list.filter((x) => x.id !== id), e]);   // bring to front
      }
    }
    if (drag.current) svg.current.setPointerCapture(ev.pointerId);
  };

  const move = (ev) => {
    const p = toCanvas(ev);
    setPtr(p);
    const d = drag.current; if (!d) return;
    const snapping = cross && s.snap;
    const others = els.filter((x) => x.id !== d.id);
    if (d.type === 'move') {
      const e = els.find((x) => x.id === d.id);
      let nx = p.x - d.ox, ny = p.y - d.oy;
      let g = { marker: null, lines: [] };
      if (snapping) {
        const own = pointsOf({ ...e, x: nx, y: ny });
        g = snapTo(own, others.flatMap(pointsOf), aperture, s.grid ? gridNear(own) : []);
        nx += g.dx; ny += g.dy;
      }
      setGuides(g);
      update(d.id, () => ({ x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 }));
    } else if (d.type === 'size') {
      let q = p; let g = { marker: null, lines: [] };
      if (snapping) {
        g = snapTo([p], others.flatMap(pointsOf), aperture, s.grid ? gridNear([p]) : []);
        q = { x: p.x + g.dx, y: p.y + g.dy };
      }
      setGuides(g);
      const a = rad(d.r);
      const [lx, ly] = rot(q.x - d.ax, q.y - d.ay, -a);
      const [mw, mh] = MIN[d.kind];
      let w = d.hx ? Math.max(mw, lx * d.hx) : d.w;
      let h = d.hy ? Math.max(mh, ly * d.hy) : d.h;
      if (d.kind === 'circle' && d.hx && d.hy) { const m = Math.max(w, h); w = m; h = m; }
      const [ccx, ccy] = rot(d.hx ? (d.hx * w) / 2 : 0, d.hy ? (d.hy * h) / 2 : 0, a);
      const cx = d.ax + ccx, cy = d.ay + ccy;
      update(d.id, () => ({ w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10, x: cx - w / 2, y: cy - h / 2 }));
    } else if (d.type === 'rot') {
      let deg = (Math.atan2(p.y - d.cy, p.x - d.cx) * 180) / Math.PI + 90;
      if (snapping || ev.shiftKey) deg = Math.round(deg / 15) * 15;
      deg = ((deg % 360) + 360) % 360;
      setAngle({ deg, x: d.cx, y: d.cy });
      update(d.id, () => ({ r: Math.round(deg * 10) / 10 }));
    }
  };
  const up = () => { drag.current = null; setGuides({ marker: null, lines: [] }); setAngle(null); };

  const onKey = (ev, e) => {
    const step = ev.shiftKey ? 10 : 1;
    const k = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[ev.key];
    if (k) { ev.preventDefault(); setSel(e.id); update(e.id, (x) => ({ x: x.x + k[0], y: x.y + k[1] })); }
    if (ev.key === 'r' || ev.key === 'R') { ev.preventDefault(); setSel(e.id); update(e.id, (x) => ({ r: (x.r + (ev.shiftKey ? -15 : 15) + 360) % 360 })); }
    if (ev.key === 'Escape') setSel(null);
  };

  const selected = els.find((e) => e.id === sel);
  const ink = dark ? '#E9EEF2' : '#1D2125';
  const len = (s.size / 100) * Math.max(W, H);
  const gap = s.pickbox + 2;
  const accentSel = cross ? s.pickColor : '#0D99FF';

  return (
    <svg
      ref={svg} viewBox={`0 0 ${W} ${H}`} className={`cx-svg ${cross ? 'is-cross' : 'is-arrow'}`}
      role="group" aria-label={cross ? 'Canvas with a precision crosshair' : 'Canvas with a standard arrow cursor'}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onPointerLeave={() => { if (!drag.current) setPtr(null); }}
    >
      <rect width={W} height={H} fill={cross ? (dark ? '#1E2329' : '#FFFFFF') : '#F2F2F2'} />
      {cross && s.grid && (
        <g aria-hidden="true">
          {Array.from({ length: W / GRID + 1 }, (_, i) => <path key={'v' + i} d={`M${i * GRID} 0V${H}`} stroke={ink} strokeOpacity={i % 5 ? 0.07 : 0.16} />)}
          {Array.from({ length: H / GRID + 1 }, (_, i) => <path key={'h' + i} d={`M0 ${i * GRID}H${W}`} stroke={ink} strokeOpacity={i % 5 ? 0.07 : 0.16} />)}
        </g>
      )}

      {els.map((e) => (
        <g
          key={e.id} tabIndex={0} role="button" className="cx-obj"
          aria-label={`${e.name}, x ${Math.round(e.x)}, y ${Math.round(e.y)}, ${Math.round(e.w)} by ${Math.round(e.h)}, ${Math.round(e.r)} degrees. Arrow keys move, R rotates.`}
          onKeyDown={(ev) => onKey(ev, e)} onFocus={() => setSel(e.id)}
        >
          <Shape e={e} dark={dark} />
        </g>
      ))}

      {hover && hover !== sel && (() => {
        const e = els.find((x) => x.id === hover); const [cx, cy] = centre(e);
        return (
          <g transform={`translate(${cx} ${cy}) rotate(${e.r})`} pointerEvents="none" aria-hidden="true">
            {e.kind === 'circle'
              ? <ellipse rx={e.w / 2 + 3} ry={e.h / 2 + 3} fill="none" stroke={s.pickColor} strokeWidth="2" strokeDasharray="6 4" />
              : <rect x={-e.w / 2 - 3} y={-e.h / 2 - 3} width={e.w + 6} height={e.h + 6} rx="4" fill="none" stroke={s.pickColor} strokeWidth="2" strokeDasharray="6 4" />}
          </g>
        );
      })()}

      {selected && (() => {
        const e = selected; const [cx, cy] = centre(e);
        const hs = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
        const cursorFor = (hx, hy) => (hx === 0 ? 'ns-resize' : hy === 0 ? 'ew-resize' : hx === hy ? 'nwse-resize' : 'nesw-resize');
        return (
          <g transform={`translate(${cx} ${cy}) rotate(${e.r})`} aria-hidden="true">
            <rect x={-e.w / 2} y={-e.h / 2} width={e.w} height={e.h} fill="none" stroke={accentSel} strokeWidth="1.5" strokeDasharray={cross ? '6 4' : 'none'} pointerEvents="none" />
            <path d={`M0 ${-e.h / 2}V${-e.h / 2 - 22}`} stroke={accentSel} strokeWidth="1.5" pointerEvents="none" />
            <circle data-rot="1" cx="0" cy={-e.h / 2 - 26} r="6" fill="#fff" stroke={accentSel} strokeWidth="1.5" style={{ cursor: cross ? 'none' : 'grab' }} />
            {hs.map(([hx, hy]) => (
              <rect
                key={`${hx},${hy}`} data-h={`${hx},${hy}`}
                x={(hx * e.w) / 2 - 5} y={(hy * e.h) / 2 - 5} width="10" height="10" rx={cross ? 0 : 1.5}
                fill={cross ? s.pickColor : '#fff'} stroke={cross ? '#0B0D10' : accentSel} strokeWidth="1.5"
                style={{ cursor: cross ? 'none' : cursorFor(hx, hy) }}
              />
            ))}
          </g>
        );
      })()}

      {cross && (
        <g pointerEvents="none" aria-hidden="true">
          {show.lines.map((l, i) => <path key={i} d={`M${l.x1} ${l.y1}L${l.x2} ${l.y2}`} stroke={s.snapColor} strokeWidth="1.2" strokeDasharray="2 5" />)}
          {show.marker && <Marker m={show.marker} size={s.marker} color={s.snapColor} />}
          {angle && <text x={angle.x} y={angle.y - 8} textAnchor="middle" className="cx-mono" fill={s.snapColor}>{Math.round(angle.deg)}°</text>}
          {cursor && (
            <g>
              <path d={`M${cursor.x - len} ${cursor.y}H${cursor.x - gap}M${cursor.x + gap} ${cursor.y}H${cursor.x + len}M${cursor.x} ${cursor.y - len}V${cursor.y - gap}M${cursor.x} ${cursor.y + gap}V${cursor.y + len}`} stroke={ink} strokeWidth="1" />
              <rect x={cursor.x - s.pickbox} y={cursor.y - s.pickbox} width={s.pickbox * 2} height={s.pickbox * 2} fill="none" stroke={s.pickColor} strokeWidth="1.5" />
            </g>
          )}
          {cursor && <text x="12" y={H - 12} className="cx-mono" fill={ink} fillOpacity=".75">X {cursor.x.toFixed(1)}  Y {(H - cursor.y).toFixed(1)}{show.marker ? `  ·  ${SNAPNAME[show.marker.type]}` : ''}</text>}
        </g>
      )}
    </svg>
  );
}

export function alignment(els) {
  const card = els.find((e) => e.id === 'card'), btn = els.find((e) => e.id === 'btn');
  if (card.r % 360 !== 0 || btn.r % 360 !== 0) return { text: 'Rotated: straighten both to compare', ok: false };
  const d = Math.abs(btn.x - card.x);
  return d < 0.05 ? { text: 'Left edges aligned exactly', ok: true } : { text: `Left edges off by ${d.toFixed(1)} px`, ok: false };
}
