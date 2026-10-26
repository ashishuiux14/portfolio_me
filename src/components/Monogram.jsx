/* The AD mark: geometric letterforms on a 5×5 unit grid per letter,
   pressed into a blue well. Fixed colours: identical in light and dark. */
export default function Monogram({ title = 'Ashish Dixit' }) {
  return (
    <span className="mono-well">
      <svg viewBox="0 0 10.03 5" role="img" aria-label={title}>
        <defs>
          <filter id="ad-lift" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0.16" dy="0.22" stdDeviation="0.22" floodColor="#2E4A63" floodOpacity="0.42" />
            <feDropShadow dx="-0.06" dy="-0.08" stdDeviation="0.1" floodColor="#FFFFFF" floodOpacity="0.4" />
          </filter>
        </defs>
        <g fill="#ADBFCD" stroke="#55778F" strokeWidth="0.04" strokeLinejoin="round" filter="url(#ad-lift)">
          {/* a */}
          <path d="M0.12 0 H3.5 A0.5 0.5 0 0 1 3.5 1 H0.12 Q0 1 0 0.88 V0.12 Q0 0 0.12 0 Z" />
          <path d="M0.75 2 H2.95 Q3.05 2 3.05 2.1 V2.35 Q3.05 3 2.4 3 H1.5 A0.5 0.5 0 0 0 1.5 4 H3.45 Q4.05 4 4.05 3.4 V1.5 A0.48 0.48 0 0 1 5 1.5 V4.75 Q5 5 4.75 5 H0.75 Q0 5 0 4.25 V2.75 Q0 2 0.75 2 Z" />
          {/* D */}
          <path d="M5.15 0 H8.53 A0.5 0.5 0 0 1 8.53 1 H5.15 Q5.03 1 5.03 0.88 V0.12 Q5.03 0 5.15 0 Z" />
          <path d="M6.15 2 H6.4 Q7.03 2 7.03 2.65 V3.7 Q7.03 4 7.35 4 H8.4 Q9.03 4 9.03 4.6 V4.85 Q9.03 5 8.88 5 H6.15 Q6.03 5 6.03 4.88 V2.12 Q6.03 2 6.15 2 Z" />
          <path d="M9.15 1 Q10.03 1 10.03 1.95 V3.05 Q10.03 4 9.15 4 Q9.08 4 9.08 3.93 V1.07 Q9.08 1 9.15 1 Z" />
        </g>
      </svg>
    </span>
  );
}
