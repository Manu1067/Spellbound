import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Compass,
  Users,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  Shield,
  Trophy,
  Flame,
  ChevronDown
} from "lucide-react";
import Emblem from "../../components/magical/Emblem";
import ParticleField from "../../components/magical/ParticleField";
import DepartmentCard from "../../components/ui/DepartmentCard";
import QuickSearchModal from "../../components/ui/QuickSearchModal";
import { sevenDepartments } from "../../data/mockData";
import "./LandingPage.css";

export default function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToDepartments = (e) => {
    e?.preventDefault();
    const target = document.getElementById("departments-showcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToAbout = (e) => {
    e?.preventDefault();
    const target = document.getElementById("spellbound-about");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="spellbound-landing">
      {/* 1. Top Navigation Bar (Matches Reference Image) */}
      <header className="spellbound-navbar">
        <div className="navbar-container">
          {/* Left: Brand Logo & Wordmark */}
          <Link to="/" className="navbar-brand" aria-label="Spellbound Home">
            <div className="brand-emblem-wrap">
              <Emblem size={28} />
            </div>
            <span className="brand-wordmark">SPELLBOUND</span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="navbar-links" aria-label="Main Navigation">
            <Link to="/" className="nav-link active">
              Home
              <span className="active-glow-bar" />
            </Link>
            <Link to="/dashboard" className="nav-link">
              The Academy
            </Link>
            <a href="#departments-showcase" onClick={scrollToDepartments} className="nav-link">
              Departments
            </a>
            <Link to="/explore" className="nav-link">
              Features
            </Link>
            <a href="#spellbound-about" onClick={scrollToAbout} className="nav-link">
              About
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="navbar-actions">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="navbar-search-btn"
              aria-label="Open Spellbound Quick Search"
              title="Search Academy (Ctrl+K)"
            >
              <Search size={16} />
            </button>

            {/* Ornate Enter Academy CTA */}
            <Link to="/dashboard" className="navbar-enter-btn">
              <Sparkles size={14} className="btn-sparkle" />
              <span>Enter the Academy</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-drawer anim-fade-in-down">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              The Academy
            </Link>
            <a href="#departments-showcase" className="mobile-nav-link" onClick={scrollToDepartments}>
              Departments
            </a>
            <Link to="/explore" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Campus Map
            </Link>
            <Link to="/people" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Student Directory
            </Link>
            <Link to="/academics" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Magical Labs
            </Link>
            <Link to="/sports" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Sports Hub
            </Link>
            <Link to="/mysteries" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Department of Mysteries
            </Link>
            <Link to="/dashboard" className="mobile-enter-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <Sparkles size={15} /> Enter the Academy
            </Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Left-Text / Right-Castle Composition) */}
      <section className="spellbound-hero">
        {/* Cinematic Fantasy Castle Background */}
        <div className="hero-backdrop" />
        
        {/* Soft Vignettes for Text Contrast */}
        <div className="hero-radial-shade" />

        {/* Ambient Golden Sparks & Dust */}
        <ParticleField count={26} />

        <div className="hero-grid-wrapper">
          {/* Left Column: Hero Typography & Actions */}
          <div className="hero-text-column">
            {/* Introductory Eyebrow */}
            <span className="hero-eyebrow">WELCOME TO</span>

            {/* Main Title */}
            <h1 className="hero-title">SPELLBOUND</h1>

            {/* Tagline */}
            <p className="hero-tagline">
              Your world of magic. Your universe of possibilities.
            </p>

            {/* Description */}
            <p className="hero-description">
              A magical student platform that brings learning, exploration,
              community, events and intelligent discovery together in one enchanted universe.
            </p>

            {/* Two Action Buttons */}
            <div className="hero-actions-group">
              <Link to="/dashboard" className="btn-hero-primary">
                <Sparkles size={15} />
                <span>Enter the Academy</span>
                <ArrowRight size={15} className="action-arrow" />
              </Link>

              <button onClick={scrollToDepartments} className="btn-hero-secondary">
                <span>Explore the Seven Departments</span>
              </button>
            </div>

            {/* Three Feature Highlights (Reference Image Specification) */}
            <div className="hero-highlights-bar">
              <div className="highlight-item">
                <Users size={16} className="highlight-icon" />
                <span className="highlight-text">A Thriving Student Community</span>
              </div>

              <span className="highlight-divider" aria-hidden="true" />

              <div className="highlight-item">
                <BookOpen size={16} className="highlight-icon" />
                <span className="highlight-text">Magical Learning and Real Growth</span>
              </div>

              <span className="highlight-divider" aria-hidden="true" />

              <div className="highlight-item">
                <Compass size={16} className="highlight-icon" />
                <span className="highlight-text">Endless Opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Space to let the Moonlit Castle Shine */}
          <div className="hero-castle-space" aria-hidden="true" />
        </div>
      </section>

      {/* 3. Seven Departments Showcase (Horizontal Row) */}
      <section id="departments-showcase" className="departments-showcase-section">
        {/* Section Header with Golden Ornamental Flourishes */}
        <div className="showcase-header-bar">
          <div className="gold-ornament-line" />
          <h2 className="showcase-heading">Seven Departments. One Enchanted World.</h2>
          <div className="gold-ornament-line" />
        </div>

        {/* Seven Arched Cards Row (Matches Reference Exactly) */}
        <div className="showcase-cards-container">
          <div className="showcase-cards-row">
            {sevenDepartments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer & About Section */}
      <footer id="spellbound-about" className="spellbound-footer">
        <div className="footer-inner">
          <div className="footer-brand-row">
            <Emblem size={32} />
            <span className="footer-brand-name">SPELLBOUND ACADEMY</span>
          </div>

          <p className="footer-tagline-text">
            “Your world of magic. Your universe of possibilities.”
          </p>

          <div className="footer-dept-links">
            <Link to="/explore">Explore Campus</Link>
            <Link to="/people">Student Directory</Link>
            <Link to="/sports">Sports Hub</Link>
            <Link to="/academics">Magical Labs</Link>
            <Link to="/common-room">Social Network</Link>
            <Link to="/houses-events">Houses & Events</Link>
            <Link to="/mysteries">Department of Mysteries</Link>
            <Link to="/dashboard">Academy Hall</Link>
          </div>

          <div className="footer-disclaimer">
            Spellbound Academy System · Designed with antique parchment, midnight skies, and celestial order.
            All fictional lore, campus cartography, and laboratory simulations are created for student engagement.
          </div>
        </div>
      </footer>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
