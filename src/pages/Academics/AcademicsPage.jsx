import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  FlaskConical,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { potionIngredients } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./AcademicsPage.css";

export default function AcademicsPage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [brewingResult, setBrewingResult] = useState(null);
  const [isBrewing, setIsBrewing] = useState(false);

  const toggleIngredient = (ing) => {
    if (brewingResult) setBrewingResult(null);
    if (selectedIngredients.some((i) => i.id === ing.id)) {
      setSelectedIngredients((prev) => prev.filter((i) => i.id !== ing.id));
    } else {
      if (selectedIngredients.length < 3) {
        setSelectedIngredients((prev) => [...prev, ing]);
      }
    }
  };

  const brewPotion = () => {
    if (selectedIngredients.length === 0) return;
    setIsBrewing(true);
    setBrewingResult(null);

    setTimeout(() => {
      const totalPotency = selectedIngredients.reduce((sum, i) => sum + i.potency, 0);
      const totalStability = selectedIngredients.reduce((sum, i) => sum + i.stability, 0);

      let name = "Draught of Luminescence";
      let status = "Stable";
      let color = "#79C2A4";

      if (totalStability <= 0) {
        status = "Volatile";
        name = "Elixir of Pyrotechnic Surge";
        color = "#E05A47";
      } else if (totalPotency >= 18) {
        status = "Masterwork";
        name = "Grand Philtre of the Astral Mind";
        color = "#D6B46A";
      }

      setBrewingResult({
        name,
        status,
        potency: totalPotency,
        stability: totalStability,
        color,
      });
      setIsBrewing(false);
    }, 1200);
  };

  const resetCauldron = () => {
    setSelectedIngredients([]);
    setBrewingResult(null);
  };

  const currentLiquidColor = brewingResult
    ? brewingResult.color
    : selectedIngredients.length > 0
    ? selectedIngredients[selectedIngredients.length - 1].color
    : "#2A3D32";

  return (
    <div className="academics-container anim-fade-in-up">
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
              background: "rgba(49, 92, 74, 0.2)",
              border: "1px solid var(--emerald-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#79C2A4",
            }}
          >
            <FlaskConical size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Academics & Magical Labs: The Alchemical Cauldron
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Grimoires, alchemical cauldrons & rune translation laboratories.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Potion Laboratory & Curricula */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
        {/* Left: Interactive Potion Lab Cauldron */}
        <div className="lab-cauldron-view ornate-corners">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span className="badge-emerald" style={{ marginBottom: "0.4rem" }}>
                Subterranean Dungeon Lab III
              </span>
              <h2 style={{ fontSize: "1.35rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Experimental Brewing Station
              </h2>
            </div>

            <button
              onClick={resetCauldron}
              style={{
                fontSize: "0.75rem",
                color: "var(--parchment-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Clear Vessel
            </button>
          </div>

          <p style={{ fontSize: "0.84rem", color: "var(--parchment)", marginBottom: "1rem" }}>
            Select up to 3 reagents from the reagent shelf to balance potency against chemical stability.
          </p>

          {/* Cauldron Vessel */}
          <div className="cauldron-vessel">
            <div
              className="cauldron-liquid"
              style={{
                backgroundColor: currentLiquidColor,
                boxShadow: `0 0 25px ${currentLiquidColor}88, inset 0 0 15px rgba(255,255,255,0.4)`,
              }}
            />
            {isBrewing ? (
              <span style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "#FFFFFF", fontWeight: 700 }}>
                Brewing...
              </span>
            ) : (
              <span style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-literary)", fontSize: "0.95rem", color: "#FFFFFF" }}>
                {selectedIngredients.length === 0 ? "Empty Bronze Vessel" : `${selectedIngredients.length}/3 Reagents`}
              </span>
            )}
          </div>

          {/* Reagents Shelf Selection */}
          <div style={{ marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.5rem" }}>
              Reagent Cabinet
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {potionIngredients.map((ing) => {
                const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    className={`ingredient-btn ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleIngredient(ing)}
                    disabled={!isSelected && selectedIngredients.length >= 3}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ing.color }} />
                      {ing.name}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--parchment-muted)" }}>
                      +{ing.potency} pot
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brew Action & Results Feedback */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <MagicalButton
              onClick={brewPotion}
              variant="emerald"
              size="md"
              icon={Flame}
              disabled={selectedIngredients.length === 0 || isBrewing}
            >
              Ignite Hearth & Brew Elixir
            </MagicalButton>

            {brewingResult && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(11, 16, 32, 0.7)",
                  border: `1.5px solid ${brewingResult.color}`,
                  marginTop: "0.6rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", color: brewingResult.color, fontSize: "1.05rem" }}>
                    {brewingResult.name}
                  </h4>
                  <span
                    className={brewingResult.status === "Volatile" ? "badge-burgundy" : "badge-emerald"}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {brewingResult.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--ivory)", display: "flex", gap: "1rem" }}>
                  <span>Potency Yield: <strong>{brewingResult.potency}</strong></span>
                  <span>Harmonic Stability: <strong>{brewingResult.stability}</strong></span>
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--parchment-muted)", marginTop: "0.3rem" }}>
                  {brewingResult.status === "Volatile"
                    ? "Warning: Excess flame heat destabilized the mandrake fibers. Decant with caution."
                    : "Optimal crystallization achieved! Suitable for archival submission in the Hospital Wing."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Academic Syllabus & Grimoire List */}
        <div className="magical-card ornate-corners">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
            <BookOpen size={18} color="var(--antique-gold)" />
            <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Year V Advanced Course Syllabus
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              {
                code: "TRANS-501",
                title: "Advanced Inanimate Transfiguration",
                prof: "Prof. Morgana Vance",
                desc: "Molecular morphing of inanimate metals into organic crystalline matrices.",
              },
              {
                code: "RUNE-404",
                title: "Decryption of Eldorian Tablets",
                prof: "Arch-Magister Valerius",
                desc: "Syntactic analysis of third-age astronomical glyphs carved in obsidian.",
              },
              {
                code: "ALCH-520",
                title: "Distillation of Twilight Essences",
                prof: "Mistress Belladonna",
                desc: "Nocturnal reagent processing under waxing lunar illumination.",
              },
              {
                code: "ASTR-308",
                title: "Planetary Ley-Line Dynamics",
                prof: "Master Elowen Frost",
                desc: "Gravitational distortion of spell trajectories during astral conjunctions.",
              },
            ].map((course) => (
              <div
                key={course.code}
                style={{
                  padding: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(11, 16, 32, 0.5)",
                  border: "1px solid rgba(214, 180, 106, 0.12)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "var(--ivory)" }}>
                    {course.title}
                  </span>
                  <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                    {course.code}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--antique-gold)", marginBottom: "0.3rem" }}>
                  {course.prof}
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", margin: 0 }}>
                  {course.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .academics-container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
