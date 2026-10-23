import { useState } from 'react';
import { PageHead, Sheet, PrevNext } from '../components/Bits';
import { ClayToggle } from '../lab/Art';
import CadWindow, { DEFAULTS, START, SWATCHES, alignment } from '../lab/Crosshair';
import '../lab/softui.css';

function Swatches({ label, value, onChange }) {
  return (
    <div className="cx-field">
      <span className="cap">{label}</span>
      <div className="cx-swatches" role="group" aria-label={label}>
        {SWATCHES.map((c) => (
          <button key={c.hex} type="button" className="cx-sw" style={{ background: c.hex }} aria-label={c.name} aria-pressed={value === c.hex} onClick={() => onChange(c.hex)} />
        ))}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange, hint, children }) {
  const id = `cx-${label.replace(/\W/g, '')}`;
  return (
    <div className="cx-field">
      <div className="row"><label className="cap" htmlFor={id}>{label}</label><output htmlFor={id}>{value}{unit}</output></div>
      <input id={id} className="cx-range" type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} aria-describedby={`${id}-hint`} />
      {children}
      <span id={`${id}-hint`} className="cx-hint">{hint}</span>
    </div>
  );
}

/* Small live previews under each slider, at the same pixel scale as the canvas. */
function Mini({ s, children }) {
  return <div className={`cx-mini ${s.bg === 'dark' ? 'dark' : 'light'}${s.grid ? ' grid' : ''}`} aria-hidden="true">{children}</div>;
}
function Cross({ len, gap, pick, color }) {
  return (
    <>
      <i className="cx-l h" style={{ width: `calc(${len} - ${gap}px)`, right: `calc(50% + ${gap}px)` }} />
      <i className="cx-l h" style={{ width: `calc(${len} - ${gap}px)`, left: `calc(50% + ${gap}px)` }} />
      <i className="cx-l v" style={{ height: `calc(${len} - ${gap}px)`, bottom: `calc(50% + ${gap}px)` }} />
      <i className="cx-l v" style={{ height: `calc(${len} - ${gap}px)`, top: `calc(50% + ${gap}px)` }} />
      <i className="cx-pb" style={{ width: pick * 2, height: pick * 2, borderColor: color }} />
    </>
  );
}
function SizePreview({ s }) {
  return <Mini s={s}><Cross len={`${s.size / 2}cqw`} gap={s.pickbox + 2} pick={s.pickbox} color={s.pickColor} /></Mini>;
}
function PickPreview({ s }) {
  const picked = s.pickbox >= 10;
  return (
    <Mini s={s}>
      <i className="cx-obj-line" style={picked ? { background: s.pickColor, boxShadow: `0 0 0 1px ${s.pickColor}` } : null} />
      <Cross len="70px" gap={s.pickbox + 2} pick={s.pickbox} color={s.pickColor} />
      <span className="cx-mini-tag">{picked ? 'Line picked' : 'Too small to reach the line'}</span>
    </Mini>
  );
}
function MarkerPreview({ s }) {
  const m = s.marker;
  return (
    <Mini s={s}>
      <i className="cx-corner" />
      <svg className="cx-mk" width={m + 4} height={m + 4} viewBox={`0 0 ${m + 4} ${m + 4}`} style={{ marginLeft: -(m + 4) / 2, marginTop: -(m + 4) / 2 }}>
        <rect x="2" y="2" width={m} height={m} fill="none" stroke={s.snapColor} strokeWidth="2" />
      </svg>
      <Cross len="70px" gap={4} pick={3} color={s.pickColor} />
      <span className="cx-mini-tag">Corner snap</span>
    </Mini>
  );
}

function Window({ title, status, children, els }) {
  const a = alignment(els);
  return (
    <div className="cx-win">
      <div className="cx-frame">
        <div className="cx-face">
          <div className="cx-face-head"><span className="lit">{title}</span><span>{status}</span></div>
          <div className="cx-screen">{children}</div>
        </div>
      </div>
      <div className="cx-readout"><span className={`tag${a.ok ? ' ok' : ''}`} aria-live="polite">{a.text}</span></div>
    </div>
  );
}

export default function LabCrosshair() {
  const [s, setS] = useState(DEFAULTS);
  const set = (k) => (v) => setS((x) => ({ ...x, [k]: v }));
  const [crossEls, setCrossEls] = useState(START);
  const [arrowEls, setArrowEls] = useState(START);
  const reset = () => { setCrossEls(START); setArrowEls(START); };

  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab · 04 · Crosshair" title="A cursor you can aim."
        lede="AutoCAD lets you tune the crosshair, the pickbox and the snap markers, because precise work starts with knowing exactly where you are pointing. Figma gives everyone the same small arrow. This study puts both side by side on the same canvas." />

      <Sheet label="01 · Same canvas, two cursors" note="Try the same task in both: line up the button’s left edge with the card’s. Drag to move, use the square handles to resize and the round one to rotate. Keyboard: Tab to an object, arrows to move, R to rotate.">
        <div className="section" style={{ gap: 28 }}>
          <div className="cx-panel up">
            <Slider label="Crosshair size" value={s.size} min={5} max={100} unit="%" onChange={set('size')} hint="How far the lines reach across the screen"><SizePreview s={s} /></Slider>
            <Slider label="Pickbox size" value={s.pickbox} min={2} max={16} unit=" px" onChange={set('pickbox')} hint="How close you need to aim: anything the square touches gets picked"><PickPreview s={s} /></Slider>
            <Slider label="Snap marker size" value={s.marker} min={6} max={22} unit=" px" onChange={set('marker')} hint="How big the symbol is when the cursor locks onto a point"><MarkerPreview s={s} /></Slider>
            <Swatches label="Pickbox colour" value={s.pickColor} onChange={set('pickColor')} />
            <Swatches label="Snap marker colour" value={s.snapColor} onChange={set('snapColor')} />
            <div className="cx-field">
              <span className="cap">Background</span>
              <div className="cx-seg" role="group" aria-label="Background">
                <button type="button" aria-pressed={s.bg === 'dark'} onClick={() => set('bg')('dark')}>Black</button>
                <button type="button" aria-pressed={s.bg === 'light'} onClick={() => set('bg')('light')}>White</button>
              </div>
            </div>
            <div className="cx-field" style={{ gridColumn: '1 / -1' }}>
              <div className="cx-toggles">
                <span className="cx-toggle"><ClayToggle checked={s.grid} onChange={set('grid')} zoom={0.42} label="Grid" /><span>Grid</span></span>
                <span className="cx-toggle"><ClayToggle checked={s.snap} onChange={set('snap')} zoom={0.42} label="Object snap" /><span>Object snap</span></span>
                <button type="button" className="pill up-sm press" style={{ minHeight: 40, padding: '0 18px', fontSize: 14, marginLeft: 'auto' }} onClick={() => { setS(DEFAULTS); reset(); }}>Reset</button>
              </div>
            </div>
          </div>

          <div className="cx-windows">
            <Window title="Precision crosshair" status={`${s.snap ? 'OSNAP' : 'OSNAP OFF'} · ${s.grid ? 'GRID' : 'NO GRID'}`} els={crossEls}>
              <CadWindow mode="cross" settings={s} els={crossEls} setEls={setCrossEls} />
            </Window>
            <Window title="Standard arrow" status="Figma default" els={arrowEls}>
              <CadWindow mode="arrow" settings={s} els={arrowEls} setEls={setArrowEls} />
            </Window>
          </div>
        </div>
      </Sheet>

      <Sheet label="02 · Why it helps" note="Precision in Figma happens after you start dragging. A crosshair moves it to before you click.">
        <div className="grid-3">
          <div className="note up-sm"><span className="n">01 · BEFORE THE CLICK</span><b>See alignment, don’t wait for it</b><p>Full-length lines show what an edge lines up with across the whole canvas, before anything moves. The arrow only reveals it once smart guides appear mid-drag.</p></div>
          <div className="note up-sm"><span className="n">02 · SNAP YOU CAN READ</span><b>Know what you are snapping to</b><p>A square means endpoint, a triangle midpoint, a circle centre, a diamond quadrant. Each mark tells you which point you will hit, and the readout gives its exact coordinates.</p></div>
          <div className="note up-sm"><span className="n">03 · YOURS TO TUNE</span><b>Sized for the person, not the average</b><p>Line length, pickbox and marker size and colour are personal settings. They help on dense canvases, on large screens and for anyone who loses a small arrow, and they stay local, so collaborators never see them.</p></div>
        </div>
      </Sheet>

      <PrevNext prev={{ to: '/lab/seat-picker', label: '03 · Seat picker' }} next={{ to: '/work', label: 'Case studies' }} />
    </div>
  );
}
