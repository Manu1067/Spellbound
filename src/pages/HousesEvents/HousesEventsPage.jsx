import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Award,
  Sparkles,
  Calendar,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { housesData as initialHouses, campusEvents } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./HousesEventsPage.css";

export default function HousesEventsPage() {
  const [houses, setHouses] = useState(initialHouses);
  const [awardHouseId, setAwardHouseId] = useState("ravencrest");
  const [awardAmount, setAwardAmount] = useState(25);
  const [awardReason, setAwardReason] = useState("Exemplary Potion Formulation");
  const [awardFeedback, setAwardFeedback] = useState("");

  const handleAwardPoints = (e) => {
    e.preventDefault();
    setHouses((prev) =>
      prev.map((h) =>
        h.id === awardHouseId
          ? { ...h, points: h.points + Number(awardAmount) }
          : h
      )
    );

    const targetHouse = houses.find((h) => h.id === awardHouseId);
    setAwardFeedback(
      `✨ Added ${awardAmount} points to ${targetHouse.name} for "${awardReason}"!`
    );
    setTimeout(() => setAwardFeedback(""), 4500);
  };

  const maxPoints = 1600;

  return (
    <div className="houses-container anim-fade-in-up">
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
              background: "rgba(214, 180, 106, 0.2)",
              border: "1px solid var(--antique-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--antique-gold)",
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Houses & Events: The Great Hall Hourglasses
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              House points hourglasses, crest banners & celebratory campus galas.
            </p>
          </div>
        </div>
      </div>

      {/* 1. The Great Hall Hourglasses Stage */}
      <div className="hourglasses-stage ornate-corners">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 1rem" }}>
          <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
            The Four Jewel Cylinders of Eldoria
          </span>
          <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
            Live House Cup Points Standings
          </h2>
          <p style={{ color: "var(--parchment)", fontSize: "0.88rem" }}>
            As points are awarded by arch-magisters, thousands of precious gems cascade through the enchanted glass chambers.
          </p>
        </div>

        {/* Four Hourglasses Columns */}
        <div className="hourglass-grid">
          {houses.map((house) => {
            const pct = Math.min(100, Math.round((house.points / maxPoints) * 100));

            const gemColors = {
              ravencrest: { fill: "#2D589E", glow: "#4A82DE", gem: "Sapphires" },
              gryphonhart: { fill: "#8E2B43", glow: "#C94565", gem: "Rubies" },
              shadowvale: { fill: "#236B49", glow: "#44A877", gem: "Emeralds" },
              emberwyrm: { fill: "#9E581D", glow: "#DE8536", gem: "Topazes" },
            }[house.id];

            return (
              <div key={house.id} className="hourglass-column">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--ivory)" }}>
                    {house.name}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--antique-gold)" }}>
                    {gemColors.gem}
                  </div>
                </div>

                {/* Cylinder */}
                <div className="hourglass-cylinder">
                  <div
                    className="hourglass-jewels-fill"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: gemColors.fill,
                      color: gemColors.glow,
                      backgroundImage: `radial-gradient(circle at 50% 20%, ${gemColors.glow} 0%, ${gemColors.fill} 80%)`,
                    }}
                  />
                </div>

                {/* Points Pill */}
                <span className="badge-gold" style={{ fontSize: "0.85rem", padding: "0.3rem 0.8rem", fontWeight: 700 }}>
                  {house.points} pts
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive Points Awarding Station */}
        <div
          style={{
            borderTop: "1px solid rgba(214, 180, 106, 0.2)",
            paddingTop: "1.5rem",
            marginTop: "1.5rem",
            background: "rgba(11, 16, 32, 0.6)",
            padding: "1.2rem",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
            <PlusCircle size={18} color="var(--antique-gold)" />
            <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", color: "var(--ivory)" }}>
              Faculty Points Ledger (Interactive Prototype Action)
            </h3>
          </div>

          <form
            onSubmit={handleAwardPoints}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <label style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase" }}>Select House</label>
              <select
                value={awardHouseId}
                onChange={(e) => setAwardHouseId(e.target.value)}
                style={{
                  background: "rgba(21, 29, 53, 0.8)",
                  border: "1px solid var(--antique-gold-border)",
                  color: "var(--ivory)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.45rem 0.8rem",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              >
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <label style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase" }}>Points</label>
              <select
                value={awardAmount}
                onChange={(e) => setAwardAmount(e.target.value)}
                style={{
                  background: "rgba(21, 29, 53, 0.8)",
                  border: "1px solid var(--antique-gold-border)",
                  color: "var(--ivory)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.45rem 0.8rem",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              >
                <option value={10}>+10 Points</option>
                <option value={25}>+25 Points</option>
                <option value={50}>+50 Points</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1, minWidth: "200px" }}>
              <label style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase" }}>Commendation Reason</label>
              <input
                type="text"
                value={awardReason}
                onChange={(e) => setAwardReason(e.target.value)}
                style={{
                  background: "rgba(21, 29, 53, 0.8)",
                  border: "1px solid var(--antique-gold-border)",
                  color: "var(--ivory)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.45rem 0.8rem",
                  fontSize: "0.85rem",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div style={{ alignSelf: "flex-end" }}>
              <MagicalButton type="submit" variant="primary" size="md" icon={Award}>
                Award Points
              </MagicalButton>
            </div>
          </form>

          {awardFeedback && (
            <div
              style={{
                marginTop: "0.8rem",
                color: "#79C2A4",
                fontSize: "0.85rem",
                fontFamily: "var(--font-literary)",
                fontWeight: 600,
              }}
            >
              {awardFeedback}
            </div>
          )}
        </div>
      </div>

      {/* 2. The Four Great Houses Showcase Cards */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-display)", color: "var(--ivory)", marginBottom: "1rem" }}>
          The Four Houses of Spellbound
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {houses.map((house) => (
            <div
              key={house.id}
              className="house-banner-card"
              style={{
                background: `linear-gradient(180deg, ${house.crestColor}33 0%, rgba(11, 16, 32, 0.95) 100%)`,
                borderTop: `3px solid ${house.accentColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span className="badge-gold" style={{ fontSize: "0.68rem" }}>
                  Totem: {house.animal}
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--parchment-muted)" }}>
                  {house.gem}
                </span>
              </div>

              <h3 style={{ fontSize: "1.35rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.2rem" }}>
                {house.name}
              </h3>

              <p style={{ fontStyle: "italic", fontFamily: "var(--font-literary)", fontSize: "1rem", color: "var(--antique-gold)", marginBottom: "0.8rem" }}>
                "{house.motto}"
              </p>

              <div style={{ fontSize: "0.78rem", color: "var(--parchment)", marginBottom: "0.8rem" }}>
                <strong>Virtues: </strong>{house.values.join(" · ")}
              </div>

              <div style={{ fontSize: "0.74rem", color: "var(--parchment-muted)", borderTop: "1px solid rgba(214, 180, 106, 0.12)", paddingTop: "0.6rem" }}>
                Head of House: <span style={{ color: "var(--ivory)" }}>{house.headOfHouse}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
