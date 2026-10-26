import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  ArrowLeft,
  Navigation,
  Sparkles,
  Info,
  Search,
  List,
  Map as MapIcon,
  Clock,
  Footprints,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Utensils,
  Coffee
} from "lucide-react";
import { getCampusLocations, getLocationDirections } from "../../services/api";
import { campusLocations as fallbackLocations, campusPathways } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./ExplorePage.css";

const LOCATION_ICONS = {
  "loc-academic": Building,
  "loc-hostel-girls": Home,
  "loc-hostel-boys": Home,
  "loc-mess": Utensils,
  "loc-cafeteria": Coffee,
};

const BUILDING_IMAGES = {
  "loc-academic": "/assets/accessible_List/Academic_building.png",
  "loc-hostel-girls": "/assets/accessible_List/GirlsHostel.png",
  "loc-hostel-boys": "/assets/accessible_List/BoysHostel.png",
  "loc-mess": "/assets/accessible_List/Mess.png",
  "loc-cafeteria": "/assets/accessible_List/cafeteria.png",
};

const BUILDING_COORDS = {
  "loc-academic": { x: 50, y: 46 },
  "loc-hostel-girls": { x: 22, y: 23 },
  "loc-hostel-boys": { x: 80, y: 29 },
  "loc-mess": { x: 51, y: 69 },
  "loc-cafeteria": { x: 19, y: 60 },
};

export default function ExplorePage() {
  const [locations, setLocations] = useState(
    fallbackLocations.map((l) => ({
      ...l,
      coords: BUILDING_COORDS[l.id] || l.coords,
      image: l.image || BUILDING_IMAGES[l.id],
    }))
  );
  const [selectedLocation, setSelectedLocation] = useState(
    fallbackLocations[0]
      ? {
          ...fallbackLocations[0],
          coords: BUILDING_COORDS[fallbackLocations[0].id] || fallbackLocations[0].coords,
          image: fallbackLocations[0].image || BUILDING_IMAGES[fallbackLocations[0].id],
        }
      : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZone, setActiveZone] = useState("All");
  const [viewMode, setViewMode] = useState("map"); // "map" | "list"

  // Directions state
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [startLocId, setStartLocId] = useState("loc-academic");
  const [destLocId, setDestLocId] = useState("loc-mess");
  const [routeResult, setRouteResult] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCampusLocations()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const merged = data.map((l) => ({
            ...l,
            coords: BUILDING_COORDS[l.id] || l.coords,
            image: l.image || BUILDING_IMAGES[l.id],
          }));
          setLocations(merged);
          setSelectedLocation(merged[0]);
        }
      })
      .catch((err) => console.warn("Using fallback locations:", err));
    return () => { mounted = false; };
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesZone = activeZone === "All" || loc.zone === activeZone;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.highlights?.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesZone && matchesSearch;
  });

  const handleComputeDirections = async () => {
    if (startLocId === destLocId) {
      setRouteResult({
        totalDistanceMeters: 0,
        estimatedWalkMinutes: 0,
        instructions: ["You are already at your destination!"],
        path: [locations.find((l) => l.id === startLocId)],
      });
      return;
    }

    setIsLoadingRoute(true);
    try {
      const result = await getLocationDirections(startLocId, destLocId);
      setRouteResult(result);
    } catch (err) {
      console.error("Directions error:", err);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
  };

  const setAsStartPoint = (id) => {
    setStartLocId(id);
    setIsDirectionsOpen(true);
  };

  const setAsDestination = (id) => {
    setDestLocId(id);
    setIsDirectionsOpen(true);
  };

  // Check if a pathway edge is part of the active route
  const isPathwayInRoute = (fromId, toId) => {
    if (!routeResult || !routeResult.path || routeResult.path.length < 2) return false;
    const pathIds = routeResult.path.map((p) => p.id);
    for (let i = 0; i < pathIds.length - 1; i++) {
      if (
        (pathIds[i] === fromId && pathIds[i + 1] === toId) ||
        (pathIds[i] === toId && pathIds[i + 1] === fromId)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="explore-container anim-fade-in-up">
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(214, 180, 106, 0.15)",
                border: "1px solid var(--antique-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--antique-gold)",
              }}
            >
              <Compass size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Explore Hogwarts: Campus Cartography & Navigation
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Enchanted parchment maps, live shortest-path routing, and interactive student campus facilities.
              </p>
            </div>
          </div>

          {/* View Toggle Button */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setViewMode("map")}
              className={`view-mode-btn ${viewMode === "map" ? "active" : ""}`}
              aria-label="Switch to Parchment Map view"
            >
              <MapIcon size={16} /> Map View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
              aria-label="Switch to Accessible List view"
            >
              <List size={16} /> Accessible List
            </button>
          </div>
        </div>
      </div>

      {/* Illustrative Notice Disclaimer */}
      <div className="campus-disclaimer-banner">
        <Info size={18} color="var(--antique-gold)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Campus Cartography Notice:</strong> All coordinates, distances, pathways, and walking times are illustrative prototypes calibrated for student navigation simulation until verified against physical campus survey data.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="explore-controls-bar">
        <div className="search-input-wrapper">
          <Search size={16} color="var(--parchment-muted)" />
          <input
            type="text"
            placeholder="Search campus buildings, hostels, facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="zone-filter-chips">
          {["All", "Academic", "Residential", "Dining"].map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`zone-chip ${activeZone === zone ? "active" : ""}`}
            >
              {zone}
            </button>
          ))}
        </div>

        <MagicalButton
          onClick={() => setIsDirectionsOpen((prev) => !prev)}
          variant={isDirectionsOpen ? "primary" : "secondary"}
          size="sm"
          icon={Navigation}
        >
          {isDirectionsOpen ? "Close Directions" : "Get Directions (Dijkstra)"}
        </MagicalButton>
      </div>

      {/* Directions Planning Drawer (Conditional) */}
      {isDirectionsOpen && (
        <div className="directions-panel ornate-corners anim-fade-in-up">
          <div className="directions-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Footprints size={18} color="var(--antique-gold-bright)" />
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold-bright)", fontSize: "1.1rem" }}>
                Campus Pathfinding Engine (Dijkstra Shortest Path)
              </h3>
            </div>
            <span className="badge-gold">Graph Routing Active</span>
          </div>

          <div className="directions-form-grid">
            <div className="form-group">
              <label>Starting Point:</label>
              <select
                value={startLocId}
                onChange={(e) => setStartLocId(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destination:</label>
              <select
                value={destLocId}
                onChange={(e) => setDestLocId(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <MagicalButton
                onClick={handleComputeDirections}
                variant="primary"
                size="md"
                disabled={isLoadingRoute}
                icon={Navigation}
                style={{ width: "100%" }}
              >
                {isLoadingRoute ? "Calculating Ley-Lines..." : "Calculate Shortest Route"}
              </MagicalButton>
            </div>
          </div>

          {/* Directions Output */}
          {routeResult && (
            <div className="route-result-box anim-fade-in-up">
              <div className="route-metrics">
                <div className="metric-pill">
                  <Clock size={16} color="var(--antique-gold)" />
                  <span>Est. Walking Time: <strong>{routeResult.estimatedWalkMinutes || 1} min</strong></span>
                </div>
                <div className="metric-pill">
                  <Footprints size={16} color="var(--antique-gold)" />
                  <span>Total Distance: <strong>{routeResult.totalDistanceMeters || 0} meters</strong></span>
                </div>
                <div className="metric-pill">
                  <Layers size={16} color="var(--antique-gold)" />
                  <span>Waypoints: <strong>{routeResult.path?.length || 1} locations</strong></span>
                </div>
              </div>

              <div className="route-steps-list">
                <h4 style={{ fontFamily: "var(--font-display)", color: "var(--antique-gold)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                  Step-by-Step Navigation:
                </h4>
                {routeResult.instructions && routeResult.instructions.map((step, idx) => (
                  <div key={idx} className="route-step-item">
                    <span className="step-num">{idx + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main View: Map or List */}
      {viewMode === "map" ? (
        <div className="explore-main-grid">
          {/* Left: The Enchanted Parchment Map */}
          <div className="parchment-map-wrapper ornate-corners">
            <div className="map-top-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="map-title-label">CAMPUS LEY-LINE CARTOGRAPHY</span>
                <span className="badge-gold" style={{ fontSize: "0.65rem" }}>5 Primary Facilities</span>
              </div>
              <span className="map-hint-text">
                Click any golden seal or facility node to inspect
              </span>
            </div>

            {/* Interactive SVG Parchment Map */}
            <div className="map-svg-container">
              <svg viewBox="0 0 1000 1000" className="parchment-map-svg">
                <defs>
                  <linearGradient id="pathGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBF4DD" />
                    <stop offset="50%" stopColor="#D6B46A" />
                    <stop offset="100%" stopColor="#7E6023" />
                  </linearGradient>
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Illustrated Campus Parchment Map Base */}
                <image
                  href="/assets/accessible_List/campus_map_parchment.png"
                  x="0"
                  y="0"
                  width="1000"
                  height="1000"
                  preserveAspectRatio="none"
                />

                {/* Pathways connecting locations */}
                {campusPathways.map((pathway) => {
                  const fromLoc = locations.find((l) => l.id === pathway.fromId);
                  const toLoc = locations.find((l) => l.id === pathway.toId);
                  if (!fromLoc || !toLoc) return null;

                  const x1 = (fromLoc.coords.x / 100) * 1000;
                  const y1 = (fromLoc.coords.y / 100) * 1000;
                  const x2 = (toLoc.coords.x / 100) * 1000;
                  const y2 = (toLoc.coords.y / 100) * 1000;
                  const isInActiveRoute = isPathwayInRoute(pathway.fromId, pathway.toId);

                  return (
                    <g key={pathway.id}>
                      {/* Pathway line */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isInActiveRoute ? "#FFD700" : "rgba(214, 180, 106, 0.45)"}
                        strokeWidth={isInActiveRoute ? 4.5 : 2}
                        strokeDasharray={isInActiveRoute ? "none" : "6 6"}
                        opacity={isInActiveRoute ? 1 : 0.55}
                        filter={isInActiveRoute ? "url(#goldGlow)" : "none"}
                      />
                      {/* Pathway distance label */}
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 6}
                        fill={isInActiveRoute ? "#FFD700" : "rgba(251, 244, 221, 0.9)"}
                        fontSize="10"
                        fontFamily="var(--font-body)"
                        fontWeight="700"
                        textAnchor="middle"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}
                      >
                        {pathway.distanceMeters}m
                      </text>
                    </g>
                  );
                })}

                {/* Interactive Hotspot Pins for all 5 Campus Locations */}
                {locations.map((loc) => {
                  const px = (loc.coords.x / 100) * 1000;
                  const py = (loc.coords.y / 100) * 1000;
                  const isSelected = selectedLocation?.id === loc.id;
                  const isInRoute = routeResult?.path?.some((p) => p.id === loc.id);

                  return (
                    <g
                      key={loc.id}
                      transform={`translate(${px}, ${py})`}
                      className="map-poi-pin"
                      onClick={() => handleSelectLocation(loc)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Outer pulse when selected or in route */}
                      {(isSelected || isInRoute) && (
                        <circle
                          cx="0"
                          cy="0"
                          r="28"
                          stroke={isInRoute ? "#FFD700" : "#F4D38B"}
                          strokeWidth="2.5"
                          fill="rgba(214, 180, 106, 0.28)"
                          className="anim-window-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill={isSelected ? "#D6B46A" : isInRoute ? "#8B6F2B" : "#1A233A"}
                        stroke="#F4D38B"
                        strokeWidth="2"
                        filter="drop-shadow(0 2px 6px rgba(0,0,0,0.85))"
                      />

                      {/* Icon initial */}
                      <text
                        x="0"
                        y="5"
                        fill={isSelected ? "#0B1020" : "#F4D38B"}
                        fontSize="12"
                        fontFamily="Cinzel"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {loc.name.charAt(0)}
                      </text>

                      {/* Floating Name Label */}
                      <text
                        x="0"
                        y="-24"
                        fill="#FFFFFF"
                        fontSize="13"
                        fontFamily="Cinzel"
                        fontWeight="700"
                        textAnchor="middle"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 0 6px #000000" }}
                      >
                        {loc.name}
                      </text>

                      {/* Zone tag underneath */}
                      <text
                        x="0"
                        y="34"
                        fill="rgba(251, 244, 221, 0.95)"
                        fontSize="10"
                        fontFamily="var(--font-body)"
                        fontWeight="600"
                        textAnchor="middle"
                        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.95)" }}
                      >
                        [{loc.zone}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Filter Buttons under Map */}
            <div className="map-quick-chips">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`quick-chip ${selectedLocation?.id === loc.id ? "active" : ""}`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Selected Location Lore & Details Drawer */}
          {selectedLocation && (
            <div className="location-drawer ornate-corners">
              <div className="drawer-header">
                <div>
                  <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
                    {selectedLocation.zone} Facility
                  </span>
                  <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                    {selectedLocation.name}
                  </h2>
                </div>

                <span
                  className={selectedLocation.dangerLevel?.includes("Restricted") ? "badge-burgundy" : "badge-emerald"}
                  style={{ fontSize: "0.68rem" }}
                >
                  {selectedLocation.dangerLevel || "Authorized"}
                </span>
              </div>

              {/* Dedicated Campus Building Photo */}
              <div className="drawer-building-image-wrap">
                <img
                  src={selectedLocation.image || BUILDING_IMAGES[selectedLocation.id]}
                  alt={selectedLocation.name}
                  className="drawer-building-image"
                />
              </div>

              <p style={{ color: "var(--parchment)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {selectedLocation.description}
              </p>

              {/* Highlights */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.88rem", fontFamily: "var(--font-display)", color: "var(--antique-gold)", marginBottom: "0.6rem" }}>
                  Key Campus Features & Facilities:
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                  {selectedLocation.highlights?.map((h, i) => (
                    <div key={i} className="highlight-pill">
                      <Sparkles size={13} color="var(--antique-gold)" style={{ flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Set as Start / Destination */}
              <div className="drawer-actions-grid">
                <MagicalButton
                  onClick={() => setAsStartPoint(selectedLocation.id)}
                  variant="secondary"
                  size="sm"
                  icon={MapPin}
                >
                  Set as Start Point
                </MagicalButton>

                <MagicalButton
                  onClick={() => setAsDestination(selectedLocation.id)}
                  variant="primary"
                  size="sm"
                  icon={Navigation}
                >
                  Directions Here
                </MagicalButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible List View */
        <div className="accessible-list-grid">
          {filteredLocations.map((loc) => {
            const IconComponent = LOCATION_ICONS[loc.id] || Building;
            return (
              <div key={loc.id} className="accessible-location-card ornate-corners">
                <div className="card-top">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <div className="loc-card-icon">
                      <IconComponent size={22} />
                    </div>
                    <div>
                      <span className="badge-gold" style={{ fontSize: "0.65rem", marginBottom: "0.2rem" }}>
                        {loc.zone}
                      </span>
                      <h3 style={{ fontSize: "1.25rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                        {loc.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={loc.dangerLevel?.includes("Restricted") ? "badge-burgundy" : "badge-emerald"}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {loc.dangerLevel}
                  </span>
                </div>

                {/* Building Image */}
                <div className="accessible-card-image-wrap">
                  <img
                    src={loc.image || BUILDING_IMAGES[loc.id]}
                    alt={loc.name}
                    className="accessible-card-image"
                  />
                </div>

                <p style={{ color: "var(--parchment)", fontSize: "0.9rem", lineHeight: 1.6, margin: "1rem 0" }}>
                  {loc.description}
                </p>

                <div className="loc-card-highlights">
                  {loc.highlights?.map((h, idx) => (
                    <div key={idx} className="highlight-tag">
                      • {h}
                    </div>
                  ))}
                </div>

                <div className="loc-card-footer">
                  <MagicalButton
                    onClick={() => {
                      setSelectedLocation(loc);
                      setAsStartPoint(loc.id);
                    }}
                    variant="ghost"
                    size="sm"
                    icon={MapPin}
                  >
                    Start Here
                  </MagicalButton>

                  <MagicalButton
                    onClick={() => {
                      setSelectedLocation(loc);
                      setAsDestination(loc.id);
                    }}
                    variant="primary"
                    size="sm"
                    icon={Navigation}
                  >
                    Get Directions
                  </MagicalButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
