import { useLocation } from 'react-router-dom';

const HUD = () => {
  const location = useLocation();

  // Determine drawing number based on path
  const dwgNum = (() => {
    switch (location.pathname) {
      case '/': return 'AD-001';
      case '/projects': return 'AD-002';
      case '/projects/cleanero': return '002.1';
      case '/projects/ev-trip-intelligence': return '002.2';
      case '/projects/3d-hub': return '002.3';
      case '/projects/travelogue': return '002.4';
      case '/projects/atelier': return '002.5';
      case '/3d-printing': return 'AD-003';
      case '/about': return 'AD-004';
      case '/contact': return 'AD-005';
      default: return 'AD-005';
    }
  })();

  // Determine title based on path
  const pageTitle = (() => {
    switch (location.pathname) {
      case '/': return 'ashishdixit.work';
      case '/projects': return '// Projects';
      case '/projects/cleanero': return '// Cleaneró';
      case '/projects/ev-trip-intelligence': return '// EV Trip Intelligence';
      case '/projects/3d-hub': return '// 3D Hub';
      case '/projects/travelogue': return '// Travelogue';
      case '/projects/atelier': return '// Atelier';
      case '/3d-printing': return '// 3D Printing';
      case '/about': return '// About';
      case '/contact': return '// Contact';
      default: return '// Page';
    }
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
