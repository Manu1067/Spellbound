import { getDatabase } from '../db/connection.js';

export const getAllLocations = ({ zone, includeSecrets = false } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      id,
      name,
      zone,
      description,
      highlights,
      danger_level as dangerLevel,
      coord_x as x,
      coord_y as y,
      is_secret as isSecret,
      created_at as createdAt
    FROM locations
    WHERE 1=1
  `;

  const params = [];

  if (!includeSecrets) {
    query += ` AND is_secret = 0`;
  }

  if (zone && zone !== 'All') {
    query += ` AND zone = ?`;
    params.push(zone);
  }

  query += ` ORDER BY name ASC`;

  const rows = db.prepare(query).all(...params);

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    zone: r.zone,
    description: r.description,
    highlights: JSON.parse(r.highlights || '[]'),
    dangerLevel: r.dangerLevel,
    coords: { x: r.x, y: r.y },
    isSecret: Boolean(r.isSecret),
    createdAt: r.createdAt
  }));
};

export const getLocationById = (id) => {
  const db = getDatabase();

  const query = `
    SELECT 
      id,
      name,
      zone,
      description,
      highlights,
      danger_level as dangerLevel,
      coord_x as x,
      coord_y as y,
      is_secret as isSecret,
      created_at as createdAt
    FROM locations
    WHERE id = ?
  `;

  const row = db.prepare(query).get(id);
  if (!row) return null;

  // Get pathways connecting to/from this location
  const pathways = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.path_type as pathType,
      p.distance_meters as distanceMeters,
      p.is_unlocked as isUnlocked,
      p.description,
      p.from_location_id as fromId,
      p.to_location_id as toId,
      l.name as destinationName
    FROM pathways p
    JOIN locations l ON (l.id = CASE WHEN p.from_location_id = ? THEN p.to_location_id ELSE p.from_location_id END)
    WHERE p.from_location_id = ? OR p.to_location_id = ?
  `).all(id, id, id);

  return {
    id: row.id,
    name: row.name,
    zone: row.zone,
    description: row.description,
    highlights: JSON.parse(row.highlights || '[]'),
    dangerLevel: row.dangerLevel,
    coords: { x: row.x, y: row.y },
    isSecret: Boolean(row.isSecret),
    pathways: pathways.map((p) => ({
      ...p,
      isUnlocked: Boolean(p.isUnlocked)
    })),
    createdAt: row.createdAt
  };
};

export const getPathways = () => {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.path_type as pathType,
      p.distance_meters as distanceMeters,
      p.is_unlocked as isUnlocked,
      p.description,
      p.from_location_id as fromLocationId,
      p.to_location_id as toLocationId,
      l1.name as fromLocationName,
      l2.name as toLocationName
    FROM pathways p
    JOIN locations l1 ON p.from_location_id = l1.id
    JOIN locations l2 ON p.to_location_id = l2.id
  `).all();

  return rows.map((r) => ({
    ...r,
    isUnlocked: Boolean(r.isUnlocked)
  }));
};

/**
 * Dijkstra's Shortest Path Algorithm on Campus Graph
 */
export const calculateShortestPath = (fromId, toId) => {
  const db = getDatabase();

  const allLocations = getAllLocations({ includeSecrets: true });
  const locMap = new Map(allLocations.map((l) => [l.id, l]));

  if (!locMap.has(fromId)) throw new Error(`Starting location not found: ${fromId}`);
  if (!locMap.has(toId)) throw new Error(`Destination location not found: ${toId}`);

  if (fromId === toId) {
    return {
      from: locMap.get(fromId),
      to: locMap.get(toId),
      path: [locMap.get(fromId)],
      totalDistanceMeters: 0,
      estimatedWalkMinutes: 0,
      legs: [],
      instructions: ['You are already at your destination.']
    };
  }

  const allPathways = getPathways();

  // Build adjacency list (undirected graph)
  const graph = new Map();
  for (const loc of allLocations) {
    graph.set(loc.id, []);
  }

  for (const p of allPathways) {
    if (graph.has(p.fromLocationId) && graph.has(p.toLocationId)) {
      graph.get(p.fromLocationId).push({
        neighbor: p.toLocationId,
        weight: p.distanceMeters,
        name: p.name,
        type: p.pathType
      });
      graph.get(p.toLocationId).push({
        neighbor: p.fromLocationId,
        weight: p.distanceMeters,
        name: p.name,
        type: p.pathType
      });
    }
  }

  // Dijkstra's algorithm
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();

  for (const loc of allLocations) {
    distances.set(loc.id, Infinity);
    unvisited.add(loc.id);
  }

  distances.set(fromId, 0);

  while (unvisited.size > 0) {
    // Extract node with minimum distance
    let current = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances.get(node) < minDistance) {
        minDistance = distances.get(node);
        current = node;
      }
    }

    if (current === null || minDistance === Infinity) break;
    if (current === toId) break;

    unvisited.delete(current);

    const neighbors = graph.get(current) || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.neighbor)) continue;

      const alt = distances.get(current) + edge.weight;
      if (alt < distances.get(edge.neighbor)) {
        distances.set(edge.neighbor, alt);
        previous.set(edge.neighbor, { from: current, edge });
      }
    }
  }

  if (distances.get(toId) === Infinity) {
    throw new Error(`No connected pathway found between ${locMap.get(fromId).name} and ${locMap.get(toId).name}`);
  }

  // Reconstruct path
  const pathIds = [];
  const legs = [];
  let curr = toId;

  while (curr !== fromId) {
    pathIds.unshift(curr);
    const prevEntry = previous.get(curr);
    if (!prevEntry) break;
    legs.unshift({
      fromId: prevEntry.from,
      toId: curr,
      fromName: locMap.get(prevEntry.from).name,
      toName: locMap.get(curr).name,
      pathwayName: prevEntry.edge.name,
      pathType: prevEntry.edge.type,
      distanceMeters: prevEntry.edge.weight
    });
    curr = prevEntry.from;
  }
  pathIds.unshift(fromId);

  const path = pathIds.map((id) => locMap.get(id));
  const totalDistanceMeters = distances.get(toId);
  // Average pedestrian speed ~ 1.3 meters/second = ~78 meters/minute
  const estimatedWalkMinutes = Math.max(1, Math.round(totalDistanceMeters / 75));

  const instructions = legs.map((leg, idx) => {
    return `Step ${idx + 1}: Depart ${leg.fromName} via ${leg.pathwayName} (${leg.distanceMeters}m, ${leg.pathType}) toward ${leg.toName}.`;
  });

  return {
    from: locMap.get(fromId),
    to: locMap.get(toId),
    path,
    totalDistanceMeters,
    estimatedWalkMinutes,
    legs,
    instructions,
    illustrativeNotice: 'Coordinates, distances, and route geometry are illustrative for navigation prototyping until verified against physical survey.'
  };
};
