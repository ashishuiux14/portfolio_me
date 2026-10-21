import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { Toggle } from './Controls';
import { CONTACT } from '../data/site';

const NAV = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/work', label: 'Case studies', icon: 'work' },
  { to: '/lab', label: 'Interaction Lab', icon: 'lab' },
  { to: '/3d-printing', label: '3D printing', icon: 'print' },
  { to: '/about', label: 'About', icon: 'about' },
  { to: '/contact', label: 'Contact', icon: 'mail' },
];

/* Theme lives on <html data-theme>; the head script sets it before first paint. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#2A2725' : '#EBE6E2');
  }, [theme]);
  return [theme, setTheme];
}

function ThemeSwitch({ theme, setTheme }) {
  const dark = theme === 'dark';
  return (
    <div className="theme-row">
      <span className="cap" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Icon name={dark ? 'moon' : 'sun'} size={16} /> {dark ? 'Dark' : 'Light'}
      </span>
      <Toggle material="clay" checked={dark} onChange={(v) => setTheme(v ? 'dark' : 'light')} label="Dark theme" />
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
        <Link to="/" className="monogram" aria-label="Ashish Dixit, home"><span aria-hidden="true">AD</span></Link>
        <div className="who"><b>Ashish Dixit</b><span>Senior Product Designer · Chicago</span></div>
        <NavLinks />
        <a className="btn-dark" href={CONTACT.resume} target="_blank" rel="noreferrer">Résumé <Icon name="download" size={16} /></a>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </aside>
  );
}

export function Topbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
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
          <Toggle material="clay" checked={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} label="Dark theme" />
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
            <a className="btn-dark" href={CONTACT.resume} target="_blank" rel="noreferrer">Résumé <Icon name="download" size={16} /></a>
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
