import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Activity,
  Zap,
  Shield,
  Circle,
  Flame,
  Feather,
  Award,
  Target,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Info,
  Timer
} from "lucide-react";
import { getSportsDisciplines, registerSportInterest, getSportsStandings } from "../../services/api";
import { sportsDisciplinesData as fallbackDisciplines, currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./SportsPage.css";

const SPORT_ICONS = {
  "sport-volleyball": Activity,
  "sport-kho-kho": Zap,
  "sport-kabaddi": Shield,
  "sport-football": Circle,
  "sport-throwball": Flame,
  "sport-badminton": Feather,
  "sport-chess": Award,
  "sport-carroms": Target,
  "sport-table-tennis": RotateCcw,
};

const SPORT_IMAGES = {
  "sport-volleyball": "/assets/sports/vollyBall.png",
  "sport-kho-kho": "/assets/sports/Kho_Kho.png",
  "sport-kabaddi": "/assets/sports/kabbadi.png",
  "sport-football": "/assets/sports/football.png",
  "sport-throwball": "/assets/sports/ThrowBall.png",
  "sport-badminton": "/assets/sports/batmiton.png",
  "sport-chess": "/assets/sports/chess.png",
  "sport-carroms": "/assets/sports/carrom.png",
  "sport-table-tennis": "/assets/sports/TableTennis.png",
};

const UPCOMING_FIXTURES = [
  { id: "f-1", sport: "Football", category: "Outdoor", home: "Gryffindor Strikers", away: "Slytherin Vipers FC", date: "Friday · 16:30", venue: "Skyspire Football Field" },
  { id: "f-2", sport: "Volleyball", category: "Outdoor", home: "Ravenclaw Eagles", away: "Hufflepuff Badgers", date: "Saturday · 10:00", venue: "West Outdoor Courts" },
  { id: "f-3", sport: "Kho-Kho", category: "Outdoor", home: "Gryffindor Lions", away: "Ravenclaw Eagles", date: "Saturday · 16:00", venue: "Central Athletics Oval" },
  { id: "f-4", sport: "Chess", category: "Indoor", home: "Aris Thorne (Ravenclaw)", away: "Corvin Drake (Slytherin)", date: "Sunday · 14:00", venue: "Library Mind Games Hall" },
  { id: "f-5", sport: "Table Tennis", category: "Indoor", home: "Isolde R. (Slytherin)", away: "Cedric B. (Gryffindor)", date: "Sunday · 17:30", venue: "Indoor Sports Hall B" }
];

export default function SportsPage() {
  const [activeCategory, setActiveCategory] = useState("All"); // "All" | "Outdoor" | "Indoor"
  const [disciplines, setDisciplines] = useState(
    fallbackDisciplines.map((s) => ({ ...s, image: s.image || SPORT_IMAGES[s.id] }))
  );
  const [standings, setStandings] = useState([]);
  const [selectedSportForDetails, setSelectedSportForDetails] = useState(null);

  // Registration modal
  const [registerSportModal, setRegisterSportModal] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [preferredRole, setPreferredRole] = useState("Starter / Active Player");
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Reflex Agility Drill
  const [drillState, setDrillState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    let mounted = true;
    getSportsDisciplines(activeCategory)
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setDisciplines(data.map((s) => ({ ...s, image: s.image || SPORT_IMAGES[s.id] })));
        }
      })
      .catch((err) => console.warn("Using fallback sports:", err));

    getSportsStandings()
      .then((st) => {
        if (mounted && Array.isArray(st)) setStandings(st);
      })
      .catch((err) => console.warn("Using fallback standings:", err));

    return () => { mounted = false; };
  }, [activeCategory]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerSportModal) return;

    setIsSubmittingReg(true);
    try {
      await registerSportInterest(registerSportModal.id, experienceLevel, preferredRole);
      setToastMessage(`Registered interest for ${registerSportModal.name}! The sports captain will owl your trial schedule.`);
      setRegisterSportModal(null);
      setTimeout(() => setToastMessage(""), 6000);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Reflex Trainer handler
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
      {/* Return to Dashboard & Header */}
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

      {/* Cinematic Sports Department Hero Banner */}
      <div className="dept-hero-banner ornate-corners">
        <img
          src="/assets/sports_hero.png"
          alt="Spellbound Athletics & Sports Arena"
          className="dept-hero-image"
        />
        <div className="dept-hero-gradient" />
        <div className="dept-hero-content">
          <span className="badge-emerald" style={{ marginBottom: "0.5rem" }}>
            Athletic Directorate & Tournaments
          </span>
          <h1 className="dept-hero-title">
            Sports Department: Outdoor & Indoor Athletics
          </h1>
          <p className="dept-hero-subtitle">
            Inter-house leagues, court reservations, official tournament fixtures & squad registrations.
          </p>
        </div>
      </div>
    </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="sports-toast-banner anim-fade-in-up">
          <CheckCircle2 size={18} color="#79C2A4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Demo Tournament Disclaimer */}
      <div className="sports-disclaimer-banner">
        <Info size={18} color="#E288A1" style={{ flexShrink: 0 }} />
        <span>
          <strong>Athletic Records Notice:</strong> Sport categories, official match rosters, and tournament brackets are structured illustrative datasets. Real student trial schedules will be coordinated by the Sports Council.
        </span>
      </div>

      {/* Category Tabs: Outdoor vs Indoor */}
      <div className="sports-category-nav">
        {[
          { id: "All", label: "All Sports (9)" },
          { id: "Outdoor", label: "Outdoor Sports (6)" },
          { id: "Indoor", label: "Indoor Sports (3)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`sports-cat-tab ${activeCategory === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sports Grid */}
      <div className="sports-cards-grid">
        {disciplines.map((sport) => {
          const IconComp = SPORT_ICONS[sport.id] || Trophy;
          const isOutdoor = sport.category === "Outdoor";

          return (
            <div key={sport.id} className="sport-discipline-card ornate-corners">
              {/* Individual Sport Card Artwork */}
              <div className="sport-card-image-wrap">
                <img
                  src={sport.image || SPORT_IMAGES[sport.id]}
                  alt={sport.name}
                  className="sport-card-image"
                />
                <span className={`sport-category-tag ${isOutdoor ? "outdoor" : "indoor"}`}>
                  {sport.category}
                </span>
              </div>

              <div className="sport-card-top">
                <div className={`sport-icon-box ${isOutdoor ? "outdoor" : "indoor"}`}>
                  <IconComp size={20} />
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                  {sport.name}
                </h3>
              </div>

              <p style={{ color: "var(--parchment)", fontSize: "0.86rem", lineHeight: 1.5, margin: "0.6rem 0 1rem" }}>
                {sport.description}
              </p>

              <div className="sport-specs-grid">
                <div className="spec-item">
                  <Users size={14} color="var(--antique-gold)" />
                  <span><strong>Team:</strong> {sport.teamSize}</span>
                </div>
                <div className="spec-item">
                  <MapPin size={14} color="var(--antique-gold)" />
                  <span><strong>Venue:</strong> {sport.venue}</span>
                </div>
              </div>

              <div className="sport-card-actions">
                <button
                  onClick={() => setSelectedSportForDetails(sport)}
                  className="sport-view-details-btn"
                >
                  Rules & Guidelines
                </button>
                <MagicalButton
                  onClick={() => setRegisterSportModal(sport)}
                  variant="primary"
                  size="sm"
                  icon={Trophy}
                >
                  Join / Trials
                </MagicalButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standings & Upcoming Matches Grid */}
      <div className="sports-extra-grid">
        {/* Left: Inter-House Championship Standings */}
        <div className="sports-section-box ornate-corners">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Trophy size={18} color="var(--antique-gold-bright)" />
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.1rem" }}>
                Inter-House Sports Championship Standings
              </h3>
            </div>
            <span className="badge-gold">Autumn Term</span>
          </div>

          <table className="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>House Squad</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((st) => (
                <tr key={st.rank}>
                  <td style={{ fontWeight: "bold", color: "var(--antique-gold)" }}>#{st.rank}</td>
                  <td>
                    <span className="house-dot" style={{ background: st.color }} />
                    <span style={{ color: "var(--ivory)", fontWeight: "600" }}>{st.team}</span>
                  </td>
                  <td>{st.wins}</td>
                  <td>{st.losses}</td>
                  <td style={{ fontWeight: "bold", color: "var(--antique-gold-bright)" }}>{st.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Upcoming Fixtures */}
        <div className="sports-section-box ornate-corners">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={18} color="var(--antique-gold-bright)" />
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.1rem" }}>
                Upcoming Match Fixtures
              </h3>
            </div>
            <span className="badge-burgundy">Live Schedule</span>
          </div>

          <div className="fixtures-list">
            {UPCOMING_FIXTURES.map((fix) => (
              <div key={fix.id} className="fixture-item">
                <div className="fixture-badge-col">
                  <span className="fixture-sport">{fix.sport}</span>
                  <span className="fixture-date">{fix.date}</span>
                </div>
                <div className="fixture-match-details">
                  <div className="fixture-matchup">
                    <span className="team-name">{fix.home}</span>
                    <span className="vs-tag">vs</span>
                    <span className="team-name">{fix.away}</span>
                  </div>
                  <span className="fixture-venue">{fix.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflex Agility Training Simulator */}
      <div className="sports-drill-card ornate-corners">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Timer size={18} color="var(--antique-gold-bright)" />
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.15rem" }}>
                Athletic Reflex & Reaction Calibration
              </h3>
            </div>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
              Test your reaction speed for Volleyball spikes, Kho-Kho dodges, and Table Tennis reflex returns.
            </p>
          </div>

          {drillState === "idle" && (
            <MagicalButton onClick={startDrill} variant="primary" size="md" icon={Zap}>
              Initiate Reaction Drill
            </MagicalButton>
          )}
        </div>

        {drillState !== "idle" && (
          <div className="drill-arena">
            {drillState === "running" && (
              <div className="drill-status-text anim-pulse">
                Eyes on the court... Wait for the gold spark! (Do not click yet)
              </div>
            )}
            {drillState === "active" && (
              <button onClick={handleIntercept} className="intercept-orb-btn anim-bounce">
                ✦ INTERCEPT NOW! ✦
              </button>
            )}
            {drillState === "success" && (
              <div className="drill-success-box">
                <CheckCircle2 size={32} color="#79C2A4" />
                <h4 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Target Intercepted! Reaction: {reactionTime} ms
                </h4>
                <p style={{ color: "var(--parchment-muted)", fontSize: "0.82rem" }}>
                  {reactionTime < 280 ? "Championship Grade Reflexes! Exceptional speed." : "Solid reaction speed. Continued practice will hone precision."}
                </p>
                <MagicalButton onClick={startDrill} variant="secondary" size="sm">
                  Test Again
                </MagicalButton>
              </div>
            )}
            {drillState === "miss" && (
              <div className="drill-miss-box">
                <span style={{ color: "#E288A1", fontWeight: "bold" }}>False Start! Clicked before the signal.</span>
                <MagicalButton onClick={startDrill} variant="secondary" size="sm">
                  Reset & Retry
                </MagicalButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sport Details Modal */}
      {selectedSportForDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedSportForDetails(null)}>
          <div className="sports-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <span className="badge-gold">{selectedSportForDetails.category}</span>
                <h2 style={{ fontSize: "1.4rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  {selectedSportForDetails.name} — Rules & Participation
                </h2>
              </div>
              <button onClick={() => setSelectedSportForDetails(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <div className="sports-modal-body">
              <p style={{ color: "var(--parchment)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {selectedSportForDetails.description}
              </p>

              <div className="modal-specs-list">
                <div><strong>Standard Team Size:</strong> {selectedSportForDetails.teamSize}</div>
                <div><strong>Official Match Venue:</strong> {selectedSportForDetails.venue}</div>
                <div><strong>Equipment Requirements:</strong> Academy-provided regulation balls/racquets/pieces. Non-marking shoes required for indoor courts.</div>
                <div><strong>Eligibility:</strong> Open to all enrolled students across the Four Houses.</div>
              </div>
            </div>

            <div className="sports-modal-footer">
              <button onClick={() => setSelectedSportForDetails(null)} className="cancel-btn">
                Close
              </button>
              <MagicalButton
                onClick={() => {
                  setRegisterSportModal(selectedSportForDetails);
                  setSelectedSportForDetails(null);
                }}
                variant="primary"
                size="md"
                icon={Trophy}
              >
                Register for Trials
              </MagicalButton>
            </div>
          </div>
        </div>
      )}

      {/* Register Interest Modal */}
      {registerSportModal && (
        <div className="modal-backdrop" onClick={() => setRegisterSportModal(null)}>
          <div className="sports-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.25rem" }}>
                Trial & Squad Registration: {registerSportModal.name}
              </h3>
              <button onClick={() => setRegisterSportModal(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="register-sport-form">
              <div className="form-group">
                <label>Student Scholar:</label>
                <input
                  type="text"
                  value={`${currentUser.name} (${currentUser.house} · ${currentUser.branch})`}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Experience Level:</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="Beginner / Recreational">Beginner / Recreational</option>
                  <option value="Intermediate">Intermediate (House Club experience)</option>
                  <option value="Competitive / Varsity">Competitive / Varsity (Tournament level)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Position or Role:</label>
                <input
                  type="text"
                  placeholder="e.g., Setter, Raider, Forward, Opening Board..."
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  required
                />
              </div>

              <div className="sports-modal-footer">
                <button
                  type="button"
                  onClick={() => setRegisterSportModal(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmittingReg}
                  icon={CheckCircle2}
                >
                  {isSubmittingReg ? "Submitting Registration..." : "Submit Registration"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
