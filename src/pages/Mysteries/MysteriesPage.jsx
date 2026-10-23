import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Compass,
  Eye,
} from "lucide-react";
import { mysteriesRiddles } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./MysteriesPage.css";

const CONSTELLATIONS = [
  {
    id: "c-1",
    name: "Corona Noctis (The Crown Raven)",
    stars: 7,
    season: "Autumn Solstice",
    lore: "Associated with mind-expanding spells and precognitive visions. Anchors the north wards of the Academy.",
    color: "var(--antique-gold)",
  },
  {
    id: "c-2",
    name: "Draco Igneus (The Fire Wyrm)",
    stars: 12,
    season: "Winter Solstice",
    lore: "Fires from this constellation catalyze volatile potion cauldrons and strengthen dragon-heartstring wands.",
    color: "#E288A1",
  },
  {
    id: "c-3",
    name: "Hydra Umbrae (The Shadow Serpent)",
    stars: 9,
    season: "Spring Equinox",
    lore: "Veils cloaking charms and enhances illusion enchantments. Appears low on the south horizon.",
    color: "#79C2A4",
  },
];

export default function MysteriesPage() {
  const [selectedConstellation, setSelectedConstellation] = useState(CONSTELLATIONS[0]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [puzzleState, setPuzzleState] = useState("unsolved"); // 'unsolved' | 'correct' | 'wrong'

  const riddle = mysteriesRiddles[0];

  const handleVerifyAnswer = () => {
    if (selectedAnswer === riddle.correctIndex) {
      setPuzzleState("correct");
    } else {
      setPuzzleState("wrong");
    }
  };

  return (
    <div className="mysteries-container anim-fade-in-up">
      {/* Return Path & Header */}
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
              background: "rgba(109, 51, 69, 0.25)",
              border: "1px solid #8E445B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E288A1",
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Department of Mysteries: Chronomancy & Stellar Enigmas
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Chronomancy dials, stellar spheres & arcane riddles locked beneath subterranean seals.
            </p>
          </div>
        </div>
      </div>

      {/* Restricted Vault Atmosphere Banner */}
      <div className="vault-atmosphere ornate-corners">
        <div style={{ maxWidth: "700px" }}>
          <span className="badge-burgundy" style={{ marginBottom: "0.6rem" }}>
            Classification: Arch-Magister Level III
          </span>
          <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            The Chamber of Arcane Paradoxes
          </h2>
          <p style={{ color: "var(--parchment)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            Here lie instruments that measure the ebb of magical time, celestial astrolabes that forecast ley-line fractures, and forbidden scrolls sealed by ancient oaths.
          </p>
        </div>
      </div>

      {/* Two Column Grid: The Chrono-Dial Enigma & Celestial Spheres */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        {/* Left: The Riddle of the Chronos Dial */}
        <div className="magical-card ornate-corners">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {puzzleState === "correct" ? (
                <Unlock size={20} color="#79C2A4" />
              ) : (
                <Lock size={20} color="var(--antique-gold)" />
              )}
              <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                The Chronos Enigma Dial
              </h3>
            </div>
            <span className="badge-gold">Interactive Riddle</span>
          </div>

          <p style={{ fontStyle: "italic", fontFamily: "var(--font-literary)", fontSize: "1.1rem", color: "var(--parchment)", lineHeight: 1.6, marginBottom: "1.4rem" }}>
            "{riddle.question}"
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
            {riddle.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAnswer(idx);
                    if (puzzleState !== "unsolved") setPuzzleState("unsolved");
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: isSelected ? "rgba(214, 180, 106, 0.18)" : "rgba(11, 16, 32, 0.6)",
                    border: `1px solid ${isSelected ? "var(--antique-gold)" : "rgba(214, 180, 106, 0.15)"}`,
                    color: isSelected ? "var(--antique-gold-bright)" : "var(--ivory)",
                    fontSize: "0.88rem",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "var(--transition-fast)",
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <span style={{ fontSize: "0.75rem" }}>● Selected Dial</span>}
                </button>
              );
            })}
          </div>

          {/* Verification Action */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <MagicalButton
              onClick={handleVerifyAnswer}
              variant="burgundy"
              size="md"
              icon={Key}
              disabled={selectedAnswer === null}
            >
              Align Chrono-Dial & Break Seal
            </MagicalButton>

            {puzzleState === "correct" && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(49, 92, 74, 0.25)",
                  border: "1px solid #79C2A4",
                  color: "#79C2A4",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={16} /> Seal Broken!
                </div>
                <p style={{ margin: 0, color: "var(--parchment)" }}>
                  {riddle.explanation}
                </p>
                <div style={{ marginTop: "0.6rem", padding: "0.6rem", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-sm)", border: "1px dashed #79C2A4", fontSize: "0.78rem" }}>
                  📜 <strong>Unlocked Classified Record:</strong> "The third moon of the winter solstice shall reveal the passage beneath the Astronomy spire to those bearing the Obsidian crest."
                </div>
              </div>
            )}

            {puzzleState === "wrong" && (
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(109, 51, 69, 0.25)",
                  border: "1px solid #E288A1",
                  color: "#E288A1",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={16} />
                <span>The runes hum in dissonance. The dial rejects this alignment. Reflect on the Solstice candle and try again.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Constellation Planetarium Finder */}
        <div className="magical-card ornate-corners">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Eye size={18} color="var(--antique-gold)" />
            <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Nocturnal Constellation Archive
            </h3>
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "1.2rem" }}>
            Select a celestial cluster to view its alignment and astral influence over Academy wards.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
            {CONSTELLATIONS.map((c) => {
              const isActive = selectedConstellation.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`constellation-card ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedConstellation(c)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ivory)", fontSize: "0.92rem" }}>
                      {c.name}
                    </span>
                    <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                      {c.stars} Stars
                    </span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)" }}>
                    Peak Alignment: {c.season}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Constellation Lore Details */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(11, 16, 32, 0.7)",
              border: "1px solid var(--antique-gold-border)",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
              Ley-Line Properties
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--parchment)", lineHeight: 1.5, margin: 0 }}>
              {selectedConstellation.lore}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .mysteries-container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
