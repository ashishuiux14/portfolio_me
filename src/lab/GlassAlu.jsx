import { useRef, useState } from 'react';

/* A slab of glass resting over anodised aluminium.
   What makes it read as premium is what the glass does to the metal behind it:
   - the body magnifies and softens it (a thick slab acts as a weak lens)
   - the bevelled edge bends it hard and splits it into colour (dispersion)
   - its shadow is pale, with a bright caustic where light is focused
   Drag the glass: the refraction is recomputed live from what is underneath. */

const W = 1200, H = 640;
const GW = 470, GH = 300, R = 34, EDGE = 18;

function rr(x, y, w, h, r) {
  return `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
}

function Scene() {
  const grooves = [];
  for (let r = 34; r <= 300; r += 8) grooves.push(r);
  const holes = [];
  for (let y = 70; y <= 580; y += 22) for (let x = 820; x <= 1160; x += 22) holes.push([x + ((y / 22) % 2 ? 11 : 0), y]);
  return (
    <g>
      <rect width={W} height={H} fill="url(#ga-base)" />
      <rect width={W} height={H} fill="url(#ga-brush)" />
      {/* spun finish around a turned boss */}
      <g>
        {grooves.map((r, i) => (
          <g key={r}>
            <circle cx="290" cy="330" r={r} fill="none" stroke="var(--ga-hi)" strokeOpacity={i % 3 ? 0.35 : 0.8} strokeWidth="1.3" transform="translate(-.8,-.8)" />
            <circle cx="290" cy="330" r={r} fill="none" stroke="var(--ga-lo)" strokeOpacity={i % 3 ? 0.35 : 0.75} strokeWidth="1.3" transform="translate(.8,.8)" />
          </g>
        ))}
        <circle cx="290" cy="330" r="30" fill="var(--ga-boss)" stroke="var(--ga-lo)" strokeWidth="2" />
        <circle cx="290" cy="330" r="6" fill="var(--ga-led)" />
      </g>
      {/* machined seams */}
      <path d="M 600 -10 L 760 650" stroke="var(--ga-lo)" strokeWidth="3" />
      <path d="M 603 -10 L 763 650" stroke="var(--ga-hi)" strokeWidth="1.6" />
      <path d="M 640 -10 L 800 650" stroke="var(--ga-lo)" strokeWidth="1.2" strokeOpacity=".6" />
      {/* grille */}
      {holes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 1} r="6" fill="var(--ga-hi)" fillOpacity=".7" />
          <circle cx={x} cy={y} r="6" fill="var(--ga-hole)" />
        </g>
      ))}
      {/* engraving */}
      <text x="56" y="80" className="ga-eng">ANODISED ALUMINIUM · 6061-T6</text>
      <text x="56" y="600" className="ga-eng">CNC 0.02 MM · BEAD BLASTED</text>
      <text x="470" y="590" className="ga-big">21</text>
      <rect x="470" y="96" width="250" height="8" rx="4" fill="var(--ga-led)" />
    </g>
  );
}

export default function GlassAlu() {
  const svg = useRef(null);
  const drag = useRef(null);
  const [pos, setPos] = useState({ x: 300, y: 170 });
  const toSvg = (e) => {
    const b = svg.current.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * W, y: ((e.clientY - b.top) / b.height) * H };
  };
  const clamp = (p) => ({ x: Math.max(-60, Math.min(W - GW + 60, p.x)), y: Math.max(-40, Math.min(H - GH + 40, p.y)) });
  const onKey = (e) => {
    const k = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
    if (k) { setPos(clamp({ x: pos.x + k[0], y: pos.y + k[1] })); e.preventDefault(); }
  };

  const { x, y } = pos;
  const cx = x + GW / 2, cy = y + GH / 2;
  const lens = (s) => `translate(${cx},${cy}) scale(${s}) translate(${-cx},${-cy})`;
  const outer = rr(x, y, GW, GH, R);
  const inner = rr(x + EDGE, y + EDGE, GW - 2 * EDGE, GH - 2 * EDGE, R - EDGE / 1.4);

  return (
    <div className="ga">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A glass panel over anodised aluminium; the metal behind it is magnified and bent at the glass edge">
        <defs>
          <linearGradient id="ga-base" x1="0" y1="0" x2=".4" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--ga-a)' }} /><stop offset="1" style={{ stopColor: 'var(--ga-b)' }} />
          </linearGradient>
          <pattern id="ga-brush" width="7" height="3" patternUnits="userSpaceOnUse">
            <rect width="7" height="1" fill="#fff" fillOpacity=".09" /><rect y="2" width="7" height="1" fill="#000" fillOpacity=".05" />
          </pattern>
          <linearGradient id="ga-body" x1="0" y1="0" x2=".7" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".34" /><stop offset=".5" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="ga-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#fff" stopOpacity=".15" /><stop offset=".55" stopColor="#000" stopOpacity=".05" /><stop offset="1" stopColor="#000" stopOpacity=".28" />
          </linearGradient>
          <linearGradient id="ga-glare" x1="0" y1="0" x2="1" y2=".6">
            <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".28" stopColor="#fff" stopOpacity="0" /><stop offset=".3" stopColor="#fff" stopOpacity=".22" /><stop offset=".42" stopColor="#fff" stopOpacity=".04" /><stop offset=".43" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <g id="ga-scene"><Scene /></g>
          <clipPath id="ga-clip-body"><path d={inner} /></clipPath>
          <clipPath id="ga-clip-edge"><path d={`${outer} ${inner}`} clipRule="evenodd" /></clipPath>
          <clipPath id="ga-clip-all"><path d={outer} /></clipPath>
          <clipPath id="ga-frame"><rect width={W} height={H} rx="40" /></clipPath>
          <filter id="ga-frost" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1100">
            <feGaussianBlur stdDeviation="1.6" />
            <feColorMatrix type="matrix" values="1.04 0 0 0 .05  0 1.04 0 0 .05  0 0 1.06 0 .06  0 0 0 1 0" />
          </filter>
          <filter id="ga-disperse" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1100">
            <feGaussianBlur stdDeviation=".8" result="b" />
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx="-4" dy="-1.5" result="r2" />
            <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bl" />
            <feOffset in="bl" dx="4" dy="1.5" result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
          <filter id="ga-soft" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1100"><feGaussianBlur stdDeviation="16" /></filter>
          <filter id="ga-soft2" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1100"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>

        <g clipPath="url(#ga-frame)">
          <use href="#ga-scene" />

          {/* pale shadow, then the caustic: light the slab gathers and drops beyond its far edge */}
          <path d={outer} transform="translate(16,26)" fill="#000" fillOpacity=".2" filter="url(#ga-soft)" />
          <path d={rr(x + 30, y + GH + 4, GW - 40, 14, 7)} fill="var(--ga-caustic)" filter="url(#ga-soft2)" />

          {/* the glass */}
          <g
            className="ga-glass" tabIndex={0} role="slider" aria-label="Glass panel position" aria-valuetext="Use arrow keys to slide the glass"
            onKeyDown={onKey}
            onPointerDown={(e) => { const p = toSvg(e); drag.current = { dx: p.x - x, dy: p.y - y }; e.currentTarget.setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { if (!drag.current) return; const p = toSvg(e); setPos(clamp({ x: p.x - drag.current.dx, y: p.y - drag.current.dy })); }}
            onPointerUp={() => { drag.current = null; }}
          >
            {/* body: the metal seen through the slab, magnified and softened */}
            <g clipPath="url(#ga-clip-body)"><use href="#ga-scene" transform={lens(1.14)} filter="url(#ga-frost)" /></g>
            {/* bevel: bent hard, split into colour */}
            <g clipPath="url(#ga-clip-edge)"><use href="#ga-scene" transform={lens(1.32)} filter="url(#ga-disperse)" /></g>
            <path d={outer} fill="url(#ga-body)" />
            <path d={inner} fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2" />
            <path d={outer} fill="url(#ga-glare)" />
            <path d={outer} fill="none" stroke="url(#ga-rim)" strokeWidth="2.4" />

            {/* content on the glass */}
            <g className="ga-ink" pointerEvents="none">
              <text x={x + 44} y={y + 66} className="ga-cap">LIVING ROOM · HEATING</text>
              <text x={x + 40} y={y + 190} className="ga-temp">21.5°</text>
              <text x={x + 44} y={y + 246} className="ga-sub">Holding 22° until 23:00 · Eco</text>
              <circle cx={x + GW - 60} cy={y + 60} r="9" fill="var(--ga-led)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
