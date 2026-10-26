import React, { useMemo } from "react";

export default function ParticleField({ count = 28, className = "" }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = i % 3 === 0 ? "twinkle" : i % 2 === 0 ? "drift" : "float";
      return {
        id: i,
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: type === "twinkle" ? Math.random() * 2.2 + 1.2 : Math.random() * 2.5 + 1.2,
        duration: type === "twinkle" ? Math.random() * 3 + 2.5 : Math.random() * 7 + 6,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? "#FBF4DD" : i % 3 === 1 ? "#D6B46A" : "#F4D38B",
      };
    });
  }, [count]);

  return (
    <div
      className={`particle-field-container ambient-particle-field ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {particles.map((p) => {
        const animName =
          p.type === "twinkle"
            ? "starTwinkle"
            : p.type === "drift"
            ? "floatParticleDrift"
            : "floatParticle";

        return (
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
              boxShadow: `0 0 ${p.size * (p.type === "twinkle" ? 3 : 2)}px ${p.color}`,
              animation: `${animName} ${p.duration}s infinite ease-in-out`,
              animationDelay: `${p.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
