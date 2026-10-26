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
  try { localStorage.setItem('theme', t); } catch (e) { /* storage unavailable */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#2A2725' : '#EBE6E2');
  // case studies are same-origin frames: switch them in the same frame
  document.querySelectorAll('iframe').forEach((f) => {
    try { f.contentDocument && f.contentDocument.documentElement.setAttribute('data-theme', t); } catch (e) { /* cross-origin */ }
  });
}

/* Ink spill: a disc of the new background grows out of the switch until it
   covers the page (transform only, so it stays on the GPU and never stutters),
   the theme flips underneath it in one frame with transitions paused, then
   the ink fades away to reveal the page already in its new colours. */
const INK = { dark: '#2A2725', light: '#EBE6E2' };
let spilling = false;
function spill(next, origin, done) {
  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;
  const ink = document.createElement('div');
  ink.className = 'ink-spill';
  ink.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px;--ink:${INK[next]}`;
  document.body.appendChild(ink);
  const grow = ink.animate(
    [{ transform: 'scale(0.002)' }, { transform: 'scale(1)' }],
    { duration: 820, easing: 'cubic-bezier(.62, 0, .28, 1)', fill: 'forwards' },
  );
  grow.finished.then(() => {
    document.documentElement.classList.add('theme-flip');
    done();
    // two frames so the new colours are painted before the ink lifts
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-flip');
      const fade = ink.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
      fade.finished.then(() => { ink.remove(); spilling = false; });
    }));
  }).catch(() => { ink.remove(); spilling = false; done(); });
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
