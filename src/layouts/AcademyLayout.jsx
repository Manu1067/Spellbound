import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MobileNav from "../components/layout/MobileNav";
import ParticleField from "../components/magical/ParticleField";
import MagicalPageTransition from "../components/magical/MagicalPageTransition";

export default function AcademyLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="academy-shell"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--midnight)",
        position: "relative",
      }}
    >
      {/* Subtle Background Ambience Particles */}
      <ParticleField count={16} />

      {/* Desktop / Tablet Sidebar */}
      <div className="desktop-sidebar-container">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Main View Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Topbar
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main
          style={{
            flex: 1,
            padding: "2rem",
            maxWidth: "1440px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <MagicalPageTransition>
            <Outlet />
          </MagicalPageTransition>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar-container {
            display: none !important;
          }
          .mobile-nav-toggle-btn {
            display: flex !important;
          }
          .astral-date-badge {
            display: none !important;
          }
          .search-placeholder-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
