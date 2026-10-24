import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Award,
  Sparkles,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Flame,
  Music,
  Palette,
  MessageSquare,
  BookOpen
} from "lucide-react";
import { getHouses, awardHousePoints, getFeaturedClubs, getEvents, toggleEventRsvp } from "../../services/api";
import { housesData as initialHouses, studentClubs as initialClubs, campusEvents as initialEvents } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./HousesEventsPage.css";

const CLUB_ICONS = {
  "club-lit-debate": BookOpen,
  "club-music": Music,
  "club-dance": Sparkles,
  "club-fine-arts": Palette,
};

const GEM_METRICS = {
  gryffindor: { fill: "#8E2B43", glow: "#C94565", gem: "Spinel Rubies" },
  slytherin: { fill: "#1F4734", glow: "#3DAE7A", gem: "Deep Emeralds" },
  ravenclaw: { fill: "#1C3669", glow: "#4A82DE", gem: "Sapphire Dust" },
  hufflepuff: { fill: "#8C6218", glow: "#D69F3D", gem: "Citrine Amber" },
};

export default function HousesEventsPage() {
  const [houses, setHouses] = useState(initialHouses);
  const [clubs, setClubs] = useState(initialClubs);
  const [events, setEvents] = useState(initialEvents);

  // Points award state
  const [awardHouseId, setAwardHouseId] = useState("gryffindor");
  const [awardAmount, setAwardAmount] = useState(25);
  const [awardReason, setAwardReason] = useState("Exemplary Laboratory Innovation");
  const [awardFeedback, setAwardFeedback] = useState("");
  const [isAwarding, setIsAwarding] = useState(false);

  // RSVP feedback state
  const [rsvpFeedback, setRsvpFeedback] = useState("");

  useEffect(() => {
    let mounted = true;
    getHouses()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setHouses(data);
      })
      .catch((err) => console.warn("Using fallback houses:", err));

    getFeaturedClubs()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setClubs(data);
      })
      .catch((err) => console.warn("Using fallback clubs:", err));

    getEvents()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch((err) => console.warn("Using fallback events:", err));

    return () => { mounted = false; };
  }, []);

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    setIsAwarding(true);
    try {
      await awardHousePoints(awardHouseId, Number(awardAmount), awardReason);
      setHouses((prev) =>
        prev.map((h) =>
          h.id === awardHouseId ? { ...h, points: h.points + Number(awardAmount) } : h
        )
      );
      const targetHouse = houses.find((h) => h.id === awardHouseId);
      setAwardFeedback(
        `✨ Added ${awardAmount} points to House ${targetHouse?.name || awardHouseId} for "${awardReason}"!`
      );
      setTimeout(() => setAwardFeedback(""), 5000);
    } catch (err) {
      console.error("Points award error:", err);
    } finally {
      setIsAwarding(false);
    }
  };

  const handleToggleRsvp = async (eventId) => {
    try {
      const res = await toggleEventRsvp(eventId);
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id === eventId) {
            const nextRsvp = !ev.isRsvp;
            return {
              ...ev,
              isRsvp: nextRsvp,
              rsvps: nextRsvp ? ev.rsvps + 1 : Math.max(0, ev.rsvps - 1)
            };
          }
          return ev;
        })
      );
      setRsvpFeedback(`RSVP preference recorded for your student profile.`);
      setTimeout(() => setRsvpFeedback(""), 4000);
    } catch (err) {
      console.error("RSVP error:", err);
    }
  };

  const maxPoints = Math.max(...houses.map((h) => h.points), 1600);

  return (
    <div className="houses-container anim-fade-in-up">
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

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(214, 180, 106, 0.15)",
              border: "1px solid var(--antique-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--antique-gold)",
            }}
          >
            <Shield size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Houses & Events: The Four Houses & Student Clubs
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              House Cup hourglasses, official student clubs & upcoming campus festivals.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {awardFeedback && (
        <div className="houses-toast-banner anim-fade-in-up">
          <Sparkles size={18} color="var(--antique-gold-bright)" />
          <span>{awardFeedback}</span>
        </div>
      )}
      {rsvpFeedback && (
        <div className="houses-toast-banner anim-fade-in-up" style={{ borderColor: "#79C2A4", color: "#79C2A4" }}>
          <CheckCircle2 size={18} color="#79C2A4" />
          <span>{rsvpFeedback}</span>
        </div>
      )}

      {/* 1. The Great Hall Hourglasses Stage */}
      <div className="hourglasses-stage ornate-corners">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 1.5rem" }}>
          <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
            The Four Jewel Cylinders of Eldoria
          </span>
          <h2 style={{ fontSize: "1.65rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
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
            const gem = GEM_METRICS[house.id.toLowerCase()] || { fill: "#D6B46A", glow: "#FFD700", gem: "Gems" };

            return (
              <div key={house.id} className="hourglass-column">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "var(--ivory)" }}>
                    {house.name}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--antique-gold)" }}>
                    {house.animal} · {gem.gem}
                  </div>
                </div>

                {/* Cylinder */}
                <div className="hourglass-cylinder">
                  <div
                    className="hourglass-jewels-fill"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: gem.fill,
                      boxShadow: `0 0 16px ${gem.glow}`,
                    }}
                  />
                </div>

                {/* Counter */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--ivory)" }}>
                    {house.points}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                    points scored
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Award Points Form */}
        <form onSubmit={handleAwardPoints} className="award-points-form">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--antique-gold)", marginBottom: "0.6rem" }}>
            <Award size={16} />
            <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              FACULTY POINTS CONSIGNMENT FORM
            </span>
          </div>

          <div className="award-inputs-row">
            <div className="award-field">
              <label>Select House:</label>
              <select value={awardHouseId} onChange={(e) => setAwardHouseId(e.target.value)}>
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="award-field" style={{ maxWidth: "120px" }}>
              <label>Gems / Points:</label>
              <input
                type="number"
                min="5"
                max="100"
                step="5"
                value={awardAmount}
                onChange={(e) => setAwardAmount(e.target.value)}
              />
            </div>

            <div className="award-field" style={{ flex: 1 }}>
              <label>Academic or Extracurricular Reason:</label>
              <input
                type="text"
                value={awardReason}
                onChange={(e) => setAwardReason(e.target.value)}
                required
              />
            </div>

            <MagicalButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isAwarding}
              icon={PlusCircle}
            >
              {isAwarding ? "Consigning..." : "Award Points"}
            </MagicalButton>
          </div>
        </form>
      </div>

      {/* 2. The Four Featured Student Clubs */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <Sparkles size={20} color="var(--antique-gold-bright)" />
          <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
            The Four Featured Student Clubs
          </h2>
        </div>

        <div className="clubs-grid">
          {clubs.map((club) => {
            const Icon = CLUB_ICONS[club.id] || Sparkles;
            return (
              <div key={club.id} className="club-card ornate-corners">
                <div className="club-card-top">
                  <div className="club-icon-box">
                    <Icon size={22} />
                  </div>
                  <span className="badge-gold">Active Society</span>
                </div>

                <h3 className="club-name">{club.name}</h3>
                <p className="club-desc">{club.description}</p>

                <div className="club-meta">
                  <div><strong>Lead Coordinator:</strong> {club.leadCoordinator}</div>
                  <div><strong>Meeting Schedule:</strong> {club.meetingSchedule}</div>
                </div>

                <div className="club-activities-box">
                  <span className="activities-title">Signature Activities:</span>
                  <div className="activities-list">
                    {club.activities?.map((act, i) => (
                      <span key={i} className="activity-pill">• {act}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Campus Festivals & Events Calendar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Calendar size={20} color="var(--antique-gold-bright)" />
            <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Official Campus Events & Festivals
            </h2>
          </div>
          <span className="badge-emerald">{events.length} Upcoming Events</span>
        </div>

        <div className="events-grid">
          {events.map((ev) => (
            <div key={ev.id} className="event-card ornate-corners">
              <div className="event-date-badge">
                <span className="event-day">{ev.date.split(" ")[0]}</span>
                <span className="event-subdate">{ev.date.split(" ").slice(1).join(" ")}</span>
              </div>

              <div className="event-content">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <span className="badge-gold" style={{ fontSize: "0.65rem" }}>{ev.category}</span>
                  <span style={{ fontSize: "0.74rem", color: "var(--parchment-muted)" }}>
                    <Clock size={12} style={{ display: "inline", marginRight: "3px" }} />
                    {ev.time}
                  </span>
                </div>

                <h3 className="event-title">{ev.title}</h3>
                <p className="event-desc">{ev.description}</p>

                <div className="event-footer">
                  <span className="event-location">
                    <MapPin size={13} /> {ev.location}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span className="event-rsvps">
                      <Users size={13} /> {ev.rsvps} Scholars RSVP'd
                    </span>
                    <MagicalButton
                      onClick={() => handleToggleRsvp(ev.id)}
                      variant={ev.isRsvp ? "secondary" : "primary"}
                      size="sm"
                    >
                      {ev.isRsvp ? "RSVP'd ✓" : "RSVP Seat"}
                    </MagicalButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
