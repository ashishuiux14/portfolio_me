/* LCD glyphs drawn as SVG, so a readout stays razor sharp at any size.
   - Seg: seven-segment digits (and the few letters 7 segments can draw), with
     unlit "ghost" segments like a real LCD and an optional parallax shadow:
     on a real LCD the dark crystal sits a hair above the reflector and casts a
     faint shadow onto it, offset away from the light.
   - Dots: a 5x7 dot-matrix line for day names and labels. */

const MAP = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
  '-': 'g', ' ': '', E: 'adefg', r: 'eg', o: 'cdeg', P: 'abefg', H: 'bcefg', L: 'def', A: 'abcefg', C: 'adef',
  S: 'afgcd', t: 'defg', U: 'bcdef', n: 'ceg', d: 'bcdeg', b: 'cdefg', F: 'aefg',
};

function hbar(x1, x2, cy, t) {
  const h = t / 2;
  return `${x1},${cy} ${x1 + h},${cy - h} ${x2 - h},${cy - h} ${x2},${cy} ${x2 - h},${cy + h} ${x1 + h},${cy + h}`;
}
function vbar(cx, y1, y2, t) {
  const h = t / 2;
  return `${cx},${y1} ${cx + h},${y1 + h} ${cx + h},${y2 - h} ${cx},${y2} ${cx - h},${y2 - h} ${cx - h},${y1 + h}`;
}
// one digit in a 60 x 100 box
const W = 60, H = 100, T = 11, G = 2.2;
const SEGS = {
  a: hbar(T / 2 + G, W - T / 2 - G, T / 2, T),
  g: hbar(T / 2 + G, W - T / 2 - G, H / 2, T),
  d: hbar(T / 2 + G, W - T / 2 - G, H - T / 2, T),
  f: vbar(T / 2, T / 2 + G, H / 2 - G, T),
  b: vbar(W - T / 2, T / 2 + G, H / 2 - G, T),
  e: vbar(T / 2, H / 2 + G, H - T / 2 - G, T),
  c: vbar(W - T / 2, H / 2 + G, H - T / 2 - G, T),
};
const ALL = Object.keys(SEGS);

/* text: digits/letters plus ':' (colon) and '.' ; colonOn lets the colon blink */
export function Seg({ text, x = 0, y = 0, h = 100, ink, ghost, shadow, colonOn = true, gap = 0.22, skew = -7 }) {
  const s = h / H;
  const items = [];
  let cx = 0;
  for (const ch of String(text)) {
    if (ch === ':' || ch === '.') {
      items.push({ kind: ch, x: cx });
      cx += (ch === ':' ? 26 : 18);
    } else {
      items.push({ kind: 'd', ch, x: cx });
      cx += W + W * gap;
    }
  }
  const draw = (fill, lit, keyp) => items.map((it, i) => {
    if (it.kind === ':') {
      if (lit && !colonOn) return null;
      return (
        <g key={keyp + i} transform={`translate(${it.x + 3},0)`}>
          <rect x="2" y="28" width="12" height="12" rx="2" fill={fill} />
          <rect x="2" y="64" width="12" height="12" rx="2" fill={fill} />
        </g>
      );
    }
    if (it.kind === '.') return <rect key={keyp + i} x={it.x + 2} y={H - 12} width="12" height="12" rx="2" fill={fill} />;
    const on = MAP[it.ch] ?? '';
    const segs = lit ? on.split('') : ALL;
    return (
      <g key={keyp + i} transform={`translate(${it.x},0)`}>
        {segs.map((k) => <polygon key={k} points={SEGS[k]} fill={fill} />)}
      </g>
    );
  });
  return (
    <g transform={`translate(${x},${y}) scale(${s}) skewX(${skew})`}>
      {ghost && <g>{draw(ghost, false, 'g')}</g>}
      {shadow && <g transform={`translate(${shadow.dx / s},${shadow.dy / s})`} filter={shadow.filter ? `url(#${shadow.filter})` : undefined}>{draw(shadow.color, true, 's')}</g>}
      <g>{draw(ink, true, 'i')}</g>
    </g>
  );
}
Seg.width = (text, h = 100, gap = 0.22) => {
  let w = 0;
  for (const ch of String(text)) w += ch === ':' ? 26 : ch === '.' ? 18 : W + W * gap;
  return (w - W * gap) * (h / H);
};

const F = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'], B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'], D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'], F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'], H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'], K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'], M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'], O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'], R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'], T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'], V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'], Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'], ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '·': ['.....', '.....', '.....', '..#..', '.....', '.....', '.....'],
};

/* 5x7 dot matrix. dot = pitch of one dot in user units. */
export function Dots({ text, x = 0, y = 0, dot = 6, ink, ghost, shadow }) {
  const cells = [];
  [...String(text).toUpperCase()].forEach((ch, ci) => {
    const g = F[ch] || F[' '];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) {
      cells.push({ x: (ci * 6 + c) * dot, y: r * dot, on: g[r][c] === '#' });
    }
  });
  const sz = dot * 0.78;
  return (
    <g transform={`translate(${x},${y})`}>
      {ghost && cells.map((d, i) => <rect key={'g' + i} x={d.x} y={d.y} width={sz} height={sz} rx={sz * 0.18} fill={ghost} />)}
      {shadow && cells.filter((d) => d.on).map((d, i) => <rect key={'s' + i} x={d.x + shadow.dx} y={d.y + shadow.dy} width={sz} height={sz} fill={shadow.color} />)}
      {cells.filter((d) => d.on).map((d, i) => <rect key={'i' + i} x={d.x} y={d.y} width={sz} height={sz} rx={sz * 0.18} fill={ink} />)}
    </g>
  );
}
Dots.width = (text, dot = 6) => (String(text).length * 6 - 1) * dot;
