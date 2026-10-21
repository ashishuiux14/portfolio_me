import { useRef, useState } from 'react';

/* Hard + glass: machined aluminium plates with a lit glass channel.
   Light theme: bright aluminium, ember glow. Dark theme: graphite, white glow.
   Move the pointer: the metal's reflection follows the light, the glass glow
   does not, because it makes its own light. */

const W = 1200, H = 600;
const r = 14, hw = Math.sqrt(3) * r; // hex mesh
const hex = (cx, cy) => [[cx, cy - r], [cx + hw / 2, cy - r / 2], [cx + hw / 2, cy + r / 2], [cx, cy + r], [cx - hw / 2, cy + r / 2], [cx - hw / 2, cy - r / 2]].map((p) => p.join(',')).join(' ');

const P1 = '30,320 250,320 330,400 330,570 30,570';                  // hex mesh panel
const P2 = '30,30 420,30 480,90 480,230 420,290 30,290';              // left panel
const P3 = '560,30 1170,30 1170,196 622,196 560,134';                 // top right panel
const CH = 'M 352 600 L 352 520 L 520 352 L 760 352 L 880 268 L 1200 268'; // glass channel
const SCREWS = [[62, 62], [448, 258], [596, 62], [1138, 62], [62, 538], [298, 538]];

function Screw({ x, y, rot = 30 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="11" fill="url(#pl-screw)" />
      <circle r="11" fill="none" stroke="var(--pl-lo)" strokeOpacity=".7" strokeWidth="1.2" />
      <path d="M -6 0 L 6 0" transform={`rotate(${rot})`} stroke="var(--pl-cut)" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

export default function Plate() {
  const svg = useRef(null);
  const [sheen, setSheen] = useState({ x: 260, y: 90 });
  const move = (e) => {
    const b = svg.current.getBoundingClientRect();
    setSheen({ x: ((e.clientX - b.left) / b.width) * W, y: ((e.clientY - b.top) / b.height) * H });
  };

  return (
    <div className="plate" onPointerMove={move} onPointerLeave={() => setSheen({ x: 260, y: 90 })}>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Machined aluminium plates with a glowing glass channel and a frosted glass tile">
        <defs>
          <linearGradient id="pl-alu" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--pl-a)' }} /><stop offset="1" style={{ stopColor: 'var(--pl-b)' }} />
          </linearGradient>
          <linearGradient id="pl-raise" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--pl-a2)' }} /><stop offset="1" style={{ stopColor: 'var(--pl-b2)' }} />
          </linearGradient>
          <linearGradient id="pl-bevel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--pl-hi)' }} /><stop offset=".5" style={{ stopColor: 'var(--pl-hi)', stopOpacity: 0.2 }} /><stop offset="1" style={{ stopColor: 'var(--pl-lo)' }} />
          </linearGradient>
          <radialGradient id="pl-screw" cx=".35" cy=".3" r=".8">
            <stop offset="0" style={{ stopColor: 'var(--pl-hi)' }} /><stop offset=".55" style={{ stopColor: 'var(--pl-a)' }} /><stop offset="1" style={{ stopColor: 'var(--pl-lo)' }} />
          </radialGradient>
          <radialGradient id="pl-sheen" gradientUnits="userSpaceOnUse" cx={sheen.x} cy={sheen.y} r="420">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity=".12" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <pattern id="pl-brush" width="6" height="3" patternUnits="userSpaceOnUse">
            <rect width="6" height="1" fill="#fff" fillOpacity=".07" /><rect y="2" width="6" height="1" fill="#000" fillOpacity=".04" />
          </pattern>
          <pattern id="pl-hex" width={hw} height={3 * r} patternUnits="userSpaceOnUse">
            {[[hw / 2, r], [0, 2.5 * r], [hw, 2.5 * r]].map(([cx, cy], i) => (
              <g key={i}>
                <polygon points={hex(cx, cy)} transform="translate(-.9,-.9)" fill="none" stroke="var(--pl-hi)" strokeWidth="1.4" />
                <polygon points={hex(cx, cy)} transform="translate(.9,.9)" fill="none" stroke="var(--pl-lo)" strokeWidth="1.4" />
              </g>
            ))}
          </pattern>
          <filter id="pl-lift" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="5" dy="8" stdDeviation="7" floodColor="#000" floodOpacity=".26" /></filter>
          <filter id="pl-glow" filterUnits="userSpaceOnUse" x="-300" y="-400" width="1800" height="1400"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="pl-bloom" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1800" height="1200"><feGaussianBlur stdDeviation="34" /></filter>
          <clipPath id="pl-clip"><rect width={W} height={H} rx="34" /></clipPath>
        </defs>

        <g clipPath="url(#pl-clip)">
          {/* base plate */}
          <rect width={W} height={H} fill="url(#pl-alu)" />
          <rect width={W} height={H} fill="url(#pl-brush)" />

          {/* the glow spills onto the metal around it */}
          <path d={CH} fill="none" stroke="var(--glow)" strokeWidth="120" strokeOpacity=".22" filter="url(#pl-bloom)" />

          {/* raised panels */}
          {[P2, P3].map((pts) => (
            <g key={pts} filter="url(#pl-lift)">
              <polygon points={pts} fill="url(#pl-raise)" />
              <polygon points={pts} fill="url(#pl-brush)" />
              <polygon points={pts} fill="none" stroke="url(#pl-bevel)" strokeWidth="3" />
            </g>
          ))}
          <g filter="url(#pl-lift)">
            <polygon points={P1} fill="url(#pl-raise)" />
            <polygon points={P1} fill="url(#pl-hex)" />
            <polygon points={P1} fill="none" stroke="url(#pl-bevel)" strokeWidth="3" />
          </g>

          {/* vent slots and printed marks */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${700 + i * 40},70) skewX(-24)`}>
              <rect width="24" height="56" rx="5" fill="var(--pl-cut)" />
              <rect width="24" height="56" rx="5" fill="none" stroke="var(--pl-hi)" strokeOpacity=".7" strokeWidth="1.5" transform="translate(1.2,1.6)" />
            </g>
          ))}
          {[0, 1, 2].map((i) => <path key={i} d={`M 66 ${206 + i * 22} l 18 -14 l 18 14`} fill="none" stroke="var(--glow)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />)}
          <text x="66" y="92" className="pl-print">AL 6061 · BEAD BLASTED</text>
          <text x="66" y="114" className="pl-print">ANODISED · 0.8 MM CHAMFER</text>
          <text x="604" y="168" className="pl-print">EMISSIVE GLASS · LIGHT GUIDE 01</text>
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={356 + i * 15} cy={300 + i * 4} r="4.2" fill="var(--pl-cut)" stroke="var(--pl-hi)" strokeOpacity=".6" />)}

          {/* recessed channel, walls first: the wall facing the light is in shade */}
          <path d={CH} fill="none" stroke="var(--pl-hi)" strokeWidth="58" strokeLinejoin="bevel" transform="translate(2.5,2.5)" />
          <path d={CH} fill="none" stroke="var(--pl-lo)" strokeWidth="58" strokeLinejoin="bevel" transform="translate(-1.5,-1.5)" />
          <path d={CH} fill="none" stroke="var(--pl-cut)" strokeWidth="54" strokeLinejoin="bevel" />

          {/* pointer sheen: only the metal reflects it */}
          <rect width={W} height={H} fill="url(#pl-sheen)" style={{ mixBlendMode: 'soft-light' }} />

          {/* glass light guide */}
          <path d={CH} fill="none" stroke="var(--glass)" strokeWidth="40" strokeLinejoin="bevel" />
          <path d={CH} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinejoin="bevel" transform="translate(-13,-13)" />
          <path d={CH} fill="none" stroke="var(--glow)" strokeWidth="26" strokeLinejoin="bevel" filter="url(#pl-glow)" className="pl-pulse" />
          <path d={CH} fill="none" stroke="var(--glow-core)" strokeWidth="7" strokeLinejoin="bevel" strokeLinecap="round" />

          {/* vertical light bar */}
          <rect x="1108" y="70" width="18" height="110" rx="9" fill="var(--pl-cut)" />
          <rect x="1110" y="76" width="14" height="98" rx="7" fill="var(--glow)" filter="url(#pl-glow)" />
          <rect x="1113" y="80" width="8" height="90" rx="4" fill="var(--glow-core)" />

          {/* frosted glass tile over the metal */}
          <g transform="translate(936,330)">
            <rect x="6" y="10" width="216" height="216" rx="18" fill="#000" fillOpacity=".22" filter="url(#pl-glow)" />
            <rect width="216" height="216" rx="18" fill="var(--glass-tile)" />
            {[[78, 78, 102, 102], [138, 78, 114, 102], [78, 138, 102, 114], [138, 138, 114, 114]].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--glow)" strokeWidth="18" strokeLinecap="round" filter="url(#pl-glow)" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--glow-core)" strokeWidth="6" strokeLinecap="round" />
              </g>
            ))}
            {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 34} y="26" width="26" height="14" rx="3" transform="skewX(-24)" fill="var(--pl-cut)" fillOpacity=".55" />)}
            <rect width="216" height="216" rx="18" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
            <path d="M 18 1 H 198" stroke="#fff" strokeOpacity=".8" strokeWidth="2" strokeLinecap="round" />
          </g>

          {SCREWS.map(([x, y], i) => <Screw key={i} x={x} y={y} rot={20 + i * 37} />)}
        </g>
      </svg>
    </div>
  );
}
