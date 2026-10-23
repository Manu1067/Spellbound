import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
  LayoutDashboard,
  Home,
  ChevronRight,
} from "lucide-react";
import Emblem from "../magical/Emblem";
import { currentUser, sevenDepartments } from "../../data/mockData";

const ICON_MAP = {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
};

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  return (
    <aside
      className={`academy-sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "74px" : "268px",
        height: "100vh",
        position: "sticky",
        top: 0,
        backgroundColor: "var(--midnight-translucent)",
        backdropFilter: "blur(16px)",
        borderRight: "1px solid var(--antique-gold-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: "var(--z-nav)",
        transition: "width var(--transition-normal)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div>
        {/* Brand Header */}
        <div
          style={{
            padding: isCollapsed ? "1.2rem 0.5rem" : "1.4rem 1.4rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            borderBottom: "1px solid rgba(214, 180, 106, 0.15)",
          }}
        >
          <Link
            to="/"
            title="Return to Landing"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <Emblem size={isCollapsed ? 36 : 40} spin={false} />
            {!isCollapsed && (
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.12rem",
                    letterSpacing: "0.14em",
                    color: "var(--ivory)",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  SPELLBOUND
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--antique-gold)",
                  }}
                >
                  Magical Academy
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: "1rem 0.6rem" }}>
          {/* Main Dashboard Link */}
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: isCollapsed ? "0.75rem 0" : "0.75rem 0.95rem",
              justifyContent: isCollapsed ? "center" : "flex-start",
              borderRadius: "var(--radius-sm)",
              marginBottom: "0.4rem",
              textDecoration: "none",
              color: isActive ? "var(--antique-gold-bright)" : "var(--parchment)",
              backgroundColor: isActive ? "rgba(214, 180, 106, 0.12)" : "transparent",
              borderLeft: isActive ? "3px solid var(--antique-gold)" : "3px solid transparent",
              boxShadow: isActive ? "inset 0 0 12px rgba(214, 180, 106, 0.15)" : "none",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
              transition: "var(--transition-fast)",
            })}
          >
            <LayoutDashboard size={18} />
            {!isCollapsed && <span>Academy Great Hall</span>}
          </NavLink>

          {/* Section Divider */}
          {!isCollapsed && (
            <div
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--antique-gold-dark)",
                fontFamily: "var(--font-display)",
                padding: "0.8rem 0.8rem 0.3rem",
              }}
            >
              Seven Departments
            </div>
          )}

          {/* Seven Departments Links */}
          {sevenDepartments.map((dept) => {
            const IconComponent = ICON_MAP[dept.iconName] || Compass;
            return (
              <NavLink
                key={dept.id}
                to={dept.slug}
                onClick={onCloseMobile}
                title={isCollapsed ? dept.title : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: isCollapsed ? "0.7rem 0" : "0.68rem 0.95rem",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "0.25rem",
                  textDecoration: "none",
                  color: isActive ? "var(--antique-gold-bright)" : "var(--parchment)",
                  backgroundColor: isActive ? "rgba(214, 180, 106, 0.12)" : "transparent",
                  borderLeft: isActive ? `3px solid ${dept.accentColor}` : "3px solid transparent",
                  boxShadow: isActive ? `inset 0 0 12px ${dept.accentColor}25` : "none",
                  fontSize: "0.84rem",
                  transition: "var(--transition-fast)",
                  position: "relative",
                })}
              >
                <div style={{ color: dept.accentColor, display: "flex", alignItems: "center" }}>
                  <IconComponent size={17} />
                </div>
                {!isCollapsed && (
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dept.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Student Profile Mini Badge */}
      <div
        style={{
          borderTop: "1px solid rgba(214, 180, 106, 0.15)",
          padding: isCollapsed ? "1rem 0.4rem" : "1rem 1.2rem",
          background: "rgba(11, 16, 32, 0.6)",
        }}
      >
        <Link
          to="/people"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid var(--antique-gold)",
              background: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80') center/cover",
              flexShrink: 0,
            }}
          />
          {!isCollapsed && (
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--ivory)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {currentUser.name}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--antique-gold)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span>{currentUser.house}</span>
                <span>·</span>
                <span>{currentUser.pointsContributed} pts</span>
              </div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
