import React, { useState } from "react";
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
} from "lucide-react";
import { studentDirectory } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./PeoplePage.css";

const HOUSES = ["All Houses", "Ravencrest", "Gryphonhart", "Shadowvale", "Emberwyrm"];

export default function PeoplePage() {
  const [selectedHouse, setSelectedHouse] = useState("All Houses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDossier, setActiveDossier] = useState(null);
  const [owlModalTarget, setOwlModalTarget] = useState(null);
  const [owlMessage, setOwlMessage] = useState("");
  const [sentToast, setSentToast] = useState("");

  const filteredStudents = studentDirectory.filter((s) => {
    const matchesHouse = selectedHouse === "All Houses" || s.house === selectedHouse;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.favSubject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHouse && matchesQuery;
  });

  const handleSendOwl = (e) => {
    e.preventDefault();
    if (!owlMessage.trim()) return;
    const recipient = owlModalTarget.name;
    setOwlModalTarget(null);
    setOwlMessage("");
    setSentToast(`A snowy owl was dispatched with your parchment scroll to ${recipient}!`);
    setTimeout(() => setSentToast(""), 5000);
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

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
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
              Gilded portraits, lineage records & magical companions across the Four Houses.
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
            fontSize: "0.86rem",
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
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {HOUSES.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHouse(h)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-round)",
                fontFamily: "var(--font-display)",
                fontSize: "0.76rem",
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
            placeholder="Search adepts by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--ivory)",
              fontSize: "0.82rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Student Portraits Grid */}
      <div className="portrait-grid">
        {filteredStudents.map((person) => {
          const isRaven = person.house === "Ravencrest";
          const isGryph = person.house === "Gryphonhart";
          const isShadow = person.house === "Shadowvale";

          const houseAccent = isRaven
            ? "var(--antique-gold)"
            : isGryph
            ? "var(--burgundy-light)"
            : isShadow
            ? "#79C2A4"
            : "#D48C45";

          return (
            <div key={person.id} className="portrait-card ornate-corners">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* Circular Portrait Frame with Initials / Motif */}
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
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>

                <span
                  className="badge-gold"
                  style={{
                    fontSize: "0.68rem",
                    borderColor: `${houseAccent}77`,
                    color: houseAccent,
                  }}
                >
                  {person.house}
                </span>
              </div>

              {/* Name & Academic Title */}
              <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.2rem" }}>
                {person.name}
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--antique-gold)", fontFamily: "var(--font-display)", marginBottom: "0.6rem" }}>
                {person.title} · {person.year}
              </p>

              {/* Biography excerpt */}
              <p style={{ fontSize: "0.85rem", color: "var(--parchment)", lineHeight: 1.5, marginBottom: "1rem" }}>
                {person.bio}
              </p>

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
                  <span style={{ color: "var(--parchment-muted)" }}>Wand: </span>
                  <span style={{ color: "var(--ivory)" }}>{person.wand}</span>
                </div>
                <div>
                  <span style={{ color: "var(--parchment-muted)" }}>Spirit Guardian: </span>
                  <span style={{ color: "var(--antique-gold-bright)" }}>{person.patronus}</span>
                </div>
                <div>
                  <span style={{ color: "var(--parchment-muted)" }}>Focus Subject: </span>
                  <span style={{ color: "#79C2A4" }}>{person.favSubject}</span>
                </div>
              </div>

              {/* Actions: Send Owl Dispatch */}
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <MagicalButton
                  onClick={() => setOwlModalTarget(person)}
                  variant="primary"
                  size="sm"
                  icon={Feather}
                  style={{ flex: 1 }}
                >
                  Send Owl Post
                </MagicalButton>
              </div>
            </div>
          );
        })}
      </div>

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
              <MagicalButton onClick={handleSendOwl} variant="primary" size="sm" icon={Send}>
                Seal & Release Owl
              </MagicalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
