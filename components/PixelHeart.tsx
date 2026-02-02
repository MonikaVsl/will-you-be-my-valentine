
import React from 'react';

interface PixelHeartProps {
  size?: number;
  color?: string;
}

const PixelHeart: React.FC<PixelHeartProps> = ({ size = 64, color = "#ec4899" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 8 8" 
      xmlns="http://www.w3.org/2000/svg" 
      shapeRendering="crispEdges"
      className="drop-shadow-lg"
    >
      <path 
        d="M1 2h2v1H1zm4 0h2v1H5zM0 3h8v3H0zm1 3h6v1H1zm2 1h2v1H3z" 
        fill={color} 
      />
      {/* Gloss Effect */}
      <path d="M1 3h1v1H1z" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
};

export default PixelHeart;
