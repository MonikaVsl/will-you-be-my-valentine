
import React from 'react';

const Arrow: React.FC = () => {
  return (
    <svg 
      width="12" 
      height="32" 
      viewBox="0 0 3 8" 
      shapeRendering="crispEdges"
      className="drop-shadow-sm"
    >
      {/* Tip */}
      <rect x="1" y="0" width="1" height="1" fill="#cbd5e1" />
      {/* Shaft */}
      <rect x="1" y="1" width="1" height="5" fill="#92400e" />
      {/* Fletching */}
      <rect x="0" y="6" width="3" height="1" fill="#ef4444" />
      <rect x="0" y="7" width="1" height="1" fill="#ef4444" />
      <rect x="2" y="7" width="1" height="1" fill="#ef4444" />
    </svg>
  );
};

export default Arrow;
