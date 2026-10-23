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

  if (zone) {
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
