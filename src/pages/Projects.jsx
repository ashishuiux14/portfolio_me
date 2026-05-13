import { useState } from 'react';
import CleaneroThumb from '../components/CleaneroThumb';
import HubThumb from '../components/HubThumb';
import TravelogueThumb from '../components/TravelogueThumb';
import AtelierThumb from '../components/AtelierThumb';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const handleFilter = (cat) => {
    setFilter(cat);
  };

  const isVisible = (cat) => {
    return filter === 'all' || filter === cat;
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">// 01 — Selected Work</div>
        <h1 className="page-h1">ALL<br /><span className="outline">PROJECTS</span><span className="red">.</span></h1>
      </div>

      <div className="divider"></div>

      <section className="work">
        <div className="filter-row">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>All Work</button>
          <button className={`filter-btn ${filter === 'uiux' ? 'active' : ''}`} onClick={() => handleFilter('uiux')}>UI/UX</button>
          <button className={`filter-btn ${filter === 'spatial' ? 'active' : ''}`} onClick={() => handleFilter('spatial')}>Spatial</button>
        </div>

        <div className="projects-grid">
          {isVisible('uiux') && (
            <Link to="/projects/cleanero" className="proj-card" data-cat="uiux">
              <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
                <CleaneroThumb />
              </div>
              <div className="proj-info">
                <div className="proj-meta"><span>DWG 002.1</span><span>·</span><span>UI/UX</span><span>·</span><span>Mobile + Web</span></div>
                <div className="proj-title">CLEANERÓ</div>
                <div className="proj-date">September 23 — November 23</div>
                <div className="proj-sub">End-to-end cleaning service platform — research, user flows, visual design and handoff.</div>
              </div>
              <span className="proj-arrow">View Case Study →</span>
            </Link>
          )}

          {isVisible('uiux') && (
            <Link to="/projects/ev-trip-intelligence" className="proj-card" data-cat="uiux">
              <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
                <img src="/ev-thumb.svg" alt="EV Trip Intelligence" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="proj-info">
                <div className="proj-meta"><span>DWG 002.2</span><span>·</span><span>UI/UX</span><span>·</span><span>Mobile + In-Car</span></div>
                <div className="proj-title">EV TRIP INTELLIGENCE</div>
                <div className="proj-date">2024</div>
                <div className="proj-sub">Designing trust in EV mobility through predictive intelligence.</div>
              </div>
              <span className="proj-arrow">View Case Study →</span>
            </Link>
          )}

          {isVisible('uiux') && (
            <Link to="/projects/3d-hub" className="proj-card" data-cat="uiux">
              <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
                <HubThumb />
              </div>
              <div className="proj-info">
                <div className="proj-meta"><span>DWG 002.3</span><span>·</span><span>UI/UX</span><span>·</span><span>Mobile App</span></div>
                <div className="proj-title">3D HUB</div>
                <div className="proj-date">September 24 — November 24</div>
                <div className="proj-sub">A dedicated social platform for 3D printing enthusiasts — built with soft neumorphism UI.</div>
              </div>
              <span className="proj-arrow">View Case Study →</span>
            </Link>
          )}
          {isVisible('uiux') && (
            <Link to="/projects/travelogue" className="proj-card" data-cat="uiux">
              <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
                <TravelogueThumb />
              </div>
              <div className="proj-info">
                <div className="proj-meta"><span>DWG 002.4</span><span>·</span><span>UI/UX</span><span>·</span><span>Mobile App</span></div>
                <div className="proj-title">TRAVELOGUE</div>
                <div className="proj-date">January 25 — March 25</div>
                <div className="proj-sub">A social travel app for collaborative planning, storytelling, and itinerary access.</div>
              </div>
              <span className="proj-arrow">View Case Study →</span>
            </Link>
          )}

          {isVisible('uiux') && (
            <Link to="/projects/atelier" className="proj-card" data-cat="uiux">
              <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
                <AtelierThumb />
              </div>
              <div className="proj-info">
                <div className="proj-meta"><span>DWG 002.5</span><span>·</span><span>UI/UX</span><span>·</span><span>Web App</span></div>
                <div className="proj-title">ATELIER</div>
                <div className="proj-date">2026</div>
                <div className="proj-sub">A second brain for the solo principal architect — juggling projects, WhatsApp groups, and client meetings.</div>
              </div>
              <span className="proj-arrow">View Case Study →</span>
            </Link>
          )}

          {isVisible('uiux') && (
            <Link to="/projects/ev-trip-screens" className="proj-card wide" data-cat="uiux">
              <div className="proj-thumb"><div className="thumb-grid"></div><span className="thumb-num">04</span></div>
              <div className="proj-info">
                <div className="proj-meta"><span>UI/UX</span><span>·</span><span>Mobile + In-Car</span></div>
                <div className="proj-title">EV TRIP SCREENS</div>
                <div className="proj-date">2024</div>
                <div className="proj-sub">8 production-ready screens. Dark. Clean. Confident.</div>
              </div>
              <span className="proj-arrow">View UI Gallery →</span>
            </Link>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Projects;
