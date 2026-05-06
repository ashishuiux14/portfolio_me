import React from 'react';

const CleaneroThumb = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#04080f' }}>
      <img 
        src="/cleanero-hero-final.png" 
        alt="Cleaneró Smart Pitcher" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
    </div>
  );
};

export default CleaneroThumb;
