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
  Cpu,
  HeartHandshake,
  AlertTriangle,
  Building
} from "lucide-react";
import {
  currentUser,
  dailySchedule as initialSchedule,
  campusEvents as initialEvents,
  housesData,
  sevenDepartments,
  campusLocations,
  laboratoriesData
} from "../../data/mockData";
import { getLikeMindedStudents, getOfficialNotices } from "../../services/api";
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
  const [likeMindedMatches, setLikeMindedMatches] = useState([]);
  const [urgentNotices, setUrgentNotices] = useState([]);

  useEffect(() => {
    let mounted = true;
    getLikeMindedStudents()
      .then((res) => {
        if (mounted && res?.matches) setLikeMindedMatches(res.matches.slice(0, 3));
      })
      .catch(() => {});

    getOfficialNotices()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setUrgentNotices(data.filter((n) => n.priority === "Urgent" || n.priority === "High").slice(0, 2));
        }
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

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
              rsvps: e.isRsvp ? e.rsvps - 1 : e.rsvps + 1,
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
              Academic Term III · Senior Adept Scholar
            </div>
            <h1 className="welcome-title">
              Welcome back, {currentUser.name}
            </h1>
            <p className="welcome-subtitle">
              Your House of {currentUser.house} currently holds 1st place in the
              House Cup ledger. Celestial ley-lines show high stability across the 5 specialized campus laboratories.
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
              {currentUser.branch} · {currentUser.academicRank}
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
            Seven Academy Departments
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
            Explore All Academy Portals
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
                  {dept.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Cross-Department Facilities Ribbon */}
      <div className="facilities-ribbon-grid">
        {/* 5 Campus Locations Quick Access */}
        <div className="ribbon-card ornate-corners">
          <div className="ribbon-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MapPin size={16} color="var(--antique-gold)" />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", color: "var(--ivory)" }}>
                Campus Facilities (5 Primary Locations)
              </h4>
            </div>
            <Link to="/explore" style={{ fontSize: "0.72rem", color: "var(--antique-gold)" }}>
              Open Map →
            </Link>
          </div>
          <div className="facility-chips-row">
            {campusLocations.map((loc) => (
              <Link key={loc.id} to="/explore" className="facility-chip">
                <span>{loc.name}</span>
                <small>({loc.zone})</small>
              </Link>
            ))}
          </div>
        </div>

        {/* 5 Academic Laboratories Quick Access */}
        <div className="ribbon-card ornate-corners">
          <div className="ribbon-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Cpu size={16} color="#79C2A4" />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", color: "var(--ivory)" }}>
                Academic Laboratories (5 Practical Labs)
              </h4>
            </div>
            <Link to="/academics" style={{ fontSize: "0.72rem", color: "var(--antique-gold)" }}>
              All Labs →
            </Link>
          </div>
          <div className="facility-chips-row">
            {laboratoriesData.map((lab) => (
              <Link key={lab.id} to="/academics" className="facility-chip lab-chip">
                <span>{lab.name}</span>
                <small>[{lab.code}]</small>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-main">
        {/* Left Column: Schedule, Like-Minded Peers & Events */}
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

          {/* Recommended Like-Minded Students Widget */}
          {likeMindedMatches.length > 0 && (
            <div className="magical-card ornate-corners">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <HeartHandshake size={18} color="#79C2A4" />
                  <h3 style={{ fontSize: "1.15rem", color: "var(--ivory)" }}>
                    Recommended Like-Minded Peers
                  </h3>
                </div>
                <Link to="/people" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                  Full Directory →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {likeMindedMatches.map((m) => (
                  <div key={m.student.id} className="peer-match-item">
                    <div className="peer-avatar">
                      <img src={m.student.avatarUrl} alt={m.student.name} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.92rem" }}>
                          {m.student.name}
                        </span>
                        <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                          {m.matchPercentage}% Match
                        </span>
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--antique-gold)" }}>
                        {m.student.branch} · {m.student.house}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)", marginTop: "0.2rem" }}>
                        Shared: {m.sharedTags?.slice(0, 3).map((t) => t.label).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                View Labs & Syllabus →
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
                      {evt.rsvps} Attending
                    </span>
                    <MagicalButton
                      onClick={() => toggleEventRsvp(evt.id)}
                      variant={evt.isRsvp ? "secondary" : "primary"}
                      size="sm"
                    >
                      {evt.isRsvp ? "RSVP'd ✓" : "RSVP Pass"}
                    </MagicalButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: House Cup, Urgent Notices & Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Urgent Official Notices Widget */}
          {urgentNotices.length > 0 && (
            <div className="magical-card ornate-corners" style={{ borderColor: "#E05A47" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertTriangle size={18} color="#E05A47" />
                  <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)" }}>
                    Urgent Official Notices
                  </h3>
                </div>
                <Link to="/mysteries" style={{ fontSize: "0.75rem", color: "#E05A47" }}>
                  Mysteries Hub →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {urgentNotices.map((n) => (
                  <div key={n.id} style={{ padding: "0.6rem 0.8rem", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid #E05A47" }}>
                    <span style={{ fontSize: "0.7rem", color: "#E05A47", fontWeight: "bold" }}>
                      {n.priority} · {n.issuingAuthority}
                    </span>
                    <h5 style={{ color: "var(--ivory)", fontSize: "0.86rem", margin: "0.2rem 0" }}>
                      {n.title}
                    </h5>
                    <p style={{ color: "var(--parchment-muted)", fontSize: "0.78rem", margin: 0 }}>
                      {n.body.slice(0, 95)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                const maxPoints = 1600;
                const points = h.id === "ravenclaw" ? h.points + pointsBonus : h.points;
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
                          backgroundColor: h.crestColor,
                          boxShadow: `0 0 8px ${h.accentColor}44`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: "0.74rem", color: "var(--parchment-muted)", fontStyle: "italic", marginTop: "0.5rem" }}>
              Synchronized with the Great Hall gem hourglasses.
            </p>
          </div>

          {/* Sports Department Summary */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trophy size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)" }}>
                  Athletics & Sports Hub
                </h3>
              </div>
              <Link to="/sports" style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                Fixtures →
              </Link>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.8rem" }}>
              9 active disciplines (6 Outdoor + 3 Indoor) open for squad trials:
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {["Volleyball", "Kho-Kho", "Kabaddi", "Football", "Throwball", "Badminton", "Chess", "Carroms", "Table Tennis"].map((s) => (
                <span key={s} className="badge-gold" style={{ fontSize: "0.68rem" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
