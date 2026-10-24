import React, { useEffect, useState } from "react";
import { Award, Sparkles, CheckCircle2, X } from "lucide-react";

export default function AcademicSuccessAnimation({ achievement, onClose }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!achievement) return;

    // Check prefers-reduced-motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      // Spawn 16 stardust embers drifting upward
      const newParticles = Array.from({ length: 16 }, (_, i) => ({
        id: `ap-${i}`,
        left: `${20 + Math.random() * 60}%`,
        bottom: `${10 + Math.random() * 20}%`,
        size: `${3 + Math.random() * 4}px`,
        dx: `${(Math.random() - 0.5) * 80}px`,
        dy: `-${40 + Math.random() * 60}px`,
        duration: `${1.4 + Math.random() * 0.8}s`,
        delay: `${Math.random() * 0.3}s`,
      }));
      setParticles(newParticles);
    }

    // Auto-dismiss after 4.2 seconds
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4200);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        maxWidth: "540px",
        width: "calc(100% - 2rem)",
        pointerEvents: "auto",
      }}
      role="alert"
      aria-live="assertive"
    >
      <div
        className="anim-stamp-achievement ornate-corners"
        style={{
          background: "linear-gradient(135deg, rgba(21, 29, 53, 0.98) 0%, rgba(11, 16, 32, 0.98) 100%)",
          border: "2px solid var(--antique-gold-bright)",
          borderRadius: "var(--radius-lg)",
          padding: "1.2rem 1.6rem",
          boxShadow: "0 16px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(214, 180, 106, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer sweep effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(244, 211, 139, 0.12) 50%, transparent 100%)",
            animation: "goldenLightSweep 1.8s ease-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Celebratory Stardust Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "#F4D38B",
              boxShadow: "0 0 8px #F4D38B",
              pointerEvents: "none",
              "--dx": p.dx,
              "--dy": p.dy,
              animation: `celebrateParticleBurst ${p.duration} ease-out ${p.delay} forwards`,
            }}
          />
        ))}

        {/* Golden Laurel / Seal Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244, 211, 139, 0.3) 0%, rgba(214, 180, 106, 0.1) 70%)",
            border: "2px solid var(--antique-gold-bright)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 18px rgba(214, 180, 106, 0.6)",
          }}
        >
          <Award size={30} color="var(--antique-gold-bright)" className="anim-candle-pulse" />
        </div>

        {/* Achievement Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span
              className="badge-gold"
              style={{
                fontSize: "0.68rem",
                padding: "0.15rem 0.5rem",
                letterSpacing: "0.08em",
              }}
            >
              MAGICAL MILESTONE UNLOCKED
            </span>
            {achievement.points && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-display)",
                  color: "var(--antique-gold-bright)",
                  fontWeight: "bold",
                }}
              >
                +{achievement.points} House Pts
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: "var(--ivory)",
              marginBottom: "0.2rem",
            }}
          >
            {achievement.title}
          </h3>

          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--parchment)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {achievement.subtitle}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          style={{
            color: "var(--parchment-muted)",
            padding: "0.4rem",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label="Dismiss academic achievement alert"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
