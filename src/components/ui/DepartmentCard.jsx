import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./DepartmentCard.css";

export default function DepartmentCard({ department }) {
  return (
    <Link
      to={department.slug}
      className="arched-dept-card-link"
      aria-label={`Enter ${department.title}`}
    >
      <div className="arched-dept-card">
        {/* Ornate Arched Image Frame */}
        <div className="card-arch-frame">
          {/* Top Filigree Jewel Ornament */}
          <div className="card-top-crest" aria-hidden="true">
            <span className="crest-jewel" style={{ background: department.accentColor || "var(--antique-gold)" }} />
          </div>

          {/* Arched Illustration */}
          <div className="card-img-wrapper">
            <img
              src={department.image}
              alt={department.title}
              className="card-illustration"
              loading="lazy"
            />
            {/* Inner Atmospheric Shadow */}
            <div className="card-inner-vignette" />
          </div>

          {/* Golden Gilded Border Overlay */}
          <div className="card-gilded-border" />
        </div>

        {/* Card Label & Navigation Indicator */}
        <div className="card-content-area">
          <h3 className="card-dept-title">{department.title}</h3>
          <div className="card-arrow-indicator" aria-hidden="true">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
