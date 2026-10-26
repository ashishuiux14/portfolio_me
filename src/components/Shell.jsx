import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Monogram from './Monogram';
import { ClayToggle } from '../lab/Art';
import { CONTACT } from '../data/site';

const NAV = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/work', label: 'Case studies', icon: 'work' },
  { to: '/lab', label: 'Interaction Lab', icon: 'lab' },
  { to: '/3d-printing', label: '3D printing', icon: 'print' },
  { to: '/about', label: 'About', icon: 'about' },
  { to: '/contact', label: 'Contact', icon: 'mail' },
];

/* Theme lives on <html data-theme>; the head script sets it before first paint.
   Switching runs a circular reveal from the switch: dark grows out of it,
   light shrinks back into it. Falls back to an instant swap where unsupported. */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { sessionStorage.setItem('theme', t); } catch (e) { /* storage unavailable */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#2A2725' : '#EBE6E2');
  // case studies are same-origin frames: switch them in the same frame
  document.querySelectorAll('iframe').forEach((f) => {
    try { f.contentDocument && f.contentDocument.documentElement.setAttribute('data-theme', t); } catch (e) { /* cross-origin */ }
  });
}

/* Ink spill. The new colour seeps out of the switch through the gaps between
   tiles (a soft-edged pool that sits under the page content), and each tile,
   like a folded sheet of paper, soaks the colour up as the pool reaches its
   nearest edge. Tiles are themed one by one with data-ink, so nothing goes
   blank; when the pool has covered the page the theme is committed for real. */
const INK = { dark: '#2A2725', light: '#EBE6E2' };
const SOAK = 620;      // how long a tile takes to soak up the colour
const SPREAD = 1100;   // how long the pool takes to reach the farthest corner
const TILE = '.up, .up-sm, .in, .in-sm, .glass, .card, .rail-inner, .topbar, iframe, .cx-frame, .lab-prev';
let spilling = false;

function inkTargets() {
  const out = [];
  const walk = (el) => {
    if (el.matches(TILE) || !el.querySelector(TILE)) { out.push(el); return; }
    for (const c of el.children) walk(c);
  };
  document.querySelectorAll('.rail, .topbar, .main').forEach(walk);
  return out;
}

function spill(next, origin, commit) {
  const html = document.documentElement;
  const o = origin.getBoundingClientRect();
  const x = o.left + o.width / 2, y = o.top + o.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 60;

  // the pool, under the content: only shows in the gaps
  const pool = document.createElement('div');
  pool.className = 'ink-pool';
  pool.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px;--ink:${INK[next]}`;
  document.body.prepend(pool);
  const grow = pool.animate([{ transform: 'scale(0.002)' }, { transform: 'scale(1)' }],
    { duration: SPREAD, easing: 'cubic-bezier(.45, .05, .35, 1)', fill: 'forwards' });

  // when the pool's edge reaches each tile, the tile soaks up the colour
  const ease = (t) => 1 - Math.pow(1 - t, 1.35);
  const when = (dist) => {
    const d = Math.min(1, dist / R);
    for (let i = 0; i <= 60; i++) if (ease(i / 60) >= d) return (i / 60) * SPREAD;
    return SPREAD;
  };
  const queue = inkTargets().map((el) => {
    const r = el.getBoundingClientRect();
    const near = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
    const far = Math.hypot(Math.max(Math.abs(r.left - x), Math.abs(r.right - x)), Math.max(Math.abs(r.top - y), Math.abs(r.bottom - y)));
    const a = when(near), b = when(far);
    // the sheet starts to soak when the ink touches it and is saturated once the ink has passed it
    return { el, at: a, soak: Math.max(SOAK, b - a + 240) };
  }).sort((p, q) => p.at - q.at);

  html.classList.add('ink-wave');
  const start = performance.now();
  let i = 0;
  const step = (now) => {
    const t = now - start;
    while (i < queue.length && queue[i].at <= t) {
      const { el, soak } = queue[i++];
      el.style.setProperty('--soak', `${Math.round(soak)}ms`);
      el.setAttribute('data-ink', next);
      if (el.tagName === 'IFRAME') {
        try {
          const d = el.contentDocument.documentElement;
          d.classList.add('theme-soak');
          d.setAttribute('data-theme', next);
          setTimeout(() => d.classList.remove('theme-soak'), 1100);
        } catch (e) { /* cross-origin */ }
      }
    }
    if (i < queue.length) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);

  const lastAt = queue.reduce((m, q) => Math.max(m, q.at + q.soak), 0);
  Promise.all([grow.finished, new Promise((r) => setTimeout(r, lastAt + 40))]).then(() => {
    html.classList.add('theme-flip');
    commit();
    queue.forEach(({ el }) => { el.removeAttribute('data-ink'); el.style.removeProperty('--soak'); });
    pool.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      html.classList.remove('theme-flip', 'ink-wave');
      spilling = false;
    }));
  }).catch(() => { pool.remove(); html.classList.remove('ink-wave'); commit(); spilling = false; });
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const setTheme = (next, origin) => {
    if (next === theme || spilling) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const commit = () => { applyTheme(next); setThemeState(next); };
    if (reduce || !origin || !Element.prototype.animate) {
      document.documentElement.classList.add('theme-flip');
      commit();
      requestAnimationFrame(() => document.documentElement.classList.remove('theme-flip'));
      return;
    }
    spilling = true;
    spill(next, origin, commit);
  };
  return [theme, setTheme];
}

function ThemeSwitch({ theme, setTheme }) {
  const dark = theme === 'dark';
  const ref = useRef(null);
  return (
    <div className="theme-row">
      <span className="cap" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Icon name={dark ? 'moon' : 'sun'} size={16} /> {dark ? 'Dark' : 'Light'}
      </span>
      <span ref={ref} style={{ display: 'inline-flex' }}>
        <ClayToggle checked={dark} zoom={0.44} label="Dark theme" onChange={(v) => setTheme(v ? 'dark' : 'light', ref.current)} />
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }) {
  const { pathname } = useLocation();
  return (
    <nav className="nav" aria-label="Primary">
      {NAV.map((n) => {
        // case-study detail pages belong to "Case studies"; the dock belongs to "3D printing"
        const extra = (n.to === '/work' && /^\/projects\/(atelier|3d-hub|travelogue|cleanero)/.test(pathname))
          || (n.to === '/3d-printing' && pathname.startsWith('/projects/iphone-dock'));
        return (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}
            className={({ isActive }) => (isActive || extra ? 'active' : '')}>
            <Icon name={n.icon} />{n.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function Rail({ theme, setTheme }) {
  return (
    <aside className="rail">
      <div className="rail-inner up">
        <Link to="/" className="monogram" aria-label="Ashish Dixit, home"><Monogram title="AD" /></Link>
        <div className="who"><b>Ashish Dixit</b><span>Senior Product Designer · Chicago</span></div>
        <NavLinks />
        <a className="btn-resume" href={CONTACT.resume} target="_blank" rel="noreferrer">Résumé <Icon name="download" size={16} /></a>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </aside>
  );
}

export function Topbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const tref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  return (
    <>
      <header className="topbar up">
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <b style={{ fontWeight: 500 }}>Ashish Dixit</b>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Senior Product Designer</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span ref={tref} style={{ display: 'inline-flex' }}>
            <ClayToggle checked={theme === 'dark'} zoom={0.42} label="Dark theme" onChange={(v) => setTheme(v ? 'dark' : 'light', tref.current)} />
          </span>
          <button type="button" className="icon-btn up-sm" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
        </div>
      </header>
      {open && (
        <>
          <div className="sheet-backdrop" onClick={() => setOpen(false)} />
          <div className="sheet up" role="dialog" aria-modal="true" aria-label="Menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 0 8px' }}>
              <span className="cap">Menu</span>
              <button type="button" className="icon-btn up-sm" aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
                <Icon name="close" size={20} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <a className="btn-resume" href={CONTACT.resume} target="_blank" rel="noreferrer">Résumé <Icon name="download" size={16} /></a>
          </div>
        </>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="cap">Ashish Dixit · © {new Date().getFullYear()}</span>
      <span className="cap">Chicago · Soft UI, v11</span>
    </footer>
  );
}

/* Scroll to top on route change (keeps the rail where it is). */
export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
