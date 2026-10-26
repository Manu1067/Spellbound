import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  ArrowLeft,
  Send,
  Feather,
  Sparkles,
  Shield,
  Check,
  X,
  HeartHandshake,
  BookOpen,
  Globe,
  Compass,
  Award,
  Filter,
  Info
} from "lucide-react";
import { getStudents, getLikeMindedStudents, dispatchOwl } from "../../services/api";
import { studentDirectory as fallbackStudents, currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./PeoplePage.css";

const HOUSES = ["All Houses", "Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
const BRANCHES = [
  "All",
  "Computer Science & Arcana",
  "Mechanical Alchemical Engineering",
  "Electronics & Optical Engineering",
  "Civil & Sustainable Infrastructure",
  "Physics & Applied Celestial Mechanics"
];
const LANGUAGES = ["All", "English", "Hindi", "French", "German", "Spanish", "Telugu", "Tamil", "Japanese"];
const INTERESTS = [
  "All",
  "Artificial Intelligence",
  "Chronomancy",
  "Quantum Arithmancy",
  "Cyber Security",
  "Robotics",
  "Semiconductors & C2S",
  "Sustainable Magic",
  "Astrophysics"
];

export default function PeoplePage() {
  const [students, setStudents] = useState(fallbackStudents);
  const [selectedHouse, setSelectedHouse] = useState("All Houses");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDossier, setActiveDossier] = useState(null);
  const [owlModalTarget, setOwlModalTarget] = useState(null);
  const [owlMessage, setOwlMessage] = useState("");
  const [sentToast, setSentToast] = useState("");
  const [isSendingOwl, setIsSendingOwl] = useState(false);

  // Like-minded matching mode
  const [isLikeMindedMode, setIsLikeMindedMode] = useState(false);
  const [likeMindedMatches, setLikeMindedMatches] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    let mounted = true;
    getStudents({
      house: selectedHouse,
      branch: selectedBranch,
      language: selectedLanguage,
      interest: selectedInterest,
      search: searchQuery
    })
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setStudents(data);
        }
      })
      .catch((err) => console.warn("Using fallback students:", err));
    return () => { mounted = false; };
  }, [selectedHouse, selectedBranch, selectedLanguage, selectedInterest, searchQuery]);

  const handleToggleLikeMinded = async () => {
    if (!isLikeMindedMode) {
      setIsLoadingMatches(true);
      try {
        const result = await getLikeMindedStudents(currentUser.id);
        setLikeMindedMatches(result.matches || []);
        setIsLikeMindedMode(true);
      } catch (err) {
        console.error("Match error:", err);
      } finally {
        setIsLoadingMatches(false);
      }
    } else {
      setIsLikeMindedMode(false);
    }
  };

  const handleSendOwl = async (e) => {
    e.preventDefault();
    if (!owlMessage.trim() || !owlModalTarget) return;

    setIsSendingOwl(true);
    try {
      await dispatchOwl(owlModalTarget.id, owlMessage);
      const recipient = owlModalTarget.name;
      setOwlModalTarget(null);
      setOwlMessage("");
      setSentToast(`An enchanted owl has departed with your parchment dispatch to ${recipient}!`);
      setTimeout(() => setSentToast(""), 6000);
    } catch (err) {
      console.error("Owl dispatch error:", err);
    } finally {
      setIsSendingOwl(false);
    }
  };

  return (
    <div className="people-container anim-fade-in-up">
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

        {/* Cinematic People & Wizarding Connections Hero Banner */}
        <div className="dept-hero-banner ornate-corners">
          <img
            src="/assets/departments/people_wizarding_world_hero.png"
            alt="People of the Wizarding World"
            className="dept-hero-image"
          />
          <div className="dept-hero-gradient" />
          <div className="dept-hero-content">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "0.5rem" }}>
              <span className="badge-emerald">
                Scholarly Directory & Peer Affinity
              </span>
              <MagicalButton
                onClick={handleToggleLikeMinded}
                variant={isLikeMindedMode ? "primary" : "secondary"}
                size="sm"
                icon={HeartHandshake}
              >
                {isLikeMindedMode ? "View Full Directory" : "✦ Find Like-Minded Students"}
              </MagicalButton>
            </div>
            <h1 className="dept-hero-title">
              People of the Wizarding World: Student Directory & Affinity
            </h1>
            <p className="dept-hero-subtitle">
              Discover fellow scholars, filter by academic branch, languages, and hobbies, and dispatch owl posts to peers.
            </p>
          </div>
        </div>
      </div>

      {/* Dispatched Notification Toast */}
      {sentToast && (
        <div
          className="badge-emerald"
          style={{
            padding: "0.8rem 1.2rem",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid #79C2A4",
          }}
        >
          <Check size={18} />
          <span>{sentToast}</span>
        </div>
      )}

      {/* Privacy & Ethical Discovery Notice */}
      <div className="people-privacy-banner">
        <Info size={18} color="#79C2A4" style={{ flexShrink: 0 }} />
        <span>
          <strong>Consent-Based Directory:</strong> Profiles are published with student consent for collaborative academic exploration, project partnering, and peer mentorship. Private owl addresses and sensitive personal contact records are strictly confidential.
        </span>
      </div>

      {/* Like-Minded Algorithm Explainer Banner (When Active) */}
      {isLikeMindedMode && (
        <div className="like-minded-header-card ornate-corners anim-fade-in-up">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <Sparkles size={18} color="var(--antique-gold-bright)" />
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.15rem" }}>
              Deterministic Affinity Match for {currentUser.name}
            </h3>
          </div>
          <p style={{ color: "var(--parchment)", fontSize: "0.86rem", lineHeight: 1.5 }}>
            Profiles ranked using transparent multi-attribute compatibility: shared academic interests (+3), shared hobbies (+2), shared languages (+2), and matching branch (+2). Shared attributes are highlighted on each card.
          </p>
        </div>
      )}

      {/* Filter and Search Bar (When in Regular Directory Mode) */}
      {!isLikeMindedMode && (
        <div className="people-filters-bar">
          <div className="people-search-box">
            <Search size={16} color="var(--parchment-muted)" />
            <input
              type="text"
              placeholder="Search by student name, academic branch, skills, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="people-dropdowns-row">
            {/* House Dropdown */}
            <div className="select-wrapper">
              <label>House:</label>
              <select value={selectedHouse} onChange={(e) => setSelectedHouse(e.target.value)}>
                {HOUSES.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Branch Dropdown */}
            <div className="select-wrapper">
              <label>Branch:</label>
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Language Dropdown */}
            <div className="select-wrapper">
              <label>Language:</label>
              <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Interest Dropdown */}
            <div className="select-wrapper">
              <label>Field of Interest:</label>
              <select value={selectedInterest} onChange={(e) => setSelectedInterest(e.target.value)}>
                {INTERESTS.map((interest) => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Student Cards Grid */}
      {isLikeMindedMode ? (
        /* Like-Minded Students Affinity View */
        <div className="portrait-grid">
          {isLoadingMatches ? (
            <div style={{ color: "var(--parchment-muted)", textAlign: "center", padding: "3rem", gridColumn: "1 / -1" }}>
              Calculating affinity vectors across the living register...
            </div>
          ) : likeMindedMatches.length === 0 ? (
            <div style={{ color: "var(--parchment-muted)", textAlign: "center", padding: "3rem", gridColumn: "1 / -1" }}>
              No affinity matches found matching current criteria.
            </div>
          ) : (
            likeMindedMatches.map((matchItem) => {
              const student = matchItem.student;
              return (
                <div key={student.id} className="portrait-card ornate-corners anim-fade-in-up">
                  {/* Match Percentage Badge */}
                  <div className="match-score-badge">
                    <Sparkles size={13} />
                    <span>{matchItem.matchPercentage}% Compatibility</span>
                  </div>

                  <div className="portrait-top">
                    <div className="portrait-frame">
                      <img src={student.avatarUrl} alt={student.name} className="avatar-img" />
                    </div>
                    <div>
                      <span className="badge-gold" style={{ fontSize: "0.65rem", marginBottom: "0.2rem" }}>
                        {student.house} · {student.year}
                      </span>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                        {student.name}
                      </h3>
                      <p style={{ color: "var(--antique-gold)", fontSize: "0.8rem", fontWeight: "500" }}>
                        {student.branch}
                      </p>
                    </div>
                  </div>

                  {/* Shared Attributes Highlight Section */}
                  <div className="shared-attributes-box">
                    <span className="shared-title">Shared Attributes With You:</span>
                    <div className="shared-tags-container">
                      {matchItem.sharedTags?.map((tag, idx) => (
                        <span key={idx} className={`shared-tag tag-${tag.category.toLowerCase()}`}>
                          {tag.label} <small>({tag.category})</small>
                        </span>
                      ))}
                    </div>
                  </div>

                  <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                    {student.bio?.slice(0, 110)}...
                  </p>

                  <div className="portrait-actions">
                    <button
                      onClick={() => setActiveDossier(student)}
                      className="inspect-dossier-btn"
                    >
                      Inspect Dossier
                    </button>
                    <MagicalButton
                      onClick={() => setOwlModalTarget(student)}
                      variant="primary"
                      size="sm"
                      icon={Feather}
                    >
                      Send Owl
                    </MagicalButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Regular Directory Grid */
        <div className="portrait-grid">
          {students.length === 0 ? (
            <div style={{ color: "var(--parchment-muted)", textAlign: "center", padding: "3rem", gridColumn: "1 / -1" }}>
              No wizard scholars found matching your filters.
            </div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="portrait-card ornate-corners">
                <div className="portrait-top">
                  <div className="portrait-frame">
                    <img src={student.avatarUrl} alt={student.name} className="avatar-img" />
                  </div>
                  <div>
                    <span className="badge-gold" style={{ fontSize: "0.65rem", marginBottom: "0.2rem" }}>
                      {student.house} · {student.year}
                    </span>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                      {student.name}
                    </h3>
                    <p style={{ color: "var(--antique-gold)", fontSize: "0.8rem", fontWeight: "500" }}>
                      {student.branch}
                    </p>
                  </div>
                </div>

                <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.8rem" }}>
                  {student.bio?.slice(0, 110)}...
                </p>

                {/* Tags Row */}
                <div className="student-tags-preview">
                  <div className="tag-group">
                    <strong>Interests:</strong>
                    <span>{student.fieldsOfInterest?.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="tag-group">
                    <strong>Languages:</strong>
                    <span>{student.languages?.slice(0, 3).join(", ")}</span>
                  </div>
                </div>

                <div className="portrait-actions">
                  <button
                    onClick={() => setActiveDossier(student)}
                    className="inspect-dossier-btn"
                  >
                    Inspect Dossier
                  </button>
                  <MagicalButton
                    onClick={() => setOwlModalTarget(student)}
                    variant="primary"
                    size="sm"
                    icon={Feather}
                  >
                    Send Owl
                  </MagicalButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dossier Modal */}
      {activeDossier && (
        <div className="modal-backdrop" onClick={() => setActiveDossier(null)}>
          <div className="dossier-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div className="dossier-avatar-frame">
                  <img src={activeDossier.avatarUrl} alt={activeDossier.name} />
                </div>
                <div>
                  <span className="badge-gold">{activeDossier.house} · {activeDossier.year}</span>
                  <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                    {activeDossier.name}
                  </h2>
                  <p style={{ color: "var(--antique-gold)", fontSize: "0.88rem" }}>
                    {activeDossier.branch}
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveDossier(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="dossier-body">
              <div className="dossier-section">
                <h4>Biography & Academic Focus</h4>
                <p>{activeDossier.bio}</p>
              </div>

              <div className="dossier-grid">
                <div className="dossier-field">
                  <strong>Languages Spoken:</strong>
                  <div className="dossier-pills">
                    {activeDossier.languages?.map((l, i) => (
                      <span key={i} className="pill-lang">{l}</span>
                    ))}
                  </div>
                </div>

                <div className="dossier-field">
                  <strong>Hobbies & Pursuits:</strong>
                  <div className="dossier-pills">
                    {activeDossier.hobbies?.map((h, i) => (
                      <span key={i} className="pill-hobby">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="dossier-field">
                  <strong>Fields of Interest:</strong>
                  <div className="dossier-pills">
                    {activeDossier.fieldsOfInterest?.map((f, i) => (
                      <span key={i} className="pill-interest">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="dossier-field">
                  <strong>Skills & Collaboration:</strong>
                  <div className="dossier-pills">
                    {activeDossier.skills?.map((s, i) => (
                      <span key={i} className="pill-skill">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {activeDossier.wand && (
                <div className="dossier-lore-row">
                  <div><strong>Wand:</strong> {activeDossier.wand}</div>
                  <div><strong>Patronus:</strong> {activeDossier.patronus}</div>
                </div>
              )}
            </div>

            <div className="dossier-footer">
              <span className="consent-label">
                <Shield size={14} /> Consent-based directory profile
              </span>
              <MagicalButton
                onClick={() => {
                  setOwlModalTarget(activeDossier);
                  setActiveDossier(null);
                }}
                variant="primary"
                size="md"
                icon={Feather}
              >
                Dispatch Owl Parchment
              </MagicalButton>
            </div>
          </div>
        </div>
      )}

      {/* Send Owl Modal */}
      {owlModalTarget && (
        <div className="modal-backdrop" onClick={() => setOwlModalTarget(null)}>
          <div className="owl-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Feather size={20} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "1.2rem" }}>
                  Dispatch Owl to {owlModalTarget.name}
                </h3>
              </div>
              <button onClick={() => setOwlModalTarget(null)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendOwl} className="owl-form">
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                Inscribe your parchment scroll for peer study inquiries, academic project collaboration, or friendly greetings.
              </p>

              <textarea
                rows={4}
                placeholder="Inscribe your message with quill and enchanted ink..."
                value={owlMessage}
                onChange={(e) => setOwlMessage(e.target.value)}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
                <button
                  type="button"
                  onClick={() => setOwlModalTarget(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSendingOwl}
                  icon={Send}
                >
                  {isSendingOwl ? "Releasing Owl..." : "Release Owl Dispatch"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
