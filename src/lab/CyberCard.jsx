import { useEffect, useId, useRef, useState } from 'react';
import './softui.css';

/* Metal + glass, cyberpunk.
   The metal is a punched, bead-blasted plate whose edges are lit by an actual
   lighting filter (top-left light), so every hole and chamfer catches light.
   The glass is a real refraction: a displacement map is computed from the glass
   outline (strongest at the bevel, nothing in the middle), and the metal behind
   is displaced three times, once per colour channel, so the edges bend and
   fringe like real glass. Text sits on top of the glass and is never distorted. */

const VW = 1000, VH = 760;

const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i + Math.PI / 6;
  return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
});
const hexPath = (cx, cy, r) => `M${hexPts(cx, cy, r).join('L')}Z`;
const circ = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
const slot = (x, y, w, h) => {
  const r = Math.min(w, h) / 2;
  return w >= h
    ? `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x + r},${y}Z`
    : `M${x},${y + r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x},${y + h - r}Z`;
};

// metal: a chamfered plate (outline from the silhouette sheet), punched
const PLATE = 'M120,60 H560 L600,100 H860 L900,140 V330 L870,360 V470 L900,500 V640 L850,690 H520 L490,660 H180 L120,600 V420 L90,390 V250 L120,220 Z';
const GRILLE = (() => {
  const out = []; const cx = 300, cy = 330, R = 112;
  for (let row = -6; row <= 6; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = cx + col * 25 + (row % 2 ? 12.5 : 0), y = cy + row * 21.6;
      const dx = Math.abs(x - cx), dy = Math.abs(y - cy);
      if (dx + dy * 0.9 < R * 1.18 && dx < R && dy < R * 0.92) out.push(hexPath(x, y, 10));
    }
  }
  return out.join('');
})();
const HOLES = [circ(866, 642, 20), circ(866, 412, 14), slot(152, 470, 18, 140), slot(640, 132, 150, 16), slot(640, 160, 100, 16)].join('');
const METAL_D = `${PLATE}${GRILLE}${HOLES}`;

// glass: a reversed-C slab (also from the sheet), overlapping the plate's edge
const GLASS = 'M520,200 H900 L950,250 V660 L900,710 H560 L520,670 V580 L550,550 H790 L810,530 V400 L790,380 H550 L520,350 Z';
const GB = { x: 500, y: 180, w: 470, h: 550 }; // map bounds (glass bbox + margin)

const SCREWS = [[156, 96], [866, 136], [156, 624], [826, 668], [470, 96]];

function Screw({ x, y, P }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="13" fill="#000" fillOpacity=".35" transform="translate(1.5,2)" />
      <circle r="12" fill={`url(#${P}screw)`} />
      <circle r="12" fill="none" stroke="#000" strokeOpacity=".35" />
      <polygon points={hexPts(0, 0, 5).join(' ')} fill="#2a2c30" />
      <polygon points={hexPts(0, 0, 5).join(' ')} fill="none" stroke="#fff" strokeOpacity=".35" transform="translate(.6,.8)" />
    </g>
  );
}

// displacement map: normal of a blurred glass mask -> R,G offsets
function buildMap() {
  const s = 1; const w = GB.w * s, h = GB.h * s;
  const a = document.createElement('canvas'); a.width = w; a.height = h;
  const ca = a.getContext('2d');
  ca.translate(-GB.x * s, -GB.y * s); ca.scale(s, s);
  ca.fillStyle = '#fff'; ca.fill(new Path2D(GLASS));
  const b = document.createElement('canvas'); b.width = w; b.height = h;
  const cb = b.getContext('2d');
  cb.filter = 'blur(20px)'; cb.drawImage(a, 0, 0);
  const src = cb.getImageData(0, 0, w, h).data;
  const al = (x, y) => src[(Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))) * 4 + 3] / 255;
  const out = cb.createImageData(w, h); const d = out.data;
  let max = 0; const gx = new Float32Array(w * h), gy = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    gx[i] = al(x + 2, y) - al(x - 2, y); gy[i] = al(x, y + 2) - al(x, y - 2);
    const m = Math.hypot(gx[i], gy[i]); if (m > max) max = m;
  }
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    // edge: sample outward along the normal; body: tiny magnification toward centre
    const ex = -gx[i] / max, ey = -gy[i] / max;
    const mx = -(x - cx) / cx * 0.09, my = -(y - cy) / cy * 0.09;
    d[i * 4] = Math.max(0, Math.min(255, 128 + (ex + mx) * 127));
    d[i * 4 + 1] = Math.max(0, Math.min(255, 128 + (ey + my) * 127));
    d[i * 4 + 2] = 128; d[i * 4 + 3] = 255;
  }
  cb.putImageData(out, 0, 0);
  return b.toDataURL();
}

export default function CyberCard({ stage = 'transparent', under, compact = false }) {
  const P = `cb${useId().replace(/[^a-zA-Z0-9]/g, '')}-`;
  const [map, setMap] = useState('');
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 260, y: 140 });
  const box = useRef(null);
  const raf = useRef(0);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => { try { setMap(buildMap()); } catch (e) { /* canvas unavailable: glass shows frosted only */ } }, []);

  const move = (e) => {
    if (reduce) return;
    const b = box.current.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setOff({ x: (px - 0.5) * -22, y: (py - 0.5) * -16 });
      setSheen({ x: px * VW, y: py * VH });
    });
  };
  const leave = () => { setOff({ x: 0, y: 0 }); setSheen({ x: 260, y: 140 }); };

  const gx = GB.x + off.x, gy = GB.y + off.y;

  return (
    <div className={`cyber${compact ? ' compact' : ''}`} ref={box} onPointerMove={move} onPointerLeave={leave}>
      <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label="Transit pass: a frosted glass card resting on a punched titanium plate. Chicago to Pune, gate 14, 18 March 2071.">
        <defs>
          <linearGradient id={P + "metal"} x1="0" y1="0" x2=".55" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--cb-m1)' }} /><stop offset=".55" style={{ stopColor: 'var(--cb-m2)' }} /><stop offset="1" style={{ stopColor: 'var(--cb-m3)' }} />
          </linearGradient>
          <radialGradient id={P + "screw"} cx=".35" cy=".3" r=".85">
            <stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#b9bdc2" /><stop offset="1" stopColor="#5d6167" />
          </radialGradient>
          <radialGradient id={P + "sheen"} gradientUnits="userSpaceOnUse" cx={sheen.x} cy={sheen.y} r="460">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".5" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={P + "glassbody"} x1="0" y1="0" x2=".6" y2="1">
            <stop offset="0" style={{ stopColor: '#fff', stopOpacity: 'var(--cb-g1)' }} /><stop offset=".55" style={{ stopColor: '#fff', stopOpacity: 'var(--cb-g2)' }} /><stop offset="1" style={{ stopColor: '#fff', stopOpacity: 'var(--cb-g3)' }} />
          </linearGradient>
          <linearGradient id={P + "halfmask"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".35" stopColor="#fff" stopOpacity=".15" /><stop offset=".75" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".5" />
          </linearGradient>
          <pattern id={P + "dots"} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".85" fill="#fff" /></pattern>
          <mask id={P + "halftone"} maskUnits="userSpaceOnUse" x="0" y="0" width={VW} height={VH}><path d={GLASS} transform={`translate(${off.x},${off.y})`} fill={`url(#${P}halfmask)`} /></mask>
          <clipPath id={P + "glassclip"}><path d={GLASS} /></clipPath>
          <clipPath id={P + "plateclip"}><path d={PLATE} /></clipPath>

          {/* bead-blast grain */}
          <filter id={P + "grain"} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="7" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .7 -.35 -.35 0 0" />
          </filter>
          {/* real lit bevel on every edge and hole */}
          <filter id={P + "bevel"} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b" />
            <feSpecularLighting in="b" surfaceScale="4" specularConstant="1.15" specularExponent="26" lightingColor="#ffffff" result="spec">
              <feDistantLight azimuth="225" elevation="40" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feDiffuseLighting in="b" surfaceScale="4" diffuseConstant="1.28" lightingColor="#ffffff" result="diff">
              <feDistantLight azimuth="225" elevation="52" />
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1" result="shaded" />
            <feComposite in="specIn" in2="shaded" operator="arithmetic" k2=".6" k3="1" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={P + "rim"} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b" />
            <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.3" specularExponent="34" lightingColor="#ffffff" result="spec">
              <feDistantLight azimuth="225" elevation="35" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={P + "drop"} x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="10" dy="18" stdDeviation="14" floodColor="#000" floodOpacity=".55" /></filter>
          <filter id={P + "blur10"} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="11" /></filter>
          <filter id={P + "blur4"} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id={P + "glow"} filterUnits="userSpaceOnUse" x="-100" y="-100" width="1200" height="960"><feGaussianBlur stdDeviation="7" /></filter>
          {/* refraction: three displacements, one per colour channel */}
          <filter id={P + "refract"} filterUnits="userSpaceOnUse" x="0" y="0" width={VW} height={VH} colorInterpolationFilters="sRGB">
            <feFlood style={{ floodColor: under || (compact ? 'var(--bg-in)' : 'var(--bg)') }} result="fl" />
            <feMerge result="src"><feMergeNode in="fl" /><feMergeNode in="SourceGraphic" /></feMerge>
            {map && <feImage href={map} x={gx} y={gy} width={GB.w} height={GB.h} preserveAspectRatio="none" result="m" />}
            <feDisplacementMap in="src" in2="m" scale="78" xChannelSelector="R" yChannelSelector="G" result="d1" />
            <feDisplacementMap in="src" in2="m" scale="88" xChannelSelector="R" yChannelSelector="G" result="d2" />
            <feDisplacementMap in="src" in2="m" scale="98" xChannelSelector="R" yChannelSelector="G" result="d3" />
            <feColorMatrix in="d1" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="d2" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="d3" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bb" />
            <feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg" />
            <feComposite in="rg" in2="bb" operator="arithmetic" k2="1" k3="1" result="rgb" />
            <feGaussianBlur in="rgb" stdDeviation="1.6" result="soft" />
            <feColorMatrix in="soft" values="1.03 0 0 0 .04  0 1.03 0 0 .04  0 0 1.05 0 .05  0 0 0 1 0" />
          </filter>

          {/* the scene the glass looks at */}
          <g id={P + "scene"}>
            <rect width={VW} height={VH} fill={stage} />
            <g filter={`url(#${P}drop)`}>
              <path d={METAL_D} fillRule="evenodd" fill={`url(#${P}metal)`} filter={`url(#${P}bevel)`} />
            </g>
            <g clipPath={`url(#${P}plateclip)`}>
              <rect width={VW} height={VH} filter={`url(#${P}grain)`} opacity=".55" style={{ mixBlendMode: 'overlay' }} mask={`url(#${P}holesmask)`} />
              <rect width={VW} height={VH} fill={`url(#${P}sheen)`} style={{ mixBlendMode: 'soft-light' }} mask={`url(#${P}holesmask)`} />
              {/* engraving: dark cut, lit lower lip */}
              <g className="cb-eng">
                <text x="196" y="122" transform="translate(0,1.2)" className="lip">SN 0447-2071 · Ti GRADE 5</text>
                <text x="196" y="122">SN 0447-2071 · Ti GRADE 5</text>
                <text x="196" y="146" transform="translate(0,1.2)" className="lip">BEAD BLASTED · 0.4 MM CHAMFER</text>
                <text x="196" y="146">BEAD BLASTED · 0.4 MM CHAMFER</text>
              </g>
              <g className="cb-trace">
                <path d="M412,330 H470 L500,300 V180 L520,160" transform="translate(0,1.2)" className="lip" />
                <path d="M412,330 H470 L500,300 V180 L520,160" />
                <path d="M300,452 V520 L330,550 H480" transform="translate(0,1.2)" className="lip" />
                <path d="M300,452 V520 L330,550 H480" />
              </g>
              <text x="196" y="645" className="cb-big lip" transform="translate(0,1.5)">2071</text>
              <text x="196" y="645" className="cb-big">2071</text>
              {/* emissive groove in the metal */}
              <rect x="876" y="176" width="10" height="150" rx="5" fill="#111" />
              <rect x="877" y="180" width="8" height="142" rx="4" fill="var(--cb-acc)" filter={`url(#${P}glow)`} />
              <rect x="879" y="184" width="4" height="134" rx="2" fill="var(--cb-acc-core)" />
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${206 + i * 34},512) skewX(-30)`}>
                  <rect width="22" height="30" rx="3" fill="#111" />
                  <rect x="2" y="2" width="18" height="26" rx="2" fill="var(--cb-acc)" opacity={i === 2 ? 0.35 : 1} />
                </g>
              ))}
            </g>
            {SCREWS.map(([x, y]) => <Screw key={`${x}-${y}`} x={x} y={y} P={P} />)}
          </g>
          <mask id={P + "holesmask"} maskUnits="userSpaceOnUse" x="0" y="0" width={VW} height={VH}>
            <path d={METAL_D} fillRule="evenodd" fill="#fff" />
          </mask>
        </defs>

        <use href={`#${P}scene`} />

        <g transform={`translate(${off.x},${off.y})`}>
          {/* glass shadow: pale, with a caustic line beyond the far edge */}
          <path d={GLASS} transform="translate(14,22)" fill="#000" fillOpacity=".28" filter={`url(#${P}blur10)`} />
          <path d={GLASS} transform="translate(18,28)" fill="none" stroke="var(--cb-caustic)" strokeWidth="4" strokeOpacity=".4" filter={`url(#${P}blur10)`} />

          {/* what you see through it: the metal, bent at the bevel */}
          <g clipPath={`url(#${P}glassclip)`}>
            <use href={`#${P}scene`} transform={`translate(${-off.x},${-off.y})`} filter={`url(#${P}refract)`} />
            <path d={GLASS} fill={`url(#${P}glassbody)`} />
          </g>
          <rect width={VW} height={VH} fill={`url(#${P}dots)`} style={{ opacity: 'var(--cb-dot)' }} mask={`url(#${P}halftone)`} transform={`translate(${-off.x},${-off.y})`} />
          <path d={GLASS} fill="#fff" filter={`url(#${P}rim)`} opacity=".9" />
          <path d={GLASS} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" />

          {/* emissive bar printed on the glass */}
          <rect x="560" y="222" width="120" height="6" rx="3" fill="var(--cb-acc)" filter={`url(#${P}glow)`} />
          <rect x="560" y="222" width="120" height="6" rx="3" fill="var(--cb-acc-core)" />

          {/* content on the glass: never distorted */}
          <g className="cb-ink">
            <text x="560" y="270" className="cap">TRANSIT PASS · CLASS A</text>
            <text x="558" y="338" className="disp">CHI</text>
            <path d="M676,320 H722 M710,308 L724,320 L710,332" className="arrow" />
            <text x="738" y="338" className="disp">PNQ</text>
            <text x="822" y="500" className="num">07</text>
            <text x="826" y="528" className="cap small">CAR</text>
            <text x="574" y="598" className="cap">HYPERLOOP · GATE 14 · SEAT C4</text>
            <text x="572" y="640" className="mid">2071.03.18 · 06:40</text>
            <circle cx="900" cy="270" r="7" className="led" />
          </g>
        </g>
      </svg>
    </div>
  );
}
