import { getDatabase } from '../db/connection.js';

export const getAllCourses = ({ term } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      c.code,
      c.title,
      c.instructor,
      c.term,
      c.credits,
      c.description,
      c.location_id as locationId,
      l.name as locationName,
      c.created_at as createdAt
    FROM courses c
    LEFT JOIN locations l ON c.location_id = l.id
    WHERE 1=1
  `;

  const params = [];

  if (term) {
    query += ` AND c.term = ?`;
    params.push(term);
  }

  query += ` ORDER BY c.code ASC`;

  const rows = db.prepare(query).all(...params);
  return rows;
};

export const getCourseByCode = (code) => {
  const db = getDatabase();

  const query = `
    SELECT 
      c.code,
      c.title,
      c.instructor,
      c.term,
      c.credits,
      c.description,
      c.location_id as locationId,
      l.name as locationName,
      c.created_at as createdAt
    FROM courses c
    LEFT JOIN locations l ON c.location_id = l.id
    WHERE c.code = ?
  `;

  const course = db.prepare(query).get(code);
  if (!course) return null;

  const resources = db.prepare(`
    SELECT 
      id,
      title,
      resource_type as resourceType,
      author,
      rarity,
      content_snippet as contentSnippet,
      created_at as createdAt
    FROM learning_resources
    WHERE course_code = ?
    ORDER BY title ASC
  `).all(code);

  return {
    ...course,
    resources
  };
};

export const getCourseResources = (courseCode) => {
  const db = getDatabase();
  return db.prepare(`
    SELECT 
      id,
      course_code as courseCode,
      title,
      resource_type as resourceType,
      author,
      rarity,
      content_snippet as contentSnippet,
      created_at as createdAt
    FROM learning_resources
    WHERE course_code = ?
  `).all(courseCode);
};
