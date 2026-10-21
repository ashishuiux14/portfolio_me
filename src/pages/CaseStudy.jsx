import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { ALL_DETAIL_PAGES, PRINTS } from '../data/site';

/* Existing case studies are standalone HTML pages. For now they sit inside the new shell,
   in a frame that fills the content area, so the rail stays put while they scroll. */
export default function CaseStudy() {
  const { slug } = useParams();
  const item = ALL_DETAIL_PAGES.find((p) => p.slug === slug);
  useEffect(() => { if (item) document.title = `${item.name} — Ashish Dixit`; }, [item]);
  if (!item) return <Navigate to="/work" replace />;
  const isPrint = PRINTS.some((p) => p.slug === slug);
  const back = isPrint ? { to: '/3d-printing', label: '3D printing' } : { to: '/work', label: 'Case studies' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100dvh - 48px)', minHeight: 520 }}>
      <div className="up-sm" style={{ borderRadius: 28, padding: '10px 12px 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Link to={back.to} className="pill up-sm press" style={{ minHeight: 44 }}><Icon name="back" />{back.label}</Link>
        <b style={{ fontWeight: 500, fontSize: 18 }}>{item.name}</b>
        <a href={item.src} target="_blank" rel="noreferrer" className="pill press" style={{ minHeight: 44, color: 'var(--ink-2)' }}>Full screen <Icon name="link" size={16} /></a>
      </div>
      <div className="in" style={{ flex: 1, borderRadius: 30, padding: 8, minHeight: 0 }}>
        <iframe src={item.src} title={`${item.name} case study`} style={{ width: '100%', height: '100%', border: 0, borderRadius: 24, display: 'block', background: '#0a0908' }} />
      </div>
    </div>
  );
}
