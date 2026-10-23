import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Wind,
  Gauge,
  Timer,
  Shield,
  Zap,
  Target,
  CheckCircle2,
} from "lucide-react";
import MagicalButton from "../../components/ui/MagicalButton";
import "./SportsPage.css";

const LEAGUE_STANDINGS = [
  { rank: 1, team: "Gryphonhart Lions", wins: 5, losses: 1, goalDiff: "+180", points: 15, color: "var(--burgundy-light)" },
  { rank: 2, team: "Ravencrest Skyhawks", wins: 4, losses: 2, goalDiff: "+120", points: 12, color: "var(--antique-gold)" },
  { rank: 3, team: "Shadowvale Serpents", wins: 3, losses: 3, goalDiff: "+40", points: 9, color: "#79C2A4" },
  { rank: 4, team: "Emberwyrm Drakes", wins: 0, losses: 6, goalDiff: "-340", points: 0, color: "#D48C45" },
];

export default function SportsPage() {
  // Flight Drill mini-simulator state
  const [drillState, setDrillState] = useState("idle"); // 'idle' | 'running' | 'success' | 'miss'
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const startDrill = () => {
    setDrillState("running");
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 2000) + 1200;
    setTimeout(() => {
      setStartTime(Date.now());
      setDrillState("active");
    }, delay);
  };

  const handleIntercept = () => {
    if (drillState === "active") {
      const elapsed = Date.now() - startTime;
      setReactionTime(elapsed);
      setDrillState("success");
    } else if (drillState === "running") {
      setDrillState("miss"); // clicked too early
    }
  };

  return (
    <div className="sports-container anim-fade-in-up">
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
              background: "rgba(226, 136, 161, 0.15)",
              border: "1px solid #E288A1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E288A1",
            }}
          >
            <Trophy size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Sports Department: Skyspire League & Aerial Telemetry
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Aero-broom tournaments, speed vectors & flight maneuver training.
            </p>
          </div>
        </div>
      </div>

      {/* Atmospheric Wind Telemetry Row */}
      <div className="sports-stats-grid">
        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--antique-gold)" }}>
            <Wind size={16} />
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pitch Wind Vector</span>
          </div>
          <span style={{ fontSize: "1.45rem", fontFamily: "var(--font-display)", color: "var(--ivory)", fontWeight: 700 }}>
            18.4 kts · NNW
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>Favorable tailwind along Goal Tier 3</span>
        </div>

        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#79C2A4" }}>
            <Gauge size={16} />
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Repulsion Field</span>
          </div>
          <span style={{ fontSize: "1.45rem", fontFamily: "var(--font-display)", color: "var(--ivory)", fontWeight: 700 }}>
            99.8% Stability
          </span>
          <span style={{ fontSize: "0.72rem", color: "#79C2A4" }}>Safety cushions active on stadium turf</span>
        </div>

        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#E288A1" }}>
            <Timer size={16} />
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Next League Clash</span>
          </div>
          <span style={{ fontSize: "1.45rem", fontFamily: "var(--font-display)", color: "var(--ivory)", fontWeight: 700 }}>
            In 3 Days, 4h
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>Ravencrest vs. Gryphonhart</span>
        </div>
      </div>

      {/* Two Column Layout: Standings & Interactive Flight Drill */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        {/* Left: Tournament Standings */}
        <div className="magical-card ornate-corners">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Skyspire Cup League Standings
            </h3>
            <span className="badge-gold">Autumn Derby</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(214, 180, 106, 0.2)", color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                  <th style={{ padding: "0.6rem 0.4rem" }}>Rank</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Team</th>
                  <th style={{ padding: "0.6rem 0.4rem" }}>W</th>
                  <th style={{ padding: "0.6rem 0.4rem" }}>L</th>
                  <th style={{ padding: "0.6rem 0.6rem" }}>Diff</th>
                  <th style={{ padding: "0.6rem 0.6rem" }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUE_STANDINGS.map((team) => (
                  <tr
                    key={team.rank}
                    style={{
                      borderBottom: "1px solid rgba(214, 180, 106, 0.08)",
                      background: team.team.includes("Ravencrest") ? "rgba(214, 180, 106, 0.06)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.75rem 0.4rem", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--antique-gold)" }}>
                      #{team.rank}
                    </td>
                    <td style={{ padding: "0.75rem 0.8rem", fontWeight: 600, color: "var(--ivory)" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: team.color, marginRight: "0.5rem" }} />
                      {team.team}
                    </td>
                    <td style={{ padding: "0.75rem 0.4rem", color: "var(--parchment)" }}>{team.wins}</td>
                    <td style={{ padding: "0.75rem 0.4rem", color: "var(--parchment-muted)" }}>{team.losses}</td>
                    <td style={{ padding: "0.75rem 0.6rem", color: "var(--parchment)" }}>{team.goalDiff}</td>
                    <td style={{ padding: "0.75rem 0.6rem", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--antique-gold-bright)" }}>
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Interactive Aero-Broom Flight Drill Simulator */}
        <div className="flight-sim-arena ornate-corners">
          <div style={{ marginBottom: "1rem" }}>
            <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
              Flight Maneuver Simulator
            </span>
            <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              The Golden Nimbus Dive Test
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--parchment)", maxWidth: "420px", margin: "0 auto" }}>
              Test your aerial reflexes. Once the Nimbus flashes gold, strike your flight maneuver instantaneously.
            </p>
          </div>

          {/* Arena Display Area */}
          <div
            style={{
              height: "170px",
              background: "rgba(11, 16, 32, 0.7)",
              border: "1px solid rgba(214, 180, 106, 0.2)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "1.2rem 0",
              position: "relative",
            }}
          >
            {drillState === "idle" && (
              <div style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                Press "Engage Flight Drill" to begin calibration
              </div>
            )}

            {drillState === "running" && (
              <div style={{ color: "var(--antique-gold)", fontStyle: "italic", fontFamily: "var(--font-literary)", fontSize: "1.1rem" }}>
                Hovering in the mist... Stay focused...
              </div>
            )}

            {drillState === "active" && (
              <button
                onClick={handleIntercept}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #FFE49E 0%, #D6B46A 60%, #AA8438 100%)",
                  boxShadow: "0 0 35px #FFE49E, inset 0 0 10px #FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0B1020",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  letterSpacing: "0.08em",
                  animation: "fadeInScale 0.15s ease",
                }}
              >
                CATCH!
              </button>
            )}

            {drillState === "success" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={32} color="#79C2A4" />
                <span style={{ fontFamily: "var(--font-display)", color: "#79C2A4", fontWeight: 700, fontSize: "1.1rem" }}>
                  Intercepted in {reactionTime} ms!
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--antique-gold)" }}>
                  Exemplary Reflexes · Seeker Grade A
                </span>
              </div>
            )}

            {drillState === "miss" && (
              <div style={{ color: "#E288A1", fontSize: "0.9rem" }}>
                Early dive! The Nimbus slipped through the draft. Try again!
              </div>
            )}
          </div>

          {/* Simulator Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem" }}>
            <MagicalButton
              onClick={startDrill}
              variant="primary"
              size="md"
              disabled={drillState === "running" || drillState === "active"}
            >
              {drillState === "idle" ? "Engage Flight Drill" : "Repeat Test"}
            </MagicalButton>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .sports-container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
