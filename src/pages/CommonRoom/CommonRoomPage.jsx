import React, { useState, useEffect } from "react";
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
  Search,
  CheckCircle2,
  Share2
} from "lucide-react";
import { getCommunityPosts, createCommunityPost, signCommunityPost } from "../../services/api";
import { currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./CommonRoomPage.css";

const CATEGORIES = ["All", "Study Circle", "Sports Gathering", "Academic Collaboration", "Lost Artifact"];

export default function CommonRoomPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("Study Circle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    getCommunityPosts(activeCategory)
      .then((data) => {
        if (mounted && Array.isArray(data)) setPosts(data);
      })
      .catch((err) => console.warn("Using fallback posts:", err));
    return () => { mounted = false; };
  }, [activeCategory]);

  const toggleSign = async (id) => {
    try {
      await signCommunityPost(id);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const nextSigned = !p.isSigned;
            return {
              ...p,
              isSigned: nextSigned,
              signatures: nextSigned ? p.signatures + 1 : Math.max(0, p.signatures - 1),
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Sign error:", err);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createCommunityPost(newTitle, newBody, newCategory);
      setPosts([created, ...posts]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewBody("");
      setToastMessage("Your parchment notice has been pinned to the Hearth Notice Board!");
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="common-room-container anim-fade-in-up">
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(212, 140, 69, 0.15)",
                border: "1px solid #D48C45",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D48C45",
              }}
            >
              <Flame size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Wizarding Social Network: The Hearthside Notice Board
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Parchment notices, peer study circles, sports squad formations & academy fellowship.
              </p>
            </div>
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

      {/* Success Toast */}
      {toastMessage && (
        <div className="common-toast-banner anim-fade-in-up">
          <CheckCircle2 size={18} color="#79C2A4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="common-filters-bar">
        <div className="common-search-box">
          <Search size={15} color="var(--parchment-muted)" />
          <input
            type="text"
            placeholder="Search parchment notices by topic, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="common-category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-chip ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Board Parchments Grid */}
      <div className="notices-board-grid">
        {filteredPosts.length === 0 ? (
          <div style={{ color: "var(--parchment-muted)", textAlign: "center", padding: "3rem", gridColumn: "1 / -1" }}>
            No hearth notices pinned under this category. Be the first to inscribe one!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="parchment-notice-card ornate-corners">
              <div className="notice-pin-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Pin size={15} color="var(--antique-gold)" />
                  <span className="badge-gold" style={{ fontSize: "0.68rem" }}>{post.category}</span>
                </div>
                <span className="notice-timestamp">{post.createdAt || post.date || "Today"}</span>
              </div>

              <h3 className="notice-title">{post.title}</h3>
              <p className="notice-body">{post.body}</p>

              <div className="notice-footer">
                <div className="notice-author">
                  <span className="author-name">{post.author}</span>
                  <span className="author-house">({post.house || "Academy Adept"})</span>
                </div>

                <button
                  onClick={() => toggleSign(post.id)}
                  className={`sign-notice-btn ${post.isSigned ? "signed" : ""}`}
                >
                  <Heart size={14} fill={post.isSigned ? "var(--burgundy-bright)" : "none"} />
                  <span>{post.signatures || 0} Endorsements</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inscribe Notice Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="inscribe-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Flame size={20} color="#D48C45" />
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "1.25rem" }}>
                  Pin a Parchment to the Hearth Board
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="inscribe-form">
              <div className="form-group">
                <label>Notice Category:</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject / Title:</label>
                <input
                  type="text"
                  placeholder="e.g., C2S Lab Verilog Review Circle..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parchment Inscription:</label>
                <textarea
                  rows={4}
                  placeholder="Detail your study circle, sports practice, or collaborative announcement..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <MagicalButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  icon={Pin}
                >
                  {isSubmitting ? "Pinning Notice..." : "Pin Notice to Board"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
