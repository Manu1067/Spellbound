import React, { useEffect, useRef, useState } from "react";

export default function CelestialCrystalEmblem({
  size = 120,
  className = "",
  isProcessing = false,
  isStasis = false,
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // 1. Intersection Observer: Stop movement when element is scrolled out of viewport
    if (!containerRef.current || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    // 2. Page Visibility Listener: Stop movement when user switches browser tabs
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. User Idle Detection: Reduce movement after 25s of inactivity
    let idleTimer = null;
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 25000);
    };

    resetIdle();
    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
    };
  }, []);

  const shouldPauseMovement = isStasis || !isVisible || !isTabActive || (isIdle && !isProcessing);

  return (
    <div
      ref={containerRef}
      className={`celestial-crystal-emblem-wrap ${shouldPauseMovement ? "stasis-frozen" : ""} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        filter: isProcessing ? "drop-shadow(0 0 25px rgba(244, 211, 139, 0.85))" : "none",
        transition: "filter var(--transition-normal)",
      }}
      aria-label="Department of Mysteries Animated Celestial Archive Crystal"
      title={shouldPauseMovement ? "Celestial movement suspended for energy conservation" : "Celestial core active"}
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
            <stop offset="0%" stopColor="#79C2A4" stopOpacity={isProcessing ? "0.9" : "0.6"} />
            <stop offset="40%" stopColor="#4A6FA5" stopOpacity={isProcessing ? "0.6" : "0.3"} />
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
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#D6B46A" stopOpacity="0.5" />
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

        {/* Middle Celestial Ring with Arcane Coordinates (Counter-Clockwise) */}
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
          <line x1="100" y1="30" x2="100" y2="40" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="100" y1="160" x2="100" y2="170" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="30" y1="100" x2="40" y2="100" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="160" y1="100" x2="170" y2="100" stroke="#D6B46A" strokeWidth="1" strokeOpacity="0.8" />
        </g>

        {/* Orbiting Celestial Ancient Runes (Clockwise Orbit 1) */}
        <g style={{ transformOrigin: "100px 100px" }} className={isProcessing ? "anim-spin-slow" : "anim-orbit-rune-1"}>
          <g transform="translate(100, 100)">
            <g transform="translate(74, 0)">
              <circle cx="0" cy="0" r="8" fill="rgba(11, 16, 32, 0.85)" stroke="#D6B46A" strokeWidth="0.8" />
              <text x="0" y="3" fill="#F4D38B" fontSize="9" fontFamily="Cinzel" fontWeight="bold" textAnchor="middle">
                ᚱ
              </text>
            </g>
            <g transform="translate(-74, 0)">
              <circle cx="0" cy="0" r="8" fill="rgba(11, 16, 32, 0.85)" stroke="#D6B46A" strokeWidth="0.8" />
              <text x="0" y="3" fill="#F4D38B" fontSize="9" fontFamily="Cinzel" fontWeight="bold" textAnchor="middle">
                ᛟ
              </text>
            </g>
          </g>
        </g>

        {/* Orbiting Celestial Ancient Runes (Counter-Clockwise Orbit 2) */}
        <g style={{ transformOrigin: "100px 100px" }} className={isProcessing ? "anim-spin-reverse" : "anim-orbit-rune-2"}>
          <g transform="translate(100, 100)">
            <g transform="translate(0, 58)">
              <circle cx="0" cy="0" r="7.5" fill="rgba(11, 16, 32, 0.85)" stroke="#79C2A4" strokeWidth="0.8" />
              <text x="0" y="3" fill="#79C2A4" fontSize="8.5" fontFamily="Cinzel" fontWeight="bold" textAnchor="middle">
                ᚦ
              </text>
            </g>
            <g transform="translate(0, -58)">
              <circle cx="0" cy="0" r="7.5" fill="rgba(11, 16, 32, 0.85)" stroke="#79C2A4" strokeWidth="0.8" />
              <text x="0" y="3" fill="#79C2A4" fontSize="8.5" fontFamily="Cinzel" fontWeight="bold" textAnchor="middle">
                ᛋ
              </text>
            </g>
          </g>
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

        {/* Central Faceted Celestial Crystal with Gentle Rotation & Shimmer */}
        <g className="crystal-core-float anim-crystal-prism">
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

          {/* Processing Focused Energy Starlight Beam */}
          {isProcessing && (
            <circle
              cx="100"
              cy="100"
              r="22"
              fill="none"
              stroke="#F4D38B"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="anim-spin-slow"
            />
          )}

          {/* Center Point Star Brilliance */}
          <circle
            cx="100"
            cy="100"
            r={isProcessing ? 4.5 : 3}
            fill="#FFFFFF"
            filter="drop-shadow(0 0 6px #FFFFFF)"
          />
          <circle cx="100" cy="46" r="2" fill="#FBF4DD" />
        </g>
      </svg>
    </div>
  );
}
