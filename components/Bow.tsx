
import React from 'react';

const Bow: React.FC = () => {
  return (
    <svg 
      width="48" 
      height="24" 
      viewBox="0 0 12 6" 
      shapeRendering="crispEdges"
    >
      {/* Bow curve */}
      <rect x="0" y="2" width="1" height="2" fill="#92400e" />
      <rect x="1" y="1" width="1" height="1" fill="#92400e" />
      <rect x="2" y="0" width="8" height="1" fill="#92400e" />
      <rect x="10" y="1" width="1" height="1" fill="#92400e" />
      <rect x="11" y="2" width="1" height="2" fill="#92400e" />
      {/* String */}
      <rect x="1" y="4" width="10" height="1" fill="#e2e8f0" />
    </svg>
  );
};

export default Bow;
