import React, { useMemo } from "react";

export default function ParticleField({ count = 28, className = "" }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2,
      duration: Math.random() * 7 + 6,
      delay: Math.random() * 5,
      isDrift: i % 2 === 0,
      color: i % 3 === 0 ? "#FBF4DD" : i % 3 === 1 ? "#D6B46A" : "#F4D38B",
    }));
  }, [count]);

  return (
    <div
      className={`particle-field-container ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `${p.isDrift ? "floatParticleDrift" : "floatParticle"} ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
