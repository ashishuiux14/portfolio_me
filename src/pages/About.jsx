import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <div className="page-header about-header">
        <div className="header-content">
          <div className="page-eyebrow">// 03 — About</div>
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
        <div className="section-tag">Experience</div>
        <h2 className="tl-h2">WHERE I'VE<br />BEEN.</h2>
        <div className="tl-items">
          <div className="tl-item">
            <div className="tl-year">2023 — NOW</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">Senior Product Designer</div>
              <div className="tl-org">Freelance · Chicago, IL</div>
              <div className="tl-desc">End-to-end product design across consumer and B2B products. Research, flows, visual design, and dev handoff.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-year">2021 — 2023</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">UX Designer</div>
              <div className="tl-org">Agency · Remote</div>
              <div className="tl-desc">Designed mobile and web products for clients across healthcare and e-commerce verticals.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-year">2019 — 2021</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">Architectural Designer</div>
              <div className="tl-org">Architecture Studio</div>
              <div className="tl-desc">Spatial design, technical drawings, and 3D visualization. Foundation in precision and visual communication.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-year">2017 — 2019</div>
            <div className="tl-line"></div>
            <div>
              <div className="tl-role">Master of Architecture</div>
              <div className="tl-org">University · Chicago, IL</div>
              <div className="tl-desc">Spatial design, computational modeling, and design theory.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tools">
        <div className="section-tag">Tools & Software</div>
        <div className="tools-row">
          <span className="tool-chip">Figma</span>
          <span className="tool-chip">Blender</span>
          <span className="tool-chip">AutoCAD</span>
          <span className="tool-chip">Revit</span>
          <span className="tool-chip">Photoshop</span>
          <span className="tool-chip">Illustrator</span>
          <span className="tool-chip">After Effects</span>
          <span className="tool-chip">Principle</span>
          <span className="tool-chip">Framer</span>
          <span className="tool-chip">Notion</span>
          <span className="tool-chip">Miro</span>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
