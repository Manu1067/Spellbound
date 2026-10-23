import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  ArrowLeft,
  Pin,
  Plus,
  Heart,
  MessageSquare,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import MagicalButton from "../../components/ui/MagicalButton";
import "./CommonRoomPage.css";

const INITIAL_NOTICES = [
  {
    id: "note-1",
    author: "Lyra Valerius",
    house: "Ravencrest",
    category: "Study Circle",
    title: "Ancient Runes Review for Eldoria Exam",
    body: "Meeting tonight in the West Alcove at 20:00. Bring your copper translation styluses. Herbal tea provided.",
    signatures: 8,
    isSigned: false,
    date: "1 hour ago",
  },
  {
    id: "note-2",
    author: "Cedric Blackthorn",
    house: "Gryphonhart",
    category: "Sports Gathering",
    title: "Skyspire Slalom Practice Squad",
    body: "Looking for two Chasers to practice crosswind evasions before Thursday's gale storm. High speed guaranteed.",
    signatures: 14,
    isSigned: true,
    date: "3 hours ago",
  },
  {
    id: "note-3",
    author: "Thaddeus Thorne",
    house: "Emberwyrm",
    category: "Lost Artifact",
    title: "Missing: Brass Armillary Lens",
    body: "Misplaced near the Greenhouse 4 fountain. It whispers when pointed toward Orion. Generous reward of mandrake tea.",
    signatures: 5,
    isSigned: false,
    date: "Yesterday",
  },
  {
    id: "note-4",
    author: "Isolde Ravenshadow",
    house: "Shadowvale",
    category: "Alchemical Trade",
    title: "Trading Crushed Moonstone for Phoenix Ash",
    body: "Have 3 drams of purified lunar dust. Looking to exchange for fresh pyrotechnic feather embers for potion finals.",
    signatures: 7,
    isSigned: false,
    date: "Yesterday",
  },
];

export default function CommonRoomPage() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("Study Circle");

  const toggleSign = (id) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isSigned: !n.isSigned,
              signatures: n.isSigned ? n.signatures - 1 : n.signatures + 1,
            }
          : n
      )
    );
  };

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: "Aris Thorne",
      house: "Ravencrest",
      category: newCategory,
      title: newTitle,
      body: newBody,
      signatures: 1,
      isSigned: true,
      date: "Just now",
    };

    setNotices([newNote, ...notices]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewBody("");
  };

  return (
    <div className="common-room-container anim-fade-in-up">
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
              background: "rgba(212, 140, 69, 0.2)",
              border: "1px solid #D48C45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D48C45",
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
              Wizarding Social Network: The Hearthside Noticeboard
            </h1>
            <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
              Hearthside fellowship, quill notices & study circles by the crackling flame.
            </p>
          </div>
        </div>
      </div>

      {/* Hearthside Banner */}
      <div className="hearth-banner ornate-corners">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: "0.5rem" }}>
              Ravencrest Common Room Lounge
            </span>
            <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.4rem" }}>
              The Pinned Parchments
            </h2>
            <p style={{ color: "var(--parchment)", fontSize: "0.92rem", maxWidth: "600px" }}>
              Pin notes to find study partners, request rare potion reagents, or rally peers for campus excursions.
            </p>
          </div>

          <MagicalButton
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="md"
            icon={Plus}
          >
            Inscribe a Notice
          </MagicalButton>
        </div>
      </div>

      {/* Pinned Parchment Notes Grid */}
      <div className="notice-board-grid">
        {notices.map((note) => (
          <div key={note.id} className="parchment-sticky-note">
            <div className="pin-tack" />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#6A532E" }}>
                {note.category}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#6A532E" }}>{note.date}</span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.08rem",
                color: "#18120C",
                marginBottom: "0.6rem",
                lineHeight: 1.3,
              }}
            >
              {note.title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-literary)",
                fontSize: "1.05rem",
                color: "#2B2117",
                lineHeight: 1.5,
                marginBottom: "1.2rem",
              }}
            >
              {note.body}
            </p>

            <div
              style={{
                borderTop: "1px dashed rgba(60, 40, 20, 0.3)",
                paddingTop: "0.6rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.78rem",
              }}
            >
              <span style={{ fontWeight: 600, color: "#443422" }}>
                ~ {note.author} ({note.house})
              </span>

              <button
                onClick={() => toggleSign(note.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  background: note.isSigned ? "#AA8438" : "rgba(60, 40, 20, 0.15)",
                  color: note.isSigned ? "#FFF" : "#2B2117",
                  padding: "0.25rem 0.55rem",
                  borderRadius: "var(--radius-round)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
              >
                <Heart size={12} fill={note.isSigned ? "#FFF" : "none"} />
                <span>{note.signatures} Signs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Inscribe New Notice */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
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
                <Pin size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ivory)" }}>
                  Inscribe Notice to the Hearth
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostNotice} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                  }}
                >
                  <option value="Study Circle">Study Circle</option>
                  <option value="Lost Artifact">Lost Artifact</option>
                  <option value="Sports Gathering">Sports Gathering</option>
                  <option value="Alchemical Trade">Alchemical Trade</option>
                  <option value="Campus Excursion">Campus Excursion</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seeking Study Partner for Arithmancy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.3rem" }}>
                  Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Write details with location and time..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.7)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-literary)",
                    fontSize: "1rem",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.5rem" }}>
                <MagicalButton onClick={() => setIsModalOpen(false)} variant="secondary" size="sm">
                  Discard
                </MagicalButton>
                <MagicalButton type="submit" variant="primary" size="sm" icon={Pin}>
                  Pin to Hearth
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
