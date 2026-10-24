import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MagicalPageTransition({ children }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Check reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      return;
    }

    setIsTransitioning(true);

    // Spawn 7 subtle celestial golden particles along the viewport top
    const newParticles = Array.from({ length: 7 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      left: `${15 + i * 11 + (Math.random() * 6 - 3)}%`,
      top: `${20 + Math.random() * 30}px`,
      size: `${3 + Math.random() * 4}px`,
      delay: `${i * 40}ms`,
      duration: `${380 + Math.random() * 120}ms`,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setParticles([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition-wrapper">
      {/* Subtle Golden Light Beam Sweep across the top edge */}
      {isTransitioning && <div className="page-transition-light-beam" />}

      {/* Ephemeral Celestial Sparkles */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "fixed",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "#F4D38B",
            boxShadow: "0 0 8px 2px rgba(244, 211, 139, 0.7)",
            pointerEvents: "none",
            zIndex: 998,
            animation: `celestialFloatParticle ${p.duration} ease-out ${p.delay} forwards`,
          }}
        />
      ))}

      {children}
    </div>
  );
}
