import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Users,
  CheckCircle2,
  Circle,
  ArrowRight,
  Award,
  Zap,
} from "lucide-react";
import {
  currentUser,
  dailySchedule as initialSchedule,
  campusEvents as initialEvents,
  housesData,
  sevenDepartments,
} from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./DashboardPage.css";

const ICON_MAP = {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
};

export default function DashboardPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [events, setEvents] = useState(initialEvents);
  const [challengeSolved, setChallengeSolved] = useState(false);
  const [pointsBonus, setPointsBonus] = useState(0);

  const toggleScheduleStatus = (id) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Completed" ? "Upcoming" : "Completed",
            }
          : item
      )
    );
  };

  const toggleEventRsvp = (id) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isRsvp: !e.isRsvp,
              rsvpCount: e.isRsvp ? e.rsvpCount - 1 : e.rsvpCount + 1,
            }
          : e
      )
    );
  };

  const handleSolveChallenge = () => {
    if (!challengeSolved) {
      setChallengeSolved(true);
      setPointsBonus(25);
    }
  };

  return (
    <div className="dashboard-container anim-fade-in-up">
      {/* 1. Welcome Banner */}
      <div className="welcome-banner ornate-corners">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: "0.6rem" }}>
              Academic Term III · Active Adept
            </div>
            <h1 className="welcome-title">
              Welcome back, {currentUser.name}
            </h1>
            <p className="welcome-subtitle">
              Your House of {currentUser.house} currently holds 1st place in the
              House Cup ledger. Your celestial readings for this evening show
              favorable astral alignment for Potion Distillation.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.4rem",
            }}
          >
            <div className="badge-emerald">
              House Points: {currentUser.pointsContributed + pointsBonus} pts
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
              {currentUser.academicRank}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Seven Department Quick Access Tiles */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.8rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--antique-gold)" }}>
            Department Portals
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
            Direct Academy Shortcuts
          </span>
        </div>

        <div className="shortcuts-grid">
          {sevenDepartments.map((dept) => {
            const Icon = ICON_MAP[dept.iconName] || Compass;
            return (
              <Link
                key={dept.id}
                to={dept.slug}
                className="shortcut-tile"
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(214, 180, 106, 0.12)",
                    border: `1px solid ${dept.accentColor}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: dept.accentColor,
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {dept.title.replace("Department", "")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-main">
        {/* Left Column: Schedule & Featured Challenge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Daily Challenge Card */}
          <div className="magical-card challenge-card ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={18} color="var(--antique-gold)" />
                <span className="badge-gold">Daily Arcane Enigma</span>
              </div>
              <span style={{ fontSize: "0.74rem", color: "var(--parchment-muted)" }}>
                Expires at Midnight
              </span>
            </div>

            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem", color: "var(--ivory)" }}>
              The Runes of Eldoria: Cipher of the Chrono-Dial
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--parchment)", marginBottom: "1.2rem" }}>
              Decipher the tripartite constellation sequence aligning the Astronomy
              Spire with the Solstice Vault before nocturnal wards engage.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--antique-gold)" }}>
                Reward: <strong>+25 House Points</strong> · Eldorian Astrolabe Crest
              </span>

              {challengeSolved ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#79C2A4" }}>
                  <CheckCircle2 size={18} />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 600 }}>
                    Enigma Solved (+25 pts added!)
                  </span>
                </div>
              ) : (
                <MagicalButton
                  onClick={handleSolveChallenge}
                  variant="primary"
                  size="sm"
                  icon={Sparkles}
                >
                  Decipher Runic Dial
                </MagicalButton>
              )}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Clock size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.15rem", color: "var(--ivory)" }}>
                  Today's Curriculum Schedule
                </h3>
              </div>
              <Link to="/academics" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                View Full Syllabus →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {schedule.map((item) => {
                const isDone = item.status === "Completed";
                return (
                  <div
                    key={item.id}
                    className="schedule-item"
                    onClick={() => toggleScheduleStatus(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                      <button
                        style={{ color: isDone ? "#79C2A4" : "var(--parchment-muted)" }}
                        aria-label="Toggle completion status"
                      >
                        {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              color: isDone ? "var(--parchment-muted)" : "var(--ivory)",
                              textDecoration: isDone ? "line-through" : "none",
                            }}
                          >
                            {item.subject}
                          </span>
                          <span className="badge-gold" style={{ fontSize: "0.62rem", padding: "0.08rem 0.35rem" }}>
                            {item.time}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--parchment-muted)", marginTop: "0.15rem" }}>
                          {item.instructor} · {item.location}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-display)",
                        color: isDone ? "#79C2A4" : item.status === "In Progress" ? "var(--antique-gold-bright)" : "var(--parchment-muted)",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Campus Events */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Calendar size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.15rem", color: "var(--ivory)" }}>
                  Upcoming Campus Gatherings
                </h3>
              </div>
              <Link to="/houses-events" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                Events Calendar →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {events.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.85rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(11, 16, 32, 0.4)",
                    border: "1px solid rgba(214, 180, 106, 0.12)",
                    flexWrap: "wrap",
                    gap: "0.8rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.92rem" }}>
                        {evt.title}
                      </span>
                      <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                        {evt.category}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                      {evt.date} · {evt.location}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--parchment-muted)" }}>
                      {evt.rsvpCount} Attending
                    </span>
                    <MagicalButton
                      onClick={() => toggleEventRsvp(evt.id)}
                      variant={evt.isRsvp ? "emerald" : "secondary"}
                      size="sm"
                    >
                      {evt.isRsvp ? "RSVP Confirmed ✓" : "RSVP Pass"}
                    </MagicalButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: House Cup Leaderboard & Discipline Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* House Cup Points Preview */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)" }}>
                  House Cup Standings
                </h3>
              </div>
              <Link to="/houses-events" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                Hourglasses →
              </Link>
            </div>

            <div>
              {housesData.map((h, i) => {
                const maxPoints = 1500;
                const points = h.id === "ravencrest" ? h.points + pointsBonus : h.points;
                const percentage = Math.round((points / maxPoints) * 100);

                return (
                  <div key={h.id} className="house-bar-row">
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--ivory)" }}>
                        #{i + 1} {h.name}
                      </span>
                      <span style={{ color: "var(--antique-gold)", fontWeight: 600 }}>
                        {points} pts
                      </span>
                    </div>

                    <div className="house-progress-track">
                      <div
                        className="house-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: h.crestColor === "#151D35" ? "var(--antique-gold)" : h.crestColor,
                          boxShadow: `0 0 8px ${h.accentColor}44`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: "0.74rem", color: "var(--parchment-muted)", fontStyle: "italic", marginTop: "0.5rem" }}>
              Updated automatically via the enchanted hourglasses in the Great Hall.
            </p>
          </div>

          {/* Magical Discipline Mastery */}
          <div className="magical-card ornate-corners">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--ivory)" }}>
              Year V Discipline Mastery
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {[
                { name: "Celestial Arithmancy", level: 91, color: "var(--antique-gold)" },
                { name: "Volatile Potion Alchemy", level: 94, color: "#79C2A4" },
                { name: "Charms & Incantations", level: 88, color: "#AA8438" },
                { name: "Counter-Curse Defense", level: 76, color: "#E288A1" },
              ].map((disc) => (
                <div key={disc.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--ivory)" }}>{disc.name}</span>
                    <span style={{ color: disc.color, fontWeight: 600 }}>{disc.level}%</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-round)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${disc.level}%`,
                        backgroundColor: disc.color,
                        boxShadow: `0 0 6px ${disc.color}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Campus Activity */}
          <div className="magical-card ornate-corners">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.8rem", color: "var(--ivory)" }}>
              Recent Dispatches & Lore
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", fontSize: "0.78rem" }}>
              <div style={{ borderLeft: "2px solid var(--antique-gold)", paddingLeft: "0.6rem" }}>
                <p style={{ color: "var(--ivory)", margin: 0 }}>
                  Earned 25 House Points in Potion Brewing Laboratory
                </p>
                <span style={{ color: "var(--parchment-muted)", fontSize: "0.7rem" }}>2 hours ago</span>
              </div>
              <div style={{ borderLeft: "2px solid #79C2A4", paddingLeft: "0.6rem" }}>
                <p style={{ color: "var(--ivory)", margin: 0 }}>
                  Discovered hidden passage behind Grand Library Tapestry
                </p>
                <span style={{ color: "var(--parchment-muted)", fontSize: "0.7rem" }}>5 hours ago</span>
              </div>
              <div style={{ borderLeft: "2px solid var(--antique-gold)", paddingLeft: "0.6rem" }}>
                <p style={{ color: "var(--ivory)", margin: 0 }}>
                  Encrypted owl scroll received from Arch-Magister Valerius
                </p>
                <span style={{ color: "var(--parchment-muted)", fontSize: "0.7rem" }}>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
