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
  FileText,
  Download,
  ShieldCheck,
  Cpu,
  Wrench,
  Radio,
  Monitor,
  Atom,
  ChevronRight,
  Info
} from "lucide-react";
import { getLaboratories } from "../../services/api";
import { laboratoriesData as fallbackLabs, potionIngredients } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./AcademicsPage.css";

const LAB_ICONS = {
  "lab-mech": Wrench,
  "lab-physics": Atom,
  "lab-c2s": Cpu,
  "lab-electronics": Radio,
  "lab-computer": Monitor,
};

const LAB_IMAGES = {
  "lab-mech": "/assets/labs/mechanical_lab_card_hero.png",
  "lab-physics": "/assets/labs/physics_lab_card_hero.png",
  "lab-c2s": "/assets/labs/CS2_lab_card_hero.png",
  "lab-electronics": "/assets/labs/Electronics_lab_card_hero.png",
  "lab-computer": "/assets/labs/Computer_lab_hero.png",
};

export default function AcademicsPage() {
  const [labs, setLabs] = useState(
    fallbackLabs.map((l) => ({ ...l, image: l.image || LAB_IMAGES[l.id] }))
  );
  const [selectedLabId, setSelectedLabId] = useState(fallbackLabs[0].id);
  const [activeTab, setActiveTab] = useState("labs"); // "labs" | "cauldron"
  const [resourceFilterCategory, setResourceFilterCategory] = useState("All");
  const [resourceSearch, setResourceSearch] = useState("");
  const [downloadToast, setDownloadToast] = useState("");

  // Potion simulator state
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [brewingResult, setBrewingResult] = useState(null);
  const [isBrewing, setIsBrewing] = useState(false);

  useEffect(() => {
    let mounted = true;
    getLaboratories()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setLabs(data.map((l) => ({ ...l, image: l.image || LAB_IMAGES[l.id] })));
          setSelectedLabId(data[0].id);
        }
      })
      .catch((err) => console.warn("Using fallback laboratories:", err));
    return () => { mounted = false; };
  }, []);

  const activeLab = labs.find((l) => l.id === selectedLabId) || labs[0];

  const filteredResources = (activeLab.resources || []).filter((res) => {
    const matchesCat = resourceFilterCategory === "All" || res.category === resourceFilterCategory;
    const matchesSearch = res.title.toLowerCase().includes(resourceSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (res) => {
    setDownloadToast(`Enchanted scroll '${res.title}' downloaded to your personal codex.`);
    setTimeout(() => setDownloadToast(""), 5000);
  };

  // Cauldron simulator logic
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

  const brewPotion = () => {
    if (selectedIngredients.length === 0) return;
    setIsBrewing(true);
    setBrewingResult(null);

    setTimeout(() => {
      const totalPotency = selectedIngredients.reduce((sum, i) => sum + i.potency, 0);
      const totalStability = selectedIngredients.reduce((sum, i) => sum + i.stability, 0);

      let name = "Draught of Luminescence";
      let status = "Stable";
      let color = "#79C2A4";

      if (totalStability <= 0) {
        status = "Volatile";
        name = "Elixir of Pyrotechnic Surge";
        color = "#E05A47";
      } else if (totalPotency >= 18) {
        status = "Masterwork";
        name = "Grand Philtre of the Astral Mind";
        color = "#D6B46A";
      }

      setBrewingResult({
        name,
        status,
        potency: totalPotency,
        stability: totalStability,
        color,
      });
      setIsBrewing(false);
    }, 1200);
  };

  const resetCauldron = () => {
    setSelectedIngredients([]);
    setBrewingResult(null);
  };

  const currentLiquidColor = brewingResult
    ? brewingResult.color
    : selectedIngredients.length > 0
    ? selectedIngredients[selectedIngredients.length - 1].color
    : "#2A3D32";

  return (
    <div className="academics-container anim-fade-in-up">
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

        {/* Cinematic Academics Department Hero Banner */}
        <div className="dept-hero-banner ornate-corners">
          <img
            src="/assets/labs/Computer_lab_hero.png"
            alt="Spellbound Academic Laboratories & Research Chambers"
            className="dept-hero-image"
          />
          <div className="dept-hero-gradient" />
          <div className="dept-hero-content">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "0.5rem" }}>
              <span className="badge-gold">
                Academic Faculty & Research Chambers
              </span>
              {/* Mode Switcher */}
              <div className="academics-mode-switcher">
                <button
                  onClick={() => setActiveTab("labs")}
                  className={`mode-btn ${activeTab === "labs" ? "active" : ""}`}
                >
                  <Cpu size={15} /> Campus Labs (5)
                </button>
                <button
                  onClick={() => setActiveTab("cauldron")}
                  className={`mode-btn ${activeTab === "cauldron" ? "active" : ""}`}
                >
                  <FlaskConical size={15} /> Alchemical Simulation
                </button>
              </div>
            </div>
            <h1 className="dept-hero-title">
              Academics & Magical Labs: Research Facilities & Manuals
            </h1>
            <p className="dept-hero-subtitle">
              Five specialized campus laboratories, equipment inventories, experiment manuals & alchemical simulations.
            </p>
          </div>
        </div>
      </div>

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="download-toast-banner anim-fade-in-up">
          <CheckCircle2 size={18} color="#79C2A4" />
          <span>{downloadToast}</span>
        </div>
      )}

      {activeTab === "labs" ? (
        <div className="labs-layout-grid">
          {/* Left Column: Vertical Laboratory Navigation */}
          <div className="labs-nav-sidebar ornate-corners">
            <h3 className="sidebar-title">ACADEMIC LABORATORIES</h3>
            <div className="labs-tabs-list">
              {labs.map((lab) => {
                const Icon = LAB_ICONS[lab.id] || BookOpen;
                const isSelected = selectedLabId === lab.id;

                return (
                  <button
                    key={lab.id}
                    onClick={() => {
                      setSelectedLabId(lab.id);
                      setResourceFilterCategory("All");
                    }}
                    className={`lab-nav-item ${isSelected ? "active" : ""}`}
                  >
                    <div className="lab-item-icon">
                      <Icon size={20} />
                    </div>
                    <div className="lab-item-text">
                      <span className="lab-code-badge">{lab.code}</span>
                      <span className="lab-item-name">{lab.name}</span>
                    </div>
                    <ChevronRight size={16} className="chevron" />
                  </button>
                );
              })}
            </div>

            <div className="lab-location-hint">
              <Info size={14} color="var(--antique-gold)" />
              <span>All 5 laboratories are located within the central Academic Building complex.</span>
            </div>
          </div>

          {/* Right Column: Detailed Laboratory Dossier */}
          {activeLab && (
            <div className="lab-details-view ornate-corners">
              {/* Active Lab Visual Hero Banner */}
              <div className="active-lab-banner">
                <img
                  src={activeLab.image || LAB_IMAGES[activeLab.id]}
                  alt={activeLab.name}
                  className="active-lab-image"
                />
                <div className="active-lab-gradient" />
                <div className="active-lab-badge-row">
                  <span className="badge-gold">{activeLab.code}</span>
                  <span className="badge-emerald">Academic Building · Level 2</span>
                </div>
              </div>

              {/* Lab Header */}
              <div className="lab-header">
                <div>
                  <h2 style={{ fontSize: "1.7rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                    {activeLab.name}
                  </h2>
                  <p style={{ color: "var(--antique-gold)", fontSize: "0.86rem", marginTop: "0.2rem" }}>
                    Specialized Facility & Computational Research Center
                  </p>
                </div>

                <div className="faculty-badge">
                  <span className="faculty-label">Faculty In-Charge:</span>
                  <span className="faculty-name">{activeLab.facultyInCharge}</span>
                </div>
              </div>

              <p className="lab-description">{activeLab.description}</p>

              {/* Equipment & Safety 2-Column Split */}
              <div className="lab-specs-grid">
                {/* Available Equipment */}
                <div className="spec-card">
                  <div className="spec-card-title">
                    <Wrench size={16} color="var(--antique-gold)" />
                    <h4>Available Equipment & Facilities</h4>
                  </div>
                  <div className="equipment-list">
                    {activeLab.availableEquipment?.map((item, idx) => (
                      <div key={idx} className="equipment-item">
                        <Sparkles size={13} color="var(--antique-gold-bright)" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Guidelines */}
                <div className="spec-card safety-card">
                  <div className="spec-card-title">
                    <ShieldCheck size={16} color="#79C2A4" />
                    <h4>Safety Guidelines & Operating Protocols</h4>
                  </div>
                  <div className="safety-list">
                    {activeLab.safetyGuidelines?.map((rule, idx) => (
                      <div key={idx} className="safety-item">
                        <AlertTriangle size={13} color="#E05A47" style={{ flexShrink: 0 }} />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Organized Learning Resources Library */}
              <div className="resources-section">
                <div className="resources-header">
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.15rem" }}>
                      Organized Learning Resources & Practical Manuals
                    </h3>
                    <p style={{ color: "var(--parchment-muted)", fontSize: "0.82rem" }}>
                      Official course experiment guides, reference materials, and software tutorials.
                    </p>
                  </div>

                  {/* Resource Category Filters */}
                  <div className="resource-filter-pills">
                    {["All", "Manuals", "Experiment Guides", "Reference Materials", "Tutorials"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setResourceFilterCategory(cat)}
                        className={`res-pill ${resourceFilterCategory === cat ? "active" : ""}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search in resources */}
                <div className="resource-search-box">
                  <Search size={15} color="var(--parchment-muted)" />
                  <input
                    type="text"
                    placeholder={`Search within ${activeLab.name} materials...`}
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                  />
                </div>

                {/* Resource Cards Grid */}
                <div className="resources-cards-grid">
                  {filteredResources.length === 0 ? (
                    <div style={{ color: "var(--parchment-muted)", padding: "1.5rem", textAlign: "center", gridColumn: "1 / -1" }}>
                      No learning resources found matching "{resourceSearch}".
                    </div>
                  ) : (
                    filteredResources.map((res) => (
                      <div key={res.id} className="resource-card">
                        <div className="resource-card-top">
                          <FileText size={20} color="var(--antique-gold)" />
                          <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                            {res.category}
                          </span>
                        </div>

                        <h4 className="resource-title">{res.title}</h4>

                        <div className="resource-footer">
                          <span className="resource-size">{res.size} · PDF</span>
                          <button
                            onClick={() => handleDownload(res)}
                            className="download-btn"
                            aria-label={`Download ${res.title}`}
                          >
                            <Download size={14} /> Download
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Alchemical Simulation Station (Cauldron) */
        <div className="lab-cauldron-view ornate-corners anim-fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="badge-emerald" style={{ marginBottom: "0.5rem" }}>Experimental Research Station</span>
            <h2 style={{ fontSize: "1.6rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              The Alchemical Simulation Cauldron
            </h2>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.88rem", maxWidth: "600px", margin: "0 auto" }}>
              Combine up to three energetic reagent reagents to test stoichiometric reaction stability and brew specialized laboratory elixirs.
            </p>
          </div>

          <div className="cauldron-sim-grid">
            {/* Left: Reagents Shelf */}
            <div className="reagents-shelf">
              <h4 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold)", fontSize: "0.95rem", marginBottom: "0.8rem" }}>
                Select Up to 3 Laboratory Reagents:
              </h4>

              <div className="ingredients-grid">
                {potionIngredients.map((ing) => {
                  const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngredient(ing)}
                      className={`ingredient-btn ${isSelected ? "selected" : ""}`}
                      disabled={!isSelected && selectedIngredients.length >= 3}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: ing.color }} />
                        <span>{ing.name}</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                        Potency +{ing.potency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: The Cauldron Vessel & Hearth */}
            <div className="cauldron-vessel-container">
              <div className="cauldron-vessel">
                <div
                  className="cauldron-liquid"
                  style={{
                    backgroundColor: currentLiquidColor,
                    boxShadow: `0 0 25px ${currentLiquidColor}`,
                  }}
                />
              </div>

              {/* Flame Beneath */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", color: "#D48C45", marginBottom: "1rem" }}>
                <Flame size={20} className="anim-pulse" />
                <Flame size={26} className="anim-pulse" style={{ animationDelay: "0.2s" }} />
                <Flame size={20} className="anim-pulse" style={{ animationDelay: "0.4s" }} />
              </div>

              <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                <MagicalButton
                  onClick={brewPotion}
                  variant="primary"
                  size="md"
                  disabled={selectedIngredients.length === 0 || isBrewing}
                  icon={FlaskConical}
                >
                  {isBrewing ? "Catalyzing Reaction..." : "Catalyze Elixir"}
                </MagicalButton>

                <MagicalButton
                  onClick={resetCauldron}
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                >
                  Reset Cauldron
                </MagicalButton>
              </div>

              {/* Brewing Outcome Card */}
              {brewingResult && (
                <div className="brewing-result-card anim-fade-in-up">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <h4 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
                      {brewingResult.name}
                    </h4>
                    <span className={brewingResult.status === "Volatile" ? "badge-burgundy" : "badge-emerald"}>
                      {brewingResult.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "var(--parchment)" }}>
                    <span>Potency: <strong>{brewingResult.potency} pts</strong></span>
                    <span>Thermal Stability: <strong>{brewingResult.stability} pts</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
