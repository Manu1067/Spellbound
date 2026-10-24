import React from "react";

export default function CelestialCrystalEmblem({ size = 120, className = "" }) {
  return (
    <div
      className={`celestial-crystal-emblem-wrap ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Department of Mysteries Animated Celestial Archive Crystal"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Celestial Crystal Gradients */}
          <radialGradient id="crystalAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#79C2A4" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#4A6FA5" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#D6B46A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="facetPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF4DD" />
            <stop offset="40%" stopColor="#D6B46A" />
            <stop offset="85%" stopColor="#79C2A4" />
            <stop offset="100%" stopColor="#2E4A70" />
          </linearGradient>

          <linearGradient id="facetGlint" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D6B46A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1B2844" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D6B46A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FBF4DD" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8E445B" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Ambient Pulsing Aura */}
        <circle cx="100" cy="100" r="85" fill="url(#crystalAura)" className="crystal-aura-pulse" />

        {/* Outer Astrolabe Coordinate Ring (Slow Clockwise) */}
        <g className="astrolabe-ring-outer">
          <circle
            cx="100"
            cy="100"
            r="82"
            stroke="url(#ringGold)"
            strokeWidth="1.2"
            strokeDasharray="4 6 12 6"
            strokeOpacity="0.75"
          />
          {/* Starlight Nodes on Outer Ring */}
          <circle cx="100" cy="18" r="3" fill="#FBF4DD" filter="drop-shadow(0 0 4px #D6B46A)" />
          <circle cx="100" cy="182" r="3" fill="#FBF4DD" filter="drop-shadow(0 0 4px #D6B46A)" />
          <circle cx="18" cy="100" r="2.5" fill="#79C2A4" filter="drop-shadow(0 0 3px #79C2A4)" />
          <circle cx="182" cy="100" r="2.5" fill="#79C2A4" filter="drop-shadow(0 0 3px #79C2A4)" />
        </g>

        {/* Middle Celestial Ring with Arcane Runic Coordinates (Counter-Clockwise) */}
        <g className="astrolabe-ring-middle">
          <circle
            cx="100"
            cy="100"
            r="66"
            stroke="#D6B46A"
            strokeWidth="1"
            strokeDasharray="1 5"
            strokeOpacity="0.6"
          />
          {/* Cardinal Coordinate Ticks */}
          <line x1="100" y1="30" x2="100" y2="40" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="100" y1="160" x2="100" y2="170" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="30" y1="100" x2="40" y2="100" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="160" y1="100" x2="170" y2="100" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
        </g>

        {/* Inner Gyro Ring (Fast Clockwise) */}
        <g className="astrolabe-ring-inner">
          <ellipse
            cx="100"
            cy="100"
            rx="52"
            ry="24"
            stroke="#79C2A4"
            strokeWidth="1"
            strokeDasharray="6 3"
            strokeOpacity="0.7"
            transform="rotate(-25 100 100)"
          />
        </g>

        {/* Central Faceted Celestial Crystal */}
        <g className="crystal-core-float">
          {/* Back Shadow / Depth Facet */}
          <polygon
            points="100,44 126,82 100,156 74,82"
            fill="rgba(15, 23, 42, 0.9)"
            stroke="rgba(214, 180, 106, 0.4)"
            strokeWidth="1"
          />

          {/* Top-Left Main Facet */}
          <polygon
            points="100,44 74,82 100,100"
            fill="url(#facetPrimary)"
            stroke="#FBF4DD"
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />

          {/* Top-Right Glint Facet */}
          <polygon
            points="100,44 126,82 100,100"
            fill="url(#facetGlint)"
            stroke="#FBF4DD"
            strokeWidth="0.8"
            strokeOpacity="0.9"
          />

          {/* Bottom-Left Depth Facet */}
          <polygon
            points="100,100 74,82 100,156"
            fill="url(#facetPrimary)"
            fillOpacity="0.85"
            stroke="#D6B46A"
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />

          {/* Bottom-Right Refraction Facet */}
          <polygon
            points="100,100 126,82 100,156"
            fill="url(#facetGlint)"
            fillOpacity="0.75"
            stroke="#79C2A4"
            strokeWidth="0.8"
            strokeOpacity="0.75"
          />

          {/* Center Point Star Brilliance */}
          <circle cx="100" cy="100" r="3" fill="#FFFFFF" filter="drop-shadow(0 0 6px #FFFFFF)" />
          <circle cx="100" cy="46" r="2" fill="#FBF4DD" />
        </g>
      </svg>
    </div>
  );
}
