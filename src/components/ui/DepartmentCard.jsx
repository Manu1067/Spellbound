import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const ICON_MAP = {
  Compass,
  Users,
  Trophy,
  BookOpen,
  Flame,
  Shield,
  Sparkles,
};

export default function DepartmentCard({ department }) {
  const IconComponent = ICON_MAP[department.iconName] || Compass;

  return (
    <Link
      to={department.slug}
      className="department-card-link"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <div
        className="magical-card ornate-corners department-card"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderTop: `2px solid ${department.accentColor}`,
          position: "relative",
          background: "linear-gradient(180deg, rgba(21, 29, 53, 0.85) 0%, rgba(11, 16, 32, 0.95) 100%)",
        }}
      >
        <div>
          {/* Header row: Icon & Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.2rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: `radial-gradient(circle at 50% 50%, rgba(214, 180, 106, 0.15), rgba(21, 29, 53, 0.6))`,
                border: `1px solid ${department.accentColor}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: department.accentColor,
                boxShadow: `0 0 12px ${department.accentColor}25`,
              }}
            >
              <IconComponent size={22} />
            </div>

            <span
              className="badge-gold"
              style={{
                fontSize: "0.68rem",
                borderColor: `${department.accentColor}66`,
                color: department.accentColor,
              }}
            >
              {department.tag}
            </span>
          </div>

          {/* Department Title */}
          <h3
            style={{
              fontSize: "1.22rem",
              marginBottom: "0.65rem",
              color: "var(--ivory)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em",
            }}
          >
            {department.title}
          </h3>

          {/* Department Description */}
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--parchment-muted)",
              lineHeight: 1.55,
              marginBottom: "1.2rem",
            }}
          >
            {department.description}
          </p>
        </div>

        {/* Footer: Snippet & Enter Link */}
        <div
          style={{
            borderTop: "1px solid rgba(214, 180, 106, 0.12)",
            paddingTop: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            fontFamily: "var(--font-display)",
            color: "var(--antique-gold)",
          }}
        >
          <span style={{ color: "var(--parchment-muted)", fontStyle: "italic", fontFamily: "var(--font-literary)", fontSize: "0.88rem" }}>
            {department.bannerSnippet}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Enter <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
