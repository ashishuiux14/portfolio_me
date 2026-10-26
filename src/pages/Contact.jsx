import { useState } from 'react';
import Icon from '../components/Icon';
import { PageHead } from '../components/Bits';
import { CONTACT } from '../data/site';

export default function Contact() {
  const [copied, setCopied] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONTACT.email); setCopied('Email copied'); }
    catch (e) { setCopied('Select the address above to copy it'); }
    setTimeout(() => setCopied(''), 2400);
  };

  return (
    <div className="page">
      <PageHead eyebrow="Contact" title="Let’s talk."
        lede="Full-time roles, freelance work or just a conversation. I reply to every serious message within 24 hours, Chicago time." />

      <section className="grid-2" style={{ alignItems: 'stretch' }}>
        <div className="up" style={{ borderRadius: 40, padding: 'clamp(22px, 3vw, 36px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            ['mail', 'Email', CONTACT.email, `mailto:${CONTACT.email}`],
            ['linkedin', 'LinkedIn', CONTACT.linkedinHandle, CONTACT.linkedin],
            ['pin', 'Location', CONTACT.location, null],
          ].map(([icon, label, value, href]) => {
            const body = (
              <>
                <span className="round-btn up-sm" style={{ width: 52, height: 52 }}><Icon name={icon} size={20} /></span>
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span className="cap">{label}</span>
                  <span style={{ fontSize: 18, wordBreak: 'break-word' }}>{value}</span>
                </span>
              </>
            );
            return href
              ? <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="in-sm" style={{ borderRadius: 26, padding: 12, display: 'flex', alignItems: 'center', gap: 16 }}>{body}</a>
              : <div key={label} className="in-sm" style={{ borderRadius: 26, padding: 12, display: 'flex', alignItems: 'center', gap: 16 }}>{body}</div>;
          })}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6 }}>
            <button type="button" className="pill up-sm press" onClick={copy} style={{ cursor: 'pointer' }}><Icon name="copy" />Copy email</button>
            <a href={CONTACT.resume} target="_blank" rel="noreferrer" className="pill" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 500, boxShadow: 'var(--sh-up-sm)' }}>Download résumé <Icon name="download" size={18} /></a>
          </div>
          <span role="status" className="cap" style={{ minHeight: 18 }}>{copied}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {[
            ['Open to work', 'Full-time roles', 'Senior product design roles. On-site, hybrid or remote.', true],
            ['Available', 'Freelance', 'Select projects, minimum two-week engagements. Let’s talk scope.', true],
            ['Response time', '24 hours', 'Every serious inquiry gets a reply within a day, Central Time.', false],
          ].map(([status, title, d, live]) => (
            <div key={title} className="up-sm" style={{ borderRadius: 30, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <span className="cap" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: live ? 'var(--ok)' : 'var(--ink-3)' }}>{live && <i className="led" />}{status}</span>
              <b style={{ fontWeight: 500, fontSize: 22 }}>{title}</b>
              <span className="muted" style={{ fontSize: 16 }}>{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
