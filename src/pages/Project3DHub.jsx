import { useEffect, useRef } from 'react';

const Project3DHub = () => {
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
        src="/3d-hub-case-study.html" 
        style={{ width: '100%', height: '100%', border: 'none', display: 'block', cursor: 'none' }} 
        title="3D Hub Case Study" 
      />
    </div>
  );
};

export default Project3DHub;
