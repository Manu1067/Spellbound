import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, MapPin, Users, BookOpen, Compass, Trophy, Shield, Sparkles } from "lucide-react";
import { sevenDepartments, studentDirectory, campusLocations, dailySchedule } from "../../data/mockData";

export default function QuickSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const depts = sevenDepartments
      .filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
      .map((d) => ({
        id: `dept-${d.id}`,
        title: d.title,
        subtitle: d.description,
        type: "Department",
        icon: Compass,
        action: () => {
          navigate(d.slug);
          onClose();
        },
      }));

    const locs = campusLocations
      .filter((l) => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
      .map((l) => ({
        id: `loc-${l.id}`,
        title: l.name,
        subtitle: `${l.zone} · ${l.dangerLevel}`,
        type: "Location",
        icon: MapPin,
        action: () => {
          navigate(`/explore?focus=${l.id}`);
          onClose();
        },
      }));

    const students = studentDirectory
      .filter((s) => s.name.toLowerCase().includes(q) || s.house.toLowerCase().includes(q) || s.title.toLowerCase().includes(q))
      .map((s) => ({
        id: `student-${s.id}`,
        title: s.name,
        subtitle: `${s.house} · ${s.title}`,
        type: "Person",
        icon: Users,
        action: () => {
          navigate(`/people?filter=${s.house}`);
          onClose();
        },
      }));

    return [...depts, ...locs, ...students];
  }, [query, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        background: "rgba(5, 8, 17, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
      onClick={onClose}
    >
      <div
        className="magical-card ornate-corners"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          maxWidth: "92vw",
          background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
          border: "1px solid var(--antique-gold-border-bright)",
          boxShadow: "var(--shadow-floating)",
          padding: "1.2rem",
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            borderBottom: "1px solid var(--antique-gold-border)",
            paddingBottom: "0.8rem",
          }}
        >
          <Search size={20} color="var(--antique-gold)" />
          <input
            autoFocus
            type="text"
            placeholder="Search departments, locations, spells, or adepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--ivory)",
              fontSize: "1rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: "var(--parchment-muted)", cursor: "pointer" }}>
              <X size={16} />
            </button>
          )}
          <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)", padding: "0.2rem 0.5rem", border: "1px solid rgba(214, 180, 106, 0.2)", borderRadius: "var(--radius-sm)" }}>
            ESC
          </span>
        </div>

        {/* Results / Suggestions */}
        <div style={{ marginTop: "1rem", maxHeight: "350px", overflowY: "auto" }}>
          {!query.trim() ? (
            <div>
              <p style={{ fontSize: "0.78rem", color: "var(--antique-gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                Quick Navigation Suggestions
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem" }}>
                {sevenDepartments.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      navigate(d.slug);
                      onClose();
                    }}
                    style={{
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(214, 180, 106, 0.05)",
                      border: "1px solid rgba(214, 180, 106, 0.15)",
                      color: "var(--ivory)",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold)" }}>{d.title}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>{d.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--parchment-muted)" }}>
              <p>No magical scrolls or records found matching "{query}".</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {results.map((res) => {
                const Icon = res.icon;
                return (
                  <div
                    key={res.id}
                    onClick={res.action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(21, 29, 53, 0.4)",
                      border: "1px solid rgba(214, 180, 106, 0.12)",
                      cursor: "pointer",
                      transition: "var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(214, 180, 106, 0.12)";
                      e.currentTarget.style.borderColor = "var(--antique-gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(21, 29, 53, 0.4)";
                      e.currentTarget.style.borderColor = "rgba(214, 180, 106, 0.12)";
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(214, 180, 106, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--antique-gold)",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--ivory)", fontWeight: 600, fontSize: "0.88rem" }}>
                          {res.title}
                        </span>
                        <span className="badge-gold" style={{ fontSize: "0.62rem", padding: "0.1rem 0.4rem" }}>
                          {res.type}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--parchment-muted)", margin: 0 }}>
                        {res.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
