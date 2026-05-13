import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

const ProjectAtelier = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="case-study-page" style={{ height: '100vh', overflow: 'hidden', background: '#0a0908' }}>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Nav forceSolid={true} />
      </div>
      
      <div style={{ width: '100%', height: '100vh', position: 'relative', zIndex: 2 }}>
        <iframe
          ref={iframeRef}
          src="/atelier-case-study.html"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Atelier Case Study"
        />
      </div>
    </div>
  );
};

export default ProjectAtelier;
