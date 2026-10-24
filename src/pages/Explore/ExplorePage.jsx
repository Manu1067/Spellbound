import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Compass,
  MapPin,
  ArrowLeft,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Info,
  Navigation,
  Lock,
  Unlock,
  Route,
  ArrowRight,
  Repeat,
  Search,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { fetchLocations, fetchPathways, togglePathwayLock } from "../../services/api";
import { campusLocations as fallbackLocations, castlePathways as fallbackPathways } from "../../data/mockData";
import MagicalButton from "../../components/ui/MagicalButton";
import "./ExplorePage.css";

// Dijkstra's Shortest Path Algorithm for Graph Traversal
function computeDijkstra(startId, endId, locations, pathways) {
  if (!startId || !endId) return null;
  if (startId === endId) {
    const loc = locations.find((l) => l.id === startId);
    return {
      nodes: [startId],
      edges: [],
      totalDistance: 0,
      steps: [{ instruction: `You are already at ${loc ? loc.name : "your destination"}.`, distance: 0 }],
    };
  }

  // Build adjacency list using ONLY unlocked pathways
  const adj = {};
  locations.forEach((loc) => {
    adj[loc.id] = [];
  });

  pathways.forEach((edge) => {
    if (edge.isUnlocked) {
      const dist = edge.distance || 15;
      if (adj[edge.fromLocationId]) {
        adj[edge.fromLocationId].push({ to: edge.toLocationId, dist, edge });
      }
      if (adj[edge.toLocationId]) {
        adj[edge.toLocationId].push({ to: edge.fromLocationId, dist, edge });
      }
    }
  });

  const distances = {};
  const previous = {};
  const previousEdge = {};
  const unvisited = new Set();

  locations.forEach((loc) => {
    distances[loc.id] = Infinity;
    unvisited.add(loc.id);
  });
  distances[startId] = 0;

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minD) {
        minD = distances[node];
        curr = node;
      }
    }

    if (curr === null || minD === Infinity || curr === endId) break;
    unvisited.delete(curr);

    const neighbors = adj[curr] || [];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.to)) {
        const alt = distances[curr] + neighbor.dist;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = curr;
          previousEdge[neighbor.to] = neighbor.edge;
        }
      }
    }
  }

  if (distances[endId] === Infinity) {
    return {
      nodes: null,
      edges: [],
      totalDistance: Infinity,
      error: "No passable corridor found. Some magical wards or closed staircases are blocking all connected routes.",
    };
  }

  // Reconstruct path
  const nodes = [];
  const edges = [];
  let u = endId;
  while (u) {
    nodes.unshift(u);
    if (previousEdge[u]) edges.unshift(previousEdge[u]);
    u = previous[u];
  }

  // Generate written turn-by-turn directions
  const steps = [];
  for (let i = 0; i < edges.length; i++) {
    const fromLoc = locations.find((l) => l.id === nodes[i]);
    const toLoc = locations.find((l) => l.id === nodes[i + 1]);
    const edge = edges[i];
    steps.push({
      stepNumber: i + 1,
      from: fromLoc ? fromLoc.name : nodes[i],
      to: toLoc ? toLoc.name : nodes[i + 1],
      corridor: edge.name,
      distance: edge.distance || 15,
      danger: edge.dangerLevel || "Standard",
      instruction: `Depart ${fromLoc?.name || "chamber"} via ${edge.name} (${edge.distance || 15} paces) towards ${toLoc?.name || "destination"}.`,
    });
  }

  return { nodes, edges, totalDistance: distances[endId], steps };
}

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get("dest");

  const [locations, setLocations] = useState(fallbackLocations);
  const [pathways, setPathways] = useState(fallbackPathways);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation State
  const [startLocationId, setStartLocationId] = useState(fallbackLocations[0]?.id || "loc-1");
  const [destinationId, setDestinationId] = useState(destParam || fallbackLocations[2]?.id || "loc-3");
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Interactive Map State
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminNotice, setAdminNotice] = useState(null);
  const [togglingPathwayId, setTogglingPathwayId] = useState(null);

  // Load locations & pathways from API
  const loadCampusData = async () => {
    try {
      const [locData, pathData] = await Promise.all([fetchLocations(), fetchPathways()]);
      if (locData && locData.length > 0) setLocations(locData);
      if (pathData && pathData.length > 0) setPathways(pathData);
      setError(null);
    } catch (err) {
      console.warn("Using fallback campus data:", err.message);
      // Fallback is already initialized in state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampusData();
  }, []);

  // Update start & destination when locations load or destParam changes
  useEffect(() => {
    if (locations && locations.length > 0) {
      if (!locations.some((l) => l.id === startLocationId)) {
        setStartLocationId(locations[0].id);
      }
      if (destParam && locations.some((l) => l.id === destParam)) {
        setDestinationId(destParam);
        const loc = locations.find((l) => l.id === destParam);
        if (loc) setSelectedLocation(loc);
      } else if (!locations.some((l) => l.id === destinationId)) {
        const dest = locations[2] ? locations[2].id : (locations[1]?.id || locations[0].id);
        setDestinationId(dest);
      }
      if (!selectedLocation) {
        const found = locations.find((l) => l.id === destParam) || locations[0];
        setSelectedLocation(found);
      }
    }
  }, [destParam, locations]);

  // Compute Dijkstra shortest path
  const navigationRoute = useMemo(() => {
    return computeDijkstra(startLocationId, destinationId, locations, pathways);
  }, [startLocationId, destinationId, locations, pathways]);

  // SVG Path description for animated traveler marker along active route
  const routePathD = useMemo(() => {
    if (!navigationRoute || !navigationRoute.nodes || navigationRoute.nodes.length < 2) return "";
    const points = navigationRoute.nodes
      .map((nodeId) => {
        const loc = locations.find((l) => l.id === nodeId);
        if (!loc) return null;
        return {
          x: (loc.coords.x / 100) * 1000,
          y: (loc.coords.y / 100) * 600,
        };
      })
      .filter(Boolean);
    if (points.length < 2) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  }, [navigationRoute, locations]);

  // Filtered locations for search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.zone.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
    );
  }, [locations, searchQuery]);

  // Handle pathway toggle (Ward Gatekeeper)
  const handleTogglePathway = async (pathwayId) => {
    setTogglingPathwayId(pathwayId);
    try {
      const updated = await togglePathwayLock(pathwayId);
      setPathways((prev) =>
        prev.map((p) => (p.id === pathwayId ? { ...p, isUnlocked: updated.isUnlocked } : p))
      );
      setAdminNotice({
        type: updated.isUnlocked ? "open" : "warded",
        message: `Corridor ${updated.name} is now ${updated.isUnlocked ? "OPEN & UNWARDED" : "SEALED BY WARDS"}. Route recalculated.`,
      });
      setTimeout(() => setAdminNotice(null), 5000);
    } catch (err) {
      // Local fallback toggle
      setPathways((prev) =>
        prev.map((p) => (p.id === pathwayId ? { ...p, isUnlocked: !p.isUnlocked } : p))
      );
      setAdminNotice({
        type: "info",
        message: `Corridor ward shifted locally. Shortest path recomputed.`,
      });
      setTimeout(() => setAdminNotice(null), 4000);
    } finally {
      setTogglingPathwayId(null);
    }
  };

  // Swap Start & Destination
  const handleSwap = () => {
    const temp = startLocationId;
    setStartLocationId(destinationId);
    setDestinationId(temp);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setRevealedSecret(false);
  };

  // Check if an edge is part of the active shortest path
  const isEdgeInRoute = (edge) => {
    if (!navigationRoute || !navigationRoute.edges) return false;
    return navigationRoute.edges.some(
      (e) =>
        e.id === edge.id ||
        (e.fromLocationId === edge.fromLocationId && e.toLocationId === edge.toLocationId) ||
        (e.fromLocationId === edge.toLocationId && e.toLocationId === edge.fromLocationId)
    );
  };

  // Check if node is in route
  const isNodeInRoute = (locId) => {
    if (!navigationRoute || !navigationRoute.nodes) return false;
    return navigationRoute.nodes.includes(locId);
  };

  return (
    <div className="explore-container anim-fade-in-up">
      {/* Return Path & Department Header */}
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
                background: "rgba(214, 180, 106, 0.15)",
                border: "1px solid var(--antique-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--antique-gold)",
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.85rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                Explore Hogwarts: Living Corridors & Graph Navigator
              </h1>
              <p style={{ color: "var(--parchment-muted)", fontSize: "0.92rem" }}>
                Interactive cartography, real-time Dijkstra shortest-path calculations, and corridor ward controls.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className="badge-gold">Dijkstra A* Active</span>
            <span className="badge-emerald">{locations.length} Chambers Mapped</span>
          </div>
        </div>
      </div>

      {/* Admin Notice Banner if corridor ward was toggled */}
      {adminNotice && (
        <div
          className={`anim-scale-in ${
            adminNotice.type === "warded" ? "banner-ward-alert" : "banner-ward-open"
          }`}
          style={{
            padding: "0.85rem 1.2rem",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            background: adminNotice.type === "warded" ? "rgba(109, 51, 69, 0.4)" : "rgba(49, 92, 74, 0.4)",
            border: `1px solid ${adminNotice.type === "warded" ? "var(--crimson-velvet)" : "#79C2A4"}`,
            color: "var(--ivory)",
            fontSize: "0.88rem",
          }}
        >
          {adminNotice.type === "warded" ? <Lock size={18} color="var(--crimson-bright)" /> : <Unlock size={18} color="#79C2A4" />}
          <div style={{ flex: 1 }}>{adminNotice.message}</div>
          <span style={{ fontSize: "0.75rem", color: "var(--parchment-muted)" }}>Auto-Recalculating</span>
        </div>
      )}

      {/* Navigation Route Planner Bar */}
      <div className="route-planner-bar ornate-corners">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "220px" }}>
            <MapPin size={16} color="var(--antique-gold)" />
            <label style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", textTransform: "uppercase" }}>
              Origin:
            </label>
            <select
              value={startLocationId}
              onChange={(e) => setStartLocationId(e.target.value)}
              className="magical-select"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.zone})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap Origin & Destination"
            className="swap-btn"
          >
            <Repeat size={16} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "220px" }}>
            <Route size={16} color="#79C2A4" />
            <label style={{ fontSize: "0.78rem", color: "var(--parchment-muted)", textTransform: "uppercase" }}>
              Destination:
            </label>
            <select
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value);
                const loc = locations.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="magical-select"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Route Summary Pill */}
          {navigationRoute && !navigationRoute.error && (
            <div className="route-summary-pill">
              <Sparkles size={14} color="var(--antique-gold)" />
              <span>
                <strong>{navigationRoute.totalDistance}</strong> paces · ~
                {Math.ceil(navigationRoute.totalDistance / 20)} min walk ·{" "}
                <strong>{navigationRoute.edges.length}</strong> corridor{navigationRoute.edges.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Map & Location Inspector Grid */}
      <div className="explore-main-grid">
        {/* Left Column: Interactive Map & Written Directions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="parchment-map-wrapper ornate-corners">
            <div className="map-header-row">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="map-title-label">CAMPUS LEY-LINE MAP</span>
                <span className="badge-gold" style={{ fontSize: "0.65rem" }}>
                  Synchronized with Wards
                </span>
              </div>

              {/* Search Box */}
              <div className="map-search-box">
                <Search size={14} color="var(--antique-gold)" />
                <input
                  type="text"
                  placeholder="Search chambers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="map-search-input"
                />
              </div>
            </div>

            {/* Interactive SVG Parchment Map */}
            <div style={{ position: "relative" }}>
              <svg viewBox="0 0 1000 600" className="parchment-map-svg">
                <defs>
                  <radialGradient id="mapVignette" cx="50%" cy="50%" r="50%">
                    <stop offset="60%" stopColor="#251C15" stopOpacity="0" />
                    <stop offset="100%" stopColor="#0B0806" stopOpacity="0.8" />
                  </radialGradient>
                  <linearGradient id="pathGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D6B46A" />
                    <stop offset="100%" stopColor="#7E6023" />
                  </linearGradient>
                  <linearGradient id="pathActive" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#79C2A4" />
                    <stop offset="50%" stopColor="#F4D38B" />
                    <stop offset="100%" stopColor="#79C2A4" />
                  </linearGradient>
                  <radialGradient id="travelerAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F4D38B" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#79C2A4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="wardAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E24A6F" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#1C1611" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Parchment Base Texture */}
                <rect width="1000" height="600" fill="#1C1611" />
                <rect width="1000" height="600" fill="url(#mapVignette)" />

                {/* Contour Lines */}
                <path d="M50 150 Q200 80 400 120 T800 90 T950 180" stroke="#36291E" strokeWidth="1.5" fill="none" />
                <path d="M50 220 Q250 160 500 200 T850 160 T950 250" stroke="#36291E" strokeWidth="1.5" fill="none" />
                <path d="M50 360 Q300 320 600 340 T950 400" stroke="#36291E" strokeWidth="1.5" fill="none" />

                {/* The Great Black Lake Contour */}
                <path
                  d="M50 450 Q250 420 500 480 T950 500 L950 600 L50 600 Z"
                  fill="#121A28"
                  stroke="rgba(214, 180, 106, 0.25)"
                  strokeWidth="1.5"
                />
                <text x="350" y="550" fill="rgba(214, 180, 106, 0.35)" fontFamily="Cinzel" fontSize="16" letterSpacing="6">
                  THE GREAT BLACK LAKE
                </text>

                {/* Forbidden Woods Zone */}
                <path d="M50 50 L300 50 L250 380 L50 380 Z" fill="#14211A" opacity="0.6" stroke="rgba(49, 92, 74, 0.4)" strokeDasharray="4 4" />
                <text x="70" y="100" fill="#4E8A71" fontFamily="Cinzel" fontSize="13" letterSpacing="3">
                  FORBIDDEN WOODS
                </text>

                {/* Graph Edges / Castle Pathways */}
                {pathways.map((edge) => {
                  const fromLoc = locations.find((l) => l.id === edge.fromLocationId);
                  const toLoc = locations.find((l) => l.id === edge.toLocationId);
                  if (!fromLoc || !toLoc) return null;

                  const x1 = (fromLoc.coords.x / 100) * 1000;
                  const y1 = (fromLoc.coords.y / 100) * 600;
                  const x2 = (toLoc.coords.x / 100) * 1000;
                  const y2 = (toLoc.coords.y / 100) * 600;
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2;

                  const inRoute = isEdgeInRoute(edge);
                  const isLocked = !edge.isUnlocked;
                  const isToggling = togglingPathwayId === edge.id;
                  const edgeLen = Math.round(Math.hypot(x2 - x1, y2 - y1));

                  if (isLocked) {
                    return (
                      <g key={edge.id} className="locked-pathway-group">
                        {/* Shimmering barrier line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#E24A6F"
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                          className="anim-ward-pulsing"
                        />
                        {/* Arcane ward rune symbols at midpoint */}
                        <g transform={`translate(${midX}, ${midY})`}>
                          <circle cx="0" cy="0" r="11" fill="#1C1611" stroke="#E24A6F" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="14" fill="none" stroke="#E24A6F" strokeWidth="0.8" strokeDasharray="2 3" className="anim-spin-slow" />
                          <text x="0" y="3" fill="#E24A6F" fontSize="8" fontFamily="Cinzel" fontWeight="bold" textAnchor="middle">
                            ᚦ
                          </text>
                        </g>
                        <rect
                          x={midX - 24}
                          y={midY - 21}
                          width="48"
                          height="13"
                          rx="3"
                          fill="#150E12"
                          stroke="#E24A6F"
                          strokeWidth="0.8"
                        />
                        <text
                          x={midX}
                          y={midY - 11}
                          fill="#FFA6BF"
                          fontSize="8"
                          fontFamily="Cinzel"
                          fontWeight="bold"
                          textAnchor="middle"
                          letterSpacing="1"
                        >
                          WARDED
                        </text>
                        {isToggling && (
                          <circle cx={midX} cy={midY} r="22" fill="none" stroke="#F4D38B" strokeWidth="2" className="anim-window-pulse" />
                        )}
                      </g>
                    );
                  }

                  if (inRoute) {
                    return (
                      <g key={edge.id} className="active-route-edge">
                        {/* Glow halo for active route */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#79C2A4"
                          strokeWidth="7"
                          opacity="0.45"
                        />
                        {/* Animated route drawing line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="url(#pathActive)"
                          strokeWidth="3.5"
                          className="anim-route-drawing anim-pulsing-path"
                          style={{
                            strokeDasharray: `${edgeLen}`,
                            strokeDashoffset: 0,
                          }}
                        />
                        {/* Distance Badge on Edge */}
                        <rect
                          x={midX - 18}
                          y={midY - 9}
                          width="36"
                          height="16"
                          rx="4"
                          fill="#0B1020"
                          stroke="#D6B46A"
                          strokeWidth="1.2"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          fill="#F4D38B"
                          fontSize="9"
                          fontFamily="Cinzel"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {edge.distance}p
                        </text>
                      </g>
                    );
                  }

                  // Default Unlocked Edge
                  return (
                    <g key={edge.id}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="url(#pathGold)"
                        strokeWidth="1.8"
                        strokeDasharray="5 7"
                        opacity="0.45"
                      />
                    </g>
                  );
                })}

                {/* Animated Traveler Scout Marker Moving Along Active Route */}
                {routePathD && (
                  <g className="traveler-marker-group" pointerEvents="none">
                    <animateMotion
                      dur={`${Math.max(3.2, (navigationRoute.nodes?.length || 2) * 1.5)}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                      path={routePathD}
                    />
                    {/* Ethereal golden aura pulse */}
                    <circle cx="0" cy="0" r="16" fill="url(#travelerAura)" opacity="0.8" />
                    {/* Core scout beacon */}
                    <circle cx="0" cy="0" r="6" fill="#F4D38B" stroke="#0B1020" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                    {/* Directional wisp spark */}
                    <polygon points="9,0 -2,-3.5 0,0 -2,3.5" fill="#D6B46A" />
                  </g>
                )}

                {/* Compass Rose */}
                <g transform="translate(900, 90)">
                  <circle cx="0" cy="0" r="36" stroke="rgba(214, 180, 106, 0.3)" strokeWidth="1" fill="none" />
                  <path d="M0 -34 L5 -7 L34 0 L5 7 L0 34 L-5 7 L-34 0 L-5 -7 Z" fill="#D6B46A" opacity="0.75" />
                  <text x="-4" y="-38" fill="#D6B46A" fontSize="11" fontFamily="Cinzel" fontWeight="bold">N</text>
                </g>

                {/* Hotspot Location Pins with High-Contrast Readable Labels */}
                {locations.map((loc) => {
                  const px = (loc.coords.x / 100) * 1000;
                  const py = (loc.coords.y / 100) * 600;
                  const isSelected = selectedLocation?.id === loc.id;
                  const isStart = startLocationId === loc.id;
                  const isDest = destinationId === loc.id;
                  const inRoute = isNodeInRoute(loc.id);

                  let pinColor = "#1A233A";
                  let strokeColor = "#F4D38B";
                  let badgeFill = "#0B1020";
                  let badgeStroke = "rgba(214, 180, 106, 0.4)";
                  let badgeText = loc.name;

                  if (isStart) {
                    pinColor = "#D6B46A";
                    strokeColor = "#F6F0E4";
                    badgeFill = "#1E1A11";
                    badgeStroke = "#D6B46A";
                    badgeText = `ORIGIN: ${loc.name}`;
                  } else if (isDest) {
                    pinColor = "#315C4A";
                    strokeColor = "#79C2A4";
                    badgeFill = "#112019";
                    badgeStroke = "#79C2A4";
                    badgeText = `DESTINATION: ${loc.name}`;
                  } else if (inRoute) {
                    pinColor = "#273859";
                    strokeColor = "#79C2A4";
                    badgeStroke = "#79C2A4";
                  }

                  const labelWidth = Math.max(70, badgeText.length * 7.5 + 14);

                  return (
                    <g
                      key={loc.id}
                      transform={`translate(${px}, ${py})`}
                      className="map-poi-pin"
                      onClick={() => handleSelectLocation(loc)}
                    >
                      {/* Pulsing ring if selected, origin, or destination */}
                      {(isSelected || isDest || isStart) && (
                        <circle
                          cx="0"
                          cy="0"
                          r="25"
                          stroke={isDest ? "#79C2A4" : "#F4D38B"}
                          strokeWidth="1.8"
                          fill={isDest ? "rgba(49, 92, 74, 0.25)" : "rgba(214, 180, 106, 0.2)"}
                          className="anim-window-pulse"
                        />
                      )}

                      <circle
                        cx="0"
                        cy="0"
                        r={isStart || isDest ? "16" : "13"}
                        fill={pinColor}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />

                      <text
                        x="0"
                        y="4"
                        fill={isStart ? "#0B1020" : "#F4D38B"}
                        fontSize="10"
                        fontFamily="Cinzel"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isStart ? "S" : isDest ? "D" : loc.name.charAt(0)}
                      </text>

                      {/* High-Contrast Readable Label Badge */}
                      <g transform="translate(0, -22)" pointerEvents="none">
                        <rect
                          x={-labelWidth / 2}
                          y="-10"
                          width={labelWidth}
                          height="18"
                          rx="4"
                          fill={badgeFill}
                          stroke={badgeStroke}
                          strokeWidth={isStart || isDest ? "1.5" : "1"}
                          opacity="0.94"
                        />
                        <text
                          x="0"
                          y="3"
                          fill={isStart ? "#F4D38B" : isDest ? "#79C2A4" : "#F6F0E4"}
                          fontSize={isStart || isDest ? "10" : "9.5"}
                          fontFamily="Cinzel"
                          fontWeight={isStart || isDest ? "bold" : "600"}
                          textAnchor="middle"
                          letterSpacing="0.4"
                        >
                          {badgeText}
                        </text>
                      </g>
                    </g>
                  );
                })}

              </svg>
            </div>

            {/* Quick Location Chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const isDest = destinationId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`loc-chip ${isSelected ? "selected" : ""} ${isDest ? "dest" : ""}`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Turn-by-Turn Route Guidance Panel */}
          <div className="written-directions-panel ornate-corners">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Route size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.1rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Turn-by-Turn Wayfinding Scroll
                </h3>
              </div>
              {navigationRoute && !navigationRoute.error && (
                <span className="badge-emerald" style={{ fontSize: "0.72rem" }}>
                  Shortest Route Verified
                </span>
              )}
            </div>

            {navigationRoute?.error ? (
              <div className="empty-route-notice">
                <AlertTriangle size={24} color="var(--crimson-bright)" />
                <div>
                  <h4 style={{ color: "var(--crimson-bright)", marginBottom: "0.2rem" }}>Path Impassable</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--parchment)" }}>{navigationRoute.error}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--parchment-muted)", marginTop: "0.4rem" }}>
                    Tip: Re-open corridor wards below in the Gatekeeper panel to restore access.
                  </p>
                </div>
              </div>
            ) : navigationRoute?.steps?.length === 0 ? (
              <div style={{ color: "var(--parchment-muted)", fontStyle: "italic", fontSize: "0.88rem" }}>
                Select distinct origin and destination chambers to plot navigation.
              </div>
            ) : (
              <div className="directions-steps-list">
                {navigationRoute?.steps?.map((step, idx) => (
                  <div key={idx} className="direction-step-card">
                    <div className="step-number-badge">{step.stepNumber}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: "0.9rem" }}>
                          {step.from} <ArrowRight size={12} style={{ display: "inline", margin: "0 4px" }} /> {step.to}
                        </span>
                        <span className="step-distance-badge">{step.distance} paces</span>
                      </div>
                      <p style={{ color: "var(--parchment)", fontSize: "0.84rem", marginTop: "0.25rem" }}>
                        {step.instruction}
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                        <span className="badge-gold" style={{ fontSize: "0.62rem" }}>
                          {step.corridor}
                        </span>
                        <span
                          className={step.danger.includes("Restricted") ? "badge-burgundy" : "badge-emerald"}
                          style={{ fontSize: "0.62rem" }}
                        >
                          {step.danger}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Location Inspector & Corridor Gatekeeper Admin Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Location Lore Inspector */}
          {selectedLocation && (
            <div className="location-drawer ornate-corners">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span className="badge-gold" style={{ marginBottom: "0.4rem" }}>
                    {selectedLocation.zone}
                  </span>
                  <h2 style={{ fontSize: "1.45rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                    {selectedLocation.name}
                  </h2>
                </div>

                <span
                  className={selectedLocation.dangerLevel?.includes("Restricted") ? "badge-burgundy" : "badge-emerald"}
                  style={{ fontSize: "0.68rem" }}
                >
                  {selectedLocation.dangerLevel}
                </span>
              </div>

              <p style={{ color: "var(--parchment)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
                {selectedLocation.description}
              </p>

              {/* Architectural Highlights */}
              <div style={{ marginBottom: "1.2rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontFamily: "var(--font-display)", color: "var(--antique-gold)", marginBottom: "0.5rem" }}>
                  Key Architectural Features
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.4rem" }}>
                  {selectedLocation.highlights?.map((h, i) => (
                    <div key={i} className="highlight-pill">
                      • {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <MagicalButton
                    onClick={() => setDestinationId(selectedLocation.id)}
                    variant="primary"
                    size="sm"
                    icon={Navigation}
                  >
                    Set as Destination
                  </MagicalButton>
                  <MagicalButton
                    onClick={() => setStartLocationId(selectedLocation.id)}
                    variant="secondary"
                    size="sm"
                    icon={MapPin}
                  >
                    Set as Origin
                  </MagicalButton>
                </div>

                <MagicalButton
                  onClick={() => setRevealedSecret((prev) => !prev)}
                  variant="ghost"
                  size="sm"
                  icon={Eye}
                >
                  {revealedSecret ? "Dispel Hidden Ward" : "Cast Revealing Charm (Aparecium)"}
                </MagicalButton>

                {revealedSecret && (
                  <div className="revealed-secret-box anim-fade-in-up">
                    ✨ <strong>Secret Passage Revealed:</strong> An ancient runic flagstone near {selectedLocation.name} connects directly through the clandestine scholars flue, bypassing the central staircases.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Demo Control: Ward & Corridor Gatekeeper */}
          <div className="admin-gatekeeper-panel ornate-corners">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={18} color="var(--antique-gold)" />
                <h3 style={{ fontSize: "1.05rem", color: "var(--ivory)", fontFamily: "var(--font-display)" }}>
                  Corridor Wards Gatekeeper
                </h3>
              </div>
              <span className="badge-burgundy" style={{ fontSize: "0.65rem" }}>
                Demo Admin Control
              </span>
            </div>

            <p style={{ color: "var(--parchment-muted)", fontSize: "0.8rem", marginBottom: "1rem", lineHeight: 1.4 }}>
              Shift magical wards to seal or open corridors. Dijkstra's algorithm immediately recalculates the living path!
            </p>

            <div className="pathway-toggle-list">
              {pathways.map((path) => {
                const fromLoc = locations.find((l) => l.id === path.fromLocationId);
                const toLoc = locations.find((l) => l.id === path.toLocationId);
                const isToggling = togglingPathwayId === path.id;

                return (
                  <div key={path.id} className="pathway-toggle-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--ivory)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {path.name}
                        </span>
                        <span className="distance-chip">{path.distance}p</span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--parchment-muted)" }}>
                        {fromLoc?.name || path.fromLocationId} ↔ {toLoc?.name || path.toLocationId}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTogglePathway(path.id)}
                      disabled={isToggling}
                      className={`pathway-status-toggle ${path.isUnlocked ? "unlocked" : "locked"}`}
                    >
                      {isToggling ? (
                        <Loader2 size={12} className="anim-spin" />
                      ) : path.isUnlocked ? (
                        <>
                          <Unlock size={12} /> Open
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Warded
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
