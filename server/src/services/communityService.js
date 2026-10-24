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

  query += ` AND (p.is_reported = 0 OR p.is_reported IS NULL)`;
  query += ` ORDER BY p.created_at DESC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => {
    const repliesCount = db.prepare('SELECT COUNT(*) as count FROM community_replies WHERE post_id = ?').get(r.id);
    return {
      ...r,
      isSigned: Boolean(r.isSigned),
      repliesCount: repliesCount ? repliesCount.count : 0
    };
  });
};

export const getPostReplies = (postId) => {
  const db = getDatabase();
  return db.prepare(`
    SELECT id, post_id as postId, author_id as authorId, author_name as authorName, house_id as houseId, body, created_at as createdAt
    FROM community_replies
    WHERE post_id = ?
    ORDER BY created_at ASC
  `).all(postId);
};

export const createPostReply = ({ postId, authorId = 'student-aris-thorne', authorName = 'Aris Thorne', houseId = 'ravencrest', body }) => {
  const db = getDatabase();
  const id = `rep-${Date.now()}`;

  db.prepare(`
    INSERT INTO community_replies (id, post_id, author_id, author_name, house_id, body)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, postId, authorId, authorName, houseId, body);

  return {
    id,
    postId,
    authorId,
    authorName,
    houseId,
    body,
    createdAt: new Date().toISOString()
  };
};

export const reportPost = (postId, reason = 'Disruptive or inappropriate spellcraft') => {
  const db = getDatabase();
  const post = db.prepare('SELECT id, title FROM community_posts WHERE id = ?').get(postId);
  if (!post) {
    throw new Error('Notice not found');
  }

  db.prepare('UPDATE community_posts SET is_reported = 1 WHERE id = ?').run(postId);

  return {
    postId,
    isReported: true,
    message: `Parchment notice "${post.title}" has been flagged and transmitted to the House Prefect for moderation review.`
  };
};

export const getCommunities = () => {
  const db = getDatabase();
  return db.prepare(`
    SELECT id, name, description, category, house_id as houseId, member_count as memberCount, icon_name as iconName, is_joined as isJoined, created_at as createdAt
    FROM communities
    ORDER BY member_count DESC
  `).all().map((c) => ({
    ...c,
    isJoined: Boolean(c.isJoined)
  }));
};

export const toggleJoinCommunity = (id) => {
  const db = getDatabase();
  const comm = db.prepare('SELECT id, name, is_joined, member_count FROM communities WHERE id = ?').get(id);
  if (!comm) {
    throw new Error('Community not found');
  }

  const nextJoined = comm.is_joined === 1 ? 0 : 1;
  const newMemberCount = nextJoined === 1 ? comm.member_count + 1 : Math.max(1, comm.member_count - 1);

  db.prepare('UPDATE communities SET is_joined = ?, member_count = ? WHERE id = ?').run(nextJoined, newMemberCount, id);

  return {
    id: comm.id,
    name: comm.name,
    isJoined: Boolean(nextJoined),
    memberCount: newMemberCount,
    message: nextJoined === 1
      ? `You have inscribed your sigil into ${comm.name}.`
      : `You have departed ${comm.name}.`
  };
};

export const createPost = ({ authorId, authorName, houseId, category, title, body }) => {
  const db = getDatabase();

  const id = `note-${Date.now()}`;
  const resolvedAuthorId = authorId || 'student-aris-thorne';
  const resolvedAuthorName = authorName || 'Aris Thorne';
  const resolvedHouseId = houseId || 'ravencrest';

  db.prepare(`
    INSERT INTO community_posts (id, author_id, author_name, house_id, category, title, body, signature_count, is_reported)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)
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
