import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <button 
        className={`nav-toggle ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <span className="toggle-line"></span>
        <span className="toggle-line"></span>
        <span className="toggle-line"></span>
      </button>

      <nav id="main-nav" className={isOpen ? 'is-open' : ''}>
        <div className="nav-top">
          <div className="nav-mark">
            <img src="/nav-logo.png" alt="AD Logo" />
          </div>
          <div className="nav-name">
            <span className="nav-name-main">Ashish Dixit</span>
            <span className="nav-name-sub">Product Designer</span>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="nav-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></span>
            <span className="nav-label">Homepage</span>
          </Link>
          <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>
            <span className="nav-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg></span>
            <span className="nav-label">Projects</span>
          </Link>
          <Link to="/3d-printing" className={`nav-link ${location.pathname === '/3d-printing' ? 'active' : ''}`}>
            <span className="nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg></span>
            <span className="nav-label">3D Printing</span>
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            <span className="nav-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg></span>
            <span className="nav-label">About</span>
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            <span className="nav-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></span>
            <span className="nav-label">Contact</span>
          </Link>
          <a href="https://www.linkedin.com/in/ashishd-uiux" className="nav-link" target="_blank" rel="noopener noreferrer">
            <span className="nav-icon"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></span>
            <span className="nav-label">LinkedIn</span>
          </a>
        </div>
        <div className="nav-bottom">
          <div className="nav-time" id="nav-time">--:-- --</div>
          <div className="nav-status">
            <div className="status-dot"></div>
            <span className="status-txt">Available</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
