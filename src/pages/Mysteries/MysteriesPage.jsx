import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Compass,
  Search,
  BookOpen,
  Send,
  HelpCircle,
  Shield,
  Loader2,
  Brain,
  MessageSquare,
  FileText,
  Bookmark,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  GraduationCap,
  MapPin,
  RotateCcw,
} from "lucide-react";
import {
  fetchMysteryPuzzles,
  verifyMysteryAnswer,
  fetchMysteryArchives,
  fetchArchiveFilters,
  fetchMysteryRecommendations,
  askArchivalScribe,
} from "../../services/api";
import { currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import ParticleField from "../../components/magical/ParticleField";
import CelestialCrystalEmblem from "./CelestialCrystalEmblem";
import "./MysteriesPage.css";

const CONSTELLATIONS = [
  {
    id: "c-1",
    name: "Corona Noctis (The Crown Raven)",
    stars: 7,
    season: "Autumn Solstice",
    lore: "Associated with mind-expanding spells and precognitive visions. Anchors the north wards of the Academy.",
    color: "var(--antique-gold)",
  },
  {
    id: "c-2",
    name: "Draco Igneus (The Fire Wyrm)",
    stars: 12,
    season: "Winter Solstice",
    lore: "Fires from this constellation catalyze volatile potion cauldrons and strengthen dragon-heartstring wands.",
    color: "#E288A1",
  },
  {
    id: "c-3",
    name: "Hydra Umbrae (The Shadow Serpent)",
    stars: 9,
    season: "Spring Equinox",
    lore: "Veils cloaking charms and enhances illusion enchantments. Appears low on the south horizon.",
    color: "#79C2A4",
  },
  {
    id: "c-4",
    name: "Cygnus Aetheris (The Astral Swan)",
    stars: 8,
    season: "Summer Solstice",
    lore: "Guides aeromancers traversing high altitude wind shears and clarifies astronomical scrying lenses.",
    color: "#8DA9C4",
  },
];

export default function MysteriesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("archives"); // 'archives' | 'puzzles' | 'recommendations' | 'scribe'
  const [loading, setLoading] = useState(true);

  // Archives State
  const [archives, setArchives] = useState([]);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Difficulties");
  const [selectedResourceType, setSelectedResourceType] = useState("All Types");
  const [selectedChamber, setSelectedChamber] = useState("All Chambers");
  const [filterOptions, setFilterOptions] = useState({
    subjects: ["All Subjects"],
    topics: ["All Topics"],
    difficulties: ["All Difficulties", "Apprentice", "Adept", "Arch-Mage"],
    resourceTypes: ["All Types"],
    chambers: ["All Chambers"],
  });
  const [expandedNotesMap, setExpandedNotesMap] = useState({});
  const [selectedFolioModal, setSelectedFolioModal] = useState(null);

  // Puzzle State
  const [puzzles, setPuzzles] = useState([]);
  const [selectedConstellation, setSelectedConstellation] = useState(CONSTELLATIONS[0]);
  const [puzzleStateMap, setPuzzleStateMap] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCrystalStasis, setIsCrystalStasis] = useState(false);

  // Recommendations State
  const [recommendations, setRecommendations] = useState(null);

  // Archival Scribe State
  const [scribePrompt, setScribePrompt] = useState("");
  const [scribeResponse, setScribeResponse] = useState(null);
  const [isConsultingScribe, setIsConsultingScribe] = useState(false);
  const [scribeError, setScribeError] = useState(null);

  // Load Filter Options, Puzzles & Recommendations on Mount
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [filterData, puzzlesData, recsData] = await Promise.all([
          fetchArchiveFilters().catch(() => null),
          fetchMysteryPuzzles().catch(() => []),
          fetchMysteryRecommendations(currentUser.id).catch(() => null),
        ]);

        if (filterData) {
          setFilterOptions(filterData);
        }
        setPuzzles(Array.isArray(puzzlesData) ? puzzlesData : []);
        setRecommendations(recsData);
      } catch (err) {
        console.warn("Error initializing Department of Mysteries:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Fetch Filtered Archives whenever search or dropdowns change
  useEffect(() => {
    async function loadArchives() {
      try {
        const params = {};
        if (selectedChamber !== "All Chambers") params.chamber = selectedChamber;
        if (selectedDifficulty !== "All Difficulties") params.difficulty = selectedDifficulty;
        if (selectedSubject !== "All Subjects") params.subject = selectedSubject;
        if (selectedTopic !== "All Topics") params.topic = selectedTopic;
        if (selectedResourceType !== "All Types") params.resourceType = selectedResourceType;
        if (archiveSearch.trim()) params.search = archiveSearch.trim();

        const data = await fetchMysteryArchives(params);
        setArchives(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Failed to load approved archives:", err);
      }
    }
    loadArchives();
  }, [
    selectedChamber,
    selectedDifficulty,
    selectedSubject,
    selectedTopic,
    selectedResourceType,
    archiveSearch,
  ]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setArchiveSearch("");
    setSelectedSubject("All Subjects");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All Difficulties");
    setSelectedResourceType("All Types");
    setSelectedChamber("All Chambers");
  };

  // Toggle Expanded Study Notes
  const toggleStudyNotes = (id) => {
    setExpandedNotesMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle Puzzle Verification
  const handleVerifyPuzzle = async (puzzleId) => {
    const current = puzzleStateMap[puzzleId];
    if (!current || current.selectedIndex === undefined) return;

    setIsVerifying(true);
    try {
      const res = await verifyMysteryAnswer(puzzleId, current.selectedIndex, currentUser.id);
      setPuzzleStateMap((prev) => ({
        ...prev,
        [puzzleId]: {
          ...prev[puzzleId],
          status: res.isCorrect ? "correct" : "wrong",
          explanation: res.explanation,
          pointsAwarded: res.pointsAwarded || 0,
        },
      }));
    } catch (err) {
      console.warn("Puzzle validation failed:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Consult Archival Scribe
  const handleConsultScribe = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const query = customPrompt !== undefined ? customPrompt : scribePrompt;
    if (!query.trim()) return;

    setIsConsultingScribe(true);
    setScribeResponse(null);
    setScribeError(null);

    try {
      const res = await askArchivalScribe(query.trim());
      setScribeResponse(res);
      setScribePrompt(query);
    } catch (err) {
      setScribeError(
        err.message || "The Archival Scribe is momentarily realigning ward lenses. Please re-query momentarily."
      );
    } finally {
      setIsConsultingScribe(false);
    }
  };

  // Quick prompt trigger
  const handleQuickPrompt = (promptText) => {
    setActiveTab("scribe");
    setScribePrompt(promptText);
    handleConsultScribe(null, promptText);
  };

  return (
    <div className="mysteries-container anim-fade-in-up">
      {/* Top Header & Breadcrumb */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(109, 51, 69, 0.25)",
                border: "1.5px solid #8E445B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E288A1",
              }}
            >
              <Sparkles size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                Department of Mysteries: Arcane Intelligence Hub
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem", margin: "0.2rem 0 0" }}>
                Curated learning collection, grounded archival scribe, chamber ciphers & personalized intelligence.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="badge-burgundy">Subterranean Vaults</span>
            <span className="badge-gold">Arch-Mage Clearance</span>
            <span className="badge-emerald">Grounded Lore v2.0</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Celestial Archive Hero Banner with Animated Crystal Emblem */}
      <div className="celestial-archive-hero">
        <ParticleField count={22} />
        <div className="celestial-runic-watermark" aria-hidden="true">
          ᚱ ᛞ ᛟ ᚺ
        </div>

        <div style={{ maxWidth: "620px", position: "relative", zIndex: 3 }}>
          <span className="badge-burgundy" style={{ marginBottom: "0.6rem", display: "inline-block" }}>
            The Celestial Scriptoria & Vault Matrix · Sub-Level VII
          </span>
          <h2 style={{ fontSize: "1.65rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.6rem" }}>
            The Realm of Grounded Truths & Academic Discovery
          </h2>
          <p style={{ color: "var(--parchment)", fontSize: "0.9rem", lineHeight: 1.55, margin: "0 0 1rem" }}>
            The Department of Mysteries preserves Hogwarts' most verified folios, alchemical grimoires, and runic waveguides.
            Use our grounded intelligence engine to understand difficult concepts, discover approved reading resources, and test your acumen against the Chamber Enigmas.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <MagicalButton
              onClick={() => setActiveTab("archives")}
              variant={activeTab === "archives" ? "primary" : "secondary"}
              size="sm"
              icon={Search}
            >
              Search Approved Folios
            </MagicalButton>
            <MagicalButton
              onClick={() => setActiveTab("scribe")}
              variant={activeTab === "scribe" ? "primary" : "secondary"}
              size="sm"
              icon={MessageSquare}
            >
              Consult Archival Scribe
            </MagicalButton>
          </div>
        </div>

        {/* Animated Celestial Crystal Emblem with Orbiting Runes & Stasis Control */}
        <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CelestialCrystalEmblem
            size={135}
            isProcessing={isVerifying || isConsultingScribe}
            isStasis={isCrystalStasis}
          />
          <button
            onClick={() => setIsCrystalStasis((prev) => !prev)}
            style={{
              marginTop: "0.5rem",
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--radius-round)",
              background: isCrystalStasis ? "rgba(109, 51, 69, 0.4)" : "rgba(214, 180, 106, 0.12)",
              border: `1px solid ${isCrystalStasis ? "#E288A1" : "var(--antique-gold)"}`,
              color: isCrystalStasis ? "#E288A1" : "var(--antique-gold-bright)",
              fontSize: "0.7rem",
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
            title="Toggle celestial crystal rotation & orbital motion"
          >
            <span>{isCrystalStasis ? "⏸ Motion: Stasis" : "✦ Motion: Active"}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--antique-gold-border)", paddingBottom: "0.6rem", flexWrap: "wrap" }}>
        {[
          { id: "archives", label: "Approved Learning Archives & Folios", icon: BookOpen },
          { id: "scribe", label: "Archival Scribe (Grounded Intelligence)", icon: MessageSquare },
          { id: "puzzles", label: "Chamber Enigmas & Nocturnal Spheres", icon: Key },
          { id: "recommendations", label: "Personalized Intelligence & Insights", icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontSize: "0.82rem",
                cursor: "pointer",
                background: isActive ? "rgba(214, 180, 106, 0.16)" : "transparent",
                color: isActive ? "var(--antique-gold-bright)" : "var(--parchment-muted)",
                border: `1px solid ${isActive ? "var(--antique-gold)" : "transparent"}`,
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
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

      {/* ========================================================================= */}
      {/* TAB 1: APPROVED LEARNING ARCHIVES & FOLIOS (Search & Filters)            */}
      {/* ========================================================================= */}
      {activeTab === "archives" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Prominent Search Bar */}
          <div className="archive-search-container">
            <Search size={20} color="var(--antique-gold)" />
            <input
              type="text"
              className="archive-search-input"
              placeholder="Search approved folios, potion formulas, runic stelae, authors, or citations..."
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
            />
            {archiveSearch && (
              <button
                onClick={() => setArchiveSearch("")}
                style={{ background: "transparent", border: "none", color: "var(--parchment-muted)", cursor: "pointer" }}
                title="Clear search query"
              >
                <X size={16} />
              </button>
            )}
            <span style={{ fontSize: "0.78rem", color: "var(--antique-gold)", fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>
              {archives.length} approved {archives.length === 1 ? "record" : "records"}
            </span>
          </div>

          {/* Faceted Filter Toolbar */}
          <div className="archive-filter-toolbar">
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              {/* Subject */}
              <select
                className="filter-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                aria-label="Filter by subject"
              >
                {filterOptions.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Topic */}
              <select
                className="filter-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                aria-label="Filter by topic"
              >
                {filterOptions.topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                className="filter-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                aria-label="Filter by difficulty"
              >
                {filterOptions.difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Resource Type */}
              <select
                className="filter-select"
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
                aria-label="Filter by resource type"
              >
                {filterOptions.resourceTypes.map((rt) => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>

              {/* Chamber */}
              <select
                className="filter-select"
                value={selectedChamber}
                onChange={(e) => setSelectedChamber(e.target.value)}
                aria-label="Filter by chamber"
              >
                {filterOptions.chambers.map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            {(archiveSearch ||
              selectedSubject !== "All Subjects" ||
              selectedTopic !== "All Topics" ||
              selectedDifficulty !== "All Difficulties" ||
              selectedResourceType !== "All Types" ||
              selectedChamber !== "All Chambers") && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: "transparent",
                  border: "1px dashed var(--antique-gold-border)",
                  borderRadius: "var(--radius-round)",
                  padding: "0.35rem 0.8rem",
                  color: "var(--antique-gold)",
                  fontSize: "0.74rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            )}
          </div>

          {/* Results Grid */}
          {archives.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.4rem" }}>
              {archives.map((arc) => {
                const isNotesOpen = !!expandedNotesMap[arc.id];
                return (
                  <div key={arc.id} className="archival-record-card">
                    {/* Top Row Badges */}
                    <div className="archival-card-header">
                      <span className="folio-call-number">
                        {arc.glyphSignature || `FOLIO-${arc.id}`}
                      </span>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <span className="badge-burgundy" style={{ fontSize: "0.6rem" }}>
                          {arc.difficulty || "Adept"}
                        </span>
                        <span className="badge-gold" style={{ fontSize: "0.6rem" }}>
                          {arc.resourceType || "Grimoire"}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="archival-card-title">
                      {arc.title}
                    </h3>

                    {/* Metadata Subtitle */}
                    <div className="archival-card-author">
                      <span>Inscribed by: <strong>{arc.author}</strong></span>
                      <span>·</span>
                      <span style={{ color: "var(--antique-gold)" }}>{arc.subject}</span>
                    </div>

                    {/* Content Abstract */}
                    <p className="archival-card-abstract">
                      {arc.contentSnippet || arc.abstract}
                    </p>

                    {/* Study Notes Expander */}
                    {arc.studyNotes && (
                      <div>
                        <button
                          onClick={() => toggleStudyNotes(arc.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--antique-gold)",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.2rem 0",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {isNotesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isNotesOpen ? "Fold Study Guidance" : "Unfurl Study Guidance & Notes"}
                        </button>

                        {isNotesOpen && (
                          <div className="study-notes-drawer anim-fade-in-up">
                            <strong style={{ color: "var(--antique-gold-bright)", display: "block", marginBottom: "0.2rem" }}>
                              Archival Study Guidance:
                            </strong>
                            {arc.studyNotes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer with Genuine Citation & Links */}
                    <div className="archival-card-footer">
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                          🏛️ {arc.citation || `Grand Library Scriptoria, Folio #${arc.id}`}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => setSelectedFolioModal(arc)}
                          style={{
                            background: "rgba(214, 180, 106, 0.12)",
                            border: "1px solid var(--antique-gold-border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "0.3rem 0.6rem",
                            color: "var(--ivory)",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                          }}
                        >
                          Inspect Folio
                        </button>

                        {arc.courseCode && (
                          <Link
                            to={`/academics?course=${arc.courseCode}`}
                            style={{
                              background: "rgba(109, 51, 69, 0.2)",
                              border: "1px solid #8E445B",
                              borderRadius: "var(--radius-sm)",
                              padding: "0.3rem 0.6rem",
                              color: "#E288A1",
                              fontSize: "0.72rem",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.2rem",
                            }}
                          >
                            <GraduationCap size={12} /> Syllabus
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Helpful Empty State */
            <div className="empty-archive-state">
              <CelestialCrystalEmblem size={80} style={{ opacity: 0.5 }} />
              <div>
                <h3 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)", fontSize: "1.2rem", margin: "0 0 0.4rem" }}>
                  No Archival Records Match Your Inquiry
                </h3>
                <p style={{ color: "var(--parchment-muted)", fontSize: "0.86rem", maxWidth: "480px", margin: "0 auto 1.2rem" }}>
                  The Department of Mysteries catalog does not contain folios for the active filter parameters.
                  Try searching for keywords such as <em>"moonstone"</em>, <em>"transfiguration"</em>, <em>"saturn"</em>, <em>"runes"</em>, or <em>"vortex"</em>.
                </p>
                <MagicalButton onClick={handleResetFilters} variant="primary" size="sm" icon={RotateCcw}>
                  Reset All Filters
                </MagicalButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ARCHIVAL SCRIBE (Grounded Research Intelligence Query Console)     */}
      {/* ========================================================================= */}
      {activeTab === "scribe" && (
        <div className="scribe-chat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <MessageSquare size={22} color="var(--antique-gold)" />
              <div>
                <h3 style={{ fontSize: "1.35rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                  The Archival Scribe (Grounded Intelligence Console)
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--parchment-muted)" }}>
                  Verified curriculum explanations and reagent properties grounded in Academy folios.
                </span>
              </div>
            </div>
            <span className="badge-emerald" style={{ fontSize: "0.68rem" }}>
              Local Grounded Knowledge Engine (Compliant)
            </span>
          </div>

          {/* AI Compliance & Architectural Transparency Notice */}
          <div
            style={{
              padding: "0.8rem 1rem",
              background: "rgba(214, 180, 106, 0.08)",
              border: "1px dashed var(--antique-gold-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.78rem",
              color: "var(--antique-gold)",
              marginBottom: "1.2rem",
              lineHeight: 1.5,
            }}
          >
            🏛️ <strong>Hackathon Compliance Standard:</strong> This intelligence engine is strictly grounded in the approved Academy curriculum, alchemical reagent catalog, and library folios. Zero external unapproved LLM services are invoked, preserving data privacy and ensuring answers reference genuine archival sources.
          </div>

          {/* Suggestion Quick-Pill Chips */}
          <div style={{ marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)", display: "block", marginBottom: "0.4rem" }}>
              Select an archival query topic or type a custom question below:
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                "Properties of crushed moonstone in potion brewing",
                "How do acoustic wards harmonize through basalt stone?",
                "Eldorian runic inscriptions and celestial stelae",
                "Wards of the Chronomancy Vault",
                "Rules of the Golden Snitch in Skyspire Derby",
              ].map((queryText, idx) => (
                <button
                  key={idx}
                  className="scribe-suggestion-pill"
                  onClick={() => handleQuickPrompt(queryText)}
                >
                  {queryText}
                </button>
              ))}
            </div>
          </div>

          {/* Query Form */}
          <form onSubmit={(e) => handleConsultScribe(e)} style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder="Ask the Scribe about potions, transfiguration, astrolabes, runic stelae, or wards..."
              value={scribePrompt}
              onChange={(e) => setScribePrompt(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(11, 16, 32, 0.85)",
                border: "1.5px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.7rem 1rem",
                color: "var(--ivory)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <MagicalButton type="submit" variant="primary" size="md" icon={Send} disabled={isConsultingScribe}>
              {isConsultingScribe ? "Transcribing..." : "Consult Scribe"}
            </MagicalButton>
          </form>

          {/* Error Notice */}
          {scribeError && (
            <div
              className="anim-scale-in"
              style={{
                padding: "0.9rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(109, 51, 69, 0.3)",
                border: "1px solid var(--burgundy-light)",
                marginBottom: "1.2rem",
                color: "#E288A1",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                <AlertCircle size={16} /> Consultation Interrupted
              </div>
              <p style={{ margin: 0 }}>{scribeError}</p>
            </div>
          )}

          {/* Scribe Inscription Response Card */}
          {scribeResponse && (
            <div
              className="anim-scale-in"
              style={{
                padding: "1.4rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(11, 16, 32, 0.9)",
                border: `1.5px solid ${scribeResponse.isGrounded ? "var(--antique-gold)" : "var(--burgundy-light)"}`,
                boxShadow: "0 0 25px rgba(214, 180, 106, 0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--antique-gold-bright)", fontSize: "1.05rem" }}>
                  {scribeResponse.title}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={scribeResponse.isGrounded ? "badge-emerald" : "badge-burgundy"} style={{ fontSize: "0.65rem" }}>
                    {scribeResponse.status}
                  </span>
                  {scribeResponse.chamber && (
                    <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                      {scribeResponse.chamber}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: "0.92rem", color: "var(--ivory)", lineHeight: 1.6, margin: "0 0 1rem", fontFamily: "var(--font-literary)" }}>
                "{scribeResponse.answer}"
              </p>

              {/* Suggested Queries if out-of-domain boundary */}
              {Array.isArray(scribeResponse.suggestedQueries) && (
                <div style={{ marginTop: "0.6rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)", display: "block", marginBottom: "0.3rem" }}>
                    Suggested Academy Folio Queries:
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {scribeResponse.suggestedQueries.map((sq, i) => (
                      <button
                        key={i}
                        className="scribe-suggestion-pill"
                        onClick={() => handleQuickPrompt(sq)}
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Source Citation Footer */}
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--parchment-muted)",
                  borderTop: "1px solid rgba(214, 180, 106, 0.15)",
                  paddingTop: "0.7rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  Verified Source: <strong style={{ color: "var(--ivory)" }}>{scribeResponse.source}</strong>
                  {scribeResponse.confidence && (
                    <span style={{ marginLeft: "0.6rem", color: "var(--antique-gold)" }}>
                      · Confidence: {Math.round(scribeResponse.confidence * 100)}%
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {scribeResponse.resourceId && (
                    <button
                      onClick={async () => {
                        const fol = archives.find((a) => a.id === scribeResponse.resourceId);
                        if (fol) setSelectedFolioModal(fol);
                      }}
                      style={{
                        background: "rgba(214, 180, 106, 0.15)",
                        border: "1px solid var(--antique-gold-border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.25rem 0.6rem",
                        color: "var(--antique-gold-bright)",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      Inspect Source Folio
                    </button>
                  )}

                  {scribeResponse.courseCode && (
                    <Link
                      to={`/academics?course=${scribeResponse.courseCode}`}
                      style={{
                        background: "rgba(74, 111, 165, 0.2)",
                        border: "1px solid #4A6FA5",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.25rem 0.6rem",
                        color: "#99BBE8",
                        fontSize: "0.72rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <GraduationCap size={12} /> Course Syllabus
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CHAMBER ENIGMAS & NOCTURNAL SPHERES (Interactive Challenges)        */}
      {/* ========================================================================= */}
      {activeTab === "puzzles" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
          {/* Left Column: Interactive Enigmas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {puzzles.map((puz) => {
              const state = puzzleStateMap[puz.id] || { selectedIndex: null, status: "unsolved" };
              return (
                <div key={puz.id} className="magical-card ornate-corners">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <span className="badge-burgundy" style={{ fontSize: "0.62rem" }}>
                      {puz.chamber} · {puz.difficulty}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)", fontWeight: 700 }}>
                      Reward: +25 House Points
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
                    {puz.title}
                  </h3>

                  <p style={{ fontSize: "0.9rem", color: "var(--parchment)", marginBottom: "1.2rem", lineHeight: 1.5 }}>
                    "{puz.question}"
                  </p>

                  {/* Options Radio List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.2rem" }}>
                    {(Array.isArray(puz.options) ? puz.options : []).map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.6rem 0.8rem",
                          borderRadius: "var(--radius-sm)",
                          background: state.selectedIndex === optIdx ? "rgba(214, 180, 106, 0.15)" : "rgba(11, 16, 32, 0.6)",
                          border: `1px solid ${state.selectedIndex === optIdx ? "var(--antique-gold)" : "rgba(214, 180, 106, 0.12)"}`,
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "var(--ivory)",
                        }}
                      >
                        <input
                          type="radio"
                          name={puz.id}
                          checked={state.selectedIndex === optIdx}
                          onChange={() =>
                            setPuzzleStateMap((prev) => ({
                              ...prev,
                              [puz.id]: { ...prev[puz.id], selectedIndex: optIdx, status: "unsolved" },
                            }))
                          }
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>

                  {/* Validation Feedback */}
                  {state.status === "correct" && (
                    <div
                      className="anim-scale-in"
                      style={{
                        padding: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(49, 92, 74, 0.3)",
                        border: "1px solid #79C2A4",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#79C2A4", fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>
                        <CheckCircle2 size={16} /> Cipher Validated!
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--ivory)", margin: 0 }}>
                        {state.explanation}
                      </p>
                      {state.pointsAwarded > 0 && (
                        <span style={{ fontSize: "0.75rem", color: "var(--antique-gold-bright)", fontWeight: 700, display: "block", marginTop: "0.3rem" }}>
                          +{state.pointsAwarded} House Points recorded to Ravencrest!
                        </span>
                      )}
                    </div>
                  )}

                  {state.status === "wrong" && (
                    <div
                      className="anim-scale-in"
                      style={{
                        padding: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(109, 51, 69, 0.3)",
                        border: "1px solid var(--burgundy-light)",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--burgundy-light)", fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>
                        <AlertCircle size={16} /> The Chronos Ward Remains Sealed
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--parchment)", margin: 0 }}>
                        The temporal oscillating resonance rejects this sequence. Consult the Nocturnal Constellation dials or Scribe.
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <MagicalButton
                      onClick={() => handleVerifyPuzzle(puz.id)}
                      variant="primary"
                      size="sm"
                      icon={Lock}
                      disabled={state.selectedIndex === null || isVerifying}
                    >
                      {isVerifying ? "Consulting Vault..." : "Verify Dial Sequence"}
                    </MagicalButton>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Nocturnal Constellations Dial */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <Compass size={20} color="var(--antique-gold)" />
              <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                Nocturnal Constellation Spheres
              </h3>
            </div>

            <p style={{ fontSize: "0.84rem", color: "var(--parchment-muted)", marginBottom: "1.2rem", lineHeight: 1.5 }}>
              Celestial astrolabe alignments calibrate the boundary wards of Hogwarts and solve the Department's third-age riddles.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {CONSTELLATIONS.map((c) => {
                const isSelected = selectedConstellation.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`constellation-card ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedConstellation(c)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.88rem" }}>
                        {c.name}
                      </span>
                      <span className="badge-gold" style={{ fontSize: "0.6rem" }}>
                        {c.stars} Stars
                      </span>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--antique-gold)", marginBottom: "0.3rem" }}>
                      Peak Alignment: {c.season}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", margin: 0, lineHeight: 1.4 }}>
                      {c.lore}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PERSONALIZED INTELLIGENCE & RECOMMENDATIONS                        */}
      {/* ========================================================================= */}
      {activeTab === "recommendations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="magical-card ornate-corners" style={{ maxWidth: "850px", margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                <Brain size={22} color="var(--antique-gold)" />
                <div>
                  <h3 style={{ fontSize: "1.35rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                    Personalized Arcane Knowledge Matrix
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--parchment-muted)" }}>
                    Tailored for Adept Aris Thorne (Ravencrest)
                  </span>
                </div>
              </div>
              <span className="badge-gold" style={{ fontSize: "0.68rem" }}>
                Deterministic Knowledge Synthesis
              </span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--parchment)", marginBottom: "1.2rem", lineHeight: 1.55 }}>
              {recommendations?.advisoryNote || "Curated deterministically from your Adept Dossier, course syllabus, and laboratory progress records."}
            </p>

            {/* Academic Milestone Progress Callout */}
            {recommendations?.recentProgressSummary && (
              <div
                style={{
                  padding: "0.8rem 1rem",
                  background: "rgba(49, 92, 74, 0.25)",
                  border: "1px solid #79C2A4",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.82rem",
                  color: "var(--ivory)",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CheckCircle2 size={16} color="#79C2A4" />
                <span>{recommendations.recentProgressSummary}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {/* Syllabi and Resources */}
              <div style={{ padding: "1.2rem", background: "rgba(11, 16, 32, 0.65)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.18)" }}>
                <h4 style={{ color: "var(--antique-gold)", fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.8rem" }}>
                  Recommended Curriculum & Approved Folios
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {(recommendations?.recommendedResources || []).map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.85rem",
                        padding: "0.6rem",
                        background: "rgba(21, 29, 53, 0.4)",
                        borderRadius: "var(--radius-sm)",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--ivory)" }}>
                          {r.title} ({r.type})
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "var(--parchment-muted)" }}>
                          {r.reason}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => {
                            setActiveTab("archives");
                            setArchiveSearch(r.title);
                          }}
                          style={{
                            background: "rgba(214, 180, 106, 0.15)",
                            border: "1px solid var(--antique-gold-border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "0.3rem 0.6rem",
                            color: "var(--antique-gold-bright)",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                          }}
                        >
                          Find Folio
                        </button>
                        {r.courseCode && (
                          <Link
                            to={`/academics?course=${r.courseCode}`}
                            style={{
                              background: "rgba(74, 111, 165, 0.2)",
                              border: "1px solid #4A6FA5",
                              borderRadius: "var(--radius-sm)",
                              padding: "0.3rem 0.6rem",
                              color: "#99BBE8",
                              fontSize: "0.72rem",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.2rem",
                            }}
                          >
                            <GraduationCap size={12} /> Syllabus
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Fellowship Circles */}
              <div style={{ padding: "1.2rem", background: "rgba(11, 16, 32, 0.65)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.18)" }}>
                <h4 style={{ color: "var(--antique-gold)", fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.8rem" }}>
                  Recommended Fellowship Communities
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {(recommendations?.recommendedCommunities || []).map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.85rem",
                        padding: "0.6rem",
                        background: "rgba(21, 29, 53, 0.4)",
                        borderRadius: "var(--radius-sm)",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--ivory)" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "var(--parchment-muted)" }}>
                          {c.reason}
                        </div>
                      </div>
                      <Link
                        to="/common-room"
                        style={{
                          background: "rgba(109, 51, 69, 0.25)",
                          border: "1px solid #8E445B",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.3rem 0.6rem",
                          color: "#E288A1",
                          fontSize: "0.72rem",
                          textDecoration: "none",
                        }}
                      >
                        Visit Common Room
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Focus Enigma */}
              {recommendations?.recommendedEnigma && (
                <div style={{ padding: "1.2rem", background: "rgba(109, 51, 69, 0.2)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--burgundy-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <h4 style={{ color: "var(--antique-gold)", fontSize: "0.86rem", textTransform: "uppercase", margin: 0 }}>
                      Next Challenge: {recommendations.recommendedEnigma.chamber}
                    </h4>
                    <span className="badge-burgundy" style={{ fontSize: "0.62rem" }}>
                      {recommendations.recommendedEnigma.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ivory)", marginBottom: "0.3rem" }}>
                    {recommendations.recommendedEnigma.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--parchment-muted)", marginBottom: "0.8rem" }}>
                    {recommendations.recommendedEnigma.reason}
                  </div>
                  <MagicalButton
                    onClick={() => setActiveTab("puzzles")}
                    variant="primary"
                    size="sm"
                    icon={Key}
                  >
                    Solve Enigma
                  </MagicalButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL FOLIO DEEP-DIVE                                             */}
      {/* ========================================================================= */}
      {selectedFolioModal && (
        <div className="folio-modal-backdrop" onClick={() => setSelectedFolioModal(null)}>
          <div className="folio-modal-box anim-scale-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <span className="badge-burgundy" style={{ fontSize: "0.65rem", marginBottom: "0.4rem", display: "inline-block" }}>
                  {selectedFolioModal.chamber} · {selectedFolioModal.difficulty}
                </span>
                <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)", margin: 0 }}>
                  {selectedFolioModal.title}
                </h2>
                <div style={{ fontSize: "0.82rem", color: "var(--antique-gold)", marginTop: "0.3rem" }}>
                  Authored by {selectedFolioModal.author} · {selectedFolioModal.subject}
                </div>
              </div>
              <button
                onClick={() => setSelectedFolioModal(null)}
                style={{ background: "transparent", border: "none", color: "var(--parchment-muted)", cursor: "pointer" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Abstract */}
            <div style={{ marginBottom: "1.2rem" }}>
              <h4 style={{ color: "var(--antique-gold)", fontSize: "0.82rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                Folio Synopsis
              </h4>
              <p style={{ color: "var(--parchment)", fontSize: "0.9rem", lineHeight: 1.55, margin: 0 }}>
                {selectedFolioModal.contentSnippet || selectedFolioModal.abstract}
              </p>
            </div>

            {/* Study Notes */}
            {selectedFolioModal.studyNotes && (
              <div style={{ marginBottom: "1.2rem", padding: "1rem", background: "rgba(11, 16, 32, 0.75)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--antique-gold)" }}>
                <h4 style={{ color: "var(--antique-gold-bright)", fontSize: "0.82rem", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Curator Study Notes & Mechanics
                </h4>
                <p style={{ color: "var(--ivory)", fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>
                  {selectedFolioModal.studyNotes}
                </p>
              </div>
            )}

            {/* Citation & Classification */}
            <div style={{ padding: "0.8rem", background: "rgba(21, 29, 53, 0.5)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--parchment-muted)", marginBottom: "1.5rem" }}>
              <div><strong>Archival Citation:</strong> {selectedFolioModal.citation || `Grand Library Scriptoria, Cat. #${selectedFolioModal.id}`}</div>
              <div><strong>Restriction Rating:</strong> {selectedFolioModal.restrictionLevel || "Standard Access"}</div>
              <div><strong>Associated Curriculum:</strong> {selectedFolioModal.courseCode || "General Research"}</div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", flexWrap: "wrap" }}>
              <MagicalButton
                onClick={() => {
                  const prompt = `Tell me about ${selectedFolioModal.title} and its arcane mechanics`;
                  setSelectedFolioModal(null);
                  handleQuickPrompt(prompt);
                }}
                variant="secondary"
                size="sm"
                icon={MessageSquare}
              >
                Ask Scribe About This
              </MagicalButton>

              {selectedFolioModal.courseCode && (
                <Link
                  to={`/academics?course=${selectedFolioModal.courseCode}`}
                  style={{ textDecoration: "none" }}
                >
                  <MagicalButton variant="primary" size="sm" icon={GraduationCap}>
                    View Course Syllabus
                  </MagicalButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
