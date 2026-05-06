import React from 'react';
import { Link } from 'react-router-dom';
import IphoneDockThumb from '../components/IphoneDockThumb';
import Footer from '../components/Footer';

const ThreeDPrinting = () => {
  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">// 02 — Industrial Design</div>
        <h1 className="page-h1">3D<br /><span className="outline">PRINTING</span><span className="red">.</span></h1>
      </div>

      <div className="divider"></div>

      <section className="work">
        <div className="section-header">
          <div>
            <div className="section-tag">Personal Projects</div>
            <h2 className="section-h2">PRINTED OBJECTS<span>.</span></h2>
          </div>
          <span className="section-count">// 01 PROJECT</span>
        </div>
        <div className="projects-grid">
          <Link to="/projects/iphone-dock" className="proj-card">
            <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
              <IphoneDockThumb />
            </div>
            <div className="proj-info">
              <div className="proj-meta"><span>3D Printing</span><span>·</span><span>Industrial Design</span></div>
              <div className="proj-title">IPHONE DOCK</div>
              <div className="proj-date">2024</div>
              <div className="proj-sub">A redesigned iPhone charging dock with seamless Apple Watch integration.</div>
            </div>
            <span className="proj-arrow">View Case Study →</span>
          </Link>
          
          {/* Future projects placeholder */}
          <div className="proj-card" style={{ opacity: 0.3, pointerEvents: 'none' }}>
            <div className="proj-thumb"><div className="thumb-grid"></div></div>
            <div className="proj-info">
              <div className="proj-meta"><span>3D Printing</span><span>·</span><span>Coming Soon</span></div>
              <div className="proj-title">NEXT PROJECT</div>
              <div className="proj-sub">More industrial design work in progress.</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ThreeDPrinting;
