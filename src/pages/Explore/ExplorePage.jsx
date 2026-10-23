import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  ArrowLeft,
  Eye,
  ShieldAlert,
  Sparkles,
  Info,
  Navigation,
} from "lucide-react";
import { campusLocations } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./ExplorePage.css";

export default function ExplorePage() {
  const [selectedLocation, setSelectedLocation] = useState(campusLocations[0]);
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [activeCourse, setActiveCourse] = useState(false);

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setRevealedSecret(false);
    setActiveCourse(false);
  };

  return (
    <div className="explore-container anim-fade-in-up">
      {/* Return Path & Department Header */}
      <div>
        <Link
          to="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.82rem",
            color: "var(--antique-gold)",
            marginBottom: "0.8rem",
            fontFamily: "var(--font-display)",
          }}
        >
          <ArrowLeft size={14} /> Return to Academy Hall
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(214, 180, 106, 0.15)",
              border: "1px solid var(--antique-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--antique-gold)",
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Explore Hogwarts: Cartography & Living Corridors
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Parchment maps, golden pathways & compass guidance through the shifting architecture.
            </p>
          </div>
        </div>
      </div>

      {/* Main Map & Location Inspector Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem" }}>
        {/* Left: The Enchanted Parchment Map */}
        <div className="parchment-map-wrapper ornate-corners">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              borderBottom: "1px solid rgba(214, 180, 106, 0.2)",
              paddingBottom: "0.6rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "0.95rem", letterSpacing: "0.08em" }}>
                CAMPUS LEY-LINE MAP
              </span>
              <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                Active Wards Synchronized
              </span>
            </div>

            <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)", fontStyle: "italic" }}>
              Click any golden seal to inspect
            </span>
          </div>

          {/* Interactive SVG Parchment Map */}
          <div style={{ position: "relative" }}>
            <svg
              viewBox="0 0 1000 600"
              className="parchment-map-svg"
            >
              <defs>
                <radialGradient id="mapVignette" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#251C15" stopOpacity="0" />
                  <stop offset="100%" stopColor="#0B0806" stopOpacity="0.8" />
                </radialGradient>
                <linearGradient id="pathGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D6B46A" />
                  <stop offset="100%" stopColor="#7E6023" />
                </linearGradient>
              </defs>

              {/* Parchment Base Texture & Grid */}
              <rect width="1000" height="600" fill="#1C1611" />
              <rect width="1000" height="600" fill="url(#mapVignette)" />

              {/* Subtle Topological Contour Lines */}
              <path d="M50 150 Q200 80 400 120 T800 90 T950 180" stroke="#36291E" strokeWidth="1.5" fill="none" />
              <path d="M50 220 Q250 160 500 200 T850 160 T950 250" stroke="#36291E" strokeWidth="1.5" fill="none" />
              <path d="M50 360 Q300 320 600 340 T950 400" stroke="#36291E" strokeWidth="1.5" fill="none" />

              {/* The Great Black Lake Contour */}
              <path
                d="M50 450 Q250 420 500 480 T950 500 L950 600 L50 600 Z"
                fill="#121A28"
                stroke="rgba(214, 180, 106, 0.25)"
                strokeWidth="1.5"
              />
              <text x="350" y="550" fill="rgba(214, 180, 106, 0.35)" fontFamily="Cinzel" fontSize="16" letterSpacing="6">
                THE GREAT BLACK LAKE
              </text>

              {/* Forbidden Forest Zone */}
              <path d="M50 50 L300 50 L250 380 L50 380 Z" fill="#14211A" opacity="0.6" stroke="rgba(49, 92, 74, 0.4)" strokeDasharray="4 4" />
              <text x="70" y="100" fill="#4E8A71" fontFamily="Cinzel" fontSize="13" letterSpacing="3">
                FORBIDDEN WOODS
              </text>

              {/* Golden Pathways connecting locations */}
              <g stroke="url(#pathGold)" strokeWidth="2" strokeDasharray="5 7" opacity="0.65">
                <line x1="180" y1="288" x2="500" y2="336" />
                <line x1="500" y1="336" x2="380" y2="210" />
                <line x1="500" y1="336" x2="650" y2="132" />
                <line x1="500" y1="336" x2="780" y2="420" />
                <line x1="500" y1="336" x2="320" y2="450" />
              </g>

              {/* Castle Courtyard Outline */}
              <rect x="420" y="270" width="160" height="130" stroke="#D6B46A" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="500" cy="335" r="70" stroke="rgba(214, 180, 106, 0.3)" strokeWidth="1" strokeDasharray="2 3" fill="none" />

              {/* Compass Rose on Map */}
              <g transform="translate(880, 110)">
                <circle cx="0" cy="0" r="42" stroke="rgba(214, 180, 106, 0.3)" strokeWidth="1" fill="none" />
                <path d="M0 -40 L6 -8 L40 0 L6 8 L0 40 L-6 8 L-40 0 L-6 -8 Z" fill="#D6B46A" opacity="0.7" />
                <text x="-4" y="-44" fill="#D6B46A" fontSize="12" fontFamily="Cinzel" fontWeight="bold">N</text>
              </g>

              {/* Interactive Hotspot Pins */}
              {campusLocations.map((loc) => {
                const px = (loc.coords.x / 100) * 1000;
                const py = (loc.coords.y / 100) * 600;
                const isSelected = selectedLocation.id === loc.id;

                return (
                  <g
                    key={loc.id}
                    transform={`translate(${px}, ${py})`}
                    className="map-poi-pin"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        stroke="#F4D38B"
                        strokeWidth="1.5"
                        fill="rgba(214, 180, 106, 0.2)"
                        className="anim-window-pulse"
                      />
                    )}

                    <circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill={isSelected ? "#D6B46A" : "#1A233A"}
                      stroke="#F4D38B"
                      strokeWidth="2"
                    />

                    <text
                      x="0"
                      y="4"
                      fill={isSelected ? "#0B1020" : "#F4D38B"}
                      fontSize="10"
                      fontFamily="Cinzel"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {loc.name.charAt(0)}
                    </text>

                    {/* Label Tag */}
                    <text
                      x="0"
                      y="-18"
                      fill="#F6F0E4"
                      fontSize="11"
                      fontFamily="Cinzel"
                      fontWeight="600"
                      textAnchor="middle"
                      style={{ textShadow: "0 2px 5px rgba(0,0,0,0.9)" }}
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Campus Location Shortcut Filter Chips */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {campusLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                style={{
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-display)",
                  borderRadius: "var(--radius-round)",
                  background: selectedLocation.id === loc.id ? "rgba(214, 180, 106, 0.3)" : "rgba(21, 29, 53, 0.5)",
                  border: `1px solid ${selectedLocation.id === loc.id ? "var(--antique-gold)" : "rgba(214, 180, 106, 0.2)"}`,
                  color: selectedLocation.id === loc.id ? "var(--antique-gold-bright)" : "var(--parchment)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Location Lore & Action Drawer */}
        <div className="location-drawer ornate-corners">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
                {selectedLocation.zone}
              </span>
              <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                {selectedLocation.name}
              </h2>
            </div>

            <span
              className={selectedLocation.dangerLevel.includes("Restricted") ? "badge-burgundy" : "badge-emerald"}
              style={{ fontSize: "0.68rem" }}
            >
              {selectedLocation.dangerLevel}
            </span>
          </div>

          <p style={{ color: "var(--parchment)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {selectedLocation.description}
          </p>

          {/* Highlights */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "0.88rem", fontFamily: "var(--font-display)", color: "var(--antique-gold)", marginBottom: "0.6rem" }}>
              Key Architectural Features
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {selectedLocation.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.45rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(11, 16, 32, 0.6)",
                    border: "1px solid rgba(214, 180, 106, 0.15)",
                    fontSize: "0.78rem",
                    color: "var(--ivory)",
                  }}
                >
                  • {h}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Prototypes: Revealing Charm & Course Setter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", borderTop: "1px solid rgba(214, 180, 106, 0.15)", paddingTop: "1.2rem" }}>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <MagicalButton
                onClick={() => setRevealedSecret((prev) => !prev)}
                variant="primary"
                size="sm"
                icon={Eye}
              >
                {revealedSecret ? "Dispel Ward" : "Cast Revealing Charm (Aparecium)"}
              </MagicalButton>

              <MagicalButton
                onClick={() => setActiveCourse((prev) => !prev)}
                variant="secondary"
                size="sm"
                icon={Navigation}
              >
                {activeCourse ? "Navigation Active ✓" : "Plot Golden Path"}
              </MagicalButton>
            </div>

            {revealedSecret && (
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(214, 180, 106, 0.1)",
                  border: "1px solid var(--antique-gold)",
                  color: "var(--antique-gold-bright)",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-literary)",
                  lineHeight: 1.5,
                }}
              >
                ✨ <strong>Secret Passage Revealed:</strong> A hidden doorway behind the third spiral gargoyle leads directly into the East Scriptoria undercroft.
              </div>
            )}

            {activeCourse && (
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(49, 92, 74, 0.2)",
                  border: "1px solid #79C2A4",
                  color: "#79C2A4",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Sparkles size={16} />
                <span>Golden footsteps illuminate along the flagstones toward {selectedLocation.name}. Estimated travel: 4 minutes.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .explore-container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
