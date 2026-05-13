import { useLocation } from 'react-router-dom';

const HUD = () => {
  const location = useLocation();

  // Determine drawing number based on path
  const dwgNum = (() => {
    const p = location.pathname;
    if (p === '/') return 'AD-001';
    if (p === '/projects') return 'AD-002';
    if (p.startsWith('/projects/cleanero')) return '002.1';
    if (p.startsWith('/projects/ev-trip')) return '002.2';
    if (p.startsWith('/projects/3d-hub')) return '002.3';
    if (p.startsWith('/projects/travelogue')) return '002.4';
    if (p.startsWith('/projects/atelier')) return '002.5';
    if (p.startsWith('/3d-printing')) return 'AD-003';
    if (p.startsWith('/about')) return 'AD-004';
    if (p.startsWith('/contact')) return 'AD-005';
    return 'AD-005';
  })();

  // Determine title based on path
  const pageTitle = (() => {
    const p = location.pathname;
    if (p === '/') return 'ashishdixit.work';
    if (p === '/projects') return '// Projects';
    if (p.startsWith('/projects/cleanero')) return '// Cleaneró';
    if (p.startsWith('/projects/ev-trip')) return '// EV Trip Intelligence';
    if (p.startsWith('/projects/3d-hub')) return '// 3D Hub';
    if (p.startsWith('/projects/travelogue')) return '// Travelogue';
    if (p.startsWith('/projects/atelier')) return '// Atelier';
    if (p.startsWith('/3d-printing')) return '// 3D Printing';
    if (p.startsWith('/about')) return '// About';
    if (p.startsWith('/contact')) return '// Contact';
    return '// Page';
  })();

  return (
    <>
      <div className="hud-info">
        <div className="hud-info-item">SCALE <span className="val">1:100</span></div>
        <div className="hud-info-sep"></div>
        <div className="hud-info-item">DWG <span className="val">{dwgNum}</span></div>
        <div className="hud-info-sep"></div>
        <div className="hud-info-item" id="local-time">CDT <span className="val">--:--:--</span></div>
      </div>

      <div className="hud tl">
        <div className="hud-corner"></div>
        <div className="hud-txt">{pageTitle}</div>
      </div>
      <div className="hud bl">
        <div className="hud-corner"></div>
      </div>
      <div className="hud br">
        <div className="hud-txt" id="xy">0.00 · 0.00</div>
        <div className="hud-corner"></div>
      </div>
    </>
  );
};

export default HUD;
