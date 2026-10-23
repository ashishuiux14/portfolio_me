import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { ClayToggle, Stepper, Rotary, SubmitButton } from '../lab/Art';
import { ControlsPreview, SeatPreview, SoftUiPreview, CrosshairPreview } from '../components/LabPreviews';
import Sitemap from '../components/Sitemap';
import { CASE_STUDIES, LAB, PRINTS, CONTACT } from '../data/site';

const TABS = [
  { id: 'work', label: 'Case studies' },
  { id: 'lab', label: 'Interaction Lab' },
  { id: 'print', label: '3D printing' },
];

function MiniCard({ to, name, tag, sub, cover, preview }) {
  return (
    <Link to={to} className="card up-sm" style={{ borderRadius: 26, padding: 14, gap: 14 }}>
      <div className="cover in" style={{ height: 150, borderRadius: 20, position: 'relative' }}>
        {preview || (cover ? <img src={cover} alt="" loading="lazy" /> : <span className="carved" style={{ fontSize: 34, fontWeight: 500 }}>{name}</span>)}
      </div>
      <div className="meta" style={{ padding: '0 4px 4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span className="cap accent">{tag}</span>
          <b style={{ fontWeight: 500, fontSize: 18 }}>{name}</b>
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{sub}</span>
        </div>
        <span className="round-btn up-sm" aria-hidden="true"><Icon name="arrow" /></span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [tab, setTab] = useState('work');
  const [on, setOn] = useState(true);

  const items = tab === 'work'
    ? CASE_STUDIES.map((c) => ({ to: `/projects/${c.slug}`, name: c.name, tag: c.tag, sub: c.sub, cover: c.cover }))
    : tab === 'lab'
      ? LAB.map((l) => ({ to: `/lab/${l.slug}`, name: l.name, tag: `Interaction Lab · ${l.n}`, sub: l.sub, cover: null, preview: l.slug === 'soft-ui' ? <SoftUiPreview /> : l.slug === 'controls' ? <ControlsPreview /> : l.slug === 'crosshair' ? <CrosshairPreview /> : <SeatPreview /> }))
      : PRINTS.map((p) => ({ to: `/projects/${p.slug}`, name: p.name, tag: p.tag, sub: p.sub, cover: p.cover }));

  return (
    <div className="page" style={{ gap: 0 }}>
      <div className="bento">
        {/* intro */}
        <section className="b-intro up" style={{ padding: 'clamp(26px, 2.6vw, 40px)', display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.4vh, 28px)' }}>
          <h1 style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'clamp(22px, 2vw, 28px)', fontWeight: 300, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            <span>Hello,</span>
            <span>I am <b style={{ fontWeight: 500, fontSize: '1.3em', color: 'var(--ink)' }}>Ashish Dixit.</b></span>
            <span>Formerly an <b style={{ fontWeight: 500, color: 'var(--ink)' }}>Architect</b>,</span>
            <span>now a <b style={{ fontWeight: 500 }} className="accent">Senior Product Designer</b></span>
            <span>based in <b style={{ fontWeight: 500, color: 'var(--ink)' }}>Chicago.</b></span>
          </h1>
          <p className="muted" style={{ maxWidth: 440, fontSize: 16 }}>
            Seven years designing enterprise B2B products. I care about the parts most portfolios skip: the states, the edges, the feel of a control under your thumb.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <a href={CONTACT.resume} target="_blank" rel="noreferrer" className="pill up-sm press" style={{ flex: '1 1 160px' }}>My résumé</a>
            <Link to="/contact" className="pill up-sm press accent" style={{ flex: '1 1 160px', fontWeight: 500 }}>Let’s connect</Link>
          </div>
        </section>
        {/* route */}
        <section className="b-route up" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }} aria-label="The route">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span className="cap">The route</span><span className="cap" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Physical space <Icon name="arrow" size={13} /> digital space</span>
          </div>
          <div style={{ position: 'relative', padding: '10px 0' }} aria-hidden="true">
            <div className="in-sm" style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 10, marginTop: -5, borderRadius: 5 }} />
            <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 4, marginTop: -2, borderRadius: 2, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
              {['var(--accent)', 'var(--ink-3)', 'var(--accent-2)'].map((c) => (
                <span key={c} className="up-sm" style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: c }} /></span>
              ))}
            </div>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, fontSize: 15, lineHeight: 1.35 }}>
            <li style={{ display: 'flex', flexDirection: 'column' }}><b style={{ fontWeight: 500 }}>Pune</b><span className="muted">B.Arch, University of Pune</span></li>
            <li style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}><b style={{ fontWeight: 500 }}>DePaul</b><span className="muted">MS in HCI</span></li>
            <li style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}><b style={{ fontWeight: 500 }}>Chicago</b><span className="muted">UI/UX · Product design</span></li>
          </ol>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 'auto' }} aria-label="In numbers">
            {[['5', 'years of architecture first'], ['7+', 'years in enterprise B2B']].map(([n, t]) => (
              <div key={t} className="in" style={{ borderRadius: 22, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <span style={{ fontSize: 34, fontWeight: 300, lineHeight: 1 }}>{n}</span>
                <span style={{ fontSize: 14, lineHeight: 1.3, color: 'var(--ink-2)', borderLeft: '1px solid var(--rule)', paddingLeft: 12 }}>{t}</span>
              </div>
            ))}
          </div>
        </section>
        {/* work with tabs */}
        <section className="b-work up" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 22 }} aria-label="Work">
          <div role="tablist" aria-label="Work categories" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`pill ${tab === t.id ? 'in-sm accent' : 'up-sm press'}`} style={{ fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="grid-2" style={{ gap: 20 }}>
            {items.map((it) => <MiniCard key={it.to} {...it} />)}
          </div>
        </section>
        {/* sitemap */}
        <section className="b-map up" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }} aria-label="Sitemap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span className="cap">Sitemap · what is where</span>
            <span className="cap">{CASE_STUDIES.length + LAB.length + PRINTS.length + 6} pages</span>
          </div>
          <Sitemap />
        </section>
        {/* live controls */}
        <section className="b-lab up" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }} aria-label="Try the controls">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="cap">Interaction Lab · try me</span>
            <Link to="/lab/controls" className="cap accent" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>Open <Icon name="arrow" size={14} /></Link>
          </div>
          <p className="muted" style={{ fontSize: 15, lineHeight: 1.5, margin: 0 }}>Working controls from my component studies, built in soft clay and machined aluminium. Flip the toggle, count with the stepper, turn the dial, press save.</p>
          <div className="lab-quad">
            <div className="lab-cell"><ClayToggle checked={on} onChange={setOn} zoom={0.55} label="Example clay toggle" /><span className="cap" aria-hidden="true">Toggle · clay</span></div>
            <div className="lab-cell"><Stepper material="alu" value={3} min={0} max={20} zoom={0.5} label="Example count" /><span className="cap" aria-hidden="true">Stepper · aluminium</span></div>
            <div className="lab-cell"><Rotary material="alu" zoom={0.42} label="Example rotary switch" /><span className="cap" aria-hidden="true">Rotary switch</span></div>
            <div className="lab-cell"><SubmitButton material="alu" zoom={0.74} /><span className="cap" aria-hidden="true">Submit button</span></div>
          </div>
        </section>
        {/* contact */}
        <section className="b-contact up" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }} aria-label="Contact">
          <span className="cap" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--ok)' }}><i className="led" />Available</span>
          <p style={{ fontSize: 20, lineHeight: 1.35 }}>Open to Senior Product Designer and Design Engineer roles.</p>
          <span className="muted" style={{ fontSize: 15, wordBreak: 'break-all' }}>{CONTACT.email}</span>
          <Link to="/contact" className="pill" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 500, boxShadow: 'var(--sh-up-sm)', marginTop: 'auto' }}>Let’s talk</Link>
        </section>







      </div>
    </div>
  );
}
