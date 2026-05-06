import React from 'react';

const IphoneDockThumb = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#080808' }}>
      <img 
        src="/iphone-dock-hero.png" 
        alt="iPhone Charging Dock" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 40%)',
        pointerEvents: 'none' 
      }} />
    </div>
  );
};

export default IphoneDockThumb;
