import { Link } from 'react-router-dom';
import Icon from './Icon';

/* Page header used by every inner page. */
export function PageHead({ eyebrow, title, lede, children }) {
  return (
    <header className="section" style={{ gap: 22, paddingTop: 36 }}>
      {eyebrow && <span className="cap">{eyebrow}</span>}
      <h1 className="display">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  );
}

/* Project card: cover well, tag, name, line, round arrow. */
export function ProjectCard({ to, name, tag, sub, cover, year }) {
  return (
    <Link to={to} className="card up-sm">
      <div className="cover in">
        {cover
          ? <img src={cover} alt="" loading="lazy" />
          : <span className="carved" style={{ fontSize: 46, fontWeight: 500, letterSpacing: '.02em' }}>{name}</span>}
      </div>
      <div className="meta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <span className="cap accent">{tag}{year ? ` · ${year}` : ''}</span>
          <b style={{ fontWeight: 500, fontSize: 20 }}>{name}</b>
          <span style={{ fontSize: 15, color: 'var(--ink-2)' }}>{sub}</span>
        </div>
        <span className="round-btn up-sm" aria-hidden="true"><Icon name="arrow" /></span>
      </div>
    </Link>
  );
}

/* Previous / next links at the end of a page. */
export function PrevNext({ prev, next }) {
  return (
    <nav className="grid-2" aria-label="More pages">
      {prev ? (
        <Link to={prev.to} className="up-sm press" style={{ borderRadius: 30, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="cap">← {prev.eyebrow || 'Previous'}</span><span style={{ fontSize: 24, fontWeight: 300 }}>{prev.label}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.to} className="up-sm press" style={{ borderRadius: 30, padding: '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, textAlign: 'right' }}>
          <span className="cap">{next.eyebrow || 'Next'} →</span><span style={{ fontSize: 24, fontWeight: 300 }}>{next.label}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}

/* A labelled panel ("sheet") as in the component kit layout. */
export function Sheet({ label, children, note, dark, style }) {
  return (
    <section className="section" style={{ gap: 18 }}>
      {label && <span className="cap">{label}</span>}
      <div className={dark ? '' : 'up'} style={{ borderRadius: 40, padding: 'clamp(22px, 3vw, 40px)', position: 'relative', overflow: 'hidden', ...(dark ? { background: 'var(--dark-panel)', color: 'var(--dark-panel-ink)', boxShadow: 'var(--sh-up)' } : {}), ...style }}>
        {children}
      </div>
      {note && <p className="cap" style={{ maxWidth: 760 }}>{note}</p>}
    </section>
  );
}

/* Comparison table from the material studies. */
export function CompareTable({ head, rows, shared }) {
  return (
    <div className="scroll-x">
      <table className="table">
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
          {shared && <tr className="shared"><td>Shared rules</td><td colSpan={head.length - 1}>{shared}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
