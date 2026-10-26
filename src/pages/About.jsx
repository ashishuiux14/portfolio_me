import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { ClayToggle } from '../lab/Art';
import { PageHead, PrevNext } from '../components/Bits';
import { CONTACT } from '../data/site';

const SKILLS = [
  ['Design', ['UI design', 'UX research', 'Prototyping', 'Design systems']],
  ['3D & spatial', ['3D modelling', '3D printing', 'Spatial design']],
  ['Tools', ['Figma', 'Blender', 'AutoCAD', 'Revit']],
  ['Process', ['User flows', 'Wireframing', 'Handoff', 'Testing']],
];

const EDUCATION = [
  ['2023 — 2025', 'MS in Human-Computer Interaction', 'DePaul University, Chicago', 'Human-computer interaction, user research and advanced prototyping.'],
  ['2011 — 2016', 'Bachelor of Architecture', 'University of Pune', 'Design theory, spatial planning and technical visualisation.'],
];

const QUOTES = [
  ['Ashish transformed our outdated website into a warm, welcoming, and user-friendly space that aligns beautifully with our mission values. Outstanding collaboration.', 'Karl Nass', 'Director, Mission & Ministry — DePaul University', 'https://framerusercontent.com/images/5te1yznG0pEp9janrkfsBoOtiSY.jpg'],
  ['During his 6-month internship, Ashish consistently demonstrated creative problem-solving, user-first design, and remarkable attention to detail. A truly valuable team member.', 'Lisa Pavati', 'Director — Sustainable Living Guide', '/avatar-lisa.jpg'],
  ['Ashish’s design thinking is exceptional. His ability to balance brand aesthetics with functional clarity made a strong impact on our digital showcase project.', 'Rahul Kadam', 'Principal Architect — The NGK Studio', '/avatar-rahul.jpg'],
  ['Ashish brought fresh vision and thoughtful UX strategy to our department’s website redesign. His work improved both engagement and accessibility.', 'Damien Rodrigue', 'Mission & Ministry Coordinator, DePaul University', '/avatar-damien.png'],
];

export default function About() {
  const [classic, setClassic] = useState(false);
  // coming back from the previous site (bfcache), the switch should be off again
  useEffect(() => { const r = () => setClassic(false); window.addEventListener('pageshow', r); return () => window.removeEventListener('pageshow', r); }, []);
  return (
    <div className="page">
      <PageHead eyebrow="About" title="The person behind it." />

      <section className="grid-2" style={{ alignItems: 'start' }}>
        <div className="up" style={{ borderRadius: 40, padding: 16 }}>
          <div className="in" style={{ borderRadius: 30, overflow: 'hidden', aspectRatio: '4 / 5', maxWidth: '100%' }}>
            <img src="/ashish dp.png" alt="Ashish Dixit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p className="cap" style={{ padding: '14px 8px 4px' }}>Chicago, IL</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontSize: 19, lineHeight: 1.65, color: 'var(--ink-2)' }}>
          <p>I’m a <b style={{ color: 'var(--ink)', fontWeight: 500 }}>product and UI/UX designer</b> with a background in architecture. That foundation lets me think spatially, design with precision, and obsess over the details that make an experience feel intentional.</p>
          <p>My work sits where <b style={{ color: 'var(--ink)', fontWeight: 500 }}>user research, visual design and systems thinking</b> meet. I’ve taken digital products from concept to handoff, bringing the same rigour to a mobile flow as I would to a building plan.</p>
          <p>Based in <b style={{ color: 'var(--ink)', fontWeight: 500 }}>Chicago</b>, open to senior IC product design roles.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link to="/contact" className="pill" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 500, boxShadow: 'var(--sh-up-sm)' }}>Get in touch</Link>
            <a href={CONTACT.resume} target="_blank" rel="noreferrer" className="pill up-sm press">Download CV <Icon name="download" size={18} /></a>
          </div>
        </div>
      </section>

      <section className="section">
        <span className="cap">Skills</span>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 22 }}>
          {SKILLS.map(([cat, list]) => (
            <div key={cat} className="up-sm" style={{ borderRadius: 28, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <b style={{ fontWeight: 500 }}>{cat}</b>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{list.map((s) => <span key={s} className="tag">{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <span className="cap">Education</span>
        <div className="up" style={{ borderRadius: 40, padding: 'clamp(22px, 3vw, 40px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {EDUCATION.map(([y, role, org, d]) => (
            <div key={role} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 160px) 1fr', gap: 20 }}>
              <span className="cap tabular" style={{ paddingTop: 6 }}>{y}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <b style={{ fontWeight: 500, fontSize: 21 }}>{role}</b>
                <span className="accent">{org}</span>
                <span className="muted" style={{ fontSize: 16 }}>{d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <span className="cap">Kind words</span>
        <div className="grid-2">
          {QUOTES.map(([q, name, role, img]) => (
            <figure key={name} className="up-sm" style={{ margin: 0, borderRadius: 30, padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <blockquote style={{ margin: 0, fontWeight: 300, fontSize: 18, lineHeight: 1.6 }}>“{q}”</blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 'auto' }}>
                <span className="in-sm" style={{ width: 52, height: 52, borderRadius: '50%', padding: 4, flex: 'none' }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}><b style={{ fontWeight: 500 }}>{name}</b><span className="muted" style={{ fontSize: 14 }}>{role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="up" style={{ borderRadius: 40, padding: 'clamp(24px, 3vw, 44px)', display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="cap">Current focus</span>
          <h2 className="h2">Aiming to be an <span className="accent">AI generalist.</span></h2>
          <p className="muted">Someone who solves the problems people face in human experiences with the best of AI.</p>
        </div>
        <div className="in" style={{ flex: '1 1 280px', borderRadius: 28, overflow: 'hidden', maxWidth: 420, aspectRatio: '4 / 3' }}>
          <img src="/about-batman.jpg" alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* previous portfolio */}
      <section className="up" style={{ borderRadius: 34, padding: 'clamp(20px, 2.6vw, 30px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }} aria-label="Previous portfolio">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: '1 1 320px' }}>
          <span className="cap">Previous portfolio · 2025</span>
          <p style={{ margin: 0, fontSize: 18 }}>Curious where this started? The earlier dark version is still online.</p>
          <a href={CONTACT.classic} target="_blank" rel="noreferrer" className="muted" style={{ fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>Open the previous portfolio <Icon name="ext" size={14} /></a>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span className="cap">Switch to it</span>
          <ClayToggle checked={classic} zoom={0.5} label="Open the previous portfolio" onChange={(v) => { setClassic(v); if (v) { setTimeout(() => { window.location.href = CONTACT.classic; }, 380); } }} />
        </span>
      </section>

      <PrevNext prev={{ to: '/3d-printing', label: '3D printing' }} next={{ to: '/contact', label: 'Contact' }} />
    </div>
  );
}
