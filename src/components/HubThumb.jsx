import React from 'react';

const HubThumb = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#1a2e1a' }}>
      <img 
        src="/hub-hero.png" 
        alt="3D Hub" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to top, rgba(26,46,26,0.8) 0%, transparent 40%)',
        pointerEvents: 'none' 
      }} />
    </div>
  );
};

export default HubThumb;
