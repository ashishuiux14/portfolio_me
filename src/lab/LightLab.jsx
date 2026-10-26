import { useRef, useState } from 'react';
import { Seg } from './Seg';

/* Move one light, watch four materials answer it.
   L = unit vector pointing from the object toward the light (screen coords). */
const DEFAULT = -0.75 * Math.PI; // top left

export default function LightLab() {
  const [a, setA] = useState(DEFAULT);
  const pad = useRef(null);
  const drag = useRef(false);
  const L = { x: Math.cos(a), y: Math.sin(a) };
  const O = { x: -L.x, y: -L.y }; // shadows fall away from the light
  const deg = Math.round(((Math.atan2(L.x, -L.y) * 180) / Math.PI + 360) % 360); // CSS gradient angle pointing at the light
  const clock = ((Math.round(((a * 180) / Math.PI + 90 + 360) % 360 / 30) + 11) % 12) + 1;

  const fromPointer = (e) => {
    const r = pad.current.getBoundingClientRect();
    setA(Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)));
  };
  const onKey = (e) => {
    const step = Math.PI / 12;
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { setA(a + step); e.preventDefault(); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { setA(a - step); e.preventDefault(); }
    if (e.key === 'Home') { setA(DEFAULT); e.preventDefault(); }
  };
  const px = (k) => `${(O.x * k).toFixed(1)}px ${(O.y * k).toFixed(1)}px`;
  const neg = (k) => `${(-O.x * k).toFixed(1)}px ${(-O.y * k).toFixed(1)}px`;
  const at = (k) => `${(50 + L.x * k).toFixed(1)}% ${(50 + L.y * k).toFixed(1)}%`;

  return (
    <div className="lightlab">
      <div className="ll-control">
        <div
          ref={pad} className="ll-pad in" role="slider" tabIndex={0}
          aria-label="Light direction" aria-valuemin={0} aria-valuemax={359} aria-valuenow={deg}
          aria-valuetext={`Light from ${clock} o'clock`}
          onKeyDown={onKey}
          onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
          onPointerMove={(e) => drag.current && fromPointer(e)}
          onPointerUp={() => { drag.current = false; }}
        >
          <span className="ll-ring" aria-hidden="true" />
          <span className="ll-sun" aria-hidden="true" style={{ left: `${50 + L.x * 38}%`, top: `${50 + L.y * 38}%` }} />
          <span className="ll-obj up-sm" aria-hidden="true" style={{ boxShadow: `${px(6)} 12px var(--lo), ${neg(6)} 12px var(--hi)` }} />
        </div>
        <div className="ll-read">
          <span className="cap">Light from</span>
          <span className="lcd ll-lcd">{String(clock).padStart(2, '0')}:00</span>
          <button type="button" className="pill up-sm press" style={{ minHeight: 40, padding: '0 16px', fontSize: 14 }} onClick={() => setA(DEFAULT)}>Reset to top left</button>
          <span className="cap" style={{ maxWidth: 220 }}>Drag the sun, or focus the dial and use the arrow keys.</span>
        </div>
      </div>

      <div className="ll-grid">
        {/* SOFT */}
        <figure className="ll-cell">
          <div className="ll-stage">
            <span className="ll-soft" style={{ boxShadow: `${px(14)} 28px var(--lo), ${neg(14)} 28px var(--hi)` }} />
            <span className="ll-dent" style={{ boxShadow: `inset ${px(7)} 12px var(--lo), inset ${neg(7)} 12px var(--hi)` }} />
          </div>
          <figcaption><b>Soft · diffuse</b><span>Matte, so no highlight spot. Two soft shadows swing round together: dark away from the light, a glow towards it. The dent is the same pair, turned inside out.</span></figcaption>
        </figure>

        {/* HARD */}
        <figure className="ll-cell">
          <div className="ll-stage">
            <span className="ll-chamfer" style={{ background: `linear-gradient(${deg + 180}deg, #8b8e93, #f7f8f9)`, boxShadow: `${px(3)} 4px rgba(0,0,0,.38), ${px(12)} 22px rgba(0,0,0,.16)` }}>
              <span className="ll-metal" style={{
                background: `radial-gradient(circle at ${at(24)}, rgba(255,255,255,.95) 0 6%, rgba(255,255,255,0) 22%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.16) 0 .6px, rgba(0,0,0,.06) .6px 1.4px), linear-gradient(${deg}deg, #7d8086, #c9cbcf 55%, #fbfbfc)`,
              }} />
            </span>
          </div>
          <figcaption><b>Hard · specular</b><span>Polished metal mirrors the light as one sharp spot that slides with it. The chamfer ring is lit on the far side, because it slopes the other way. Shadows are short and dark: hard things sit on the surface.</span></figcaption>
        </figure>

        {/* GLASS */}
        <figure className="ll-cell">
          <div className="ll-stage ll-glass-stage">
            <span className="ll-blob" style={{ left: '22%', top: '24%', background: 'var(--glow-a)' }} />
            <span className="ll-blob" style={{ left: '52%', top: '46%', background: 'var(--glow-b)' }} />
            <span className="ll-caustic" style={{ transform: `translate(${(O.x * 30).toFixed(1)}px, ${(O.y * 30).toFixed(1)}px)` }} />
            <span className="ll-glass" style={{
              boxShadow: `inset ${neg(-1.6)} 0 rgba(255,255,255,.7), inset ${neg(1.2)} 0 rgba(255,255,255,.12), ${px(16)} 34px rgba(40,30,25,.16)`,
              backgroundImage: `linear-gradient(${deg + 180}deg, rgba(255,255,255,.34), rgba(255,255,255,.06) 42%, rgba(255,255,255,0) 43%, rgba(255,255,255,.08))`,
            }}><span>32%</span></span>
          </div>
          <figcaption><b>Glass · transmits</b><span>Light passes through, so the shadow is pale and tinted by what is behind. The lit edge is a thin bright line on the side facing the light; a soft caustic lands beyond the shadow, where the panel focuses the light.</span></figcaption>
        </figure>

        {/* LCD */}
        <figure className="ll-cell">
          <div className="ll-stage">
            <span className="ll-lcd" style={{ boxShadow: `inset ${px(6)} 10px rgba(30,34,26,.45), inset ${neg(2)} 3px rgba(255,255,255,.35), 0 1px 0 var(--hi)` }}>
              <svg viewBox="0 0 300 130" aria-hidden="true">
                <defs><filter id="llsh"><feGaussianBlur stdDeviation="1.2" /></filter></defs>
                <Seg text="21:45" x={24} y={18} h={94} ink="#171A15" ghost="rgba(23,26,21,.08)" shadow={{ dx: O.x * 5, dy: O.y * 5, color: 'rgba(23,26,21,.28)', filter: 'llsh' }} />
              </svg>
              <span className="ll-lcd-glare" style={{ backgroundImage: `linear-gradient(${deg + 180}deg, rgba(255,255,255,.4), rgba(255,255,255,0) 38%)` }} />
            </span>
          </div>
          <figcaption><b>LCD · reflects back</b><span>The digits float a hair above a mirror, so each one casts its own faint shadow that turns with the light. The window is recessed: its inner wall shades the side nearest the light. Glare sits on the cover glass, not on the digits.</span></figcaption>
        </figure>
      </div>
    </div>
  );
}
