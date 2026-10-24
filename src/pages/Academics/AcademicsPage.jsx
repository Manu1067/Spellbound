import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  FlaskConical,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Award,
  Clock,
  Check,
  X,
  FileText,
  Loader2,
  HelpCircle,
} from "lucide-react";
import {
  fetchCourses,
  fetchLearningResources,
  fetchPotionIngredients,
  brewPotion as apiBrewPotion,
  submitCourseQuiz,
  fetchStudentAcademicProgress,
} from "../../services/api";
import { currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./AcademicsPage.css";

const RARITIES = ["All Rarities", "Common", "Rare Grimoire", "Ancient Foliant", "Restricted"];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("lab"); // 'lab' | 'courses' | 'resources' | 'progress'
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Potion Lab State
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [heatLevel, setHeatLevel] = useState("Steady Flame");
  const [stirDirection, setStirDirection] = useState("Clockwise");
  const [brewingResult, setBrewingResult] = useState(null);
  const [isBrewing, setIsBrewing] = useState(false);

  // Resource Search State
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceRarity, setResourceRarity] = useState("All Rarities");

  // Quiz Modal State
  const [activeQuizCourse, setActiveQuizCourse] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizFeedbackToast, setQuizFeedbackToast] = useState("");

  // Load Academics Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, ingData, progData] = await Promise.all([
        fetchCourses().catch(() => []),
        fetchPotionIngredients().catch(() => []),
        fetchStudentAcademicProgress(currentUser.id).catch(() => null),
      ]);

      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setIngredients(Array.isArray(ingData) ? ingData : []);
      setProgress(progData);
    } catch (err) {
      console.warn("Failed to load academic data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search Learning Resources
  useEffect(() => {
    const fetchRes = async () => {
      try {
        const params = {};
        if (resourceRarity !== "All Rarities") params.rarity = resourceRarity;
        if (resourceSearch.trim()) params.search = resourceSearch.trim();
        const res = await fetchLearningResources(params);
        setResources(Array.isArray(res) ? res : []);
      } catch (err) {
        console.warn("Error fetching resources:", err);
      }
    };
    fetchRes();
  }, [resourceSearch, resourceRarity]);

  // Toggle Ingredient Selection (Max 3)
  const toggleIngredient = (ing) => {
    if (brewingResult) setBrewingResult(null);
    if (selectedIngredients.some((i) => i.id === ing.id)) {
      setSelectedIngredients((prev) => prev.filter((i) => i.id !== ing.id));
    } else {
      if (selectedIngredients.length < 3) {
        setSelectedIngredients((prev) => [...prev, ing]);
      }
    }
  };

  // Brew Potion with API Call & Deterministic Rules
  const handleBrewPotion = async () => {
    if (selectedIngredients.length === 0) return;
    setIsBrewing(true);
    setBrewingResult(null);

    try {
      const payload = {
        studentId: currentUser.id,
        ingredientIds: selectedIngredients.map((i) => i.id),
        heatLevel,
        stirDirection,
      };

      const result = await apiBrewPotion(payload);
      setBrewingResult(result);

      // Refresh progress to reflect new potion brew in journal
      const updatedProgress = await fetchStudentAcademicProgress(currentUser.id).catch(() => null);
      if (updatedProgress) setProgress(updatedProgress);
    } catch (err) {
      console.warn("Brewing failed:", err);
      // Fallback local deterministic outcome
      const totalPotency = selectedIngredients.reduce((s, i) => s + (i.potency || 5), 0);
      const totalStability = selectedIngredients.reduce((s, i) => s + (i.stability || 2), 0);
      setBrewingResult({
        potionName: totalStability > 2 ? "Draught of Luminescence" : "Volatile Alchemical Slag",
        outcome: totalStability > 2 ? "Success" : "Unstable",
        potency: totalPotency,
        stability: totalStability,
        potionColor: totalStability > 2 ? "#4E8A71" : "#7A5BA3",
        description: "Enchanted distillation completed under steady cauldron flame.",
        disclaimer: "Academy Alchemical Notice: This is a fictional wizarding simulation based on arcane lore. It does not contain or represent real-world chemical formulas.",
      });
    } finally {
      setIsBrewing(false);
    }
  };

  const resetCauldron = () => {
    setSelectedIngredients([]);
    setBrewingResult(null);
  };

  // Open Examination / Quiz
  const handleOpenQuiz = (course) => {
    setActiveQuizCourse(course);
    setQuizAnswers({});
    setQuizResult(null);
  };

  // Submit Quiz Answers to Backend
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (!activeQuizCourse) return;

    setIsSubmittingQuiz(true);
    try {
      const result = await submitCourseQuiz({
        studentId: currentUser.id,
        courseCode: activeQuizCourse.code,
        answers: quizAnswers,
      });

      setQuizResult(result);
      if (result.passed) {
        setQuizFeedbackToast(`✨ Examination passed with ${result.scorePercent}%! +${result.pointsAwarded} House Points awarded to Ravencrest!`);
      } else {
        setQuizFeedbackToast(`Examination completed: ${result.scorePercent}%. Score 70% or higher to earn House Points.`);
      }
      setTimeout(() => setQuizFeedbackToast(""), 6000);

      // Refresh progress
      const updatedProg = await fetchStudentAcademicProgress(currentUser.id).catch(() => null);
      if (updatedProg) setProgress(updatedProg);
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const currentLiquidColor = brewingResult
    ? brewingResult.potionColor || brewingResult.color
    : selectedIngredients.length > 0
    ? selectedIngredients[selectedIngredients.length - 1].color || "#4E8A71"
    : "#2A3D32";

  return (
    <div className="academics-container anim-fade-in-up">
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
                background: "rgba(49, 92, 74, 0.2)",
                border: "1px solid var(--emerald-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#79C2A4",
              }}
            >
              <FlaskConical size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Academics & Magical Labs: Learning Hub
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Curricula syllabi, potion brewing laboratory, validated quizzes & learning records.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className="badge-emerald">Term III Active</span>
            <span className="badge-gold">Class of 180 Adepts</span>
          </div>
        </div>
      </div>

      {/* Quiz Toast Feedback */}
      {quizFeedbackToast && (
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
          <span>{quizFeedbackToast}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--antique-gold-border)", paddingBottom: "0.6rem", flexWrap: "wrap" }}>
        {[
          { id: "lab", label: "Potion Laboratory", icon: Flame },
          { id: "courses", label: "Course Catalogue & Syllabi", icon: BookOpen },
          { id: "resources", label: "Searchable Learning Resources", icon: Search },
          { id: "progress", label: "Saved Learning Progress", icon: Award },
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

      {/* Tab 1: Potion Laboratory */}
      {activeTab === "lab" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
          {/* Cauldron Vessel Area */}
          <div className="lab-cauldron-view ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <span className="badge-emerald" style={{ marginBottom: "0.4rem" }}>
                  Subterranean Dungeon Lab III
                </span>
                <h2 style={{ fontSize: "1.35rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Experimental Brewing Station
                </h2>
              </div>

              <button
                onClick={resetCauldron}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--parchment-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                }}
              >
                <RotateCcw size={14} /> Clear Vessel
              </button>
            </div>

            <p style={{ fontSize: "0.84rem", color: "var(--parchment)", marginBottom: "1rem" }}>
              Combine up to 3 magical reagents. Fine-tune your heat source and stir cadence to discover masterwork elixirs.
            </p>

            {/* Cauldron Animated Graphics */}
            <div className="cauldron-vessel">
              <div
                className="cauldron-liquid"
                style={{
                  backgroundColor: currentLiquidColor,
                  boxShadow: `0 0 25px ${currentLiquidColor}88, inset 0 0 15px rgba(255,255,255,0.4)`,
                }}
              />
              {isBrewing ? (
                <span style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "#FFFFFF", fontWeight: 700 }}>
                  Brewing...
                </span>
              ) : (
                <span style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-literary)", fontSize: "0.95rem", color: "#FFFFFF" }}>
                  {selectedIngredients.length === 0 ? "Empty Bronze Vessel" : `${selectedIngredients.length}/3 Reagents`}
                </span>
              )}
            </div>

            {/* Brewing Controls: Heat & Stir Direction */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem", padding: "0.8rem", background: "rgba(11, 16, 32, 0.5)", borderRadius: "var(--radius-sm)" }}>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Cauldron Flame Intensity
                </label>
                <select
                  value={heatLevel}
                  onChange={(e) => setHeatLevel(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.8)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.4rem 0.6rem",
                    color: "var(--ivory)",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                >
                  <option value="Low Ember">Low Ember (+3 Stability)</option>
                  <option value="Steady Flame">Steady Flame (Balanced)</option>
                  <option value="Dragon Fire">Dragon Fire (+6 Potency, Volatile)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Stirring Cadence
                </label>
                <select
                  value={stirDirection}
                  onChange={(e) => setStirDirection(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.8)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.4rem 0.6rem",
                    color: "var(--ivory)",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                >
                  <option value="Clockwise">Clockwise (+3 Stability)</option>
                  <option value="Counter-Clockwise">Counter-Clockwise (+3 Potency)</option>
                </select>
              </div>
            </div>

            {/* Reagents Shelf Selection */}
            <div style={{ marginBottom: "1.2rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.5rem" }}>
                Reagent Cabinet
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {ingredients.map((ing) => {
                  const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                  return (
                    <button
                      key={ing.id}
                      className={`ingredient-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleIngredient(ing)}
                      disabled={!isSelected && selectedIngredients.length >= 3}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ing.color }} />
                        {ing.name}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--parchment-muted)" }}>
                        +{ing.potency} pot / {ing.stability >= 0 ? `+${ing.stability}` : ing.stability} stab
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brew Action & Results Feedback */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <MagicalButton
                onClick={handleBrewPotion}
                variant="emerald"
                size="md"
                icon={Flame}
                disabled={selectedIngredients.length === 0 || isBrewing}
              >
                {isBrewing ? "Distilling Reagents..." : "Ignite Hearth & Brew Elixir"}
              </MagicalButton>

              {brewingResult && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: `1.5px solid ${brewingResult.potionColor || brewingResult.color || "#79C2A4"}`,
                    marginTop: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h4 style={{ fontFamily: "var(--font-display)", color: brewingResult.potionColor || brewingResult.color, fontSize: "1.1rem" }}>
                      {brewingResult.potionName}
                    </h4>
                    <span
                      className={brewingResult.outcome === "Success" ? "badge-emerald" : "badge-burgundy"}
                      style={{ fontSize: "0.65rem" }}
                    >
                      {brewingResult.outcome}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "var(--ivory)", margin: "0.3rem 0 0.6rem" }}>
                    {brewingResult.description}
                  </p>

                  <div style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", display: "flex", gap: "1rem", marginBottom: "0.6rem" }}>
                    <span>Potency: <strong>{brewingResult.potency}</strong></span>
                    <span>Stability: <strong>{brewingResult.stability}</strong></span>
                    {brewingResult.housePointsAwarded ? (
                      <span style={{ color: "#79C2A4" }}>+{brewingResult.housePointsAwarded} House Points!</span>
                    ) : null}
                  </div>

                  {/* Fictional Potion Safety Disclaimer */}
                  <div style={{ fontSize: "0.7rem", color: "var(--antique-gold)", fontStyle: "italic", borderTop: "1px dashed rgba(214, 180, 106, 0.2)", paddingTop: "0.5rem" }}>
                    ⚠️ {brewingResult.disclaimer || "Academy Alchemical Notice: This is a fictional wizarding simulation based on arcane lore. It does not contain or represent real-world chemical formulas."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Lab Station Rules & Recent Brews */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <Sparkles size={18} color="var(--antique-gold)" />
              <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Alchemical Codex & Principles
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.82rem", color: "var(--parchment)" }}>
              <div style={{ padding: "0.8rem", background: "rgba(11, 16, 32, 0.5)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.12)" }}>
                <strong style={{ color: "var(--antique-gold)", display: "block", marginBottom: "0.2rem" }}>Rule of Three Reagents</strong>
                Cauldrons cannot sustain more than three concurrent magical frequencies without ward dampening.
              </div>
              <div style={{ padding: "0.8rem", background: "rgba(11, 16, 32, 0.5)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.12)" }}>
                <strong style={{ color: "var(--antique-gold)", display: "block", marginBottom: "0.2rem" }}>Thermal Transmutation</strong>
                Steady flame prevents sudden mandrake fiber combustion. Dragon fire yields maximum potency but invites volatility.
              </div>
              <div style={{ padding: "0.8rem", background: "rgba(11, 16, 32, 0.5)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.12)" }}>
                <strong style={{ color: "var(--antique-gold)", display: "block", marginBottom: "0.2rem" }}>Academic House Points</strong>
                Successfully stabilized masterwork potions earn 15 points recorded immediately in the Great Hall Hourglasses.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Course Catalogue & Syllabi */}
      {activeTab === "courses" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {courses.map((c) => (
            <div key={c.code} className="magical-card ornate-corners">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                <h3 style={{ fontSize: "1.15rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  {c.title}
                </h3>
                <span className="badge-gold" style={{ fontSize: "0.68rem" }}>
                  {c.code}
                </span>
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--antique-gold)", marginBottom: "0.8rem" }}>
                {c.instructor} · {c.locationName || c.locationId || "Academy Keep"}
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--parchment)", lineHeight: 1.5, marginBottom: "1.2rem" }}>
                {c.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(214, 180, 106, 0.12)", paddingTop: "0.8rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
                  Credits: {c.credits || 4} · Term III
                </span>

                <MagicalButton
                  onClick={() => handleOpenQuiz(c)}
                  variant="primary"
                  size="sm"
                  icon={BookOpen}
                >
                  Take Examination
                </MagicalButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Searchable Learning Resources */}
      {activeTab === "resources" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Search & Filter Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              padding: "1rem",
              background: "rgba(21, 29, 53, 0.6)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--antique-gold-border)",
            }}
          >
            {/* Rarity Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {RARITIES.map((r) => (
                <button
                  key={r}
                  onClick={() => setResourceRarity(r)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "var(--radius-round)",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    background: resourceRarity === r ? "var(--antique-gold)" : "rgba(11, 16, 32, 0.6)",
                    color: resourceRarity === r ? "var(--midnight)" : "var(--parchment)",
                    border: `1px solid ${resourceRarity === r ? "var(--antique-gold-bright)" : "rgba(214, 180, 106, 0.2)"}`,
                    fontWeight: resourceRarity === r ? 700 : 500,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(11, 16, 32, 0.7)",
                border: "1px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-round)",
                padding: "0.35rem 0.8rem",
                minWidth: "240px",
              }}
            >
              <Search size={14} color="var(--antique-gold)" />
              <input
                type="text"
                placeholder="Search scrolls, authors, keywords..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--ivory)",
                  fontSize: "0.8rem",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Resources Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.2rem" }}>
            {resources.map((res) => (
              <div key={res.id} className="magical-card ornate-corners">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <span className="badge-emerald" style={{ fontSize: "0.62rem" }}>
                    {res.resourceType}
                  </span>
                  <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                    {res.rarity}
                  </span>
                </div>

                <h4 style={{ fontSize: "1.05rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.3rem" }}>
                  {res.title}
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--antique-gold)", marginBottom: "0.6rem" }}>
                  Author: {res.author} · Ref: {res.courseCode}
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--parchment-muted)", lineHeight: 1.45, margin: 0 }}>
                  "{res.contentSnippet}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Saved Learning Progress */}
      {activeTab === "progress" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Completed Quizzes & Exams */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <Award size={18} color="var(--antique-gold)" />
              <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Verified Examination Records
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {progress?.completedQuizzes && progress.completedQuizzes.length > 0 ? (
                progress.completedQuizzes.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(11, 16, 32, 0.6)",
                      border: "1px solid rgba(214, 180, 106, 0.15)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.9rem" }}>
                        Course: {q.courseCode}
                      </span>
                      <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                        Completed: {new Date(q.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                        {q.score}%
                      </span>
                      <span className={q.passed ? "badge-emerald" : "badge-burgundy"} style={{ fontSize: "0.62rem", display: "block" }}>
                        {q.passed ? "Passed" : "Needs Review"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--parchment-muted)" }}>
                  No examination records yet inscribed. Select a syllabus under 'Course Catalogue' to take an examination.
                </p>
              )}
            </div>
          </div>

          {/* Potion Brewing Journal */}
          <div className="magical-card ornate-corners">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <FlaskConical size={18} color="#79C2A4" />
              <h3 style={{ fontSize: "1.2rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Alchemical Brewing Journal
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {progress?.brewJournal && progress.brewJournal.length > 0 ? (
                progress.brewJournal.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(11, 16, 32, 0.6)",
                      border: "1px solid rgba(214, 180, 106, 0.15)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.88rem" }}>
                        {b.potionName}
                      </span>
                      <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                        Potency {b.potency} · Stability {b.stability}
                      </div>
                    </div>
                    <span className={b.outcome === "Success" ? "badge-emerald" : "badge-burgundy"} style={{ fontSize: "0.65rem" }}>
                      {b.outcome}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--parchment-muted)" }}>
                  Your cauldron journal is blank. Visit the Potion Laboratory to distill your first elixir.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Examination / Quiz Modal */}
      {activeQuizCourse && (
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
          onClick={() => setActiveQuizCourse(null)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "600px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>
                  {activeQuizCourse.code} Examination
                </h3>
              </div>
              <button onClick={() => setActiveQuizCourse(null)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {/* Questions Form or Results Feedback */}
            {!quizResult ? (
              <form onSubmit={handleSubmitQuiz} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {activeQuizCourse.code === "TRANS-501" ? (
                  <>
                    <div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ivory)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        1. Which harmonic vibration frequency stabilizes copper into organic crystalline matrices?
                      </p>
                      {[
                        "432 Hz Sol-Fulgur",
                        "528 Hz Vita-Forma",
                        "108 Hz Litho-Morte",
                        "960 Hz Ignis-Vael",
                      ].map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.3rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="q1"
                            checked={quizAnswers.q1 === i}
                            onChange={() => setQuizAnswers({ ...quizAnswers, q1: i })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    <div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ivory)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        2. What happens if the inanimate animus reversal charm is performed without grounding the wand tip?
                      </p>
                      {[
                        "The metal evaporates into ether",
                        "The object transmutes into basalt stone",
                        "Static discharge inverts the caster’s wand wood",
                        "The transfiguration rebounds into volatile glass",
                      ].map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.3rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="q2"
                            checked={quizAnswers.q2 === i}
                            onChange={() => setQuizAnswers({ ...quizAnswers, q2: i })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    <div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ivory)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        3. According to Vance’s Third Law of Transmutation, which attribute cannot be spontaneously induced?
                      </p>
                      {[
                        "Reflective luster",
                        "Permanent sentient consciousness",
                        "Tensile elasticity",
                        "Thermal conductivity",
                      ].map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.3rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="q3"
                            checked={quizAnswers.q3 === i}
                            onChange={() => setQuizAnswers({ ...quizAnswers, q3: i })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ivory)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        1. The tri-corner glyph inscribed on the North Spire denotes which astral celestial body?
                      </p>
                      {[
                        "The Eye of Saturn",
                        "The Talon of the Raven",
                        "The Golden Chariot of Apollo",
                        "The Eclipse of Cassiopeia",
                      ].map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.3rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="q1"
                            checked={quizAnswers.q1 === i}
                            onChange={() => setQuizAnswers({ ...quizAnswers, q1: i })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    <div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ivory)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        2. Which stylus alloy prevents rune ink smudging during high electromagnetic ley line pulses?
                      </p>
                      {[
                        "Tempered Electrum",
                        "Cast Lead",
                        "Brittle Obsidian",
                        "Sterling Copper",
                      ].map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "0.3rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="q2"
                            checked={quizAnswers.q2 === i}
                            onChange={() => setQuizAnswers({ ...quizAnswers, q2: i })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "1rem" }}>
                  <MagicalButton onClick={() => setActiveQuizCourse(null)} variant="secondary" size="sm">
                    Cancel
                  </MagicalButton>
                  <MagicalButton type="submit" variant="primary" size="sm" disabled={isSubmittingQuiz}>
                    {isSubmittingQuiz ? "Validating..." : "Submit Answers for Evaluation"}
                  </MagicalButton>
                </div>
              </form>
            ) : (
              /* Quiz Detailed Results */
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ textAlign: "center", padding: "1rem", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--antique-gold)", fontFamily: "var(--font-display)" }}>
                    {quizResult.scorePercent}%
                  </span>
                  <div style={{ marginTop: "0.4rem" }}>
                    <span className={quizResult.passed ? "badge-emerald" : "badge-burgundy"}>
                      {quizResult.passed ? "Passed with Distinction" : "Did Not Meet Requirement"}
                    </span>
                  </div>
                  {quizResult.pointsAwarded > 0 && (
                    <div style={{ fontSize: "0.82rem", color: "#79C2A4", marginTop: "0.4rem" }}>
                      +{quizResult.pointsAwarded} House Points awarded to Ravencrest!
                    </div>
                  )}
                </div>

                {/* Question Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {quizResult.results.map((res, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                        background: res.isCorrect ? "rgba(49, 92, 74, 0.2)" : "rgba(109, 51, 69, 0.2)",
                        border: `1px solid ${res.isCorrect ? "#79C2A4" : "var(--burgundy-light)"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, color: "var(--ivory)", marginBottom: "0.3rem" }}>
                        <span>Question {i + 1}</span>
                        <span>{res.isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--parchment)", margin: "0 0 0.3rem" }}>
                        {res.prompt}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--antique-gold)", margin: 0 }}>
                        {res.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.8rem" }}>
                  <MagicalButton onClick={() => setActiveQuizCourse(null)} variant="primary" size="sm">
                    Close Examination Record
                  </MagicalButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
