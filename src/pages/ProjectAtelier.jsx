import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

const ProjectAtelier = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handler = (e) => {
      if (e.data && e.data.type === 'iframe-mousemove' && iframeRef.current) {
        const rect = iframeRef.current.getBoundingClientRect();
        const x = rect.left + e.data.clientX;
        const y = rect.top + e.data.clientY;

        document.dispatchEvent(new MouseEvent('mousemove', { 
          clientX: x, 
          clientY: y, 
          bubbles: true 
        }));
      }
    };
    window.addEventListener('message', handler);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('message', handler);
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
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', cursor: 'none' }}
          title="Atelier Case Study"
        />
      </div>
    </div>
  );
};

export default ProjectAtelier;
