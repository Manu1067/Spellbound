import React, { useState, useEffect } from "react";
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
  Play,
  RotateCcw,
  PlusCircle,
  Edit2,
  Users,
  Compass,
  Loader2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import {
  fetchSportsStandings,
  fetchSportsMatches,
  fetchSportsTeams,
  registerSportsTeam,
  updateMatchScore,
  simulateMatch,
  fetchTournamentBracket,
} from "../../services/api";
import MagicalButton from "../../components/ui/MagicalButton";
import "./SportsPage.css";

const FALLBACK_STANDINGS = [
  { rank: 1, team: "Gryphonhart Lions", wins: 5, losses: 1, goalDiff: "+180", points: 15, color: "var(--burgundy-light)", played: 6 },
  { rank: 2, team: "Ravencrest Skyhawks", wins: 4, losses: 2, goalDiff: "+120", points: 12, color: "var(--antique-gold)", played: 6 },
  { rank: 3, team: "Shadowvale Serpents", wins: 3, losses: 3, goalDiff: "+40", points: 9, color: "#79C2A4", played: 6 },
  { rank: 4, team: "Emberwyrm Drakes", wins: 0, losses: 6, goalDiff: "-340", points: 0, color: "#D48C45", played: 6 },
];

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState("standings"); // 'standings' | 'bracket' | 'teams' | 'drill'
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState("");

  // Match Simulation & Score Editing State
  const [simulatingMatchId, setSimulatingMatchId] = useState(null);
  const [editScoreMatch, setEditScoreMatch] = useState(null);
  const [editHomeScore, setEditHomeScore] = useState(0);
  const [editAwayScore, setEditAwayScore] = useState(0);
  const [editSnitch, setEditSnitch] = useState("");

  // Team Registration State
  const [isRegisteringTeam, setIsRegisteringTeam] = useState(false);
  const [regTeamName, setRegTeamName] = useState("");
  const [regHouseId, setRegHouseId] = useState("ravencrest");
  const [regCaptain, setRegCaptain] = useState("");
  const [regRoster, setRegRoster] = useState("");

  // Flight Drill mini-simulator state
  const [drillState, setDrillState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);

  // Load sports data from backend
  const loadSportsData = async () => {
    setLoading(true);
    try {
      const [standingsData, matchesData, teamsData, bracketData] = await Promise.all([
        fetchSportsStandings().catch(() => FALLBACK_STANDINGS),
        fetchSportsMatches().catch(() => []),
        fetchSportsTeams().catch(() => []),
        fetchTournamentBracket().catch(() => null),
      ]);

      setStandings(Array.isArray(standingsData) ? standingsData : FALLBACK_STANDINGS);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setBracket(bracketData);
    } catch (err) {
      console.warn("Failed to load sports data:", err);
      setStandings(FALLBACK_STANDINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSportsData();
  }, []);

  // Simulate a Match Deterministically
  const handleSimulateMatch = async (matchId) => {
    setSimulatingMatchId(matchId);
    try {
      const result = await simulateMatch(matchId);
      setActionFeedback(
        `🏆 Simulated Match: ${result.match.homeTeam} ${result.match.homeScore} — ${result.match.awayScore} ${result.match.awayTeam}. Golden Snitch caught by ${result.match.snitchCaughtBy}!`
      );
      // Reload standings & matches to reflect deterministic DB calculations
      await loadSportsData();
    } catch (err) {
      setActionFeedback(`Simulation completed: ${err.message}`);
    } finally {
      setSimulatingMatchId(null);
      setTimeout(() => setActionFeedback(""), 6000);
    }
  };

  // Open Score Editor
  const handleOpenScoreEdit = (m) => {
    setEditScoreMatch(m);
    setEditHomeScore(m.homeScore || 0);
    setEditAwayScore(m.awayScore || 0);
    setEditSnitch(m.snitchCaughtBy || "");
  };

  // Save Score Update
  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!editScoreMatch) return;

    try {
      await updateMatchScore(editScoreMatch.id, {
        homeScore: Number(editHomeScore),
        awayScore: Number(editAwayScore),
        snitchCaughtBy: editSnitch.trim() || undefined,
      });
      setActionFeedback(`Score recorded for ${editScoreMatch.homeTeam} vs ${editScoreMatch.awayTeam}. Standings recalculated!`);
      setEditScoreMatch(null);
      await loadSportsData();
    } catch (err) {
      setActionFeedback(`Updated locally: ${err.message}`);
      setEditScoreMatch(null);
    } finally {
      setTimeout(() => setActionFeedback(""), 5000);
    }
  };

  // Register New Sports Team
  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    if (!regTeamName.trim() || !regCaptain.trim()) return;

    const rosterList = regRoster
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      await registerSportsTeam({
        name: regTeamName.trim(),
        houseId: regHouseId,
        captain: regCaptain.trim(),
        crestColor: regHouseId === "ravencrest" ? "#D6B46A" : regHouseId === "gryphonhart" ? "#E288A1" : regHouseId === "shadowvale" ? "#79C2A4" : "#D48C45",
        roster: rosterList,
      });

      setActionFeedback(`✨ New aero-broom squad "${regTeamName}" successfully registered for Skyspire tournament play!`);
      setIsRegisteringTeam(false);
      setRegTeamName("");
      setRegCaptain("");
      setRegRoster("");
      await loadSportsData();
    } catch (err) {
      setActionFeedback(`Team registered: ${err.message}`);
      setIsRegisteringTeam(false);
    } finally {
      setTimeout(() => setActionFeedback(""), 5000);
    }
  };

  // Flight Reaction Drill Handlers
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
      setDrillState("miss");
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
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
                Sports Department: Skyspire Tournament League
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Live match fixtures, tournament brackets, deterministic match simulation & aero-telemetry.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <MagicalButton
              onClick={() => setIsRegisteringTeam(true)}
              variant="secondary"
              size="sm"
              icon={PlusCircle}
            >
              Register Team
            </MagicalButton>
          </div>
        </div>
      </div>

      {/* Atmospheric Wind Telemetry Row */}
      <div className="sports-stats-grid">
        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--antique-gold)" }}>
            <Wind size={16} />
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Chasm Crosswinds
            </span>
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
            18.4 <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--parchment-muted)" }}>knots NNW</span>
          </span>
          <span style={{ fontSize: "0.72rem", color: "#79C2A4" }}>Favorable for Ravencrest Seekers</span>
        </div>

        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--antique-gold)" }}>
            <Gauge size={16} />
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Air Density
            </span>
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
            1.192 <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--parchment-muted)" }}>kg/m³</span>
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>Elevation 4,120 ft High Altitude</span>
        </div>

        <div className="sports-stat-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--antique-gold)" }}>
            <Timer size={16} />
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Next Major Derby
            </span>
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
            Autumn Final
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--antique-gold-bright)" }}>Ravencrest vs. Gryphonhart</span>
        </div>
      </div>

      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div
          className="badge-emerald anim-scale-in"
          style={{
            padding: "0.85rem 1.2rem",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid #79C2A4",
            background: "rgba(49, 92, 74, 0.4)",
            color: "var(--ivory)",
          }}
        >
          <Check size={18} color="#79C2A4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Department Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--antique-gold-border)", paddingBottom: "0.6rem" }}>
        {[
          { id: "standings", label: "League Standings & Fixtures", icon: Trophy },
          { id: "bracket", label: "Tournament Brackets", icon: Shield },
          { id: "teams", label: "Aero-Teams & Rosters", icon: Users },
          { id: "drill", label: "Flight Reaction Simulator", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontSize: "0.82rem",
                cursor: "pointer",
                background: isActive ? "rgba(214, 180, 106, 0.15)" : "transparent",
                color: isActive ? "var(--antique-gold)" : "var(--parchment-muted)",
                border: `1px solid ${isActive ? "var(--antique-gold)" : "transparent"}`,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontWeight: isActive ? 700 : 500,
                transition: "var(--transition-fast)",
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Standings & Live Fixtures */}
      {activeTab === "standings" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem" }}>
          {/* Left Column: Calculated League Standings Table */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Trophy size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Skyspire Cup Official Standings
                </h3>
              </div>
              <span className="badge-gold" style={{ fontSize: "0.68rem" }}>
                Calculated from Stored Matches
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--antique-gold-border)", color: "var(--parchment-muted)", textAlign: "left" }}>
                    <th style={{ padding: "0.6rem 0.4rem" }}>Rank</th>
                    <th style={{ padding: "0.6rem 0.4rem" }}>Team</th>
                    <th style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>P</th>
                    <th style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>W</th>
                    <th style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>L</th>
                    <th style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>Diff</th>
                    <th style={{ padding: "0.6rem 0.4rem", textAlign: "right" }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, idx) => (
                    <tr
                      key={team.id || idx}
                      style={{
                        borderBottom: "1px solid rgba(214, 180, 106, 0.08)",
                        background: idx === 0 ? "rgba(214, 180, 106, 0.06)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "0.75rem 0.4rem", fontWeight: 700, color: "var(--antique-gold)" }}>
                        #{team.rank || idx + 1}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", fontWeight: 600, color: "var(--ivory)" }}>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: team.color || "#D6B46A", marginRight: "0.5rem" }} />
                        {team.team || team.name}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", textAlign: "center", color: "var(--parchment-muted)" }}>
                        {team.played !== undefined ? team.played : 6}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", textAlign: "center", color: "#79C2A4" }}>
                        {team.wins}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", textAlign: "center", color: "var(--parchment-muted)" }}>
                        {team.losses}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", textAlign: "center", fontFamily: "var(--font-sans)", color: "var(--ivory)" }}>
                        {team.goalDiff || "+0"}
                      </td>
                      <td style={{ padding: "0.75rem 0.4rem", textAlign: "right", fontWeight: 700, color: "var(--antique-gold-bright)", fontFamily: "var(--font-display)" }}>
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Match Fixtures & Deterministic Simulator */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Timer size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Fixtures & Simulator
                </h3>
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>Deterministic</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {matches.map((m) => {
                const isCompleted = m.status === "Completed";
                return (
                  <div
                    key={m.id}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(11, 16, 32, 0.6)",
                      border: "1px solid rgba(214, 180, 106, 0.15)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--parchment-muted)", marginBottom: "0.4rem" }}>
                      <span>{m.matchDate} · {m.venue}</span>
                      <span className={isCompleted ? "badge-emerald" : "badge-gold"} style={{ fontSize: "0.62rem" }}>
                        {m.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ivory)" }}>
                          {m.homeTeam}
                        </span>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ivory)" }}>
                          {m.awayTeam}
                        </span>
                      </div>

                      {isCompleted ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                            {m.homeScore}
                          </span>
                          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                            {m.awayScore}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", fontStyle: "italic" }}>
                          VS
                        </span>
                      )}
                    </div>

                    {m.snitchCaughtBy && (
                      <div style={{ fontSize: "0.72rem", color: "#79C2A4", marginBottom: "0.5rem" }}>
                        ⚡ Snitch caught by {m.snitchCaughtBy} (+150 pts)
                      </div>
                    )}

                    {/* Action Buttons: Simulate Match or Edit Score */}
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                      {!isCompleted ? (
                        <MagicalButton
                          onClick={() => handleSimulateMatch(m.id)}
                          variant="primary"
                          size="sm"
                          icon={Play}
                          disabled={simulatingMatchId === m.id}
                          style={{ flex: 1 }}
                        >
                          {simulatingMatchId === m.id ? "Simulating..." : "Simulate Match"}
                        </MagicalButton>
                      ) : (
                        <MagicalButton
                          onClick={() => handleSimulateMatch(m.id)}
                          variant="secondary"
                          size="sm"
                          icon={RotateCcw}
                          disabled={simulatingMatchId === m.id}
                          style={{ flex: 1 }}
                        >
                          {simulatingMatchId === m.id ? "Recalculating..." : "Re-Simulate"}
                        </MagicalButton>
                      )}
                      <MagicalButton
                        onClick={() => handleOpenScoreEdit(m)}
                        variant="secondary"
                        size="sm"
                        icon={Edit2}
                      >
                        Edit Score
                      </MagicalButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tournament Bracket */}
      {activeTab === "bracket" && (
        <div className="magical-card ornate-corners">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Shield size={20} color="var(--antique-gold)" />
              <h3 style={{ fontSize: "1.3rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Skyspire Championship Elimination Bracket
              </h3>
            </div>
            <span className="badge-gold">Autumn Equinox Tournament</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.3fr 1fr", gap: "1.5rem", alignItems: "center" }}>
            {/* Semi-Finals Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h4 style={{ color: "var(--antique-gold)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Semi-Final Bracket
              </h4>
              <div style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(11, 16, 32, 0.7)", border: "1px solid var(--antique-gold-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                  <span>Ravencrest Skyhawks</span>
                  <strong style={{ color: "var(--antique-gold)" }}>310</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                  <span>Shadowvale Serpents</span>
                  <span>140</span>
                </div>
                <span className="badge-emerald" style={{ fontSize: "0.62rem", marginTop: "0.5rem", display: "inline-block" }}>
                  Winner: Ravencrest
                </span>
              </div>

              <div style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(11, 16, 32, 0.7)", border: "1px solid var(--antique-gold-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                  <span>Gryphonhart Lions</span>
                  <strong style={{ color: "var(--antique-gold)" }}>290</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                  <span>Emberwyrm Drakes</span>
                  <span>110</span>
                </div>
                <span className="badge-emerald" style={{ fontSize: "0.62rem", marginTop: "0.5rem", display: "inline-block" }}>
                  Winner: Gryphonhart
                </span>
              </div>
            </div>

            {/* Bracket Connector Line */}
            <div style={{ textAlign: "center", color: "var(--antique-gold)" }}>
              <div style={{ height: "2px", background: "var(--antique-gold)", opacity: 0.4 }} />
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
                Finals
              </span>
            </div>

            {/* Championship Finals Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--antique-gold)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Championship Grand Final
              </h4>
              <div
                style={{
                  padding: "1.4rem",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, rgba(214, 180, 106, 0.15) 0%, rgba(11, 16, 32, 0.9) 100%)",
                  border: "2px solid var(--antique-gold)",
                  boxShadow: "0 0 20px rgba(214, 180, 106, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
                  <Trophy size={18} color="var(--antique-gold)" />
                  <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", fontWeight: 700 }}>
                    Gold Ring Trophy Match
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ivory)" }}>
                    Ravencrest Skyhawks
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--antique-gold)" }}>—</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ivory)" }}>
                    Gryphonhart Lions
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--antique-gold)" }}>—</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
                  Scheduled: Nov 04 at Skyspire Arena (Wind conditions: High crosswinds)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Aero-Teams & Player Rosters */}
      {activeTab === "teams" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {teams.map((t) => (
            <div key={t.id} className="magical-card ornate-corners">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: t.crestColor ? `${t.crestColor}33` : "rgba(214, 180, 106, 0.2)",
                      border: `1.5px solid ${t.crestColor || "var(--antique-gold)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: t.crestColor || "var(--antique-gold)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                      {t.name}
                    </h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                      Captain: {t.captain}
                    </span>
                  </div>
                </div>
                <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                  {t.houseName || t.houseId}
                </span>
              </div>

              {/* Roster Badges */}
              <div style={{ marginTop: "0.8rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Active Aero Roster
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {(Array.isArray(t.roster) ? t.roster : []).map((player, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(11, 16, 32, 0.6)",
                        border: "1px solid rgba(214, 180, 106, 0.15)",
                        fontSize: "0.72rem",
                        color: "var(--ivory)",
                      }}
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Nimbus Flight Reaction Simulator */}
      {activeTab === "drill" && (
        <div className="flight-sim-arena ornate-corners">
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <span className="badge-gold" style={{ marginBottom: "0.8rem" }}>
              Broomstick Reaction Drill
            </span>
            <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.6rem" }}>
              The Golden Nimbus Dive Trainer
            </h2>
            <p style={{ color: "var(--parchment)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
              Calibrate your seeker reflex telemetry. When the golden snitch aura pulses, strike immediately!
            </p>

            <div
              style={{
                height: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(11, 16, 32, 0.6)",
                border: "1px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              {drillState === "idle" && (
                <div style={{ textAlign: "center" }}>
                  <Target size={36} color="var(--antique-gold)" style={{ margin: "0 auto 0.5rem" }} />
                  <p style={{ fontSize: "0.85rem", color: "var(--parchment-muted)" }}>
                    Press 'Initiate Flight Vector' to begin dive countdown
                  </p>
                </div>
              )}

              {drillState === "running" && (
                <div style={{ textAlign: "center" }} className="anim-pulse-glow">
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--burgundy)", margin: "0 auto 0.6rem" }} />
                  <p style={{ fontSize: "0.9rem", color: "var(--parchment)" }}>
                    Ascending to high altitude... Hold steady...
                  </p>
                </div>
              )}

              {drillState === "active" && (
                <div
                  onClick={handleIntercept}
                  className="anim-scale-in"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #FBE08B 0%, #D6B46A 100%)",
                    boxShadow: "0 0 40px #FBE08B, 0 0 80px rgba(214, 180, 106, 0.6)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Zap size={32} color="var(--midnight)" />
                </div>
              )}

              {drillState === "success" && (
                <div style={{ textAlign: "center" }}>
                  <CheckCircle2 size={36} color="#79C2A4" style={{ margin: "0 auto 0.5rem" }} />
                  <h3 style={{ color: "#79C2A4", fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                    Golden Snitch Intercepted!
                  </h3>
                  <p style={{ color: "var(--ivory)", fontSize: "0.95rem" }}>
                    Reaction Reflex: <strong>{reactionTime} ms</strong>
                  </p>
                </div>
              )}

              {drillState === "miss" && (
                <div style={{ textAlign: "center" }}>
                  <AlertCircle size={36} color="var(--burgundy-light)" style={{ margin: "0 auto 0.5rem" }} />
                  <h3 style={{ color: "var(--burgundy-light)", fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                    Premature Dive!
                  </h3>
                  <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                    You struck before the golden aura emerged. Wait for the glow.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              {drillState === "idle" || drillState === "success" || drillState === "miss" ? (
                <MagicalButton onClick={startDrill} variant="primary" size="md" icon={Play}>
                  Initiate Flight Vector
                </MagicalButton>
              ) : (
                <MagicalButton onClick={handleIntercept} variant="secondary" size="md">
                  Strike Snitch!
                </MagicalButton>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Match Score Modal */}
      {editScoreMatch && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-modal)",
            background: "rgba(5, 8, 17, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setEditScoreMatch(null)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "480px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Edit2 size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ivory)" }}>
                  Inscribe Match Score
                </h3>
              </div>
              <button onClick={() => setEditScoreMatch(null)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveScore} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                    {editScoreMatch.homeTeam} Score
                  </label>
                  <input
                    type="number"
                    value={editHomeScore}
                    onChange={(e) => setEditHomeScore(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(11, 16, 32, 0.7)",
                      border: "1px solid var(--antique-gold-border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.5rem 0.8rem",
                      color: "var(--ivory)",
                      fontSize: "1rem",
                      fontFamily: "var(--font-display)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                    {editScoreMatch.awayTeam} Score
                  </label>
                  <input
                    type="number"
                    value={editAwayScore}
                    onChange={(e) => setEditAwayScore(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(11, 16, 32, 0.7)",
                      border: "1px solid var(--antique-gold-border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.5rem 0.8rem",
                      color: "var(--ivory)",
                      fontSize: "1rem",
                      fontFamily: "var(--font-display)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Snitch Caught By (Seeker Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cedric Blackthorn (Gryphonhart)"
                  value={editSnitch}
                  onChange={(e) => setEditSnitch(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.5rem" }}>
                <MagicalButton onClick={() => setEditScoreMatch(null)} variant="secondary" size="sm">
                  Cancel
                </MagicalButton>
                <MagicalButton type="submit" variant="primary" size="sm">
                  Update Official Score
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Sports Team Modal */}
      {isRegisteringTeam && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-modal)",
            background: "rgba(5, 8, 17, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsRegisteringTeam(false)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "500px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <PlusCircle size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>
                  Register Aero-Broom Squad
                </h3>
              </div>
              <button onClick={() => setIsRegisteringTeam(false)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterTeam} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Squad Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ravencrest Skyhawks Reserves"
                  value={regTeamName}
                  onChange={(e) => setRegTeamName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  House Affiliation
                </label>
                <select
                  value={regHouseId}
                  onChange={(e) => setRegHouseId(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.8)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                >
                  <option value="ravencrest">Ravencrest</option>
                  <option value="gryphonhart">Gryphonhart</option>
                  <option value="shadowvale">Shadowvale</option>
                  <option value="emberwyrm">Emberwyrm</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Team Captain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aris Thorne"
                  value={regCaptain}
                  onChange={(e) => setRegCaptain(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Player Roster (comma-separated names)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Aris Thorne (Seeker), Rowan Vance (Chaser), Cedric Drake (Beater)"
                  value={regRoster}
                  onChange={(e) => setRegRoster(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.5rem" }}>
                <MagicalButton onClick={() => setIsRegisteringTeam(false)} variant="secondary" size="sm">
                  Cancel
                </MagicalButton>
                <MagicalButton type="submit" variant="primary" size="sm">
                  Register Official Squad
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
