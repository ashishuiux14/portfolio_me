import { useState } from 'react';
import { PrevNext } from '../components/Bits';
import { ClayToggle, AluToggle, SoundSwitch } from '../lab/Art';
import Watch from '../lab/Watch';
import LightLab from '../lab/LightLab';
import GlassAlu from '../lab/GlassAlu';
import { Thermostat, PetFeeder, MATERIALS, MaterialPuck } from '../lab/Devices';
import { Seg } from '../lab/Seg';
import '../lab/softui.css';



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

  return (
    <div className="page page-softui" style={{ gap: 110 }}>
      {/* ---------- cover: glass over aluminium ---------- */}
      <section className="section" style={{ gap: 36 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span className="cap">Interaction Lab · 01</span>
            <h1 className="display">Soft UI Language</h1>
          </div>
          <p className="lede" style={{ maxWidth: 560 }}>Soft clay, plastic, polished metal, brushed aluminium and glass: what each material looks like on screen, how it handles light, and where it belongs on real devices.</p>
        </div>
        <GlassAlu />
        <div className="ga-notes">
          <div className="note up-sm"><span className="n">01 · THE BODY</span><b>Thick glass is a weak lens</b><p>Through the middle of the slab the aluminium is slightly magnified and softened, so the grille and the spun rings look closer than the metal around them.</p></div>
          <div className="note up-sm"><span className="n">02 · THE EDGE</span><b>The bevel bends light hardest</b><p>At the rim the metal behind is pulled sideways and split into faint colour fringes. That fringe is what tells the eye this is real glass, not a blurred panel.</p></div>
          <div className="note up-sm"><span className="n">03 · THE SHADOW</span><b>Pale, with a bright line</b><p>Glass blocks little light, so its shadow on the metal is soft and light. The slab focuses some of it into a thin bright caustic beyond its far edge.</p></div>
        </div>
        <p className="cap" style={{ textAlign: 'center' }}>Drag the glass across the aluminium, or focus it and use the arrow keys</p>
      </section>

      {/* ---------- five materials ---------- */}
      <section className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="cap">Five materials · one object</span>
          <h2 className="h2">The same button, five ways.</h2>
        </div>
        <div className="mats">
          {MATERIALS.map((m) => (
            <figure key={m.id} className="mat-tile up">
              <div className={`mat-stage${m.id === 'glass' ? ' glass' : ''}`}><MaterialPuck id={m.id} /></div>
              <figcaption><b>{m.name}</b><span className="l">{m.light}</span><span className="u">{m.use}</span></figcaption>
            </figure>
          ))}
        </div>
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

      {/* ---------- use cases ---------- */}
      <section className="section" style={{ gap: 34 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">Use cases · devices and platforms</span>
            <h2 className="h2">Materials at work.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 460 }}>Each device mixes materials by job: something to touch, something to read, something to protect. All three are working prototypes.</p>
        </div>
        <div className="scen-grid">
          <Scenario title="Thermostat" platform="Wall device" mats={['Brushed aluminium', 'Smoked glass', 'Soft clay']}
            text="An aluminium ring you turn, a glass face you read through, a clay plate that disappears into the wall. The arc glows ember when heating and blue when cooling."
            hint="Turn the ring, or focus it and use the arrow keys">
            <Thermostat />
          </Scenario>
          <Scenario title="Pet feeder" platform="Countertop device" mats={['Gloss plastic', 'Clear hopper', 'LCD', 'Soft clay keys', 'Steel bowl']}
            text="Plastic for a body that gets knocked about, a clear hopper so the food level is obvious from across the room, an LCD that stays readable in daylight."
            hint="Set portions, then press Feed now">
            <PetFeeder />
          </Scenario>
        </div>
        <Scenario wide title="Watch" platform="Wearable" mats={['Polished metal', 'LCD', 'Cover glass']}
          text="A segment display that reads in sunlight and costs almost no power. Digits cast a faint shadow on the mirror behind them; the backlight turns that mirror into the light source."
          hint="Side buttons: LIGHT · MODE for Chicago, Pune and stopwatch · START · RESET">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <Watch />
            <SoundSwitch />
          </div>
        </Scenario>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span className="cap">Use case · mobile app</span><h2 className="h2">The kit on a phone</h2></div>
          <p className="muted" style={{ maxWidth: 420 }}>The same materials on a phone: soft for everyday, an LCD for live numbers, glass for the one overlay.</p>
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

function Scenario({ title, platform, mats, text, hint, wide, children }) {
  return (
    <article className="scen up" style={wide ? {} : undefined}>
      <div className="scen-stage in">{children}</div>
      <div className="scen-head"><h3>{title}</h3><span className="cap">{platform}</span></div>
      <div className="chips">{mats.map((m) => <span key={m} className="tag">{m}</span>)}</div>
      <p>{text}</p>
      <span className="cap">{hint}</span>
    </article>
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
