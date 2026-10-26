import { useRef, useState } from 'react';
import { Seg, Dots } from './Seg';
import { Snd } from './engines';

function beep(f = 4000) {
  if (!Snd.on) return;
  const c = Snd.ensure(); if (!c) return;
  Snd.tone(c.currentTime + 0.002, f, 0.035, 0.05, 'square');
}
const p2 = (n) => String(n).padStart(2, '0');

/* ---------- Thermostat: aluminium ring, smoked glass face, clay wall plate ---------- */
const MIN = 16, MAX = 28, ROOM = 21.5;
export function Thermostat() {
  const [set, setSet] = useState(22);
  const ring = useRef(null);
  const drag = useRef(null);
  // 16°..28° maps to -135°..135°
  const ang = ((set - MIN) / (MAX - MIN)) * 270 - 135;
  const heat = set > ROOM + 0.2, cool = set < ROOM - 0.2;
  const mode = heat ? 'Heating' : cool ? 'Cooling' : 'Holding';
  const arcFrom = Math.min(ang, ((ROOM - MIN) / (MAX - MIN)) * 270 - 135);
  const arcTo = Math.max(ang, ((ROOM - MIN) / (MAX - MIN)) * 270 - 135);
  const change = (v) => {
    const n = Math.round(Math.max(MIN, Math.min(MAX, v)) * 2) / 2;
    if (n !== set) { setSet(n); beep(n > set ? 4400 : 3600); }
  };
  const fromPointer = (e) => {
    const b = ring.current.getBoundingClientRect();
    const a = (Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180) / Math.PI;
    if (drag.current === null) { drag.current = { a, v: set }; return; }
    let d = a - drag.current.a; if (d > 180) d -= 360; if (d < -180) d += 360;
    change(drag.current.v + (d / 270) * (MAX - MIN));
  };
  const onKey = (e) => {
    if (['ArrowUp', 'ArrowRight'].includes(e.key)) { change(set + 0.5); e.preventDefault(); }
    if (['ArrowDown', 'ArrowLeft'].includes(e.key)) { change(set - 0.5); e.preventDefault(); }
  };
  return (
    <div className="thermo up">
      <div
        ref={ring} className="thermo-ring" role="slider" tabIndex={0} aria-label="Target temperature"
        aria-valuemin={MIN} aria-valuemax={MAX} aria-valuenow={set} aria-valuetext={`${set} degrees, ${mode.toLowerCase()}`}
        onKeyDown={onKey}
        onPointerDown={(e) => { drag.current = null; fromPointer(e); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => drag.current && fromPointer(e)}
        onPointerUp={() => { drag.current = null; }}
      >
        <span className="thermo-knurl" aria-hidden="true" />
        <span className="thermo-tick" aria-hidden="true" style={{ transform: `rotate(${ang}deg)` }}><i /></span>
        <span className="thermo-face" aria-hidden="true">
          <span className="thermo-arc" style={{ background: `conic-gradient(from ${arcFrom}deg, ${heat ? 'var(--th-heat)' : 'var(--th-cool)'} 0 ${arcTo - arcFrom}deg, transparent 0)`, opacity: heat || cool ? 1 : 0 }} />
          <span className="thermo-glass">
            <span className="thermo-mode">{mode}</span>
            <span className="thermo-set">{set.toFixed(1)}<small>°</small></span>
            <span className="thermo-room">Room {ROOM}°</span>
          </span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Pet feeder: glossy plastic body, clear hopper, LCD, clay buttons, steel bowl ---------- */
export function PetFeeder() {
  const [cups, setCups] = useState(2);
  const [level, setLevel] = useState(0.78);
  const [fed, setFed] = useState(null);
  const [drop, setDrop] = useState(0);
  const [said, setSaid] = useState('');
  const now = new Date();
  const feed = () => {
    if (level < 0.08) { setSaid('Hopper empty'); beep(300); return; }
    setLevel(Math.max(0.04, level - cups * 0.06));
    const t = new Date(); setFed(`${p2(t.getHours())}:${p2(t.getMinutes())}`);
    setDrop((d) => d + 1); beep(4200);
    setSaid(`Fed ${cups} ${cups > 1 ? 'portions' : 'portion'}`);
  };
  const lcdTop = fed ? 'FED' : 'NEXT';
  const lcdTime = fed || '18:30';
  return (
    <div className="feeder">
      <div className="fd-body">
        <div className="fd-hopper" aria-hidden="true">
          <span className="fd-kibble" style={{ height: `${level * 100}%` }} />
          <span className="fd-hopper-glare" />
        </div>
        <div className="fd-lcd" aria-hidden="true">
          <svg viewBox="0 0 300 110">
            <defs><filter id="fdsh"><feGaussianBlur stdDeviation="1.1" /></filter></defs>
            <Dots text={lcdTop.padEnd(4, ' ')} x={18} y={14} dot={4.4} ink="#171A15" ghost="rgba(23,26,21,.08)" shadow={{ dx: 1.6, dy: 2, color: 'rgba(23,26,21,.22)' }} />
            <Seg text={lcdTime} x={24} y={54} h={46} ink="#171A15" ghost="rgba(23,26,21,.08)" shadow={{ dx: 2, dy: 2.6, color: 'rgba(23,26,21,.24)', filter: 'fdsh' }} />
            <Dots text="CUP" x={218} y={14} dot={4.4} ink="#171A15" ghost="rgba(23,26,21,.08)" />
            <Seg text={String(cups)} x={236} y={54} h={46} ink="#171A15" ghost="rgba(23,26,21,.08)" shadow={{ dx: 2, dy: 2.6, color: 'rgba(23,26,21,.24)', filter: 'fdsh' }} />
          </svg>
        </div>
        <div className="fd-keys">
          <button type="button" className="fd-key" aria-label="Fewer portions" onClick={() => { setCups(Math.max(1, cups - 1)); beep(3600); }}>−</button>
          <button type="button" className="fd-key feed" onClick={feed}>Feed now</button>
          <button type="button" className="fd-key" aria-label="More portions" onClick={() => { setCups(Math.min(4, cups + 1)); beep(4400); }}>+</button>
        </div>
        <span className="fd-led" aria-hidden="true" style={{ background: level < 0.2 ? '#E0533A' : '#5BCB86' }} />
      </div>
      <div className="fd-bowl" aria-hidden="true">
        {fed && <span key={drop} className="fd-pile" style={{ '--n': cups }} />}
      </div>
      <span className="sr-only" aria-live="polite">{said}</span>
      <button type="button" className="fd-refill pill up-sm press" onClick={() => { setLevel(0.9); setFed(null); setSaid('Hopper refilled'); }}>Refill</button>
      <span className="cap" style={{ textAlign: 'center' }}>Hopper {Math.round(level * 100)}% · {now.toLocaleDateString(undefined, { weekday: 'short' })}</span>
    </div>
  );
}

/* ---------- five materials, one object ---------- */
export const MATERIALS = [
  { id: 'clay', name: 'Soft clay', light: 'Diffuses: no shine, two soft shadows, moulded from the page.', use: 'Everyday buttons, toggles, cards.' },
  { id: 'plastic', name: 'Plastic', light: 'A broad soft sheen plus one small sharp highlight; colour runs through it.', use: 'Hardware bodies, playful accents.' },
  { id: 'metal', name: 'Polished metal', light: 'A mirror: hard bands of light and dark reflected from the room.', use: 'Bezels, rings, premium trims.' },
  { id: 'alu', name: 'Brushed aluminium', light: 'Matte metallic; the grain stretches the highlight into a streak.', use: 'Knobs, dials, deliberate settings.' },
  { id: 'glass', name: 'Glass', light: 'Transmits: magnifies and bends what is behind, bright thin edge.', use: 'Overlays, readouts, covers.' },
];
export function MaterialPuck({ id }) {
  return <span className={`mat mat-${id}`} aria-hidden="true">{id === 'glass' && <span className="mat-lens" />}</span>;
}
