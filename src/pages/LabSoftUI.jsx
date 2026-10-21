import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrevNext } from '../components/Bits';
import { ClayToggle, AluToggle, SoundSwitch } from '../lab/Art';
import Watch from '../lab/Watch';
import LightLab from '../lab/LightLab';
import Plate from '../lab/Plate';
import { Seg } from '../lab/Seg';
import '../lab/softui.css';

const SURFACES = [
  {
    name: 'Soft', sub: 'Neumorphism', verb: 'Diffuses light', stage: 'soft',
    pts: ['Moulded from the page colour; never a new colour', 'Two shadows: dark away from the light, glow towards it', 'Raised can be pressed, pressed is on, flat is information'],
  },
  {
    name: 'Hard', sub: 'Aluminium · skeuomorphism', verb: 'Reflects light', stage: 'hard',
    pts: ['One sharp highlight that moves with the light', 'Short, dark contact shadows: it sits on the surface', 'Chamfers catch light on one edge, lose it on the other'],
  },
  {
    name: 'Glass', sub: 'Glassmorphism', verb: 'Transmits light', stage: 'glass',
    pts: ['Blurs whatever sits behind it, so it needs colour behind', 'A thin bright edge on the side facing the light', 'Pale, tinted shadow; overlays and summaries only'],
  },
  {
    name: 'LCD', sub: 'Segment display', verb: 'Reflects back · or glows', stage: 'lcd',
    pts: ['Digits cast a faint shadow on the mirror behind them', 'Unlit segments stay faintly visible: the ghost', 'Backlight turns the reflector into the light source'],
  },
];

const LAYERS = [
  ['Cover glass', 'Takes the glare. Highlights belong here, never on the digits.'],
  ['Front polariser', 'Tints the whole window the familiar grey-green.'],
  ['Liquid crystal', 'Each segment twists light only when switched on, so it reads dark. Unlit segments still show faintly.'],
  ['Rear polariser', 'Blocks the twisted light; this is what makes a lit segment black.'],
  ['Reflector', 'A mirror the digits float above, so each digit leaves a soft shadow on it. With the backlight on, it glows instead.'],
];

const PRINCIPLES = [
  ['01', 'One light source', 'Top left, everywhere. Every shadow, edge and glare agrees with it.'],
  ['02', 'Depth means action', 'Raised can be pressed. Pressed is on or selected. Flat is information.'],
  ['03', 'Contrast first', 'Labels never rely on shadows. Text meets 4.5:1 on its surface.'],
  ['04', 'Materials have jobs', 'Soft for everyday, hard for deliberate, glass for overlays, LCD for live numbers.'],
  ['05', 'Emitted light is separate', 'Glows and backlights ignore the light source, because they are one.'],
  ['06', 'Motion with weight', 'Clay springs, metal snaps. Reduced-motion users get instant changes.'],
];

const COLORS = [
  ['Ink', '#2A2724', '12.0', 'All text', true],
  ['Muted', '#5E5750', '5.7', 'Body copy', true],
  ['Ember', '#D9572B', '3.2', 'Fills, glow, large type', false],
  ['Ember deep', '#A63F1C', '5.1', 'Accent text', true],
  ['Cobalt', '#2F5FBF', '4.8', 'Links, text', true],
  ['LCD ink on LCD', '#171A15', '7.2', 'Readouts', true],
];

export default function LabSoftUI() {
  const [clay, setClay] = useState(true);
  const [alu, setAlu] = useState(true);
  const [open, setOpen] = useState(true);
  const [hl, setHl] = useState(-1);

  return (
    <div className="page page-softui" style={{ gap: 110 }}>
      {/* ---------- cover: the watch ---------- */}
      <section className="section" style={{ gap: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span className="cap">Interaction Lab · 01</span>
            <h1 className="display">Soft UI Language</h1>
          </div>
          <p className="lede" style={{ maxWidth: 560 }}>Four surfaces, one light source. How soft, hard, glass and LCD each answer the same light, and when each one earns its place.</p>
        </div>
        <Watch />
        <div className="watch-hint">
          <span className="cap">Press the side buttons · LIGHT · MODE for Chicago, Pune and the stopwatch · START · RESET</span>
          <SoundSwitch />
        </div>
      </section>

      {/* ---------- four surfaces ---------- */}
      <section className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="cap">Four surfaces</span>
          <h2 className="h2">Same light, four answers.</h2>
        </div>
        <div className="surf-grid">
          {SURFACES.map((s) => (
            <article key={s.name} className="surf up">
              <SurfaceStage kind={s.stage} clay={clay} setClay={setClay} alu={alu} setAlu={setAlu} />
              <span className="verb">{s.verb}</span>
              <h3>{s.name} <span style={{ color: 'var(--ink-3)', fontSize: 16 }}>· {s.sub}</span></h3>
              <ul>{s.pts.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="muted">The working controls, each built in clay and aluminium, live in <Link to="/lab/controls" className="accent" style={{ textDecoration: 'underline' }}>02 · Controls</Link>.</p>
      </section>

      {/* ---------- light lab ---------- */}
      <section className="section" style={{ gap: 34 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">Move the light</span>
            <h2 className="h2">Where the light is decides everything.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 460 }}>The site locks the light at top left. Here you can move it and watch each material respond the way the real thing would.</p>
        </div>
        <LightLab />
      </section>

      {/* ---------- hard + glass ---------- */}
      <section className="section" style={{ gap: 30 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">Hard + glass · lit from within</span>
            <h2 className="h2">Metal reflects. Glass carries light.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 460 }}>Move your pointer over the plate. The reflection on the metal follows you; the glow in the glass does not. Ember in light mode, white in dark.</p>
        </div>
        <Plate />
        <div className="plate-notes">
          <div className="note up-sm"><span className="n">01 · BRUSHED METAL</span><b>Highlights stretch across the grain</b><p>Brushing leaves fine parallel grooves, so a reflection smears along them instead of forming a round spot. Chamfered edges are lit on the side facing the light and dark on the far side.</p></div>
          <div className="note up-sm"><span className="n">02 · RECESS</span><b>A cut-out is the inverse of a plate</b><p>A raised plate throws its shadow away from the light. A channel cut into the metal does the opposite: the wall nearest the light is in shade, the far wall catches it.</p></div>
          <div className="note up-sm"><span className="n">03 · EMISSIVE GLASS</span><b>Glow is its own light source</b><p>The glass channel ignores the top-left rule: it is bright at its core and spills colour onto the metal around it. Frosted glass softens that glow; clear glass shows a thin bright edge.</p></div>
        </div>
      </section>

      {/* ---------- LCD anatomy ---------- */}
      <section className="section" style={{ gap: 30 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">LCD · five layers</span>
            <h2 className="h2">Why a watch display looks the way it does.</h2>
          </div>
          <button type="button" className={`pill ${open ? 'up-sm press' : 'in-sm'}`} onClick={() => setOpen(!open)} aria-pressed={open}>{open ? 'Assemble' : 'Explode'}</button>
        </div>
        <div className={`xlcd${open ? ' open' : ''}`}>
          <div className="xlcd-stage in" aria-hidden="true">
            <div className="xlcd-stack">
              {/* bottom to top */}
              <div className={`xlcd-layer${hl === 4 ? ' hl' : ''}`} style={{ '--i': 0, background: 'linear-gradient(176deg, #C3C8B6, #A2A996)' }}>
                <svg viewBox="0 0 230 100"><defs><filter id="xsh"><feGaussianBlur stdDeviation="1.4" /></filter></defs>
                  <Seg text="12:45" x={24} y={14} h={72} ink="transparent" shadow={{ dx: 0, dy: 0, color: 'rgba(23,26,21,.3)', filter: 'xsh' }} />
                </svg>
              </div>
              <div className={`xlcd-layer${hl === 3 ? ' hl' : ''}`} style={{ '--i': 1, background: 'rgba(120,128,108,.22)', border: '1px solid rgba(255,255,255,.35)' }} />
              <div className={`xlcd-layer${hl === 2 ? ' hl' : ''}`} style={{ '--i': 2, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.4)' }}>
                <svg viewBox="0 0 230 100"><Seg text="12:45" x={24} y={14} h={72} ink="#171A15" ghost="rgba(23,26,21,.12)" /></svg>
              </div>
              <div className={`xlcd-layer${hl === 1 ? ' hl' : ''}`} style={{ '--i': 3, background: 'rgba(150,160,130,.2)', border: '1px solid rgba(255,255,255,.35)' }} />
              <div className={`xlcd-layer${hl === 0 ? ' hl' : ''}`} style={{ '--i': 4, background: 'linear-gradient(118deg, rgba(255,255,255,.5), rgba(255,255,255,.08) 34%, rgba(255,255,255,0) 35%)', border: '1px solid rgba(255,255,255,.7)' }} />
            </div>
          </div>
          <ol className="xlcd-list">
            {LAYERS.map(([t, d], i) => (
              <li key={t} className={hl === i ? 'in-sm' : 'up-sm'} onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(-1)}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span><b>{t}</b><span>{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- one readout, every surface ---------- */}
      <section className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="cap">One readout, every surface</span>
          <h2 className="h2">32%, seven ways.</h2>
        </div>
        <div className="dm">
          <Cell t="Soft · well" u="Default readout inside a soft control."><span className="in-sm" style={{ padding: '10px 18px', borderRadius: 18, fontSize: 36, fontWeight: 300 }}>32%</span></Cell>
          <Cell t="Soft · carved" u="Decoration only; it fails contrast, so the value is always stated elsewhere."><span className="carved" style={{ fontSize: 56, fontWeight: 600 }}>32%</span></Cell>
          <Cell t="Hard · engraved" u="Labels on metal: cut in, lit on the lower lip." stage={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, rgba(0,0,0,.04) 1px 3px), linear-gradient(180deg, #ECEDEF, #BDC0C4)' }}><span className="dm-engrave">32%</span></Cell>
          <Cell t="Glass" u="Floats over colour. Needs something behind it to read as glass." stage={{ background: 'var(--ll-glass-bg)' }}>
            <span className="ll-blob" style={{ left: '14%', top: '6%', width: 90, height: 90, background: 'var(--glow-a)' }} /><span className="ll-blob" style={{ left: '52%', top: '30%', width: 80, height: 80, background: 'var(--glow-b)' }} />
            <span className="ll-glass" style={{ width: 150, height: 86, fontSize: 32, boxShadow: 'inset 1.5px 1.5px 0 rgba(255,255,255,.6), 10px 14px 28px rgba(40,30,25,.16)' }}><span>32%</span></span>
          </Cell>
          <Cell t="LCD" u="Live numbers that change: time, counts, levels."><LcdChip text="32" /></Cell>
          <Cell t="LCD · backlit" u="The same display at night. The reflector becomes the light."><LcdChip text="32" lit /></Cell>
          <Cell t="Emissive glass" u="Status that must be seen from across a room. Use sparingly." stage={{ background: '#1B1C1E' }}><span className="dm-glow">32%</span></Cell>
        </div>
      </section>

      {/* ---------- principles ---------- */}
      <section className="up" style={{ borderRadius: 50, padding: 'clamp(24px, 4vw, 56px)' }} aria-label="Principles">
        <div className="grid-3" style={{ gap: 0 }}>
          {PRINCIPLES.map(([n, t, d]) => (
            <div key={n} style={{ padding: '24px clamp(12px, 2vw, 30px)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
              <span className="carved" style={{ fontSize: 40, fontWeight: 500, lineHeight: 1 }} aria-hidden="true">{n}</span>
              <h2 style={{ fontWeight: 400, fontSize: 24, lineHeight: 1.15 }}>{t}</h2>
              <p className="muted" style={{ fontSize: 16, maxWidth: 300 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- colour ---------- */}
      <section className="section" style={{ gap: 18 }}>
        <span className="cap">Colour on #EBE6E2 · contrast checked</span>
        <div className="up colors" style={{ borderRadius: 40, padding: '26px 30px' }}>
          {COLORS.map(([n, hex, r, use, ok]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 44, height: 44, borderRadius: 14, background: hex, boxShadow: 'inset 2px 2px 4px rgba(0,0,0,.18), var(--sh-up-sm)' }} />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}><span>{n}</span><span className="cap">{hex}</span></span>
              <span className="tag" style={{ color: ok ? 'var(--ok)' : 'var(--accent-ink)', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{r}:1 · {use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- in context ---------- */}
      <section style={{ borderRadius: 44, padding: 'clamp(24px, 4vw, 60px)', background: 'linear-gradient(115deg, color-mix(in srgb, var(--accent-2) 16%, var(--bg)) 0 52%, color-mix(in srgb, var(--ok) 14%, var(--bg)) 52% 100%)', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span className="cap">In context · concept screens</span><h2 className="h2">The kit, put to work</h2></div>
          <p className="muted" style={{ maxWidth: 420 }}>Three concept screens built only from the lab’s parts: soft for everyday, an LCD for live numbers, glass for the one overlay.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          <Phone title="Studio climate">
            <div style={{ display: 'grid', placeItems: 'center', padding: '6px 0' }}>
              <div className="up" style={{ width: 180, height: 180, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                <div className="in" style={{ width: 128, height: 128, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><LcdChip text="21" small /></div>
              </div>
            </div>
            <Row label="Lights"><span className="lcd" style={{ fontSize: 13, padding: '3px 8px' }}>32%</span></Row>
            <div className="in-sm" style={{ position: 'relative', height: 12, borderRadius: 6 }} aria-hidden="true"><span style={{ position: 'absolute', left: 3, top: 3, width: '32%', height: 6, borderRadius: 3, background: 'var(--accent)' }} /><span className="up-sm" style={{ position: 'absolute', left: '28%', top: -9, width: 30, height: 30, borderRadius: '50%' }} /></div>
            <Row label="Blinds"><ClayToggle checked={clay} onChange={setClay} zoom={0.4} label="Blinds" /></Row>
          </Phone>
          <Phone title="Site hours" dark>
            <span style={{ fontWeight: 200, fontSize: 30, lineHeight: 1.15 }}>Atelier<br />site visit</span>
            <div style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}><LcdChip text="02:45" wide /></div>
            <Row label="Billable"><AluToggle checked={alu} onChange={setAlu} zoom={0.38} label="Billable" /></Row>
            <span aria-hidden="true" style={{ position: 'absolute', left: 30, bottom: 50, width: 120, height: 70, borderRadius: '50%', background: '#D9572B', filter: 'blur(30px)', opacity: .5 }} />
            <span className="glass" style={{ position: 'relative', marginTop: 'auto', minHeight: 54, borderRadius: 27, display: 'grid', placeItems: 'center', fontWeight: 500 }}>Log time</span>
          </Phone>
          <Phone title="Choose seats">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 8, marginTop: 6 }} aria-hidden="true">
              {Array.from({ length: 36 }, (_, i) => {
                const taken = [2, 3, 8, 14, 15, 20, 27, 33].includes(i), mine = [21, 22].includes(i);
                return <span key={i} style={{ height: 26, borderRadius: '8px 8px 5px 5px', border: taken ? '1px solid var(--ink-3)' : '2.5px solid var(--seat-free)', opacity: taken ? .45 : 1, background: mine ? 'var(--seat-free)' : 'color-mix(in srgb, var(--seat-free) 12%, transparent)' }} />;
              })}
            </div>
            <div className="up-sm" style={{ marginTop: 'auto', minHeight: 54, borderRadius: 27, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px' }}><span>D4 · D5</span><b className="accent" style={{ fontWeight: 500 }}>Continue</b></div>
          </Phone>
        </div>
      </section>

      <PrevNext prev={{ to: '/lab', label: 'Interaction Lab', eyebrow: 'Back' }} next={{ to: '/lab/controls', label: '02 · Controls' }} />
    </div>
  );
}

function SurfaceStage({ kind }) {
  if (kind === 'soft') {
    return (
      <div className="surf-stage" style={{ background: 'var(--bg)', gap: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="up" style={{ width: 74, height: 74, borderRadius: 22 }} />
        <span className="in" style={{ width: 74, height: 74, borderRadius: 22 }} />
        <span style={{ width: 74, height: 74, borderRadius: 22, border: '1px solid var(--rule)' }} />
      </div>
    );
  }
  if (kind === 'hard') {
    return (
      <div className="surf-stage" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, rgba(0,0,0,.04) 1px 3px), linear-gradient(180deg, var(--pl-a), var(--pl-b))', boxShadow: 'inset 0 2px 0 var(--pl-hi), inset 0 -2px 4px rgba(0,0,0,.15)' }}>
        <span className="ll-chamfer" style={{ width: 104, height: 104, background: 'linear-gradient(135deg, #8b8e93, #f7f8f9)', boxShadow: '3px 4px 4px rgba(0,0,0,.38), 10px 14px 20px rgba(0,0,0,.16)' }}>
          <span className="ll-metal" style={{ width: 80, height: 80, background: 'radial-gradient(circle at 33% 33%, rgba(255,255,255,.95) 0 6%, rgba(255,255,255,0) 22%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.16) 0 .6px, rgba(0,0,0,.06) .6px 1.4px), linear-gradient(315deg, #7d8086, #c9cbcf 55%, #fbfbfc)' }} />
        </span>
      </div>
    );
  }
  if (kind === 'glass') {
    return (
      <div className="surf-stage" style={{ background: 'var(--ll-glass-bg)' }}>
        <span className="ll-blob" style={{ left: '18%', top: '8%', width: 100, height: 100, background: 'var(--glow-a)' }} />
        <span className="ll-blob" style={{ left: '50%', top: '34%', width: 90, height: 90, background: 'var(--glow-b)' }} />
        <span className="ll-glass" style={{ width: 160, height: 92, fontSize: 30, boxShadow: 'inset 1.5px 1.5px 0 rgba(255,255,255,.6), 10px 14px 28px rgba(40,30,25,.16)' }}><span>C4 · C5</span></span>
      </div>
    );
  }
  return <div className="surf-stage" style={{ background: 'var(--bg)' }}><LcdChip text="12:45" wide /></div>;
}

function LcdChip({ text, lit, small, wide }) {
  const h = small ? 46 : 64;
  const vbW = wide ? 300 : 170;
  return (
    <span className="lcd" style={{ padding: 0, overflow: 'hidden', borderRadius: 14, width: small ? 92 : wide ? 210 : 130, ...(lit ? { background: 'radial-gradient(90% 110% at 50% 55%, #B9F2E6, #79D3C2 55%, #4DAF9F)', boxShadow: 'inset 2px 3px 6px rgba(10,50,44,.4), 0 0 24px rgba(110,220,200,.45)' } : {}) }}>
      <svg viewBox={`0 0 ${vbW} 100`} style={{ display: 'block', width: '100%', height: 'auto' }} aria-label={text}>
        <defs><filter id={`lc${text.replace(/\W/g, '')}${lit ? 'l' : ''}`}><feGaussianBlur stdDeviation="1.1" /></filter></defs>
        <Seg text={text} x={wide || small ? (vbW - Seg.width(text, h)) / 2 + 4 : 30} y={(100 - h) / 2} h={h} ink="#171A15" ghost={lit ? 'rgba(10,50,44,.1)' : 'rgba(23,26,21,.08)'} shadow={{ dx: 2.4, dy: 3, color: lit ? 'rgba(10,50,44,.18)' : 'rgba(23,26,21,.26)', filter: `lc${text.replace(/\W/g, '')}${lit ? 'l' : ''}` }} />
        {!wide && !small && <text x="128" y="74" style={{ font: '600 30px var(--mono)', fill: '#171A15' }}>%</text>}
      </svg>
    </span>
  );
}

function Cell({ t, u, stage, children }) {
  return (
    <figure className="dm-cell up-sm" style={{ margin: 0 }}>
      <div className="dm-stage" style={stage || { background: 'var(--bg)' }}>{children}</div>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 4px 4px' }}><b>{t}</b><span className="u">{u}</span></figcaption>
    </figure>
  );
}

function Row({ label, children }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{label}</span>{children}</div>;
}

function Phone({ title, dark, children }) {
  return (
    <div style={{ width: 290, maxWidth: '100%', height: 600, borderRadius: 46, padding: 11, background: dark ? '#2C2926' : 'var(--bg)', boxShadow: '16px 16px 34px rgba(110,110,120,.35), -10px -10px 26px rgba(255,255,255,.55)' }}>
      <div className={dark ? '' : 'in-sm'} style={{ position: 'relative', height: '100%', borderRadius: 36, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 18, padding: '50px 22px 24px', background: dark ? '#2C2926' : 'var(--bg)', color: dark ? '#F2EDE8' : 'var(--ink)', boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,.06)' : undefined }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: 120, height: 26, marginLeft: -60, borderRadius: '0 0 16px 16px', background: dark ? '#24211F' : 'var(--bg-in)' }} />
        <b style={{ fontWeight: 500, fontSize: 19 }}>{title}</b>
        {children}
      </div>
    </div>
  );
}
