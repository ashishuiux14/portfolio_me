import { Link } from 'react-router-dom';
import Icon from './Icon';
import { CASE_STUDIES, LAB, PRINTS, CONTACT } from '../data/site';

/* The whole site on one tile: a drawn tree from Home to every page. */
const TREE = [
  { to: '/work', label: 'Case studies', icon: 'work', kids: CASE_STUDIES.map((c) => ({ to: `/projects/${c.slug}`, label: c.name })) },
  { to: '/lab', label: 'Interaction Lab', icon: 'lab', kids: LAB.map((l) => ({ to: `/lab/${l.slug}`, label: l.name })) },
  { to: '/3d-printing', label: '3D printing', icon: 'print', kids: PRINTS.map((p) => ({ to: `/projects/${p.slug}`, label: p.name })) },
  { to: '/about', label: 'About', icon: 'about', kids: [{ href: CONTACT.resume, label: 'Résumé PDF' }] },
  { to: '/contact', label: 'Contact', icon: 'mail', kids: [] },
];

export default function Sitemap() {
  return (
    <nav className="smap" aria-label="Sitemap">
      <Link to="/" className="smap-root up-sm press"><Icon name="home" size={16} />Home</Link>
      <ul className="smap-trunk">
        {TREE.map((b) => (
          <li key={b.to} className="smap-branch">
            <Link to={b.to} className="smap-node up-sm press">
              <Icon name={b.icon} size={15} /><span>{b.label}</span>
              {b.kids.length > 1 && <span className="smap-count">{b.kids.length}</span>}
            </Link>
            {b.kids.length > 0 && (
              <ul className="smap-kids">
                {b.kids.map((k) => (
                  <li key={k.label}>
                    {k.href
                      ? <a href={k.href} target="_blank" rel="noreferrer" className="smap-leaf">{k.label}</a>
                      : <Link to={k.to} className="smap-leaf">{k.label}</Link>}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
