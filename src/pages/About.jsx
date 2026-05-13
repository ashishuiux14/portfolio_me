import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <div className="page-header about-header">
        <div className="header-content">
          <div className="page-eyebrow">{'// 03 — About'}</div>
          <h1 className="page-h1">THE<br /><span className="outline">PERSON</span><br />BEHIND<span className="red">.</span></h1>
        </div>
        <div className="header-visual">
          <img src="/about-diagram.png" alt="Technical Drawing of initials" className="about-diagram-img" />
        </div>
      </div>

      <div className="divider"></div>

      <div className="bio">
        <div className="bio-left">
          <div className="bio-label">Who I am</div>
          <h2 className="bio-h2">Ashish<br /><em className="outline">Dixit</em><span className="red">.</span></h2>
          <div className="avatar-box">
            <img src="/ashish dp.png" alt="Ashish Dixit" className="avatar-img" />
            <span className="avatar-label">Chicago, IL</span>
          </div>
        </div>
        <div className="bio-right">
          <p className="bio-body">
            I'm a <strong>Product & UI/UX Designer</strong> with a background in Architecture. That foundation gives me something most designers don't have — the ability to think spatially, design with precision, and obsess over the details that make experiences feel intentional.<br /><br />
            My work sits at the intersection of <strong>user research, visual design, and systems thinking</strong>. I've designed digital products from concept to handoff, bringing the same rigor to a mobile flow as I would to a building plan.<br /><br />
            Currently based in <strong>Chicago</strong>, open to senior IC product design roles.
          </p>

          <div className="skills-grid">
            <div className="skill-item">
              <div className="skill-cat">Design</div>
              <div className="skill-list">
                <span className="skill-tag">UI Design</span>
                <span className="skill-tag">UX Research</span>
                <span className="skill-tag">Prototyping</span>
                <span className="skill-tag">Design Systems</span>
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-cat">3D & Spatial</div>
              <div className="skill-list">
                <span className="skill-tag">3D Modeling</span>
                <span className="skill-tag">3D Printing</span>
                <span className="skill-tag">Spatial Design</span>
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-cat">Tools</div>
              <div className="skill-list">
                <span className="skill-tag">Figma</span>
                <span className="skill-tag">Blender</span>
                <span className="skill-tag">AutoCAD</span>
                <span className="skill-tag">Revit</span>
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-cat">Process</div>
              <div className="skill-list">
                <span className="skill-tag">User Flows</span>
                <span className="skill-tag">Wireframing</span>
                <span className="skill-tag">Handoff</span>
                <span className="skill-tag">Testing</span>
              </div>
            </div>
          </div>

          <div className="bio-cta">
            <a href="/contact" className="btn btn-red">Get in Touch</a>
            <a href="https://drive.google.com/file/d/1j09Exkfpj39EFfeW4WUMBc1JWhgPBrNa/view" target="_blank" rel="noreferrer" className="btn btn-ghost">Download CV</a>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="timeline">
        <div className="section-tag">Education</div>
        <h2 className="tl-h2">WHERE I'VE<br />LEARNED.</h2>
        <div className="tl-items">
          <div className="tl-item">
            <div className="tl-year">2023 — 2025</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">MS in HCI</div>
              <div className="tl-org">DePaul University, Chicago</div>
              <div className="tl-desc">Focusing on human-computer interaction, user research, and advanced prototyping.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-year">2011 — 2016</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">Bachelors of Architecture</div>
              <div className="tl-org">University of Pune</div>
              <div className="tl-desc">Foundation in design theory, spatial planning, and technical visualization.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-year">1993</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">First Step on Earth</div>
              <div className="tl-org">The Beginning</div>
              <div className="tl-desc">Initialization of the human design system.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="batman-section">
        <div className="container">
          <img src="/about-batman.jpg" alt="Technical Lab" className="batman-img" />
          <p className="batman-quote">"Why do we fall ? So we can learn to pick ourselves up"</p>
          <p className="batman-author">— Batman</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
