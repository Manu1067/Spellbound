import React, { useState, useEffect } from "react";
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
  MapPin,
  Loader2,
  Check,
} from "lucide-react";
import {
  fetchCurrentStudent,
  fetchDailySchedule,
  toggleScheduleStatus as apiToggleSchedule,
  fetchEvents,
  toggleEventRsvp as apiToggleEventRsvp,
  fetchHouses,
  fetchPointsHistory,
  fetchStudentAcademicProgress,
} from "../../services/api";
import {
  currentUser as fallbackUser,
  dailySchedule as fallbackSchedule,
  campusEvents as fallbackEvents,
  housesData as fallbackHouses,
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
  const [student, setStudent] = useState(fallbackUser);
  const [schedule, setSchedule] = useState(fallbackSchedule);
  const [events, setEvents] = useState(fallbackEvents);
  const [houses, setHouses] = useState(fallbackHouses);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [academicProgress, setAcademicProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState("");

  // Daily Enigma Challenge
  const [challengeSolved, setChallengeSolved] = useState(false);

  // Load Dashboard Data from API
  const loadDashboardData = async () => {
    try {
      const [studentData, schedData, eventsData, housesDataRes, historyData, progData] =
        await Promise.all([
          fetchCurrentStudent().catch(() => fallbackUser),
          fetchDailySchedule().catch(() => fallbackSchedule),
          fetchEvents().catch(() => fallbackEvents),
          fetchHouses().catch(() => fallbackHouses),
          fetchPointsHistory(5).catch(() => []),
          fetchStudentAcademicProgress("student-aris-thorne").catch(() => null),
        ]);

      if (studentData) setStudent(studentData);
      if (Array.isArray(schedData) && schedData.length > 0) setSchedule(schedData);
      if (Array.isArray(eventsData) && eventsData.length > 0) setEvents(eventsData);
      if (Array.isArray(housesDataRes) && housesDataRes.length > 0) setHouses(housesDataRes);
      if (Array.isArray(historyData)) setPointsHistory(historyData);
      if (progData) setAcademicProgress(progData);
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Toggle Schedule Completion via API
  const handleToggleSchedule = async (id) => {
    try {
      const updated = await apiToggleSchedule(id);
      setSchedule((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updated.status } : item
        )
      );
    } catch (err) {
      // Local fallback
      setSchedule((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: item.status === "Completed" ? "Upcoming" : "Completed" }
            : item
        )
      );
    }
  };

  // Toggle Event RSVP via API
  const handleToggleEventRsvp = async (eventId) => {
    try {
      const updated = await apiToggleEventRsvp(eventId, student.id || "student-aris-thorne");
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, isRsvp: updated.isRsvp, rsvpCount: updated.rsvpCount }
            : e
        )
      );

      if (updated.isRsvp) {
        setActionFeedback(`✨ Registered for gathering! +${updated.pointsAwarded || 10} House Points added to ${student.house || "Ravencrest"}.`);
        // Refresh houses to update points
        const updatedHouses = await fetchHouses().catch(() => null);
        if (updatedHouses) setHouses(updatedHouses);
      } else {
        setActionFeedback(`RSVP cancelled for gathering.`);
      }
      setTimeout(() => setActionFeedback(""), 5000);
    } catch (err) {
      setActionFeedback(err.message || "Failed to update RSVP");
      setTimeout(() => setActionFeedback(""), 5000);
    }
  };

  const handleSolveChallenge = () => {
    if (!challengeSolved) {
      setChallengeSolved(true);
      setActionFeedback("✨ Runic Dial decoded! +25 House Points recorded in the Great Hall.");
      setTimeout(() => setActionFeedback(""), 5000);
    }
  };

  const maxHousePoints = Math.max(...houses.map((h) => h.points || 0), 1600);

  return (
    <div className="dashboard-container anim-fade-in-up">
      {/* 1. Welcome Banner */}
      <div className="welcome-banner ornate-corners">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: "0.6rem" }}>
              {student.term || "Academic Term III · Active Adept"}
            </div>
            <h1 className="welcome-title">
              Welcome back, {student.name}
            </h1>
            <p className="welcome-subtitle">
              Your House of {student.house} stands proudly in the Great Hall ledger.
              Your celestial readings indicate favorable astral vectors across all seven academy departments.
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
              House Points: {student.pointsContributed || student.points_contributed || 340} pts
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
              {student.academicRank || student.academic_rank || "4th in Class of 180"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Toast */}
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
          <div className="magical-card challenge-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-2">
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
          <div className="magical-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-3">
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
                    onClick={() => handleToggleSchedule(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                      <button
                        style={{ color: isDone ? "#79C2A4" : "var(--parchment-muted)", background: "transparent", border: "none", cursor: "pointer" }}
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

          {/* Upcoming Campus Gatherings with Direct Cartography Route Link */}
          <div className="magical-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-4">
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
                    <div style={{ fontSize: "0.75rem", color: "var(--antique-gold)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{evt.dateTime || evt.date}</span>
                      <span>•</span>
                      {/* Cross-Department Navigation Link to Map */}
                      <Link
                        to={`/explore?dest=${evt.locationId || "loc-1"}`}
                        style={{ color: "var(--antique-gold)", display: "inline-flex", alignItems: "center", gap: "0.2rem", textDecoration: "none" }}
                      >
                        <Compass size={12} /> {evt.locationName || evt.location}
                      </Link>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--parchment-muted)" }}>
                      {evt.rsvpCount} Attending
                    </span>
                    <MagicalButton
                      onClick={() => handleToggleEventRsvp(evt.id)}
                      variant={evt.isRsvp ? "emerald" : "secondary"}
                      size="sm"
                    >
                      {evt.isRsvp ? "RSVP Confirmed ✓" : "RSVP Pass (+10 pts)"}
                    </MagicalButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: House Cup Leaderboard & Academic Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* House Cup Points Preview */}
          <div className="magical-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-2">
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
              {houses.map((h, i) => {
                const points = h.points || 0;
                const percentage = Math.min(100, Math.round((points / maxHousePoints) * 100));

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
                          backgroundColor: h.crestColor === "#151D35" ? "var(--antique-gold)" : h.crestColor || "var(--antique-gold)",
                          boxShadow: `0 0 8px ${h.accentColor || "#D6B46A"}44`,
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

          {/* Academic Learning Progress (Live from Quizzes & Potions) */}
          <div className="magical-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)" }}>
                Academic Mastery & Verified Records
              </h3>
              <Link to="/academics" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                Labs & Exams →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {academicProgress?.completedQuizzes && academicProgress.completedQuizzes.length > 0 ? (
                academicProgress.completedQuizzes.map((q, idx) => (
                  <div key={idx} style={{ padding: "0.6rem 0.8rem", background: "rgba(11, 16, 32, 0.5)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--ivory)" }}>{q.courseCode} Examination</span>
                    <span className={q.passed ? "badge-emerald" : "badge-gold"} style={{ fontSize: "0.68rem" }}>
                      Score: {q.score}% ({q.passed ? "Passed" : "Completed"})
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.8rem", color: "var(--parchment-muted)" }}>
                  No examination completed this term. Head to Academics to master Transfiguration and Runic Glyphs.
                </div>
              )}
            </div>
          </div>

          {/* Recent Campus Activity from Great Hall Ledger */}
          <div className="magical-card ornate-corners magical-card-interactive anim-fade-in-up anim-stagger-4">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.8rem", color: "var(--ivory)" }}>
              Great Hall Points Activity
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", fontSize: "0.78rem" }}>
              {pointsHistory.length > 0 ? (
                pointsHistory.slice(0, 3).map((item) => (
                  <div key={item.id} style={{ borderLeft: "2px solid var(--antique-gold)", paddingLeft: "0.6rem" }}>
                    <p style={{ color: "var(--ivory)", margin: 0 }}>
                      +{item.amount} pts to {item.houseName}: {item.reason}
                    </p>
                    <span style={{ color: "var(--parchment-muted)", fontSize: "0.7rem" }}>
                      by {item.awardedBy}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ borderLeft: "2px solid var(--antique-gold)", paddingLeft: "0.6rem" }}>
                  <p style={{ color: "var(--ivory)", margin: 0 }}>
                    Aris Thorne stabilized Draught of Luminescence (+15 pts)
                  </p>
                  <span style={{ color: "var(--parchment-muted)", fontSize: "0.7rem" }}>Earlier today</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
