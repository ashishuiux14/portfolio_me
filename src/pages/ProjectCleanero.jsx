import { useEffect, useRef } from 'react';

const ProjectCleanero = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
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
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', zIndex: 2 }}>
      <iframe 
        ref={iframeRef}
        src="/cleanero-case-study.html" 
        style={{ width: '100%', height: '100%', border: 'none', display: 'block', cursor: 'none' }} 
        title="Cleaneró Case Study" 
      />
    </div>
  );
};

export default ProjectCleanero;
