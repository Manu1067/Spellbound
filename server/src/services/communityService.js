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
      COALESCE(p.signature_count, 0) as signatures,
      COALESCE(p.likes_count, 0) as likes,
      COALESCE(p.dislikes_count, 0) as dislikes,
      p.created_at as createdAt,
      CASE WHEN cs.id IS NOT NULL THEN 1 ELSE 0 END as isSigned,
      cr.reaction_type as userReaction
    FROM community_posts p
    JOIN houses h ON p.house_id = h.id
    LEFT JOIN community_signatures cs 
      ON p.id = cs.post_id AND cs.student_id = ?
    LEFT JOIN community_reactions cr
      ON p.id = cr.post_id AND cr.student_id = ?
    WHERE 1=1
  `;

  const params = [studentId, studentId];

  if (category && category !== 'All') {
    query += ` AND p.category = ?`;
    params.push(category);
  }

  query += ` ORDER BY p.created_at DESC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    signatures: Number(r.signatures) || 0,
    likes: Number(r.likes) || 0,
    dislikes: Number(r.dislikes) || 0,
    isSigned: Boolean(r.isSigned),
    userReaction: r.userReaction || null
  }));
};

export const createPost = ({ authorId, authorName, houseId, category, title, body }) => {
  const db = getDatabase();

  const id = `note-${Date.now()}`;
  const resolvedAuthorId = authorId || 'student-aris-thorne';
  const resolvedAuthorName = authorName || 'Aris Thorne';
  const resolvedHouseId = (houseId || 'ravenclaw').toLowerCase();

  db.prepare(`
    INSERT INTO community_posts (
      id, author_id, author_name, house_id, category, title, body, signature_count, likes_count, dislikes_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 0)
  `).run(id, resolvedAuthorId, resolvedAuthorName, resolvedHouseId, category, title, body);

  // Auto-sign by author
  db.prepare(`
    INSERT INTO community_signatures (post_id, student_id)
    VALUES (?, ?)
  `).run(id, resolvedAuthorId);

  // Auto-like by author
  db.prepare(`
    INSERT INTO community_reactions (post_id, student_id, reaction_type)
    VALUES (?, ?, 'like')
  `).run(id, resolvedAuthorId);

  return {
    id,
    authorId: resolvedAuthorId,
    author: resolvedAuthorName,
    houseId: resolvedHouseId,
    house: 'Ravenclaw',
    category,
    title,
    body,
    signatures: 1,
    likes: 1,
    dislikes: 0,
    isSigned: true,
    userReaction: 'like',
    createdAt: new Date().toISOString()
  };
};

export const reactToPost = (postId, studentId = 'student-aris-thorne', reactionType) => {
  if (!['like', 'dislike'].includes(reactionType)) {
    throw new Error('Invalid reaction type. Must be "like" or "dislike"');
  }

  const db = getDatabase();
  const post = db.prepare('SELECT id, likes_count, dislikes_count FROM community_posts WHERE id = ?').get(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const existing = db
    .prepare('SELECT id, reaction_type FROM community_reactions WHERE post_id = ? AND student_id = ?')
    .get(postId, studentId);

  let userReaction = null;
  let likes = Number(post.likes_count) || 0;
  let dislikes = Number(post.dislikes_count) || 0;

  const txn = db.transaction(() => {
    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Toggle off the active reaction
        db.prepare('DELETE FROM community_reactions WHERE id = ?').run(existing.id);
        if (reactionType === 'like') likes = Math.max(0, likes - 1);
        if (reactionType === 'dislike') dislikes = Math.max(0, dislikes - 1);
        userReaction = null;
      } else {
        // Switch reaction (e.g. from dislike to like, or vice versa)
        db.prepare('UPDATE community_reactions SET reaction_type = ? WHERE id = ?').run(reactionType, existing.id);
        if (reactionType === 'like') {
          likes += 1;
          dislikes = Math.max(0, dislikes - 1);
        } else {
          dislikes += 1;
          likes = Math.max(0, likes - 1);
        }
        userReaction = reactionType;
      }
    } else {
      // New reaction
      db.prepare('INSERT INTO community_reactions (post_id, student_id, reaction_type) VALUES (?, ?, ?)')
        .run(postId, studentId, reactionType);
      if (reactionType === 'like') likes += 1;
      if (reactionType === 'dislike') dislikes += 1;
      userReaction = reactionType;
    }

    db.prepare('UPDATE community_posts SET likes_count = ?, dislikes_count = ? WHERE id = ?')
      .run(likes, dislikes, postId);
  });

  txn();

  return {
    postId,
    userReaction,
    likes,
    dislikes
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
