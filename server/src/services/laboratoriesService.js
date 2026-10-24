import { getDatabase } from '../db/connection.js';

export const getAllLaboratories = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      l.id,
      l.name,
      l.code,
      l.description,
      l.location_id as locationId,
      loc.name as locationName,
      l.faculty_in_charge as facultyInCharge,
      l.available_equipment as availableEquipment,
      l.safety_guidelines as safetyGuidelines,
      l.created_at as createdAt,
      (SELECT COUNT(*) FROM lab_resources lr WHERE lr.lab_id = l.id) as resourceCount
    FROM laboratories l
    LEFT JOIN locations loc ON l.location_id = loc.id
    ORDER BY l.name ASC
  `).all();

  return rows.map((r) => ({
    ...r,
    availableEquipment: JSON.parse(r.availableEquipment || '[]'),
    safetyGuidelines: JSON.parse(r.safetyGuidelines || '[]')
  }));
};

export const getLaboratoryById = (id) => {
  const db = getDatabase();

  const row = db.prepare(`
    SELECT 
      l.id,
      l.name,
      l.code,
      l.description,
      l.location_id as locationId,
      loc.name as locationName,
      l.faculty_in_charge as facultyInCharge,
      l.available_equipment as availableEquipment,
      l.safety_guidelines as safetyGuidelines,
      l.created_at as createdAt
    FROM laboratories l
    LEFT JOIN locations loc ON l.location_id = loc.id
    WHERE l.id = ? OR LOWER(l.code) = LOWER(?)
  `).get(id, id);

  if (!row) return null;

  const resources = db.prepare(`
    SELECT 
      id,
      lab_id as labId,
      title,
      category,
      description,
      file_size as fileSize,
      download_url as downloadUrl,
      created_at as createdAt
    FROM lab_resources
    WHERE lab_id = ?
    ORDER BY title ASC
  `).all(row.id);

  return {
    ...row,
    availableEquipment: JSON.parse(row.availableEquipment || '[]'),
    safetyGuidelines: JSON.parse(row.safetyGuidelines || '[]'),
    resources
  };
};

export const getLaboratoryResources = (labId, { category, search } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      lr.id,
      lr.lab_id as labId,
      l.name as labName,
      lr.title,
      lr.category,
      lr.description,
      lr.file_size as fileSize,
      lr.download_url as downloadUrl,
      lr.created_at as createdAt
    FROM lab_resources lr
    JOIN laboratories l ON lr.lab_id = l.id
    WHERE 1=1
  `;

  const params = [];

  if (labId && labId !== 'all') {
    query += ` AND (lr.lab_id = ? OR LOWER(l.code) = LOWER(?))`;
    params.push(labId, labId);
  }

  if (category && category !== 'All') {
    query += ` AND lr.category = ?`;
    params.push(category);
  }

  if (search) {
    query += ` AND (LOWER(lr.title) LIKE LOWER(?) OR LOWER(lr.description) LIKE LOWER(?))`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY lr.title ASC`;

  return db.prepare(query).all(...params);
};
