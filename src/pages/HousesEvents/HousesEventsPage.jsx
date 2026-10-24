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
  MapPin,
  Clock,
  Compass,
  Check,
  X,
  Loader2,
  Users,
  AlertCircle,
  HelpCircle,
  Flame,
} from "lucide-react";
import {
  fetchHouses,
  fetchPointsHistory,
  awardHousePoints,
  submitSortingQuiz,
  fetchEvents,
  toggleEventRsvp,
} from "../../services/api";
import { housesData as fallbackHouses, currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./HousesEventsPage.css";

const SORTING_QUIZ_QUESTIONS = [
  {
    id: "q1",
    prompt: "When entering an unmapped chamber of the castle, your first impulse is:",
    options: [
      { text: "Inspect the astral glyphs and deduce the ward logic.", house: "Ravencrest", houseKey: "ravencrest" },
      { text: "Draw your wand and step boldly into the threshold.", house: "Gryphonhart", houseKey: "gryphonhart" },
      { text: "Observe from the shadows to see what lurks unseen.", house: "Shadowvale", houseKey: "shadowvale" },
      { text: "Check that your companions are safe and warm.", house: "Emberwyrm", houseKey: "emberwyrm" },
    ],
  },
  {
    id: "q2",
    prompt: "Which magical relic would you guard with your life?",
    options: [
      { text: "The Astrolabe of Infinite Constellations.", house: "Ravencrest", houseKey: "ravencrest" },
      { text: "The Sword of Gryphon Flight.", house: "Gryphonhart", houseKey: "gryphonhart" },
      { text: "The Philtre of Nocturnal Ambition.", house: "Shadowvale", houseKey: "shadowvale" },
      { text: "The Heart-Root of the Eternal Forest.", house: "Emberwyrm", houseKey: "emberwyrm" },
    ],
  },
  {
    id: "q3",
    prompt: "Your greatest magical ambition is:",
    options: [
      { text: "To unlock the ultimate secrets of the cosmos.", house: "Ravencrest", houseKey: "ravencrest" },
      { text: "To perform heroic feats that inspire legends.", house: "Gryphonhart", houseKey: "gryphonhart" },
      { text: "To attain mastery over subtlety and power.", house: "Shadowvale", houseKey: "shadowvale" },
      { text: "To protect the harmony of all living souls.", house: "Emberwyrm", houseKey: "emberwyrm" },
    ],
  },
  {
    id: "q4",
    prompt: "When brewing a volatile cauldron elixir:",
    options: [
      { text: "Calculate the exact thermodynamic formula before brewing.", house: "Ravencrest", houseKey: "ravencrest" },
      { text: "Stir with swift courage and trust your instinct.", house: "Gryphonhart", houseKey: "gryphonhart" },
      { text: "Alter the recipe with a cunning catalyst.", house: "Shadowvale", houseKey: "shadowvale" },
      { text: "Tend with patience and steady low flame; let nature take its course.", house: "Emberwyrm", houseKey: "emberwyrm" },
    ],
  },
];

export default function HousesEventsPage() {
  const [activeTab, setActiveTab] = useState("standings"); // 'standings' | 'sorting' | 'events'
  const [houses, setHouses] = useState(fallbackHouses);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState("");

  // Faculty Points Award Form
  const [awardHouseId, setAwardHouseId] = useState("ravencrest");
  const [awardAmount, setAwardAmount] = useState(25);
  const [awardReason, setAwardReason] = useState("Exemplary Potion Formulation");
  const [isAwarding, setIsAwarding] = useState(false);

  // Sorting Quiz State
  const [sortingAnswers, setSortingAnswers] = useState({});
  const [sortingResult, setSortingResult] = useState(null);
  const [isSubmittingSorting, setIsSubmittingSorting] = useState(false);
  const [sortingStage, setSortingStage] = useState("form"); // 'form' | 'deliberating' | 'revealed'
  const [celebrateParticles, setCelebrateParticles] = useState([]);

  // Event RSVP Action State
  const [rsvpLoadingId, setRsvpLoadingId] = useState(null);

  // Load Houses, Points History & Events
  const loadData = async () => {
    setLoading(true);
    try {
      const [housesData, historyData, eventsData] = await Promise.all([
        fetchHouses().catch(() => fallbackHouses),
        fetchPointsHistory(10).catch(() => []),
        fetchEvents().catch(() => []),
      ]);

      if (Array.isArray(housesData) && housesData.length > 0) {
        setHouses(housesData);
      }
      setPointsHistory(Array.isArray(historyData) ? historyData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.warn("Failed to load houses/events data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Award House Points via Faculty Ledger
  const handleAwardPoints = async (e) => {
    e.preventDefault();
    setIsAwarding(true);
    try {
      const res = await awardHousePoints(awardHouseId, {
        amount: Number(awardAmount),
        reason: awardReason.trim(),
        awardedBy: "Arch-Magister Valerius",
      });

      setHouses((prev) =>
        prev.map((h) => (h.id === awardHouseId ? { ...h, points: res.totalPoints } : h))
      );

      const targetHouse = houses.find((h) => h.id === awardHouseId);
      setFeedbackToast(`✨ Inscribed +${awardAmount} points to ${targetHouse?.name || awardHouseId} in official ledger!`);
      await loadData();
    } catch (err) {
      // Local fallback
      setHouses((prev) =>
        prev.map((h) => (h.id === awardHouseId ? { ...h, points: h.points + Number(awardAmount) } : h))
      );
      setFeedbackToast(`✨ Added ${awardAmount} points for "${awardReason}"!`);
    } finally {
      setIsAwarding(false);
      setTimeout(() => setFeedbackToast(""), 5000);
    }
  };

  // Submit Sorting Quiz Answers with Staged Reveal Flow
  const handleSubmitSortingQuiz = async (e) => {
    e.preventDefault();
    if (Object.keys(sortingAnswers).length < SORTING_QUIZ_QUESTIONS.length) {
      alert("Please answer all 4 questions to consult the enchanted Sorting Hat!");
      return;
    }

    setSortingStage("deliberating");
    setIsSubmittingSorting(true);

    let result;
    try {
      result = await submitSortingQuiz(sortingAnswers);
    } catch (err) {
      // Fallback local transparent scoring
      const scores = { ravencrest: 0, gryphonhart: 0, shadowvale: 0, emberwyrm: 0 };
      SORTING_QUIZ_QUESTIONS.forEach((q) => {
        const idx = sortingAnswers[q.id];
        if (idx !== undefined && q.options[idx]) {
          scores[q.options[idx].houseKey]++;
        }
      });
      const topHouseKey = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
      const targetHouse = houses.find((h) => h.id === topHouseKey) || houses[0];
      result = {
        assignedHouse: targetHouse,
        scores,
        transparentScoringMethod: "Deterministic tally: each question directly increments house affinity by 1 point. Highest score assigns house.",
      };
    }

    setSortingResult(result);

    // Stage 1: Hat Deliberation & Suspense (1.4 seconds)
    setTimeout(() => {
      setSortingStage("revealed");
      setIsSubmittingSorting(false);
      setFeedbackToast(`🎩 The Sorting Hat has spoken: Welcome to ${result.assignedHouse.name}!`);

      // Check reduced motion
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReduced) {
        // Stage 3: Short, restrained celebratory particle effect (24 particles)
        const primaryColor = result.assignedHouse.crestColor || "#D6B46A";
        const accentColor = result.assignedHouse.accentColor || "#F4D38B";
        const colors = [primaryColor, accentColor, "#F4D38B", "#FFFFFF"];

        const particles = Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
          const dist = 65 + Math.random() * 85;
          return {
            id: `cp-${i}`,
            dx: `${Math.cos(angle) * dist}px`,
            dy: `${Math.sin(angle) * dist}px`,
            color: colors[i % colors.length],
            size: `${4 + Math.random() * 4}px`,
            duration: `${1.3 + Math.random() * 0.7}s`,
            delay: `${Math.random() * 0.15}s`,
          };
        });
        setCelebrateParticles(particles);

        // Auto-cleanup particles after 2.5s to free graphical resources
        setTimeout(() => {
          setCelebrateParticles([]);
        }, 2500);
      }
    }, 1400);
  };


  // Toggle Event Registration
  const handleToggleEventRsvp = async (eventId) => {
    setRsvpLoadingId(eventId);
    try {
      const updated = await toggleEventRsvp(eventId, currentUser.id);
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === eventId
            ? {
                ...evt,
                isRsvp: updated.isRsvp,
                rsvpCount: updated.rsvpCount,
              }
            : evt
        )
      );

      if (updated.isRsvp) {
        setFeedbackToast(`✨ Registered for event! +${updated.pointsAwarded || 10} House Points awarded to Ravencrest.`);
      } else {
        setFeedbackToast(`RSVP cancelled for event.`);
      }
      // Reload points to reflect live ledger
      const updatedHouses = await fetchHouses().catch(() => null);
      if (updatedHouses) setHouses(updatedHouses);
    } catch (err) {
      alert(err.message || "Unable to register for event.");
    } finally {
      setRsvpLoadingId(null);
      setTimeout(() => setFeedbackToast(""), 5000);
    }
  };

  const maxPoints = Math.max(...houses.map((h) => h.points || 0), 1600);

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
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
                Houses & Events: Student Engagement
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                House Cup jewel hourglasses, sorting ceremony quiz, faculty ledger & campus gatherings.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <span className="badge-gold">House Cup Active</span>
            <span className="badge-emerald">{events.length} Gatherings</span>
          </div>
        </div>
      </div>

      {/* Action Feedback Toast */}
      {feedbackToast && (
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
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. The Great Hall Hourglasses Stage */}
      <div className="hourglasses-stage ornate-corners">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 1.2rem" }}>
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

        {/* Hourglass Columns Grid */}
        <div className="hourglass-grid">
          {houses.map((house) => {
            const fillPercent = Math.min(100, Math.round(((house.points || 0) / maxPoints) * 100));
            const isRaven = house.id === "ravencrest";
            const isGryph = house.id === "gryphonhart";
            const isShadow = house.id === "shadowvale";

            const jewelColor = isRaven
              ? "#4A90E2"
              : isGryph
              ? "#D0021B"
              : isShadow
              ? "#50E3C2"
              : "#F5A623";

            return (
              <div key={house.id} className="hourglass-column">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--ivory)",
                  }}
                >
                  {house.name}
                </span>

                <div className="hourglass-cylinder">
                  <div
                    className="hourglass-jewels-fill"
                    style={{
                      height: `${fillPercent}%`,
                      backgroundColor: jewelColor,
                      color: jewelColor,
                    }}
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--antique-gold-bright)",
                      display: "block",
                    }}
                  >
                    {house.points}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                    {house.gem || "Jewel Dust"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--antique-gold-border)", paddingBottom: "0.6rem" }}>
        {[
          { id: "standings", label: "Ledger & Points History", icon: Award },
          { id: "sorting", label: "Sorting Ceremony Quiz", icon: Sparkles },
          { id: "events", label: "Campus Events Calendar", icon: Calendar },
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
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Faculty Points Ledger & History */}
      {activeTab === "standings" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
          {/* Left: Points Transaction Log */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Award size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Recent House Points Transactions
                </h3>
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>Stored Ledger</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {pointsHistory.length > 0 ? (
                pointsHistory.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(11, 16, 32, 0.6)",
                      border: "1px solid rgba(214, 180, 106, 0.12)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.88rem" }}>
                          {item.houseName}
                        </span>
                        <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                          +{item.amount} pts
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--parchment-muted)", marginTop: "0.2rem" }}>
                        {item.reason}
                      </div>
                    </div>

                    <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                      by {item.awardedBy}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--parchment-muted)" }}>
                  No point awards recorded today.
                </p>
              )}
            </div>
          </div>

          {/* Right: Faculty Award Form */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <PlusCircle size={18} color="var(--antique-gold)" />
              <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Faculty Ledger: Award Points
              </h3>
            </div>

            <form onSubmit={handleAwardPoints} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Select House
                </label>
                <select
                  value={awardHouseId}
                  onChange={(e) => setAwardHouseId(e.target.value)}
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
                  <option value="ravencrest">Ravencrest (Blue / Gold)</option>
                  <option value="gryphonhart">Gryphonhart (Scarlet / Gold)</option>
                  <option value="shadowvale">Shadowvale (Emerald / Silver)</option>
                  <option value="emberwyrm">Emberwyrm (Amber / Bronze)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Point Amount (+/-)
                </label>
                <input
                  type="number"
                  value={awardAmount}
                  onChange={(e) => setAwardAmount(e.target.value)}
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
                  Merit Reason
                </label>
                <input
                  type="text"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="e.g. Discovered Lost Ancient Runic Stela"
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

              <MagicalButton type="submit" variant="primary" size="md" disabled={isAwarding}>
                {isAwarding ? "Inscribing Ledger..." : "Inscribe Points in Hourglass"}
              </MagicalButton>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Sorting Ceremony Quiz */}
      {activeTab === "sorting" && (
        <div className="magical-card ornate-corners" style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="badge-gold" style={{ marginBottom: "0.5rem" }}>
              Transparent Scoring Method
            </span>
            <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              The Great Sorting Ceremony
            </h2>
            <p style={{ color: "var(--parchment)", fontSize: "0.88rem" }}>
              Answer the four elemental inquiries. Each choice clearly aligns with one of the four houses: Ravencrest (wisdom),
              Gryphonhart (valor), Shadowvale (ambition), or Emberwyrm (loyalty).
            </p>
          </div>

          {sortingStage === "form" && (
            <form onSubmit={handleSubmitSortingQuiz} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {SORTING_QUIZ_QUESTIONS.map((q, qIdx) => (
                <div key={q.id} style={{ padding: "1.2rem", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-md)", border: "1px solid var(--antique-gold-border)" }}>
                  <h4 style={{ fontSize: "0.95rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.8rem" }}>
                    {qIdx + 1}. {q.prompt}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.5rem 0.8rem",
                          borderRadius: "var(--radius-sm)",
                          background: sortingAnswers[q.id] === oIdx ? "rgba(214, 180, 106, 0.15)" : "transparent",
                          border: `1px solid ${sortingAnswers[q.id] === oIdx ? "var(--antique-gold)" : "rgba(214, 180, 106, 0.1)"}`,
                          cursor: "pointer",
                          fontSize: "0.84rem",
                          color: "var(--parchment)",
                        }}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={sortingAnswers[q.id] === oIdx}
                          onChange={() => setSortingAnswers({ ...sortingAnswers, [q.id]: oIdx })}
                        />
                        <span>{opt.text}</span>
                        <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "var(--antique-gold)", textTransform: "uppercase" }}>
                          → {opt.house}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <MagicalButton type="submit" variant="primary" size="lg" disabled={isSubmittingSorting}>
                  Place Hat & Begin Sorting Ceremony
                </MagicalButton>
              </div>
            </form>
          )}

          {/* Stage 1: Deliberating & Suspense */}
          {sortingStage === "deliberating" && (
            <div
              className="anim-hat-deliberating"
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(214, 180, 106, 0.25) 0%, rgba(11, 16, 32, 0.8) 70%)",
                  border: "2px solid var(--antique-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 0 30px rgba(214, 180, 106, 0.4)",
                }}
              >
                <div
                  className="astrolabe-ring-outer"
                  style={{
                    position: "absolute",
                    inset: "-8px",
                    borderRadius: "50%",
                    border: "1px dashed var(--antique-gold-bright)",
                    opacity: 0.7,
                  }}
                />
                <Sparkles size={40} color="var(--antique-gold-bright)" className="anim-candle-pulse" />
              </div>

              <span className="badge-gold" style={{ fontSize: "0.78rem" }}>
                The Sorting Hat is Deliberating...
              </span>

              <p
                style={{
                  fontFamily: "var(--font-literary)",
                  fontStyle: "italic",
                  fontSize: "1.25rem",
                  color: "var(--parchment)",
                  maxWidth: "520px",
                  lineHeight: 1.5,
                }}
              >
                "Ah, yes... what do we have here? Deep intellect, keen instinct, and fierce resolve... Where shall your true potential flourish?"
              </p>
            </div>
          )}

          {/* Stage 2 & 3: Staged Emblem Reveal & Celebratory Particle Effect */}
          {sortingStage === "revealed" && sortingResult && (
            <div
              className="anim-crest-unfurl"
              style={{
                textAlign: "center",
                padding: "2rem 1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
              role="status"
              aria-live="polite"
            >
              {/* Restrained Celebratory Particle Effect Burst */}
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "50%",
                  width: "1px",
                  height: "1px",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                {celebrateParticles.map((p) => (
                  <span
                    key={p.id}
                    style={{
                      position: "absolute",
                      width: p.size,
                      height: p.size,
                      borderRadius: "50%",
                      backgroundColor: p.color,
                      boxShadow: `0 0 10px 2px ${p.color}`,
                      "--dx": p.dx,
                      "--dy": p.dy,
                      animation: `celebrateParticleBurst ${p.duration} cubic-bezier(0.16, 1, 0.3, 1) ${p.delay} forwards`,
                    }}
                  />
                ))}
              </div>

              {/* Staged House Crest Emblem */}
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${sortingResult.assignedHouse.crestColor || "#151D35"} 0%, #0B1020 90%)`,
                  border: `3px solid ${sortingResult.assignedHouse.accentColor || "var(--antique-gold)"}`,
                  margin: "0 auto 1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: `0 0 35px ${sortingResult.assignedHouse.crestColor || "rgba(214, 180, 106, 0.5)"}, 0 0 60px rgba(0,0,0,0.8)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "-10px",
                    borderRadius: "50%",
                    border: `1px solid ${sortingResult.assignedHouse.accentColor || "var(--antique-gold)"}`,
                    opacity: 0.5,
                    animation: "celestialSpin 30s linear infinite",
                  }}
                />
                <Shield size={54} color={sortingResult.assignedHouse.accentColor || "var(--antique-gold)"} />
              </div>

              <span
                className="badge-gold"
                style={{
                  fontSize: "0.82rem",
                  marginBottom: "0.6rem",
                  borderColor: sortingResult.assignedHouse.accentColor || "var(--antique-gold)",
                }}
              >
                Assigned House Ceremony
              </span>

              <h2
                style={{
                  fontSize: "2.4rem",
                  color: "var(--ivory)",
                  fontFamily: "var(--font-display)",
                  marginBottom: "0.3rem",
                  letterSpacing: "0.06em",
                  textShadow: `0 0 25px ${sortingResult.assignedHouse.crestColor || "rgba(214, 180, 106, 0.6)"}`,
                }}
              >
                {sortingResult.assignedHouse.name}
              </h2>

              <p
                style={{
                  fontStyle: "italic",
                  fontFamily: "var(--font-literary)",
                  color: "var(--antique-gold-bright)",
                  fontSize: "1.2rem",
                  marginBottom: "1.4rem",
                }}
              >
                "{sortingResult.assignedHouse.motto}"
              </p>

              {/* House Attributes */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginBottom: "1.6rem",
                }}
              >
                {sortingResult.assignedHouse.values?.map((val, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.74rem",
                      fontFamily: "var(--font-display)",
                      padding: "0.25rem 0.7rem",
                      borderRadius: "var(--radius-round)",
                      background: "rgba(21, 29, 53, 0.7)",
                      border: "1px solid rgba(214, 180, 106, 0.25)",
                      color: "var(--parchment)",
                    }}
                  >
                    ✦ {val}
                  </span>
                ))}
              </div>

              {/* Transparent Score Breakdown */}
              <div
                style={{
                  maxWidth: "480px",
                  margin: "0 auto 1.5rem",
                  padding: "1rem",
                  background: "rgba(11, 16, 32, 0.75)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--antique-gold-border)",
                }}
              >
                <h4 style={{ fontSize: "0.78rem", color: "var(--antique-gold)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                  Transparent Scoring Breakdown
                </h4>
                <div style={{ display: "flex", justifyContent: "space-around", fontSize: "0.85rem" }}>
                  <span>Ravencrest: <strong>{sortingResult.scores?.ravencrest || 0}</strong></span>
                  <span>Gryphonhart: <strong>{sortingResult.scores?.gryphonhart || 0}</strong></span>
                  <span>Shadowvale: <strong>{sortingResult.scores?.shadowvale || 0}</strong></span>
                  <span>Emberwyrm: <strong>{sortingResult.scores?.emberwyrm || 0}</strong></span>
                </div>
              </div>

              <MagicalButton
                onClick={() => {
                  setSortingResult(null);
                  setSortingStage("form");
                  setCelebrateParticles([]);
                }}
                variant="secondary"
                size="sm"
              >
                Retake Sorting Quiz
              </MagicalButton>
            </div>
          )}
        </div>
      )}


      {/* Tab 3: Campus Events Calendar */}
      {activeTab === "events" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {events.map((evt) => {
            const isFull = evt.capacity && evt.rsvpCount >= evt.capacity && !evt.isRsvp;
            return (
              <div key={evt.id} className="magical-card ornate-corners">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                  <span className="badge-gold" style={{ fontSize: "0.68rem" }}>
                    {evt.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: isFull ? "var(--burgundy-light)" : "var(--parchment-muted)" }}>
                    {evt.rsvpCount} / {evt.capacity || 50} spots
                    {isFull ? " (At Capacity)" : ""}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.4rem" }}>
                  {evt.title}
                </h3>

                <div style={{ fontSize: "0.78rem", color: "var(--antique-gold)", display: "flex", flexDirection: "column", gap: "0.2rem", marginBottom: "0.8rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} /> {evt.dateTime || evt.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} /> {evt.locationName || evt.location}
                  </span>
                </div>

                <p style={{ fontSize: "0.84rem", color: "var(--parchment)", lineHeight: 1.45, marginBottom: "1.2rem" }}>
                  {evt.description}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(214, 180, 106, 0.12)", paddingTop: "0.8rem" }}>
                  {/* Link event location to campus navigator! */}
                  <Link
                    to={`/explore?dest=${evt.locationId || "loc-1"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.75rem",
                      color: "var(--antique-gold)",
                      textDecoration: "none",
                    }}
                  >
                    <Compass size={14} /> Route on Map
                  </Link>

                  <MagicalButton
                    onClick={() => handleToggleEventRsvp(evt.id)}
                    variant={evt.isRsvp ? "emerald" : isFull ? "secondary" : "primary"}
                    size="sm"
                    disabled={rsvpLoadingId === evt.id || (isFull && !evt.isRsvp)}
                  >
                    {rsvpLoadingId === evt.id
                      ? "Updating..."
                      : evt.isRsvp
                      ? "RSVP Confirmed ✓"
                      : isFull
                      ? "Event Full"
                      : "Register (+10 pts)"}
                  </MagicalButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
