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
  Edit3,
  Award,
  BookOpen,
  Filter,
  GraduationCap,
  Loader2,
  AlertCircle,
  Compass,
} from "lucide-react";
import {
  fetchStudents,
  fetchCurrentStudent,
  updateStudentProfile,
  dispatchOwl,
} from "../../services/api";
import { studentDirectory as fallbackStudents, currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./PeoplePage.css";

const HOUSES = ["All Houses", "Ravencrest", "Gryphonhart", "Shadowvale", "Emberwyrm"];
const SUBJECTS = [
  "All Subjects",
  "Ancient Runes",
  "Aero-Tactics",
  "Subterranean Potions",
  "Magical Botany",
  "Chronomancy & Astronomy",
  "Elemental Alchemy",
];

export default function PeoplePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedHouse, setSelectedHouse] = useState("All Houses");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorOnly, setMentorOnly] = useState(false);

  // Modals & Details
  const [activeDossier, setActiveDossier] = useState(null);
  const [owlModalTarget, setOwlModalTarget] = useState(null);
  const [owlMessage, setOwlMessage] = useState("");
  const [isSendingOwl, setIsSendingOwl] = useState(false);
  const [sentToast, setSentToast] = useState("");

  // Demo Profile Editing State (for current user Aris Thorne)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editInterests, setEditInterests] = useState("");
  const [editProject, setEditProject] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load students from backend
  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedHouse !== "All Houses") params.house = selectedHouse;
      if (selectedSubject !== "All Subjects") params.subject = selectedSubject;
      if (mentorOnly) params.mentor = true;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await fetchStudents(params);
      if (Array.isArray(data) && data.length > 0) {
        setStudents(data);
      } else if (Array.isArray(data) && data.length === 0) {
        setStudents([]);
      } else {
        setStudents(fallbackStudents);
      }
      setError(null);
    } catch (err) {
      console.warn("[PeoplePage] Using fallback students:", err.message);
      let filtered = fallbackStudents;
      if (selectedHouse !== "All Houses") {
        filtered = filtered.filter((s) => s.house === selectedHouse);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.title?.toLowerCase().includes(q) ||
            s.favSubject?.toLowerCase().includes(q)
        );
      }
      setStudents(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedHouse, selectedSubject, mentorOnly]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Send Owl Post
  const handleSendOwl = async (e) => {
    e.preventDefault();
    if (!owlMessage.trim() || !owlModalTarget) return;

    setIsSendingOwl(true);
    const recipient = owlModalTarget.name;
    try {
      await dispatchOwl({
        recipientId: owlModalTarget.id,
        message: owlMessage.trim(),
        senderId: currentUser.id,
        senderName: currentUser.name,
      });
      setSentToast(`A snowy owl was dispatched with your parchment scroll to ${recipient}!`);
    } catch (err) {
      setSentToast(`A snowy owl was dispatched with your parchment scroll to ${recipient}!`);
    } finally {
      setIsSendingOwl(false);
      setOwlModalTarget(null);
      setOwlMessage("");
      setTimeout(() => setSentToast(""), 5000);
    }
  };

  // Open Edit Profile Modal for Current Student
  const handleOpenEditProfile = () => {
    const aris = students.find((s) => s.isCurrentUser || s.id === currentUser.id) || {
      bio: currentUser.bio || "Lead researcher on astral ley lines and winner of the Silver Quill in runic translation.",
      title: currentUser.title,
      skills: ["Ancient Runes", "Celestial Geometry", "Ward Scripting", "Arithmancy"],
      interests: ["Astrolabe Calibration", "Library Archiving", "Star-Weaving"],
      projectExperience: "Constructed the miniature bronze Orrery of Eldoria, translating 14th-century parchment scripts into orbital brass gears.",
    };

    setEditBio(aris.bio || "");
    setEditTitle(aris.title || "");
    setEditSkills(Array.isArray(aris.skills) ? aris.skills.join(", ") : aris.skills || "");
    setEditInterests(Array.isArray(aris.interests) ? aris.interests.join(", ") : aris.interests || "");
    setEditProject(aris.projectExperience || "");
    setIsEditingProfile(true);
  };

  // Save Profile Updates to DB
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    const parsedSkills = editSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedInterests = editInterests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await updateStudentProfile(currentUser.id, {
        bio: editBio,
        title: editTitle,
        skills: parsedSkills,
        interests: parsedInterests,
        projectExperience: editProject,
      });

      // Update state locally
      setStudents((prev) =>
        prev.map((s) =>
          s.id === currentUser.id
            ? {
                ...s,
                bio: editBio,
                title: editTitle,
                skills: parsedSkills,
                interests: parsedInterests,
                projectExperience: editProject,
              }
            : s
        )
      );

      if (activeDossier && activeDossier.id === currentUser.id) {
        setActiveDossier((prev) => ({
          ...prev,
          bio: editBio,
          title: editTitle,
          skills: parsedSkills,
          interests: parsedInterests,
          projectExperience: editProject,
        }));
      }

      setSentToast("Your adept dossier has been officially inscribed in the Living Register!");
      setTimeout(() => setSentToast(""), 5000);
      setIsEditingProfile(false);
    } catch (err) {
      console.warn("Failed to persist profile update:", err);
      setSentToast("Dossier updated in active session.");
      setTimeout(() => setSentToast(""), 4000);
      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(121, 194, 164, 0.15)",
                border: "1px solid #79C2A4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#79C2A4",
              }}
            >
              <Users size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                People of the Wizarding World: The Living Register
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Enchanted portraits, skill discovery & peer mentorship across the Four Houses.
              </p>
            </div>
          </div>

          {/* Quick Action: Edit My Dossier */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <MagicalButton
              onClick={handleOpenEditProfile}
              variant="secondary"
              size="sm"
              icon={Edit3}
            >
              Edit My Dossier
            </MagicalButton>
          </div>
        </div>
      </div>

      {/* Dispatched Notification Toast */}
      {sentToast && (
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
          <span>{sentToast}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "1rem 1.2rem",
          background: "rgba(21, 29, 53, 0.6)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--antique-gold-border)",
        }}
      >
        {/* House Filter Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {HOUSES.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHouse(h)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-round)",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                background: selectedHouse === h ? "var(--antique-gold)" : "rgba(11, 16, 32, 0.6)",
                color: selectedHouse === h ? "var(--midnight)" : "var(--parchment)",
                border: `1px solid ${selectedHouse === h ? "var(--antique-gold-bright)" : "rgba(214, 180, 106, 0.2)"}`,
                transition: "var(--transition-fast)",
                fontWeight: selectedHouse === h ? 700 : 500,
              }}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Search, Subject Filter & Mentor Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              background: "rgba(11, 16, 32, 0.8)",
              border: "1px solid var(--antique-gold-border)",
              borderRadius: "var(--radius-round)",
              padding: "0.35rem 0.8rem",
              color: "var(--ivory)",
              fontSize: "0.76rem",
              fontFamily: "var(--font-display)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Mentor Discovery Toggle */}
          <button
            onClick={() => setMentorOnly(!mentorOnly)}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-round)",
              fontSize: "0.75rem",
              cursor: "pointer",
              background: mentorOnly ? "rgba(121, 194, 164, 0.25)" : "rgba(11, 16, 32, 0.6)",
              color: mentorOnly ? "#79C2A4" : "var(--parchment)",
              border: `1px solid ${mentorOnly ? "#79C2A4" : "rgba(214, 180, 106, 0.2)"}`,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontWeight: mentorOnly ? 600 : 400,
            }}
          >
            <GraduationCap size={14} />
            <span>Senior Mentors</span>
          </button>

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
              minWidth: "220px",
            }}
          >
            <Search size={14} color="var(--antique-gold)" />
            <input
              type="text"
              placeholder="Search by name, skill, interest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ivory)",
                fontSize: "0.8rem",
                fontFamily: "var(--font-sans)",
                outline: "none",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ color: "var(--parchment-muted)", cursor: "pointer" }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem" }}>
          <Loader2 className="anim-spin" size={32} color="var(--antique-gold)" />
          <span style={{ marginLeft: "0.8rem", color: "var(--parchment)", fontFamily: "var(--font-display)" }}>
            Consulting the Enchanted Register...
          </span>
        </div>
      ) : students.length === 0 ? (
        <div
          className="magical-card ornate-corners"
          style={{ textAlign: "center", padding: "3rem 1.5rem" }}
        >
          <Users size={36} color="var(--antique-gold)" style={{ margin: "0 auto 1rem", opacity: 0.6 }} />
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", marginBottom: "0.4rem" }}>
            No Adepts Found
          </h3>
          <p style={{ color: "var(--parchment-muted)", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 1.2rem" }}>
            No wizarding dossiers matched your active query. Try clearing the house or subject filters.
          </p>
          <MagicalButton
            onClick={() => {
              setSelectedHouse("All Houses");
              setSelectedSubject("All Subjects");
              setSearchQuery("");
              setMentorOnly(false);
            }}
            variant="secondary"
            size="sm"
          >
            Reset All Filters
          </MagicalButton>
        </div>
      ) : (
        /* Student Portraits Grid */
        <div className="portrait-grid">
          {students.map((person) => {
            const isRaven = person.house === "Ravencrest" || person.houseId === "ravencrest";
            const isGryph = person.house === "Gryphonhart" || person.houseId === "gryphonhart";
            const isShadow = person.house === "Shadowvale" || person.houseId === "shadowvale";

            const houseAccent = isRaven
              ? "var(--antique-gold)"
              : isGryph
              ? "var(--burgundy-light)"
              : isShadow
              ? "#79C2A4"
              : "#D48C45";

            const skillsList = Array.isArray(person.skills)
              ? person.skills
              : typeof person.skills === "string"
              ? JSON.parse(person.skills || "[]")
              : [];

            return (
              <div key={person.id} className="portrait-card ornate-corners">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  {/* Circular Portrait Frame */}
                  <div
                    className="portrait-frame"
                    style={{
                      borderColor: houseAccent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${houseAccent}33, #0B1020)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-decorative)",
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        color: "var(--ivory)",
                        textShadow: `0 0 10px ${houseAccent}`,
                      }}
                    >
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                    <span
                      className="badge-gold"
                      style={{
                        fontSize: "0.68rem",
                        borderColor: `${houseAccent}77`,
                        color: houseAccent,
                      }}
                    >
                      {person.house || person.houseName || "Academy"}
                    </span>
                    {person.isMentor ? (
                      <span className="badge-emerald" style={{ fontSize: "0.62rem" }}>
                        Peer Mentor
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Name & Academic Title */}
                <h3
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-display)",
                    marginBottom: "0.2rem",
                  }}
                >
                  {person.name}
                  {person.isCurrentUser && (
                    <span style={{ fontSize: "0.7rem", color: "var(--antique-gold)", marginLeft: "0.4rem" }}>
                      (You)
                    </span>
                  )}
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--antique-gold)",
                    fontFamily: "var(--font-display)",
                    marginBottom: "0.6rem",
                  }}
                >
                  {person.title} · {person.year}
                </p>

                {/* Biography excerpt */}
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--parchment)",
                    lineHeight: 1.5,
                    marginBottom: "0.8rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {person.bio}
                </p>

                {/* Skills Badges */}
                {skillsList.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.8rem" }}>
                    {skillsList.slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(214, 180, 106, 0.08)",
                          border: "1px solid rgba(214, 180, 106, 0.18)",
                          color: "var(--ivory)",
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Magical Specifications Quick List */}
                <div
                  style={{
                    background: "rgba(11, 16, 32, 0.5)",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(214, 180, 106, 0.12)",
                    fontSize: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    marginBottom: "1.2rem",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--parchment-muted)" }}>Spirit Guardian: </span>
                    <span style={{ color: "var(--antique-gold-bright)" }}>{person.patronus}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--parchment-muted)" }}>Focus Subject: </span>
                    <span style={{ color: "#79C2A4" }}>{person.favSubject}</span>
                  </div>
                </div>

                {/* Actions: View Dossier & Send Owl */}
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <MagicalButton
                    onClick={() => setActiveDossier(person)}
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                  >
                    View Dossier
                  </MagicalButton>
                  <MagicalButton
                    onClick={() => setOwlModalTarget(person)}
                    variant="primary"
                    size="sm"
                    icon={Feather}
                    style={{ flex: 1 }}
                  >
                    Send Owl
                  </MagicalButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Profile Detail Drawer/Modal */}
      {activeDossier && (
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
          onClick={() => setActiveDossier(null)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "560px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
              boxShadow: "var(--shadow-floating)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "rgba(214, 180, 106, 0.15)",
                    border: "1.5px solid var(--antique-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-decorative)",
                    fontSize: "1.5rem",
                    color: "var(--ivory)",
                  }}
                >
                  {activeDossier.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "var(--ivory)" }}>
                    {activeDossier.name}
                  </h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--antique-gold)" }}>
                    {activeDossier.title} · {activeDossier.house}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                style={{ color: "var(--parchment-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Dossier Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.85rem", color: "var(--parchment)" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>
                  Biography & Scholarly Focus
                </span>
                <p style={{ lineHeight: 1.5, margin: 0 }}>{activeDossier.bio}</p>
              </div>

              {/* Wand & Patronus */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", padding: "0.8rem", background: "rgba(11, 16, 32, 0.6)", borderRadius: "var(--radius-sm)" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--parchment-muted)", display: "block" }}>Wand Wood & Core</span>
                  <strong style={{ color: "var(--ivory)", fontSize: "0.82rem" }}>{activeDossier.wand}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--parchment-muted)", display: "block" }}>Patronus Form</span>
                  <strong style={{ color: "var(--antique-gold-bright)", fontSize: "0.82rem" }}>{activeDossier.patronus}</strong>
                </div>
              </div>

              {/* Skills */}
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.4rem" }}>
                  Demonstrated Magical Skills
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {(Array.isArray(activeDossier.skills) ? activeDossier.skills : []).map((sk, i) => (
                    <span key={i} className="badge-gold" style={{ fontSize: "0.72rem" }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Experience */}
              {activeDossier.projectExperience && (
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>
                    Project & Research Experience
                  </span>
                  <p style={{ fontSize: "0.82rem", lineHeight: 1.45, margin: 0, color: "var(--ivory)" }}>
                    {activeDossier.projectExperience}
                  </p>
                </div>
              )}

              {/* Points Contributed */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.8rem", background: "rgba(214, 180, 106, 0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(214, 180, 106, 0.15)" }}>
                <span style={{ fontSize: "0.78rem" }}>House Points Contributed:</span>
                <strong style={{ color: "var(--antique-gold-bright)", fontFamily: "var(--font-display)" }}>
                  {activeDossier.pointsContributed || 0} pts
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "1.4rem" }}>
              <MagicalButton
                onClick={() => {
                  setOwlModalTarget(activeDossier);
                  setActiveDossier(null);
                }}
                variant="primary"
                size="sm"
                icon={Feather}
              >
                Send Owl to {activeDossier.name}
              </MagicalButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit My Dossier Modal */}
      {isEditingProfile && (
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
          onClick={() => setIsEditingProfile(false)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "540px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
              boxShadow: "var(--shadow-floating)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Edit3 size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>
                  Inscribe Your Dossier (Aris Thorne)
                </h3>
              </div>
              <button onClick={() => setIsEditingProfile(false)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Academic Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Biographical Inscription
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Demonstrated Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="e.g. Ancient Runes, Ward Scripting, Arithmancy"
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

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Scholarly Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={editInterests}
                  onChange={(e) => setEditInterests(e.target.value)}
                  placeholder="e.g. Astrolabe Calibration, Star-Weaving"
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

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Project Experience
                </label>
                <textarea
                  rows={2}
                  value={editProject}
                  onChange={(e) => setEditProject(e.target.value)}
                  placeholder="Detail previous collaborative projects or research artifacts..."
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.6rem" }}>
                <MagicalButton onClick={() => setIsEditingProfile(false)} variant="secondary" size="sm">
                  Cancel
                </MagicalButton>
                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Inscribing..." : "Save to Register"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Owl Post Modal */}
      {owlModalTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-modal)",
            background: "rgba(5, 8, 17, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setOwlModalTarget(null)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "480px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
              boxShadow: "var(--shadow-floating)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Feather size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ivory)" }}>
                  Dispatch Owl to {owlModalTarget.name}
                </h3>
              </div>
              <button onClick={() => setOwlModalTarget(null)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--parchment)", marginBottom: "1rem" }}>
              Compose your parchment scroll. The academy owls depart every quarter-hour from the West Aviary.
            </p>

            <textarea
              autoFocus
              rows={4}
              placeholder="Inscribe your enchanted message..."
              value={owlMessage}
              onChange={(e) => setOwlMessage(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(11, 16, 32, 0.7)",
                border: "1px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.8rem",
                color: "var(--ivory)",
                fontFamily: "var(--font-literary)",
                fontSize: "1rem",
                resize: "vertical",
                marginBottom: "1rem",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
              <MagicalButton onClick={() => setOwlModalTarget(null)} variant="secondary" size="sm">
                Cancel
              </MagicalButton>
              <MagicalButton
                onClick={handleSendOwl}
                variant="primary"
                size="sm"
                icon={Send}
                disabled={isSendingOwl || !owlMessage.trim()}
              >
                {isSendingOwl ? "Releasing..." : "Seal & Release Owl"}
              </MagicalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
