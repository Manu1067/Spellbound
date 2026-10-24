import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Users,
  Calendar,
  ShieldAlert,
  MessageCircle,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Search,
  EyeOff,
  Send,
  Heart,
  ChevronRight,
  ShieldCheck,
  FileText,
  Building,
  Key
} from "lucide-react";
import {
  getStudentCouncil,
  getOfficialNotices,
  getConfessions,
  submitConfession,
  likeConfession,
  submitComplaint,
  getComplaintStatus,
  getEvents
} from "../../services/api";
import {
  studentCouncilData as fallbackCouncil,
  officialNoticesData as fallbackNotices,
  campusEvents as fallbackEvents,
  mysteriesRiddles
} from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./MysteriesPage.css";

export default function MysteriesPage() {
  const [activeTab, setActiveTab] = useState("council"); // "council" | "events" | "complaints" | "confessions" | "notices" | "enigma"

  // Data states
  const [council, setCouncil] = useState(fallbackCouncil);
  const [events, setEvents] = useState(fallbackEvents);
  const [notices, setNotices] = useState(fallbackNotices);
  const [confessions, setConfessions] = useState([]);

  // Complaints state
  const [complaintCategory, setComplaintCategory] = useState("Hostel");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintPriority, setComplaintPriority] = useState("Routine");
  const [generatedRefId, setGeneratedRefId] = useState("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  // Complaint Tracking lookup
  const [trackRefId, setTrackRefId] = useState("");
  const [trackedStatus, setTrackedStatus] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Confessions state
  const [confessionMsg, setConfessionMsg] = useState("");
  const [confessionCategory, setConfessionCategory] = useState("Kindness");
  const [isSubmittingConfession, setIsSubmittingConfession] = useState(false);
  const [confessionToast, setConfessionToast] = useState("");

  // Notices filter
  const [noticePriorityFilter, setNoticePriorityFilter] = useState("All");

  // Chronos Enigma state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [puzzleState, setPuzzleState] = useState("unsolved");
  const riddle = mysteriesRiddles[0];

  useEffect(() => {
    let mounted = true;
    getStudentCouncil()
      .then((data) => { if (mounted && Array.isArray(data)) setCouncil(data); })
      .catch(() => {});

    getEvents()
      .then((data) => { if (mounted && Array.isArray(data)) setEvents(data); })
      .catch(() => {});

    getOfficialNotices()
      .then((data) => { if (mounted && Array.isArray(data)) setNotices(data); })
      .catch(() => {});

    getConfessions()
      .then((data) => { if (mounted && Array.isArray(data)) setConfessions(data); })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) return;

    setIsSubmittingComplaint(true);
    try {
      const res = await submitComplaint({
        category: complaintCategory,
        subject: complaintSubject,
        description: complaintDesc,
        priority: complaintPriority,
      });
      setGeneratedRefId(res.referenceId);
      setComplaintSubject("");
      setComplaintDesc("");
    } catch (err) {
      console.error("Complaint error:", err);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleTrackComplaint = async (e) => {
    e.preventDefault();
    if (!trackRefId.trim()) return;

    setIsTracking(true);
    try {
      const status = await getComplaintStatus(trackRefId.trim());
      setTrackedStatus(status);
    } catch (err) {
      console.error("Track error:", err);
    } finally {
      setIsTracking(false);
    }
  };

  const handleConfessionSubmit = async (e) => {
    e.preventDefault();
    if (!confessionMsg.trim()) return;

    setIsSubmittingConfession(true);
    try {
      const created = await submitConfession(confessionMsg, confessionCategory);
      setConfessions([created, ...confessions]);
      setConfessionMsg("");
      setConfessionToast("Your anonymous thought was safely cast into the Department of Mysteries.");
      setTimeout(() => setConfessionToast(""), 5000);
    } catch (err) {
      console.error("Confession error:", err);
    } finally {
      setIsSubmittingConfession(false);
    }
  };

  const handleLikeConfession = async (id) => {
    try {
      await likeConfession(id);
      setConfessions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likesCount: (c.likesCount || 0) + 1 } : c))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const filteredNotices = notices.filter(
    (n) => noticePriorityFilter === "All" || n.priority === noticePriorityFilter
  );

  return (
    <div className="mysteries-container anim-fade-in-up">
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
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(109, 51, 69, 0.25)",
              border: "1px solid #8E445B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E288A1",
            }}
          >
            <Sparkles size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Department of Mysteries: Central Communications Hub
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Student Council, campus events, confidential complaints, anonymous confessions & official warnings.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Section Nav Tabs */}
      <div className="mysteries-tabs-nav">
        {[
          { id: "council", label: "A. Student Council", icon: Users },
          { id: "events", label: "B. Upcoming Events", icon: Calendar },
          { id: "complaints", label: "C. Complaints & Tracking", icon: ShieldAlert },
          { id: "confessions", label: "D. Anonymous Confessions", icon: MessageCircle },
          { id: "notices", label: "E. Official Warnings & Notices", icon: AlertTriangle },
          { id: "enigma", label: "✦ The Chronos Enigma", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mysteries-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section A: Student Council */}
      {activeTab === "council" && (
        <div className="section-container anim-fade-in-up">
          <div className="section-header-box">
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Verified Student Council Representatives
              </h2>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.88rem" }}>
                Elected student leaders, official contact hours, and direct student welfare announcements.
              </p>
            </div>
            <span className="badge-gold">Session 2026–2027</span>
          </div>

          <div className="council-grid">
            {council.map((member) => (
              <div key={member.id} className="council-card ornate-corners">
                <div className="council-top">
                  <div className="council-avatar">
                    <img src={member.avatarUrl} alt={member.name} />
                  </div>
                  <div>
                    <span className="badge-burgundy" style={{ fontSize: "0.68rem" }}>{member.role}</span>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: "0.2rem 0" }}>
                      {member.name}
                    </h3>
                    <p style={{ color: "var(--antique-gold)", fontSize: "0.8rem" }}>{member.branch}</p>
                  </div>
                </div>

                <div className="council-office-hours">
                  <Clock size={14} color="var(--antique-gold)" />
                  <span><strong>Office Hours:</strong> {member.officeHours}</span>
                </div>

                <div className="council-announcements">
                  <span className="announcements-label">Official Announcements:</span>
                  {member.announcements?.map((ann, i) => (
                    <div key={i} className="council-announcement-item">
                      • {ann}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section B: Upcoming Events */}
      {activeTab === "events" && (
        <div className="section-container anim-fade-in-up">
          <div className="section-header-box">
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Academy Events & Ceremonial Calendar
              </h2>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.88rem" }}>
                Connected to the central campus event registry across all Seven Departments.
              </p>
            </div>
            <span className="badge-emerald">{events.length} Scheduled Assemblies</span>
          </div>

          <div className="events-calendar-list">
            {events.map((ev) => (
              <div key={ev.id} className="mysteries-event-row ornate-corners">
                <div className="event-date-col">
                  <span className="date-main">{ev.date}</span>
                  <span className="date-time">{ev.time}</span>
                </div>
                <div className="event-info-col">
                  <span className="badge-gold" style={{ fontSize: "0.65rem" }}>{ev.category}</span>
                  <h3 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)", fontSize: "1.15rem", margin: "0.2rem 0" }}>
                    {ev.title}
                  </h3>
                  <p style={{ color: "var(--parchment)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {ev.description}
                  </p>
                  <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.4rem", fontSize: "0.78rem", color: "var(--parchment-muted)" }}>
                    <span><strong>Location:</strong> {ev.location}</span>
                    <span><strong>RSVPs:</strong> {ev.rsvps} Scholars Registered</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section C: Complaints & Tracking */}
      {activeTab === "complaints" && (
        <div className="section-container anim-fade-in-up">
          <div className="complaint-confidentiality-notice">
            <ShieldCheck size={20} color="#79C2A4" style={{ flexShrink: 0 }} />
            <span>
              <strong>Confidentiality Guarantee:</strong> Complaints submitted to the Department of Mysteries are protected under encrypted seal. Only the Proctor Directorate and relevant facility managers receive anonymous dossiers. You will receive a unique Reference ID to track resolution without revealing your identity.
            </span>
          </div>

          <div className="complaints-grid">
            {/* Left: Submit Complaint */}
            <div className="complaint-card ornate-corners">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.2rem", marginBottom: "0.8rem" }}>
                Lodge a Confidential Grievance
              </h3>

              <form onSubmit={handleComplaintSubmit} className="complaint-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                    >
                      <option value="Hostel">Hostel Maintenance & Facilities</option>
                      <option value="Mess & Dining">Mess & Dining Quality</option>
                      <option value="Academic">Academic Classrooms & Scheduling</option>
                      <option value="Laboratory">Laboratory Equipment & Access</option>
                      <option value="Campus Safety">Campus Safety & Ley-Line Wards</option>
                      <option value="Other">Other Campus Grievance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority Level:</label>
                    <select
                      value={complaintPriority}
                      onChange={(e) => setComplaintPriority(e.target.value)}
                    >
                      <option value="Routine">Routine (Within 48h)</option>
                      <option value="Urgent">Urgent (Within 24h)</option>
                      <option value="Critical">Critical (Immediate Ward Action)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject / Facility Area:</label>
                  <input
                    type="text"
                    placeholder="e.g., Girls' Hostel 2nd floor hot water kettle faulty..."
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description of Grievance:</label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific location, dates, and nature of the issue..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    required
                  />
                </div>

                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmittingComplaint}
                  icon={Send}
                >
                  {isSubmittingComplaint ? "Inscribing Grievance..." : "Submit Confidential Complaint"}
                </MagicalButton>
              </form>

              {generatedRefId && (
                <div className="ref-id-success-box anim-fade-in-up">
                  <CheckCircle2 size={24} color="#79C2A4" />
                  <div>
                    <h4 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                      Grievance Lodged Successfully!
                    </h4>
                    <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                      Your tracking reference code: <strong style={{ color: "var(--antique-gold-bright)", letterSpacing: "1px" }}>{generatedRefId}</strong>
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
                      Keep this reference safe to verify Proctor updates below.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Track Complaint by Reference ID */}
            <div className="complaint-card ornate-corners">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.2rem", marginBottom: "0.8rem" }}>
                Track Status by Reference ID
              </h3>
              <p style={{ color: "var(--parchment)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                Enter your generated complaint tracking code (e.g. REF-MYST-1042) to inspect real-time resolution status.
              </p>

              <form onSubmit={handleTrackComplaint} className="track-form">
                <div className="search-input-wrapper">
                  <Search size={16} color="var(--parchment-muted)" />
                  <input
                    type="text"
                    placeholder="e.g., REF-MYST-1042"
                    value={trackRefId}
                    onChange={(e) => setTrackRefId(e.target.value)}
                    required
                  />
                </div>
                <MagicalButton
                  type="submit"
                  variant="secondary"
                  size="md"
                  disabled={isTracking}
                >
                  {isTracking ? "Querying Vault..." : "Query Status"}
                </MagicalButton>
              </form>

              {trackedStatus && (
                <div className="tracked-result-card anim-fade-in-up">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span className="badge-gold">{trackedStatus.referenceId}</span>
                    <span className="badge-emerald">{trackedStatus.status}</span>
                  </div>
                  <h4 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)", fontSize: "1rem", margin: "0.3rem 0" }}>
                    {trackedStatus.subject || "Reported Grievance"}
                  </h4>
                  <p style={{ color: "var(--parchment-muted)", fontSize: "0.82rem" }}>
                    Category: {trackedStatus.category} · Assigned to: Facility Directorate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section D: Anonymous Confessions */}
      {activeTab === "confessions" && (
        <div className="section-container anim-fade-in-up">
          {confessionToast && (
            <div className="confession-toast anim-fade-in-up">
              <CheckCircle2 size={18} color="#79C2A4" />
              <span>{confessionToast}</span>
            </div>
          )}

          <div className="confessions-layout">
            {/* Left: Confession Feed */}
            <div className="confessions-feed">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "1.2rem" }}>
                  The Whispering Arch Feed
                </h3>
                <span className="badge-gold">Moderated & Anonymous</span>
              </div>

              <div className="confessions-list">
                {confessions.map((c) => (
                  <div key={c.id} className="confession-bubble ornate-corners">
                    <div className="bubble-top">
                      <span className="badge-burgundy" style={{ fontSize: "0.65rem" }}>{c.category}</span>
                      <span className="anon-tag">Anonymous Scholar</span>
                    </div>

                    <p className="bubble-text">"{c.message}"</p>

                    <div className="bubble-footer">
                      <button
                        onClick={() => handleLikeConfession(c.id)}
                        className="like-confession-btn"
                      >
                        <Heart size={14} fill="#E288A1" color="#E288A1" />
                        <span>{c.likesCount || 0} Echoes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Submit Confession Form */}
            <div className="confession-compose-card ornate-corners">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.2rem", marginBottom: "0.6rem" }}>
                Cast a Thought into the Arch
              </h3>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                Share an encouraging word, humorous campus memory, or honest reflection. Submissions are strictly unlinked from student identities.
              </p>

              <form onSubmit={handleConfessionSubmit} className="confession-form">
                <div className="form-group">
                  <label>Theme:</label>
                  <select
                    value={confessionCategory}
                    onChange={(e) => setConfessionCategory(e.target.value)}
                  >
                    <option value="Kindness">Kindness & Encouragement</option>
                    <option value="Humor">Campus Humor</option>
                    <option value="Reflection">Academic Reflection</option>
                    <option value="Mystery">Peculiar Campus Sighting</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Anonymous Message:</label>
                  <textarea
                    rows={4}
                    placeholder="Whisper your thought here..."
                    value={confessionMsg}
                    onChange={(e) => setConfessionMsg(e.target.value)}
                    required
                  />
                </div>

                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmittingConfession}
                  icon={Send}
                >
                  {isSubmittingConfession ? "Casting..." : "Cast Anonymously"}
                </MagicalButton>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Section E: Future Warnings & Official Notices */}
      {activeTab === "notices" && (
        <div className="section-container anim-fade-in-up">
          <div className="section-header-box">
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Official Decrees & Future Warnings
              </h2>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.88rem" }}>
                Prioritized administrative directives issued by the Academic Directorate, Proctorate & Hospital Wing.
              </p>
            </div>

            {/* Priority Filter */}
            <div className="notice-filter-pills">
              {["All", "Urgent", "High", "Normal"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setNoticePriorityFilter(prio)}
                  className={`prio-pill ${noticePriorityFilter === prio ? "active" : ""}`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          <div className="notices-feed-grid">
            {filteredNotices.map((n) => (
              <div key={n.id} className={`official-notice-card ornate-corners priority-${n.priority.toLowerCase()}`}>
                <div className="notice-card-top">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      className={
                        n.priority === "Urgent"
                          ? "badge-burgundy"
                          : n.priority === "High"
                          ? "badge-gold"
                          : "badge-emerald"
                      }
                    >
                      {n.priority} Priority
                    </span>
                    <span className="notice-authority">{n.issuingAuthority}</span>
                  </div>
                  <span className="notice-time">{n.effectiveDate || n.issuedAt || "Current Term"}</span>
                </div>

                <h3 className="notice-title">{n.title}</h3>
                <p className="notice-body">{n.body}</p>

                <div className="notice-footer-meta">
                  <span><strong>Authorized by:</strong> {n.issuingAuthority}</span>
                  <span><strong>Status:</strong> Enforced Across Campus Wards</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bonus / Easter-Egg: The Chronos Enigma */}
      {activeTab === "enigma" && (
        <div className="section-container anim-fade-in-up">
          <div className="vault-atmosphere ornate-corners">
            <span className="badge-burgundy" style={{ marginBottom: "0.6rem" }}>
              Subterranean Cipher Vault
            </span>
            <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
              The Chronos Enigma Dial
            </h2>
            <p style={{ color: "var(--parchment)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "700px" }}>
              Solve the ancient riddle of time to align the celestial ley-lines and unlock secrets within the Department of Mysteries.
            </p>
          </div>

          <div className="enigma-card ornate-corners">
            <p className="riddle-question">"{riddle.question}"</p>

            <div className="riddle-options-grid">
              {riddle.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAnswer(idx);
                    setPuzzleState("unsolved");
                  }}
                  className={`riddle-option-btn ${selectedAnswer === idx ? "selected" : ""}`}
                >
                  <span className="opt-marker">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1.5rem" }}>
              <MagicalButton
                onClick={() => {
                  if (selectedAnswer === riddle.correctIndex) setPuzzleState("correct");
                  else setPuzzleState("wrong");
                }}
                variant="primary"
                size="md"
                disabled={selectedAnswer === null}
                icon={Key}
              >
                Turn Chronos Dial
              </MagicalButton>

              {puzzleState === "correct" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#79C2A4", fontWeight: "bold" }}>
                  <Unlock size={18} />
                  <span>The dial clicks into place! Ley-lines aligned. (+50 House Points)</span>
                </div>
              )}

              {puzzleState === "wrong" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#E05A47" }}>
                  <Lock size={18} />
                  <span>The dial resists the turn. Ponder the temporal lore again.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
