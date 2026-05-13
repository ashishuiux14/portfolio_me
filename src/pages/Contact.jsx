import { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState({ text: 'Send Message', note: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ text: 'Sending...', note: '' });
    
    setTimeout(() => {
      setStatus({ 
        text: 'Sent ✓', 
        note: "Thanks! I'll get back to you within 24 hours.",
        noteColor: 'rgba(61,220,132,0.7)'
      });
    }, 1200);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">{"// 04 — Let's Talk"}</div>
        <h1 className="page-h1">GET IN<br/><span className="outline">TOUCH</span><span className="red">.</span></h1>
      </div>

      <div className="divider"></div>

      <div className="contact-wrap">
        {/* LEFT */}
        <div className="contact-left">
          <p className="contact-intro">I'm always excited to collaborate on innovative and exciting projects. Whether it's a full-time role, freelance work, or just a conversation — reach out.</p>

          <div className="contact-items">
            <a href="mailto:hello@ashishdixit.work" className="contact-item">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div className="contact-item-label">Email</div>
                <div className="contact-item-value">ashishdixit.ux@gmail.com</div>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/ashishd-uiux" target="_blank" rel="noreferrer" className="contact-item">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
              <div>
                <div className="contact-item-label">LinkedIn</div>
                <div className="contact-item-value">ashishd-uiux</div>
              </div>
            </a>
            <div className="contact-item">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="contact-item-label">Location</div>
                <div className="contact-item-value">Chicago, IL — Open to Remote</div>
              </div>
            </div>
          </div>

          <div className="contact-cta-row">
            <button className="btn btn-ghost btn-copy" onClick={() => globalThis.copyEmail?.()}>
              {'Copy Email '}
              <span className="copy-confirm">Copied!</span>
            </button>
            <a href="/Ashish_UX_UI_Resume.pdf" target="_blank" rel="noreferrer" className="btn btn-red">Download Resume</a>
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="contact-right">
          <div className="contact-form-label">Send a message</div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname">First Name</label>
                <input type="text" id="fname" name="fname" placeholder="John" required />
              </div>
              <div className="form-group">
                <label htmlFor="lname">Last Name</label>
                <input type="text" id="lname" name="lname" placeholder="Doe" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="john@company.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" defaultValue="">
                <option value="" disabled>Select a topic</option>
                <option value="Full-time Role">Full-time Role</option>
                <option value="Freelance Project">Freelance Project</option>
                <option value="Collaboration">Collaboration</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Tell me about your project..." required></textarea>
            </div>
            <div className="form-submit">
              <button 
                type="submit" 
                className="btn btn-red" 
                id="submit-btn"
                style={{ opacity: status.text === 'Sending...' ? 0.6 : 1 }}
                disabled={status.text === 'Sending...'}
              >
                {status.text}
              </button>
              <span 
                className="submit-note" 
                id="submit-note"
                style={{ color: status.noteColor || 'var(--grey2)' }}
              >
                {status.note}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="availability">
        <div className="avail-card">
          <div className="avail-top">
            <div className="avail-dot"></div>
            <span className="avail-status">Open to Work</span>
          </div>
          <div className="avail-title">FULL-TIME ROLES</div>
          <div className="avail-desc">Looking for senior IC product design roles. Open to on-site, hybrid, or remote positions.</div>
        </div>
        <div className="avail-card">
          <div className="avail-top">
            <div className="avail-dot"></div>
            <span className="avail-status">Available</span>
          </div>
          <div className="avail-title">FREELANCE</div>
          <div className="avail-desc">Taking on select freelance projects. Minimum 2-week engagements. Let's talk scope.</div>
        </div>
        <div className="avail-card">
          <div className="avail-top">
            <div className="avail-dot" style={{ background: '#e82828' }}></div>
            <span className="avail-status" style={{ color: 'rgba(232,40,40,0.7)' }}>Response Time</span>
          </div>
          <div className="avail-title">24 HOURS</div>
          <div className="avail-desc">I respond to all serious inquiries within 24 hours. Chicago timezone (CDT).</div>
        </div>
      </div>
    </>
  );
};

export default Contact;
