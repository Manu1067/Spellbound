import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  X,
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import Emblem from "../magical/Emblem";
import { sevenDepartments, currentUser } from "../../data/mockData";

const ICON_MAP = {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
};

export default function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        background: "rgba(5, 8, 17, 0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "290px",
          height: "100%",
          backgroundColor: "var(--midnight)",
          borderRight: "1px solid var(--antique-gold-border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.5rem 1rem",
          overflowY: "auto",
        }}
      >
        <div>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(214, 180, 106, 0.2)",
              paddingBottom: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Emblem size={34} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  color: "var(--ivory)",
                }}
              >
                SPELLBOUND
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ color: "var(--antique-gold)", cursor: "pointer", padding: "0.2rem" }}
              aria-label="Close Mobile Nav"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <NavLink
              to="/dashboard"
              onClick={onClose}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.75rem 0.9rem",
                borderRadius: "var(--radius-sm)",
                color: isActive ? "var(--antique-gold-bright)" : "var(--parchment)",
                background: isActive ? "rgba(214, 180, 106, 0.15)" : "transparent",
                borderLeft: isActive ? "3px solid var(--antique-gold)" : "3px solid transparent",
                fontFamily: "var(--font-display)",
                fontSize: "0.88rem",
                textDecoration: "none",
              })}
            >
              <LayoutDashboard size={18} />
              <span>Academy Dashboard</span>
            </NavLink>

            <div
              style={{
                fontSize: "0.68rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--antique-gold-dark)",
                fontFamily: "var(--font-display)",
                margin: "0.8rem 0 0.4rem 0.8rem",
              }}
            >
              Departments
            </div>

            {sevenDepartments.map((dept) => {
              const IconComponent = ICON_MAP[dept.iconName] || Compass;
              return (
                <NavLink
                  key={dept.id}
                  to={dept.slug}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "var(--radius-sm)",
                    color: isActive ? "var(--antique-gold-bright)" : "var(--parchment)",
                    background: isActive ? "rgba(214, 180, 106, 0.15)" : "transparent",
                    borderLeft: isActive ? `3px solid ${dept.accentColor}` : "3px solid transparent",
                    fontSize: "0.86rem",
                    textDecoration: "none",
                  })}
                >
                  <IconComponent size={18} color={dept.accentColor} />
                  <span>{dept.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Profile */}
        <div
          style={{
            borderTop: "1px solid rgba(214, 180, 106, 0.2)",
            paddingTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid var(--antique-gold)",
              background: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80') center/cover",
            }}
          />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", color: "var(--ivory)", fontWeight: 600 }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--antique-gold)" }}>
              {currentUser.house} · {currentUser.pointsContributed} pts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
