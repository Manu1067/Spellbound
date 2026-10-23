import { getDatabase } from '../db/connection.js';

export const getPosts = ({ category, studentId = 'student-aris-thorne' } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      p.id,
      p.author_id as authorId,
      p.author_name as author,
      p.house_id as houseId,
      h.name as house,
      p.category,
      p.title,
      p.body,
      p.signature_count as signatures,
      p.created_at as createdAt,
      CASE WHEN cs.id IS NOT NULL THEN 1 ELSE 0 END as isSigned
    FROM community_posts p
    JOIN houses h ON p.house_id = h.id
    LEFT JOIN community_signatures cs 
      ON p.id = cs.post_id AND cs.student_id = ?
    WHERE 1=1
  `;

  const params = [studentId];

  if (category && category !== 'All') {
    query += ` AND p.category = ?`;
    params.push(category);
  }

  query += ` ORDER BY p.created_at DESC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    isSigned: Boolean(r.isSigned)
  }));
};

export const createPost = ({ authorId, authorName, houseId, category, title, body }) => {
  const db = getDatabase();

  const id = `note-${Date.now()}`;
  const resolvedAuthorId = authorId || 'student-aris-thorne';
  const resolvedAuthorName = authorName || 'Aris Thorne';
  const resolvedHouseId = houseId || 'ravencrest';

  db.prepare(`
    INSERT INTO community_posts (id, author_id, author_name, house_id, category, title, body, signature_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(id, resolvedAuthorId, resolvedAuthorName, resolvedHouseId, category, title, body);

  // Auto-sign by author
  db.prepare(`
    INSERT INTO community_signatures (post_id, student_id)
    VALUES (?, ?)
  `).run(id, resolvedAuthorId);

  return {
    id,
    authorId: resolvedAuthorId,
    author: resolvedAuthorName,
    houseId: resolvedHouseId,
    category,
    title,
    body,
    signatures: 1,
    isSigned: true,
    createdAt: new Date().toISOString()
  };
};

export const signPost = (postId, studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const post = db.prepare('SELECT id, signature_count FROM community_posts WHERE id = ?').get(postId);
  if (!post) {
    throw new Error('Notice not found');
  }

  const existing = db
    .prepare('SELECT id FROM community_signatures WHERE post_id = ? AND student_id = ?')
    .get(postId, studentId);

  let isSigned = false;
  let newCount = post.signature_count;

  const txn = db.transaction(() => {
    if (existing) {
      db.prepare('DELETE FROM community_signatures WHERE id = ?').run(existing.id);
      newCount = Math.max(0, post.signature_count - 1);
      db.prepare('UPDATE community_posts SET signature_count = ? WHERE id = ?').run(newCount, postId);
      isSigned = false;
    } else {
      db.prepare('INSERT INTO community_signatures (post_id, student_id) VALUES (?, ?)').run(postId, studentId);
      newCount = post.signature_count + 1;
      db.prepare('UPDATE community_posts SET signature_count = ? WHERE id = ?').run(newCount, postId);
      isSigned = true;
    }
  });

  txn();

  return {
    postId,
    signatures: newCount,
    isSigned
  };
};
