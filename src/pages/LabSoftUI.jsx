import { useState } from 'react';
import { PrevNext } from '../components/Bits';
import { ClayToggle, AluToggle, Rotary } from '../lab/Art';

const PRINCIPLES = [
  ['01', 'One light source', 'Every shadow falls down and to the right, so depth reads the same everywhere.'],
  ['02', 'Depth means action', 'Raised can be pressed. Pressed is on or selected. Flat is information.'],
  ['03', 'Contrast first', 'Labels never rely on shadows. Text meets 4.5:1 on the base colour.'],
  ['04', 'Two materials, one grammar', 'Clay and aluminium share sizes, states and spacing; only the feel changes.'],
  ['05', 'Motion with weight', 'Clay springs, metal snaps. Reduced-motion users get instant state changes.'],
  ['06', 'Every state drawn', 'Default, hover, pressed, on, disabled and focus, before anything ships.'],
];
const NUMBERS = [
  ['8', 'Component studies', 'Toggle in two materials, stepper, rotary switch, submit button, date picker, date range and seat map.'],
  ['3', 'Materials', 'Clay, brushed aluminium and glass, each with its own motion and sound.'],
  ['1', 'Light source', 'Top left, everywhere. It is the only rule nothing is allowed to break.'],
];
const SURFACES = [
  ['Convex', 'up', 'Pressable. Buttons, knobs, cards that open.'],
  ['Dent', 'in', 'Selected, on, or a place to type. Inputs and wells.'],
  ['Flat', '', 'Read-only content. No shadow means no action.'],
];
const COLORS = [
  ['Ink', '#2A2724', '12.0', 'All text', true],
  ['Muted', '#5E5750', '5.7', 'Body copy', true],
  ['Ember', '#D9572B', '3.2', 'Fills, large type', false],
  ['Ember deep', '#A63F1C', '5.1', 'Accent text', true],
  ['Cobalt', '#2F5FBF', '4.8', 'Links, text', true],
  ['Charcoal', '#2C2926', '11.7', 'Dark surfaces', true],
];

export default function LabSoftUI() {
  const [clay, setClay] = useState(true);
  const [alu, setAlu] = useState(true);
  const [rot, setRot] = useState(true);

  return (
    <div className="page" style={{ gap: 110 }}>
      {/* cover */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 44, minHeight: 620, padding: 'clamp(28px, 4vw, 64px)' }} className="up">
        <div aria-hidden="true" style={{ position: 'absolute', right: '-22%', top: '-40%', width: '78%', aspectRatio: '1', borderRadius: '50%', background: 'var(--dark-panel)' }} />
        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
            <span className="cap">Interaction Lab · 01</span>
            <h1 className="display" style={{ fontSize: 'clamp(52px, 6.6vw, 100px)' }}>Soft UI<br />Language</h1>
            <span className="cap" style={{ letterSpacing: '.22em' }}>Neumorphism · Skeuomorphism · Glass</span>
            <p style={{ fontWeight: 300, fontSize: 'clamp(30px, 3vw, 46px)', lineHeight: 1.2, color: 'var(--ink-2)' }}>Raised.<br />Pressed.<br />Clear.</p>
            <p className="muted" style={{ maxWidth: 440 }}>A small visual system for physical-feeling controls: one light source, three materials, and a rule that depth always means something.</p>
          </div>
          <div style={{ flex: '1 1 340px', minHeight: 420, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 34, paddingRight: 'clamp(0px, 3vw, 40px)' }}>
            <Rotary material="alu" on={rot} onChange={setRot} zoom={0.78} label="Aluminium rotary switch" />
            <AluToggle checked={alu} onChange={setAlu} zoom={0.7} label="Aluminium toggle" />
            <div className="glass" style={{ borderRadius: 26, padding: '18px 22px', color: '#F4F0EC', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220, position: 'relative' }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: -30, top: -20, width: 110, height: 110, borderRadius: '50%', background: '#D9572B', filter: 'blur(30px)', opacity: .65, zIndex: -1 }} />
              <span className="cap" style={{ color: '#E6DFD8' }}>Glass · seat summary</span>
              <span style={{ fontWeight: 300, fontSize: 30, lineHeight: 1 }}>C4 · C5</span>
            </div>
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="up" style={{ borderRadius: 50, padding: 'clamp(24px, 4vw, 56px)' }} aria-label="Principles">
        <div className="grid-3" style={{ gap: 0 }}>
          {PRINCIPLES.map(([n, t, d], i) => (
            <div key={n} style={{ padding: '24px clamp(12px, 2vw, 30px)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, borderRight: i % 3 === 2 ? 'none' : '1px solid var(--rule)' }}>
              <span className="carved" style={{ fontSize: 40, fontWeight: 500, lineHeight: 1 }} aria-hidden="true">{n}</span>
              <h2 style={{ fontWeight: 400, fontSize: 26, lineHeight: 1.15 }}>{t}</h2>
              <p className="muted" style={{ fontSize: 16, fontWeight: 500, maxWidth: 300 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* numbers */}
      <section className="section" style={{ gap: 48, maxWidth: 820 }} aria-label="In numbers">
        {NUMBERS.map(([v, t, d]) => (
          <div key={t} style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 180px) 1fr', gap: 28, alignItems: 'start' }}>
            <span className="carved" style={{ fontSize: 'clamp(72px, 8vw, 110px)', fontWeight: 600, lineHeight: .85, textAlign: 'right' }} aria-hidden="true">{v}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 className="h2" style={{ fontSize: 'clamp(30px, 3vw, 44px)' }}><span className="sr-only">{v} </span>{t}</h2>
              <p className="lede" style={{ fontSize: 20 }}>{d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* materials */}
      <section className="section">
        <span className="cap">Three materials, one light source</span>
        <div className="grid-3">
          <article className="up" style={{ borderRadius: 40, padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="in" style={{ height: 170, borderRadius: 28, display: 'grid', placeItems: 'center' }}><ClayToggle checked={clay} onChange={setClay} zoom={0.75} label="Clay toggle" /></div>
            <span className="cap">Clay · neumorphism</span>
            <h3 className="h3">Soft and forgiving</h3>
            <p className="muted">Moulded from the page itself. Springy motion that overshoots and settles. For everyday, low-stakes controls.</p>
          </article>
          <article className="up" style={{ borderRadius: 40, padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ height: 170, borderRadius: 28, display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #E8E8EA, #D6D6D9)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,.14), 0 1px 0 var(--hi)' }}><AluToggle checked={alu} onChange={setAlu} zoom={0.72} label="Aluminium toggle" /></div>
            <span className="cap">Aluminium · skeuomorphism</span>
            <h3 className="h3">Precise and decisive</h3>
            <p className="muted">Machined edges, hard stops, a sharp click. Linear motion with no bounce. For settings that should feel deliberate.</p>
          </article>
          <article style={{ borderRadius: 40, padding: 30, display: 'flex', flexDirection: 'column', gap: 18, background: '#2C2926', color: '#F2EDE8', boxShadow: 'var(--sh-up)' }}>
            <div style={{ position: 'relative', height: 170, borderRadius: 28, display: 'grid', placeItems: 'center', overflow: 'hidden', background: '#24211F' }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: '28%', top: '22%', width: 90, height: 90, borderRadius: '50%', background: '#D9572B', filter: 'blur(26px)', opacity: .8 }} />
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '38%', width: 80, height: 80, borderRadius: '50%', background: '#4E7FB8', filter: 'blur(26px)', opacity: .8 }} />
              <span className="glass" style={{ position: 'relative', width: 150, height: 92, borderRadius: 22, display: 'grid', placeItems: 'center', fontWeight: 300, fontSize: 28 }}>C4 · C5</span>
            </div>
            <span className="cap" style={{ color: '#B9B0A8' }}>Glass · glassmorphism</span>
            <h3 className="h3" style={{ color: '#F2EDE8' }}>Light and layered</h3>
            <p style={{ color: '#CFC8C1' }}>Frosted panels that float over content. Reserved for summaries and overlays, never for primary controls.</p>
          </article>
        </div>
      </section>

      {/* surfaces */}
      <section className="section">
        <span className="cap">Surfaces · what depth means</span>
        <div className="up" style={{ borderRadius: 44, padding: 'clamp(22px, 3vw, 44px)', display: 'flex', flexDirection: 'column', gap: 30 }}>
          {SURFACES.map(([name, cls, rule]) => (
            <div key={name} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 26 }}>
              <span className="cap" style={{ flex: '0 0 120px' }}>{name}</span>
              <div style={{ display: 'flex', gap: 20 }} aria-hidden="true">
                <span className={cls} style={{ width: 84, height: 84, borderRadius: 24, display: 'block', border: cls ? 0 : '1px solid var(--rule)' }} />
                <span className={cls} style={{ width: 84, height: 84, borderRadius: '50%', display: 'block', border: cls ? 0 : '1px solid var(--rule)' }} />
                <span className={cls} style={{ width: 130, height: 84, borderRadius: 42, display: 'block', border: cls ? 0 : '1px solid var(--rule)' }} />
              </div>
              <span style={{ flex: '1 1 240px', color: 'var(--ink-2)' }}>{rule}</span>
            </div>
          ))}
        </div>
      </section>

      {/* type + colour */}
      <section className="grid-2" style={{ alignItems: 'start' }}>
        <div className="section" style={{ gap: 18 }}>
          <span className="cap">Text styles</span>
          <div className="up" style={{ borderRadius: 40, padding: 30, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, textAlign: 'center' }}>
            {[['Display', <span key="a" style={{ fontWeight: 200, fontSize: 52, lineHeight: 1 }}>Aa</span>, 'Jost 200'],
              ['Body', <span key="b" style={{ fontWeight: 400, fontSize: 52, lineHeight: 1 }}>Aa</span>, 'Jost 400'],
              ['Carved', <span key="c" className="carved" style={{ fontWeight: 600, fontSize: 52, lineHeight: 1 }}>Aa</span>, 'Decor only'],
              ['Readout', <span key="d" className="lcd" style={{ fontSize: 26 }}>21°</span>, 'Mono 500']].map(([l, el, s]) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><span className="cap">{l}</span>{el}<span className="cap">{s}</span></div>
            ))}
          </div>
          <p className="cap">Carved text fails contrast, so it is only used for numbers and marks that are also stated in plain text.</p>
        </div>
        <div className="section" style={{ gap: 18 }}>
          <span className="cap">Colour on #EBE6E2 · contrast checked</span>
          <div className="up" style={{ borderRadius: 40, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {COLORS.map(([n, hex, r, use, ok]) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, background: hex, boxShadow: 'inset 2px 2px 4px rgba(0,0,0,.18), var(--sh-up-sm)' }} />
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}><span>{n}</span><span className="cap">{hex}</span></span>
                <span className="tag" style={{ color: ok ? 'var(--ok)' : 'var(--accent-ink)', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>{r}:1 · {use}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* close look */}
      <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 56 }}>
        <div style={{ flex: '1 1 360px', display: 'grid', placeItems: 'center', minWidth: 0 }}>
          <div className="up" style={{ width: 'min(420px, 100%)', aspectRatio: '1', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <Rotary material="plastic" on={rot} onChange={setRot} zoom={1.3} label="Large rotary switch" />
          </div>
        </div>
        <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 4.4vw, 64px)', lineHeight: 1.08 }}>Light comes from the top left. Always.</h2>
          <div className="in" style={{ borderRadius: 28, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">How the rotary is built · 4 layers</span>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--ink-2)' }}>
              <li>Recessed well, shadow cast down and right</li>
              <li>Contact shadow, blurred under the knob</li>
              <li>Knob body with a top-left highlight</li>
              <li>Grip bar with a lit top edge and a dark bottom edge</li>
            </ol>
          </div>
          <p className="muted">Turn it. Every shadow in the system agrees on one light source, so a raised control and a pressed one can never be confused.</p>
        </div>
      </section>

      {/* in context: concept screens */}
      <section style={{ borderRadius: 44, padding: 'clamp(24px, 4vw, 60px)', background: 'linear-gradient(115deg, color-mix(in srgb, var(--accent-2) 16%, var(--bg)) 0 52%, color-mix(in srgb, var(--ok) 14%, var(--bg)) 52% 100%)', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span className="cap">In context · concept screens</span><h2 className="h2">The kit, put to work</h2></div>
          <p className="muted" style={{ maxWidth: 420 }}>Three concept screens built only from the lab’s parts. The seat picker has its own study.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          <Phone title="Studio climate">
            <div style={{ display: 'grid', placeItems: 'center', padding: '6px 0' }}>
              <div className="up" style={{ width: 180, height: 180, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                <div className="in" style={{ width: 122, height: 122, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><span className="lcd" style={{ fontSize: 26 }}>21°C</span></div>
              </div>
            </div>
            <Row label="Lights"><span className="lcd" style={{ fontSize: 13, padding: '3px 8px' }}>32%</span></Row>
            <div className="in-sm" style={{ position: 'relative', height: 12, borderRadius: 6 }} aria-hidden="true"><span style={{ position: 'absolute', left: 3, top: 3, width: '32%', height: 6, borderRadius: 3, background: 'var(--accent)' }} /><span className="up-sm" style={{ position: 'absolute', left: '28%', top: -9, width: 30, height: 30, borderRadius: '50%' }} /></div>
            <Row label="Blinds"><ClayToggle checked={clay} onChange={setClay} zoom={0.4} label="Blinds" /></Row>
          </Phone>
          <Phone title="Site hours" dark>
            <span style={{ fontWeight: 200, fontSize: 30, lineHeight: 1.15 }}>Atelier<br />site visit</span>
            <div style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}><span className="lcd" style={{ fontSize: 42, padding: '12px 18px', letterSpacing: '.04em' }}>02:45</span></div>
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
