import { Link } from 'react-router-dom';
import CleaneroThumb from '../components/CleaneroThumb';
import HubThumb from '../components/HubThumb';
import TravelogueThumb from '../components/TravelogueThumb';
import Footer from '../components/Footer';
import BrainHero from '../components/BrainHero';

const Home = () => {
  return (
    <>
      <section className="hero">
        {/* 3D brain sits absolutely behind the text */}
        <BrainHero />
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">{'// Hello ! I am Ashish Dixit'}</div>

            <div className="hero-location">📍 Chicago, IL</div>
            <h1 className="hero-h1">UIUX<br /><span className="outline">DESIGNER</span><span className="red">.</span></h1>
            <p className="hero-role">Product Designer</p>
            <p className="hero-body">Designer with a background in spatial design, crafting intuitive and meaningful user experiences across digital platforms through a user-centered design approach.</p>
            <div className="hero-cta">
              <a href="/Ashish_UX_UI_Resume.pdf" target="_blank" rel="noreferrer" className="btn btn-red">Download Resume</a>
              <div className="btn-copy-wrapper">
                <button className="btn btn-ghost btn-copy" onClick={() => globalThis.copyEmail?.()}>
                  {'Copy Email'}
                </button>
                <span className="copy-confirm" id="copy-confirm">Copied!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="work">
        <div className="section-header">
          <div>
            <div className="section-tag">Selected Work</div>
            <h2 className="section-h2">PROJECTS<span>.</span></h2>
          </div>
          <span className="section-count">{'// 04 CASE STUDIES'}</span>
        </div>
        <div className="projects-grid">
          <Link to="/projects/cleanero" className="proj-card">
            <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
              <CleaneroThumb />
            </div>
            <div className="proj-info">
              <div className="proj-meta"><span>UI/UX</span><span>·</span><span>Mobile + Web</span></div>
              <div className="proj-title">CLEANERÓ</div>
              <div className="proj-date">September 23 — November 23</div>
              <div className="proj-sub">End-to-end cleaning service platform — research, user flows, visual design, and handoff.</div>
            </div>
          </Link>
          <Link to="/projects/ev-trip-intelligence" className="proj-card">
            <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
              <img src="/ev-thumb.svg" alt="EV Trip Intelligence" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="proj-info">
              <div className="proj-meta"><span>UI/UX</span><span>·</span><span>Mobile + In-Car</span></div>
              <div className="proj-title">EV TRIP INTELLIGENCE</div>
              <div className="proj-date">2024</div>
              <div className="proj-sub">Designing trust in EV mobility through predictive intelligence.</div>
            </div>
          </Link>
          <Link to="/projects/3d-hub" className="proj-card">
            <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
              <HubThumb />
            </div>
            <div className="proj-info">
              <div className="proj-meta"><span>UI/UX</span><span>·</span><span>Mobile App</span></div>
              <div className="proj-title">3D HUB</div>
              <div className="proj-date">September 24 — November 24</div>
              <div className="proj-sub">A dedicated social platform for 3D printing enthusiasts — built with soft neumorphism UI.</div>
            </div>
          </Link>
          <Link to="/projects/travelogue" className="proj-card">
            <div className="proj-thumb" style={{ overflow: 'hidden', padding: 0 }}>
              <TravelogueThumb />
            </div>
            <div className="proj-info">
              <div className="proj-meta"><span>UI/UX</span><span>·</span><span>Mobile App</span></div>
              <div className="proj-title">TRAVELOGUE</div>
              <div className="proj-date">January 25 — March 25</div>
              <div className="proj-sub">A social travel app for collaborative planning, storytelling, and itinerary access.</div>
            </div>
          </Link>
        </div>
        <div className="all-projects">
          <Link to="/projects" className="btn btn-ghost">All Projects →</Link>
        </div>
      </section>

      <div className="divider"></div>

      <section className="testimonials">
        <div className="section-tag">What clients say</div>
        <h2 className="section-h2">KIND<br />WORDS<span>.</span></h2>
        <div className="testi-grid">
          <div className="testi-card">
            <p className="testi-quote">"Ashish transformed our outdated website into a warm, welcoming, and user-friendly space that aligns beautifully with our mission values. Outstanding collaboration."</p>
            <div className="testi-person">
              <div className="testi-avatar"><img src="https://framerusercontent.com/images/5te1yznG0pEp9janrkfsBoOtiSY.jpg" alt="Karl Nass" /></div>
              <div>
                <div className="testi-name">Karl Nass</div>
                <div className="testi-role">Director, Mission & Ministry — DePaul University</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-quote">"During his 6-month internship, Ashish consistently demonstrated creative problem-solving, user-first design, and remarkable attention to detail. A truly valuable team member."</p>
            <div className="testi-person">
              <div className="testi-avatar"><img src="/avatar-lisa.jpg" alt="Lisa Pavati" /></div>
              <div>
                <div className="testi-name">Lisa Pavati</div>
                <div className="testi-role">Director — Sustainable Living Guide</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-quote">"Ashish’s design thinking is exceptional. His ability to balance brand aesthetics with functional clarity made a strong impact on our digital showcase project."</p>
            <div className="testi-person">
              <div className="testi-avatar"><img src="/avatar-rahul.jpg" alt="Rahul Kadam" /></div>
              <div>
                <div className="testi-name">Rahul Kadam</div>
                <div className="testi-role">Principal Architect — The NGK Studio</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-quote">"Ashish brought fresh vision and thoughtful UX strategy to our department’s website redesign. His work improved both engagement and accessibility."</p>
            <div className="testi-person">
              <div className="testi-avatar"><img src="/avatar-damien.png" alt="Damien Rodrigue" /></div>
              <div>
                <div className="testi-name">Damien Rodrigue</div>
                <div className="testi-role">Mission & Ministry Coordinator, DePaul University</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="contact-cta-section">
        <div className="section-tag" style={{ justifyContent: 'center' }}>{'// Got questions?'}</div>
        <h2 className="contact-h2">ALWAYS<br /><span className="outline">EXCITED</span><br />TO COLLABORATE<span style={{ color: 'var(--red)' }}>.</span></h2>
        <p className="contact-sub">I'm always excited to collaborate on innovative and exciting projects!</p>
        <div className="contact-btns">
          <Link to="/contact" className="btn btn-red">Contact Me</Link>
          <div className="btn-copy-wrapper">
            <button className="btn btn-ghost btn-copy" onClick={() => globalThis.copyEmail?.()}>
              {'Copy Email'}
            </button>
            <span className="copy-confirm">Copied!</span>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
