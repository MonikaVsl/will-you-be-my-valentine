
import React from 'react';

const PixelBoy: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 2} viewBox="0 0 16 32" shapeRendering="crispEdges">
    {/* Hair - Dark Grey/Black */}
    <rect x="4" y="2" width="8" height="8" fill="#2d2a2a" />
    <rect x="3" y="4" width="10" height="5" fill="#2d2a2a" />
    <rect x="5" y="1" width="6" height="1" fill="#2d2a2a" />
    {/* Face */}
    <rect x="5" y="5" width="6" height="5" fill="#ffe4e1" />
    <rect x="4" y="6" width="1" height="3" fill="#ffe4e1" />
    <rect x="11" y="6" width="1" height="3" fill="#ffe4e1" />
    {/* Eyes */}
    <rect x="6" y="7" width="1" height="1" fill="#000" />
    <rect x="9" y="7" width="1" height="1" fill="#000" />
    {/* Shirt - White Collar + Black Tee */}
    <rect x="6" y="10" width="4" height="1" fill="#fff" />
    <rect x="4" y="11" width="8" height="6" fill="#1a1a1a" />
    {/* Arms */}
    <rect x="3" y="11" width="1" height="5" fill="#ffe4e1" />
    <rect x="12" y="11" width="1" height="5" fill="#ffe4e1" />
    {/* Pants - Ripped Jeans */}
    <rect x="4" y="17" width="8" height="8" fill="#5f9ea0" />
    <rect x="5" y="20" width="2" height="1" fill="#fff" opacity="0.6" /> {/* Rips */}
    <rect x="9" y="22" width="2" height="1" fill="#fff" opacity="0.6" />
    {/* Shoes */}
    <rect x="4" y="25" width="3" height="2" fill="#000" />
    <rect x="9" y="25" width="3" height="2" fill="#000" />
    <rect x="4" y="26" width="3" height="1" fill="#fff" />
    <rect x="9" y="26" width="3" height="1" fill="#fff" />
  </svg>
);

const PixelGirl: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 2} viewBox="0 0 16 32" shapeRendering="crispEdges">
    {/* Hair - Long Dark Wavy (No white headphones) */}
    <rect x="4" y="3" width="8" height="2" fill="#2d2a2a" />
    <rect x="3" y="4" width="10" height="15" fill="#2d2a2a" />
    <rect x="2" y="7" width="12" height="10" fill="#2d2a2a" />
    {/* Face */}
    <rect x="5" y="6" width="6" height="5" fill="#ffe4e1" />
    {/* Eyes */}
    <rect x="6" y="8" width="1" height="1" fill="#000" />
    <rect x="9" y="8" width="1" height="1" fill="#000" />
    {/* Scarf - White */}
    <rect x="5" y="11" width="6" height="2" fill="#f8f8ff" />
    <rect x="9" y="13" width="2" height="3" fill="#f8f8ff" />
    {/* Coat - Black */}
    <rect x="4" y="13" width="8" height="12" fill="#1a1a1a" />
    {/* Shoes */}
    <rect x="5" y="25" width="2" height="1" fill="#000" />
    <rect x="9" y="25" width="2" height="1" fill="#000" />
  </svg>
);

const PixelCouple: React.FC<{ size?: number }> = ({ size = 160 }) => {
  return (
    <div className="flex items-end justify-center -space-x-8">
      <div className="transform translate-x-4 z-10">
        <PixelBoy size={size / 2} />
      </div>
      <div className="transform -translate-x-4 z-0 scale-x-[-1]">
        <PixelGirl size={size / 2} />
      </div>
    </div>
  );
};

export default PixelCouple;
