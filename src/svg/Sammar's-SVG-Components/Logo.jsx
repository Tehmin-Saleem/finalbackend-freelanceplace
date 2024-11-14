import React from "react";

function Logo({ width, height, onClick }) {
  return (
    <div onClick={onClick}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon */}
        <polygon
          points="200,50 300,125 300,275 200,350 100,275 100,125"
          fill="#4bcdeb"
          stroke="#4bcdeb"
          strokeWidth="5"
        />
        {/* Stylized 'Y' inside the hexagon */}
        <line x1="200" y1="50" x2="200" y2="200" stroke="white" strokeWidth="30" />
        <line x1="200" y1="200" x2="140" y2="275" stroke="white" strokeWidth="30" />
        <line x1="200" y1="200" x2="260" y2="275" stroke="white" strokeWidth="30" />
        {/* Text below the logo */}
        <text
  x="107" 
  y="380"
  fill="#4bcdeb"
  fontSize="50px"
  fontFamily="Arial"
  fontWeight="bold"
>
          Embrace
        </text>
      </svg>
    </div>
  );
}

export default Logo;
