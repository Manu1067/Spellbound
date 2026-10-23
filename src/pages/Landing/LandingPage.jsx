import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, Compass, Shield } from "lucide-react";
import CastleHeroScene from "../../components/magical/CastleHeroScene";
import ParticleField from "../../components/magical/ParticleField";
import Emblem from "../../components/magical/Emblem";
import MagicalButton from "../../components/ui/MagicalButton";
import DepartmentCard from "../../components/ui/DepartmentCard";
import { sevenDepartments } from "../../data/mockData";
import "./LandingPage.css";

export default function LandingPage() {
  const scrollToDepartments = (e) => {
    e.preventDefault();
    const target = document.getElementById("departments-showcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-container">
      {/* 1. Hero Section */}
      <section className="landing-hero">
        {/* Layered Castle Artwork Background */}
        <div className="hero-art-layer">
          <CastleHeroScene />
        </div>

        {/* Ambient Darkening Vignette */}
        <div className="hero-vignette-overlay" />

        {/* Golden Floating Stardust & Sparks */}
        <ParticleField count={36} />

        {/* Centered Hero Content */}
        <div className="hero-content-wrapper">
          {/* Animated Emblem */}
          <div className="hero-emblem-reveal">
            <Emblem size={74} spin={true} />
          </div>

          {/* Spellbound Wordmark */}
          <h1 className="hero-brand-title hero-title-reveal">SPELLBOUND</h1>

          {/* Tagline */}
          <p className="hero-tagline hero-tagline-reveal">
            Your world of magic. Your universe of possibilities.
          </p>

          {/* Supporting Philosophy */}
          <p className="hero-description hero-tagline-reveal">
            Spellbound brings learning, exploration, community and magical
            discovery together in one connected student universe. Step past the
            ancient wards and begin your journey.
          </p>

          {/* CTA Action Buttons */}
          <div className="hero-cta-group hero-actions-reveal">
            <MagicalButton
              to="/dashboard"
              variant="primary"
              size="lg"
              icon={Sparkles}
            >
              Enter the Academy
            </MagicalButton>

            <MagicalButton
              onClick={scrollToDepartments}
              variant="secondary"
              size="lg"
              icon={Compass}
            >
              Explore the Seven Departments
            </MagicalButton>
          </div>
        </div>

        {/* Discreet Scroll Indicator */}
        <a
          href="#departments-showcase"
          onClick={scrollToDepartments}
          className="hero-scroll-indicator"
          aria-label="Scroll down to the Seven Departments showcase"
        >
          <span>Descend into the Realm</span>
          <ChevronDown size={18} />
        </a>
      </section>

      {/* 2. Seven Departments Showcase */}
      <section id="departments-showcase" className="showcase-section">
        <div className="showcase-header">
          <span className="showcase-eyebrow">The Seven Foundations</span>
          <h2 className="showcase-title">Seven Departments. One Enchanted World.</h2>
          <p className="showcase-subtitle">
            Every tower, archive, and hearth at Spellbound operates in harmony.
            Choose a department below to inspect its domain and active magical tools.
          </p>
        </div>

        <div className="departments-grid">
          {sevenDepartments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <Emblem size={38} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--ivory)",
                fontSize: "1.2rem",
              }}
            >
              SPELLBOUND
            </span>
          </div>

          <p
            style={{
              maxWidth: "600px",
              fontFamily: "var(--font-literary)",
              fontSize: "0.95rem",
              color: "var(--parchment-muted)",
              lineHeight: 1.6,
            }}
          >
            An original magical-academy platform created for scholars of the arcane.
            Designed with antique parchment, midnight skies, and celestial order.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
              fontSize: "0.82rem",
              fontFamily: "var(--font-display)",
            }}
          >
            <Link to="/dashboard" style={{ color: "var(--antique-gold)" }}>
              Academy Hall
            </Link>
            <Link to="/explore" style={{ color: "var(--antique-gold)" }}>
              Campus Map
            </Link>
            <Link to="/academics" style={{ color: "var(--antique-gold)" }}>
              Magical Labs
            </Link>
            <Link to="/houses-events" style={{ color: "var(--antique-gold)" }}>
              House Cup
            </Link>
            <Link to="/mysteries" style={{ color: "var(--antique-gold)" }}>
              Department of Mysteries
            </Link>
          </div>

          <div
            style={{
              fontSize: "0.74rem",
              color: "var(--parchment-muted)",
              borderTop: "1px solid rgba(214, 180, 106, 0.12)",
              paddingTop: "1.2rem",
              width: "100%",
            }}
          >
            Spellbound Academy System · Phase 1 Visual Shell & Department Protocols · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
