import React from 'react';

const TravelogueThumb = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0c0a09' }}>
      <img 
        src="/travelogue-hero.png" 
        alt="Travelogue" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to top, rgba(12,10,9,0.8) 0%, transparent 40%)',
        pointerEvents: 'none' 
      }} />
    </div>
  );
};

export default TravelogueThumb;
