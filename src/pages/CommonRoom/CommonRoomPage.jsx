import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  ArrowLeft,
  Pin,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Users,
  X,
  Search,
  CheckCircle2,
  Share2,
  Send,
  MessageSquare,
  Compass
} from "lucide-react";
import { getCommunityPosts, createCommunityPost, reactToCommunityPost } from "../../services/api";
import { currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./CommonRoomPage.css";

const CATEGORIES = [
  "All",
  "Study Circle",
  "Sports Gathering",
  "Academic Collaboration",
  "Project Partnering",
  "Lost Artifact",
  "General Fellowship"
];

export default function CommonRoomPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quick Post Composer state
  const [quickTitle, setQuickTitle] = useState("");
  const [quickBody, setQuickBody] = useState("");
  const [quickCategory, setQuickCategory] = useState("Study Circle");
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  // Modal Composer state
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalCategory, setModalCategory] = useState("Academic Collaboration");
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

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

  // Handle Like or Dislike Reaction
  const handleReaction = async (postId, reactionType) => {
    // 1. Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        let newLikes = p.likes || 0;
        let newDislikes = p.dislikes || 0;
        let newUserReaction = p.userReaction;

        if (p.userReaction === reactionType) {
          // Toggle off
          if (reactionType === "like") newLikes = Math.max(0, newLikes - 1);
          if (reactionType === "dislike") newDislikes = Math.max(0, newDislikes - 1);
          newUserReaction = null;
        } else {
          // Switching or new
          if (reactionType === "like") {
            newLikes += 1;
            if (p.userReaction === "dislike") newDislikes = Math.max(0, newDislikes - 1);
            newUserReaction = "like";
          } else {
            newDislikes += 1;
            if (p.userReaction === "like") newLikes = Math.max(0, newLikes - 1);
            newUserReaction = "dislike";
          }
        }

        return {
          ...p,
          likes: newLikes,
          dislikes: newDislikes,
          userReaction: newUserReaction,
        };
      })
    );

    // 2. Persist to API
    try {
      await reactToCommunityPost(postId, reactionType);
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  // Submit Quick Post
  const handleQuickPost = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickBody.trim()) return;

    setIsQuickSubmitting(true);
    try {
      const created = await createCommunityPost(quickTitle.trim(), quickBody.trim(), quickCategory);
      setPosts([created, ...posts]);
      setQuickTitle("");
      setQuickBody("");
      setToastMessage("✦ Your parchment notice has been pinned to the Hearth Notice Board! Scholars can now react.");
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  // Submit Modal Post
  const handleModalPost = async (e) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalBody.trim()) return;

    setIsModalSubmitting(true);
    try {
      const created = await createCommunityPost(modalTitle.trim(), modalBody.trim(), modalCategory);
      setPosts([created, ...posts]);
      setIsModalOpen(false);
      setModalTitle("");
      setModalBody("");
      setToastMessage("✦ Your parchment notice has been pinned to the Hearth Notice Board! Scholars can now react.");
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesQuery =
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.body || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.author || "").toLowerCase().includes(searchQuery.toLowerCase());
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

        {/* Cinematic Wizarding Social Network Hero Banner */}
        <div className="dept-hero-banner ornate-corners">
          <img
            src="/assets/departments/wizarding_social_network_hero.png"
            alt="Wizarding Social Network & Common Room"
            className="dept-hero-image"
          />
          <div className="dept-hero-gradient" />
          <div className="dept-hero-content">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "0.5rem" }}>
              <span className="badge-gold">
                Hearthside Fellowship & Community Board
              </span>
              <MagicalButton
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                size="sm"
                icon={Plus}
              >
                Inscribe Parchment Notice
              </MagicalButton>
            </div>
            <h1 className="dept-hero-title">
              Wizarding Social Network: Hearthside Fellowship & Discussions
            </h1>
            <p className="dept-hero-subtitle">
              Inscribe notices, form study circles, seek project partners, and react to fellow scholars with likes and reactions.
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="common-toast-banner anim-fade-in-up">
          <CheckCircle2 size={18} color="#79C2A4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Prominent Quick Inscription Composer (Direct Social Networking) */}
      <div className="quick-composer-card ornate-corners anim-fade-in-up">
        <div className="composer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} color="var(--antique-gold-bright)" />
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.05rem" }}>
              Inscribe a Parchment Notice to Connect with Scholars
            </h3>
          </div>
          <span className="badge-gold">
            Posting as {currentUser.name} ({currentUser.house})
          </span>
        </div>

        <form onSubmit={handleQuickPost} className="quick-composer-form">
          <div className="composer-inputs-row">
            <div className="composer-field" style={{ flex: 2 }}>
              <input
                type="text"
                placeholder="Notice Subject (e.g., C2S Lab Verilog Review Circle / Seeking Badminton Doubles Partner)..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                required
              />
            </div>

            <div className="composer-field" style={{ flex: 1, minWidth: "180px" }}>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="composer-field">
            <textarea
              rows={3}
              placeholder="Inscribe your parchment message with quill and enchanted ink. Detail meeting times, locations, project requirements, or ideas..."
              value={quickBody}
              onChange={(e) => setQuickBody(e.target.value)}
              required
            />
          </div>

          <div className="composer-actions-bar">
            <span style={{ fontSize: "0.78rem", color: "var(--parchment-muted)" }}>
              ✦ Pinned scrolls appear instantly across the Academy and accept peer reactions.
            </span>
            <MagicalButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isQuickSubmitting || !quickTitle.trim() || !quickBody.trim()}
              icon={Send}
            >
              {isQuickSubmitting ? "Pinning Scroll..." : "Post Notice to Hearth Board"}
            </MagicalButton>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="common-filters-bar">
        <div className="common-search-box">
          <Search size={15} color="var(--parchment-muted)" />
          <input
            type="text"
            placeholder="Search parchment notices by topic, scholar name, or keywords..."
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
            No hearth notices found matching your criteria. Use the composer above to inscribe the first parchment!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const likesCount = Number(post.likes) || 0;
            const dislikesCount = Number(post.dislikes) || 0;
            const totalReactions = likesCount + dislikesCount;
            const approvalRatio = totalReactions > 0 ? Math.round((likesCount / totalReactions) * 100) : 100;

            const isLiked = post.userReaction === "like";
            const isDisliked = post.userReaction === "dislike";

            return (
              <div key={post.id} className="parchment-notice-card ornate-corners">
                <div className="notice-pin-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Pin size={15} color="var(--antique-gold)" />
                    <span className="badge-gold" style={{ fontSize: "0.68rem" }}>{post.category}</span>
                  </div>
                  <span className="notice-timestamp">{post.createdAt || "Today"}</span>
                </div>

                <h3 className="notice-title">{post.title}</h3>
                <p className="notice-body">{post.body}</p>

                <div className="notice-footer">
                  <div className="notice-author">
                    <span className="author-name">{post.author}</span>
                    <span className="author-house">({post.house || "Academy Scholar"})</span>
                  </div>

                  {/* Like & Dislike Reaction Controls */}
                  <div className="reactions-container">
                    {/* Like Button */}
                    <button
                      onClick={() => handleReaction(post.id, "like")}
                      className={`reaction-btn like-btn ${isLiked ? "active" : ""}`}
                      title={isLiked ? "Undo Like" : "Like this notice"}
                      aria-label="Like notice"
                    >
                      <ThumbsUp size={14} fill={isLiked ? "#79C2A4" : "none"} />
                      <span>{likesCount}</span>
                    </button>

                    {/* Dislike Button */}
                    <button
                      onClick={() => handleReaction(post.id, "dislike")}
                      className={`reaction-btn dislike-btn ${isDisliked ? "active" : ""}`}
                      title={isDisliked ? "Undo Dislike" : "Dislike this notice"}
                      aria-label="Dislike notice"
                    >
                      <ThumbsDown size={14} fill={isDisliked ? "#E05A47" : "none"} />
                      <span>{dislikesCount}</span>
                    </button>

                    {/* Resonance Bar Tooltip */}
                    <div className="resonance-indicator" title={`${approvalRatio}% Positive Resonance`}>
                      <div className="resonance-bar-track">
                        <div
                          className="resonance-bar-fill"
                          style={{
                            width: `${approvalRatio}%`,
                            backgroundColor: approvalRatio >= 70 ? "#79C2A4" : "#D48C45"
                          }}
                        />
                      </div>
                      <span className="resonance-text">{approvalRatio}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full Modal Inscription */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="inscribe-modal ornate-corners" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Flame size={20} color="#D48C45" />
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "1.25rem" }}>
                  Inscribe a Parchment Notice
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalPost} className="inscribe-form">
              <div className="form-group">
                <label>Notice Category:</label>
                <select value={modalCategory} onChange={(e) => setModalCategory(e.target.value)}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject / Topic Title:</label>
                <input
                  type="text"
                  placeholder="e.g., C2S Lab Verilog Review Circle..."
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parchment Inscription Body:</label>
                <textarea
                  rows={4}
                  placeholder="Detail your study circle, sports practice, or collaborative announcement..."
                  value={modalBody}
                  onChange={(e) => setModalBody(e.target.value)}
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
                  disabled={isModalSubmitting}
                  icon={Pin}
                >
                  {isModalSubmitting ? "Pinning Notice..." : "Pin Notice to Board"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
