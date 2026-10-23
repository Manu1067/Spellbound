import React from "react";

export default function Emblem({ size = 48, className = "", spin = false }) {
  return (
    <div
      className={`spellbound-emblem-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="goldSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF4DD" />
            <stop offset="35%" stopColor="#D6B46A" />
            <stop offset="70%" stopColor="#AA8438" />
            <stop offset="100%" stopColor="#6E5119" />
          </linearGradient>
          <filter id="goldGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring Glow */}
        <circle cx="50" cy="50" r="46" stroke="rgba(214, 180, 106, 0.25)" strokeWidth="1" />

        {/* Outer Astrolabe Ring (Optional slow spin) */}
        <g className={spin ? "anim-spin-slow" : ""} style={{ transformOrigin: "50px 50px" }}>
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#goldSealGrad)"
            strokeWidth="1.2"
            strokeDasharray="2 4"
          />
          <circle cx="50" cy="50" r="41" stroke="url(#goldSealGrad)" strokeWidth="1.8" />
          
          {/* Runic Cardinal Points */}
          <circle cx="50" cy="9" r="1.8" fill="#F4D38B" />
          <circle cx="91" cy="50" r="1.8" fill="#F4D38B" />
          <circle cx="50" cy="91" r="1.8" fill="#F4D38B" />
          <circle cx="9" cy="50" r="1.8" fill="#F4D38B" />
        </g>

        {/* Counter-rotating Inner Star Polygon */}
        <g className={spin ? "anim-spin-reverse" : ""} style={{ transformOrigin: "50px 50px" }}>
          <polygon
            points="50,16 58,35 78,35 62,48 68,68 50,56 32,68 38,48 22,35 42,35"
            stroke="url(#goldSealGrad)"
            strokeWidth="1.2"
            fill="#151D35"
            fillOpacity="0.75"
          />
        </g>

        {/* Inner Astrolabe Arc */}
        <circle cx="50" cy="50" r="16" stroke="url(#goldSealGrad)" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="12" stroke="url(#goldSealGrad)" strokeWidth="0.8" strokeDasharray="1 2" />

        {/* Center Radiant Diamond */}
        <path
          d="M50 36 L54 46 L64 50 L54 54 L50 64 L46 54 L36 50 L46 46 Z"
          fill="url(#goldSealGrad)"
          filter="url(#goldGlowFilter)"
        />
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
