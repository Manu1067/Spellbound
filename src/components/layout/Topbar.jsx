import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  Moon,
  Sparkles,
  ChevronRight,
  Shield,
  LogOut,
} from "lucide-react";
import { currentUser, sevenDepartments } from "../../data/mockData";
import NotificationModal from "../ui/NotificationModal";
import QuickSearchModal from "../ui/QuickSearchModal";

export default function Topbar({ onToggleMobile, onToggleSidebar, isSidebarCollapsed }) {
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Derive current page title from path
  const currentDept = sevenDepartments.find((d) => d.slug === location.pathname);
  const pageTitle =
    location.pathname === "/dashboard"
      ? "Academy Dashboard"
      : currentDept
      ? currentDept.title
      : "Spellbound Realm";

  return (
    <>
      <header
        style={{
          height: "68px",
          backgroundColor: "rgba(11, 16, 32, 0.8)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--antique-gold-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: "var(--z-overlay)",
        }}
      >
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={onToggleMobile}
            className="mobile-nav-toggle-btn"
            style={{
              display: "none",
              color: "var(--antique-gold)",
              padding: "0.4rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(214, 180, 106, 0.2)",
            }}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-display)",
              fontSize: "0.86rem",
              letterSpacing: "0.04em",
            }}
          >
            <Link
              to="/dashboard"
              style={{ color: "var(--parchment-muted)", textDecoration: "none" }}
            >
              Academy
            </Link>
            <ChevronRight size={14} color="var(--antique-gold)" />
            <span style={{ color: "var(--ivory)", fontWeight: 600 }}>{pageTitle}</span>
          </nav>
        </div>

        {/* Center / Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {/* Astral Date Badge (Desktop) */}
          <div
            className="astral-date-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.74rem",
              color: "var(--parchment)",
              background: "rgba(214, 180, 106, 0.08)",
              border: "1px solid rgba(214, 180, 106, 0.2)",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-round)",
            }}
          >
            <Moon size={13} color="var(--antique-gold)" />
            <span>{currentUser.term}</span>
            <span style={{ color: "var(--antique-gold-dark)" }}>•</span>
            <span style={{ fontStyle: "italic", fontFamily: "var(--font-literary)", fontSize: "0.85rem" }}>
              {currentUser.astralPhase}
            </span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(21, 29, 53, 0.6)",
              border: "1px solid var(--antique-gold-border)",
              borderRadius: "var(--radius-round)",
              padding: "0.4rem 0.9rem",
              color: "var(--parchment-muted)",
              fontSize: "0.78rem",
              cursor: "pointer",
              transition: "var(--transition-fast)",
            }}
            title="Press Cmd+K or click to search"
          >
            <Search size={14} color="var(--antique-gold)" />
            <span className="search-placeholder-text">Search scrolls, halls, adepts...</span>
            <kbd
              style={{
                fontSize: "0.65rem",
                padding: "0.1rem 0.35rem",
                background: "rgba(214, 180, 106, 0.15)",
                borderRadius: "3px",
                color: "var(--antique-gold)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Owl Post Notifications */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: isNotifOpen ? "rgba(214, 180, 106, 0.2)" : "rgba(21, 29, 53, 0.7)",
                border: "1px solid var(--antique-gold-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--antique-gold)",
                cursor: "pointer",
                position: "relative",
              }}
              aria-label="Owl Post Dispatches"
            >
              <Bell size={17} />
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--burgundy-light)",
                  boxShadow: "0 0 6px var(--burgundy)",
                }}
              />
            </button>
            <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* Student Profile Quick Menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(21, 29, 53, 0.6)",
                border: "1px solid var(--antique-gold-border)",
                borderRadius: "var(--radius-round)",
                padding: "0.25rem 0.65rem 0.25rem 0.3rem",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--antique-gold)",
                  background: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80') center/cover",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.78rem",
                  color: "var(--ivory)",
                  display: "inline-block",
                }}
                className="topbar-student-name"
              >
                {currentUser.name}
              </span>
            </button>

            {/* Profile Menu Dropdown */}
            {isProfileOpen && (
              <>
                <div
                  onClick={() => setIsProfileOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: "var(--z-modal)" }}
                />
                <div
                  className="magical-card ornate-corners"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.6rem",
                    width: "260px",
                    zIndex: "calc(var(--z-modal) + 1)",
                    background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
                    border: "1px solid var(--antique-gold-border-bright)",
                    padding: "1rem",
                  }}
                >
                  <div style={{ borderBottom: "1px solid rgba(214, 180, 106, 0.15)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ivory)" }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--antique-gold)" }}>
                      {currentUser.house} · {currentUser.year}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)", marginTop: "0.2rem" }}>
                      Wand: {currentUser.wand}
                    </div>
                  </div>

                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                      color: "var(--parchment)",
                      padding: "0.4rem 0",
                      textDecoration: "none",
                    }}
                  >
                    <LogOut size={14} color="var(--antique-gold)" />
                    <span>Return to Entrance Portal</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
