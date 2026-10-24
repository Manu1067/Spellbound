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
  Flag,
  Check,
  Send,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  fetchCommunityPosts,
  createCommunityPost,
  signCommunityPost,
  fetchPostReplies,
  createPostReply,
  reportCommunityPost,
  fetchCommunities,
  toggleJoinCommunity,
} from "../../services/api";
import { currentUser } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./CommonRoomPage.css";

const CATEGORIES = ["All", "Study Circle", "Sports Gathering", "Lost Artifact", "Alchemical Trade", "Project Collab"];

export default function CommonRoomPage() {
  const [activeTab, setActiveTab] = useState("notices"); // 'notices' | 'groups'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notices, setNotices] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionToast, setActionToast] = useState("");

  // Create Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("Study Circle");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Threaded Replies State: Map of postId -> { open: boolean, replies: [], newReply: '', loading: boolean }
  const [threadState, setThreadState] = useState({});

  // Report Modal State
  const [reportTargetPost, setReportTargetPost] = useState(null);
  const [reportReason, setReportReason] = useState("Disruptive or inappropriate spellcraft");

  // Load notices & communities
  const loadContent = async () => {
    setLoading(true);
    try {
      const [postsData, groupsData] = await Promise.all([
        fetchCommunityPosts(selectedCategory).catch(() => []),
        fetchCommunities().catch(() => []),
      ]);

      setNotices(Array.isArray(postsData) ? postsData : []);
      setCommunities(Array.isArray(groupsData) ? groupsData : []);
    } catch (err) {
      console.warn("Error loading common room content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  // Toggle Signing / Endorsing Notice
  const handleToggleSign = async (postId) => {
    try {
      const res = await signCommunityPost(postId, currentUser.id);
      setNotices((prev) =>
        prev.map((n) =>
          n.id === postId
            ? {
                ...n,
                isSigned: res.isSigned,
                signatures: res.signatures,
              }
            : n
        )
      );
    } catch (err) {
      console.warn("Sign failed locally:", err);
      // Fallback local toggle
      setNotices((prev) =>
        prev.map((n) =>
          n.id === postId
            ? {
                ...n,
                isSigned: !n.isSigned,
                signatures: n.isSigned ? Math.max(0, n.signatures - 1) : n.signatures + 1,
              }
            : n
        )
      );
    }
  };

  // Create New Notice
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsSubmittingPost(true);
    try {
      const newPost = await createCommunityPost({
        authorId: currentUser.id,
        authorName: currentUser.name,
        houseId: currentUser.house.toLowerCase(),
        category: newCategory,
        title: newTitle.trim(),
        body: newBody.trim(),
      });

      setNotices((prev) => [newPost, ...prev]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewBody("");
      setActionToast("✨ Your notice was inscribed with enchanted golden ink!");
      setTimeout(() => setActionToast(""), 5000);
    } catch (err) {
      alert(`Post creation error: ${err.message}`);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Toggle Threaded Replies Accordion
  const toggleThreadReplies = async (postId) => {
    const currentState = threadState[postId] || { open: false, replies: [], newReply: "", loading: false };
    const willOpen = !currentState.open;

    setThreadState((prev) => ({
      ...prev,
      [postId]: {
        ...currentState,
        open: willOpen,
        loading: willOpen && currentState.replies.length === 0,
      },
    }));

    if (willOpen && currentState.replies.length === 0) {
      try {
        const replies = await fetchPostReplies(postId);
        setThreadState((prev) => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            replies: Array.isArray(replies) ? replies : [],
            loading: false,
          },
        }));
      } catch (err) {
        console.warn("Failed to load replies:", err);
        setThreadState((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], loading: false },
        }));
      }
    }
  };

  // Submit Threaded Reply
  const handleSendReply = async (postId) => {
    const thread = threadState[postId];
    if (!thread || !thread.newReply?.trim()) return;

    const replyBody = thread.newReply.trim();
    try {
      const createdReply = await createPostReply(postId, {
        authorId: currentUser.id,
        authorName: currentUser.name,
        houseId: currentUser.house.toLowerCase(),
        body: replyBody,
      });

      setThreadState((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          replies: [...(prev[postId]?.replies || []), createdReply],
          newReply: "",
        },
      }));

      // Update reply count on card
      setNotices((prev) =>
        prev.map((n) =>
          n.id === postId ? { ...n, repliesCount: (n.repliesCount || 0) + 1 } : n
        )
      );
    } catch (err) {
      console.warn("Reply error:", err);
    }
  };

  // Report Notice to Moderation
  const handleConfirmReport = async () => {
    if (!reportTargetPost) return;
    try {
      const res = await reportCommunityPost(reportTargetPost.id, reportReason);
      setNotices((prev) => prev.filter((n) => n.id !== reportTargetPost.id));
      setActionToast(res.message || "Parchment notice transmitted to House Prefect for moderation.");
    } catch (err) {
      setNotices((prev) => prev.filter((n) => n.id !== reportTargetPost.id));
      setActionToast("Parchment notice removed for moderation review.");
    } finally {
      setReportTargetPost(null);
      setTimeout(() => setActionToast(""), 5000);
    }
  };

  // Toggle Join Community Group
  const handleToggleJoin = async (communityId) => {
    try {
      const updated = await toggleJoinCommunity(communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? {
                ...c,
                isJoined: updated.isJoined,
                memberCount: updated.memberCount,
              }
            : c
        )
      );
      setActionToast(
        updated.isJoined
          ? `Joined community circle! You now receive owl updates.`
          : `Left community circle.`
      );
      setTimeout(() => setActionToast(""), 4000);
    } catch (err) {
      console.warn("Join community failed:", err);
    }
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
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
              <Flame size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Wizarding Social Network: Hearth & Notice Board
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Hearthside fellowship, parchment notice boards, threaded discussions & study circles.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <MagicalButton
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
              icon={Plus}
            >
              Inscribe a Notice
            </MagicalButton>
          </div>
        </div>
      </div>

      {/* Atmospheric Hearth Banner */}
      <div className="hearth-banner ornate-corners">
        <div style={{ maxWidth: "620px" }}>
          <span className="badge-gold" style={{ marginBottom: "0.6rem" }}>
            Crackling Hearthfire Lounge · West Chamber
          </span>
          <h2 style={{ fontSize: "1.5rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            The Fellowship of the Four Common Rooms
          </h2>
          <p style={{ color: "var(--parchment)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            Parchment scrolls pinned here flutter with magical resonance. Sign notices with your quill to pledge assistance,
            join project collaboration guilds, or ask questions in threaded discussions.
          </p>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionToast && (
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
          <span>{actionToast}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--antique-gold-border)", paddingBottom: "0.6rem" }}>
        <button
          onClick={() => setActiveTab("notices")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-display)",
            fontSize: "0.82rem",
            cursor: "pointer",
            background: activeTab === "notices" ? "rgba(214, 180, 106, 0.15)" : "transparent",
            color: activeTab === "notices" ? "var(--antique-gold)" : "var(--parchment-muted)",
            border: `1px solid ${activeTab === "notices" ? "var(--antique-gold)" : "transparent"}`,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontWeight: activeTab === "notices" ? 700 : 500,
          }}
        >
          <Pin size={15} />
          <span>Notice Board & Discussions ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("groups")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-display)",
            fontSize: "0.82rem",
            cursor: "pointer",
            background: activeTab === "groups" ? "rgba(214, 180, 106, 0.15)" : "transparent",
            color: activeTab === "groups" ? "var(--antique-gold)" : "var(--parchment-muted)",
            border: `1px solid ${activeTab === "groups" ? "var(--antique-gold)" : "transparent"}`,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontWeight: activeTab === "groups" ? 700 : 500,
          }}
        >
          <Users size={15} />
          <span>Communities & Collaboration Groups ({communities.length})</span>
        </button>
      </div>

      {/* Tab 1: Notice Board */}
      {activeTab === "notices" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-round)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  background: selectedCategory === cat ? "var(--antique-gold)" : "rgba(11, 16, 32, 0.6)",
                  color: selectedCategory === cat ? "var(--midnight)" : "var(--parchment)",
                  border: `1px solid ${selectedCategory === cat ? "var(--antique-gold-bright)" : "rgba(214, 180, 106, 0.2)"}`,
                  fontWeight: selectedCategory === cat ? 700 : 500,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notices Grid */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
              <Loader2 className="anim-spin" size={28} color="var(--antique-gold)" />
              <span style={{ marginLeft: "0.8rem", color: "var(--parchment)" }}>Reading enchanted notice parchment...</span>
            </div>
          ) : notices.length === 0 ? (
            <div className="magical-card ornate-corners" style={{ textAlign: "center", padding: "3rem" }}>
              <Pin size={32} color="var(--antique-gold)" style={{ margin: "0 auto 0.8rem", opacity: 0.6 }} />
              <h3 style={{ color: "var(--ivory)", fontFamily: "var(--font-display)" }}>Notice Board is Clear</h3>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.85rem" }}>
                No active parchment notices in this category. Click 'Inscribe a Notice' to pin the first one.
              </p>
            </div>
          ) : (
            <div className="notice-board-grid">
              {notices.map((n) => {
                const thread = threadState[n.id] || { open: false, replies: [], newReply: "", loading: false };
                return (
                  <div key={n.id} className="parchment-sticky-note">
                    <div className="pin-tack" />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem", marginTop: "0.4rem" }}>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "#7D5D26",
                          borderBottom: "1px dashed #B89C6A",
                        }}
                      >
                        {n.category}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.68rem", color: "#665440" }}>
                          {n.date || "Today"}
                        </span>
                        {/* Report Moderation Button */}
                        <button
                          onClick={() => setReportTargetPost(n)}
                          title="Report to Prefect"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#9C4242",
                            cursor: "pointer",
                            padding: "2px",
                          }}
                        >
                          <Flag size={12} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "#1E1610", marginBottom: "0.4rem" }}>
                      {n.title}
                    </h3>

                    <p style={{ fontSize: "0.88rem", fontFamily: "var(--font-literary)", lineHeight: 1.45, color: "#2E2419", marginBottom: "0.8rem" }}>
                      {n.body}
                    </p>

                    <div style={{ fontSize: "0.75rem", color: "#544330", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "0.5rem" }}>
                      <Link
                        to={`/people`}
                        style={{ textDecoration: "none", color: "#6E4416", fontWeight: 600 }}
                      >
                        ~ {n.author} ({n.house})
                      </Link>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {/* Sign Post */}
                        <button
                          onClick={() => handleToggleSign(n.id)}
                          style={{
                            background: n.isSigned ? "rgba(110, 68, 22, 0.2)" : "transparent",
                            border: "1px solid rgba(110, 68, 22, 0.4)",
                            borderRadius: "var(--radius-round)",
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.7rem",
                            color: "#4A3317",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontWeight: 600,
                          }}
                        >
                          <Heart size={12} color={n.isSigned ? "#A63D40" : "#4A3317"} fill={n.isSigned ? "#A63D40" : "none"} />
                          <span>{n.signatures || 0} signed</span>
                        </button>
                      </div>
                    </div>

                    {/* Threaded Discussion Accordion Trigger */}
                    <div style={{ marginTop: "0.8rem", borderTop: "1px dashed rgba(0,0,0,0.15)", paddingTop: "0.5rem" }}>
                      <button
                        onClick={() => toggleThreadReplies(n.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#4A3317",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <MessageSquare size={13} />
                          Discussion Thread ({n.repliesCount || (thread.replies ? thread.replies.length : 0)})
                        </span>
                        {thread.open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* Expanded Discussion Replies */}
                      {thread.open && (
                        <div style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {thread.loading ? (
                            <span style={{ fontSize: "0.72rem", color: "#665440" }}>Unrolling replies...</span>
                          ) : thread.replies && thread.replies.length > 0 ? (
                            thread.replies.map((rep, idx) => (
                              <div
                                key={rep.id || idx}
                                style={{
                                  background: "rgba(255, 255, 255, 0.5)",
                                  padding: "0.4rem 0.6rem",
                                  borderRadius: "4px",
                                  fontSize: "0.78rem",
                                  borderLeft: "2px solid #9C7A4A",
                                }}
                              >
                                <span style={{ fontWeight: 700, color: "#3B2A18", display: "block", fontSize: "0.7rem" }}>
                                  {rep.authorName || rep.author_name || "Adept"}
                                </span>
                                <span style={{ color: "#2E2419" }}>{rep.body}</span>
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.72rem", color: "#665440", fontStyle: "italic" }}>
                              No replies yet. Inscribe a response below.
                            </span>
                          )}

                          {/* Quick Reply Form */}
                          <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                            <input
                              type="text"
                              placeholder="Inscribe a reply..."
                              value={thread.newReply || ""}
                              onChange={(e) =>
                                setThreadState((prev) => ({
                                  ...prev,
                                  [n.id]: { ...prev[n.id], newReply: e.target.value },
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendReply(n.id);
                              }}
                              style={{
                                flex: 1,
                                background: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid rgba(0,0,0,0.2)",
                                borderRadius: "3px",
                                padding: "0.3rem 0.5rem",
                                fontSize: "0.75rem",
                                color: "#2E2419",
                                outline: "none",
                              }}
                            />
                            <button
                              onClick={() => handleSendReply(n.id)}
                              style={{
                                background: "#4A3317",
                                color: "#FFF",
                                border: "none",
                                borderRadius: "3px",
                                padding: "0.3rem 0.6rem",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                              }}
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Communities & Collaboration Groups */}
      {activeTab === "groups" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {communities.map((c) => (
            <div key={c.id} className="magical-card ornate-corners">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                <span className="badge-emerald" style={{ fontSize: "0.62rem" }}>
                  {c.category}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>
                  {c.memberCount} Adepts
                </span>
              </div>

              <h3 style={{ fontSize: "1.15rem", color: "var(--ivory)", fontFamily: "var(--font-display)", marginBottom: "0.4rem" }}>
                {c.name}
              </h3>

              <p style={{ fontSize: "0.84rem", color: "var(--parchment)", lineHeight: 1.45, marginBottom: "1.2rem" }}>
                {c.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(214, 180, 106, 0.12)", paddingTop: "0.8rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--antique-gold)" }}>
                  Affiliation: {c.houseId || "Inter-House Circle"}
                </span>

                <MagicalButton
                  onClick={() => handleToggleJoin(c.id)}
                  variant={c.isJoined ? "emerald" : "secondary"}
                  size="sm"
                >
                  {c.isJoined ? "Joined ✓" : "Join Circle"}
                </MagicalButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Notice Modal */}
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
              width: "500px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
              border: "1px solid var(--antique-gold-border-bright)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Pin size={18} color="var(--antique-gold)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ivory)" }}>
                  Inscribe Common Room Notice
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Notice Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(11, 16, 32, 0.8)",
                    border: "1px solid var(--antique-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem 0.8rem",
                    color: "var(--ivory)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                >
                  <option value="Study Circle">Study Circle</option>
                  <option value="Sports Gathering">Sports Gathering</option>
                  <option value="Lost Artifact">Lost Artifact</option>
                  <option value="Alchemical Trade">Alchemical Trade</option>
                  <option value="Project Collab">Project Collab</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--antique-gold)", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Celestial Astrolabe Review Session"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
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
                  Parchment Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Inscribe details of your notice..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  required
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "0.5rem" }}>
                <MagicalButton onClick={() => setIsModalOpen(false)} variant="secondary" size="sm">
                  Cancel
                </MagicalButton>
                <MagicalButton type="submit" variant="primary" size="sm" disabled={isSubmittingPost}>
                  {isSubmittingPost ? "Pinning..." : "Pin to Hearth Notice Board"}
                </MagicalButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moderation / Report Notice Modal */}
      {reportTargetPost && (
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
          onClick={() => setReportTargetPost(null)}
        >
          <div
            className="magical-card ornate-corners"
            style={{
              width: "460px",
              maxWidth: "100%",
              background: "linear-gradient(180deg, #2D141C 0%, #0B1020 100%)",
              border: "1px solid var(--burgundy-light)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Flag size={18} color="var(--burgundy-light)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ivory)" }}>
                  Report Notice to House Prefect
                </h3>
              </div>
              <button onClick={() => setReportTargetPost(null)} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.84rem", color: "var(--parchment)", marginBottom: "1rem" }}>
              Are you certain you wish to report "{reportTargetPost.title}" by {reportTargetPost.author}?
              This flags the content for senior prefect moderation and conceals it from public view.
            </p>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(11, 16, 32, 0.8)",
                border: "1px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.5rem 0.8rem",
                color: "var(--ivory)",
                fontSize: "0.85rem",
                marginBottom: "1.2rem",
                outline: "none",
              }}
            >
              <option value="Disruptive or inappropriate spellcraft">Disruptive or inappropriate spellcraft</option>
              <option value="Violates Academy Decorum">Violates Academy Decorum</option>
              <option value="Spurious or dangerous potion trading">Spurious or dangerous potion trading</option>
              <option value="Unauthorized restricted archive lore">Unauthorized restricted archive lore</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
              <MagicalButton onClick={() => setReportTargetPost(null)} variant="secondary" size="sm">
                Cancel
              </MagicalButton>
              <MagicalButton onClick={handleConfirmReport} variant="burgundy" size="sm" icon={Flag}>
                Flag & Transmit Report
              </MagicalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
