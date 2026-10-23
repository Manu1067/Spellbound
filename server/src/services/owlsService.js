import { getDatabase } from '../db/connection.js';

export const dispatchOwl = ({ senderId, senderName, recipientId, message }) => {
  const db = getDatabase();

  const recipient = db.prepare('SELECT id, name FROM students WHERE id = ?').get(recipientId);
  if (!recipient) {
    throw new Error(`Recipient student not found: ${recipientId}`);
  }

  const id = `owl-${Date.now()}`;
  const resolvedSenderId = senderId || 'student-aris-thorne';
  const resolvedSenderName = senderName || 'Aris Thorne';

  db.prepare(`
    INSERT INTO owl_dispatches (id, sender_id, sender_name, recipient_id, message, status)
    VALUES (?, ?, ?, ?, ?, 'Dispatched')
  `).run(id, resolvedSenderId, resolvedSenderName, recipientId, message);

  return {
    id,
    senderName: resolvedSenderName,
    recipientName: recipient.name,
    status: 'Dispatched',
    dispatchedAt: new Date().toISOString()
  };
};

export const getRecentDispatches = (studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  return db.prepare(`
    SELECT 
      o.id,
      o.sender_id as senderId,
      o.sender_name as senderName,
      o.recipient_id as recipientId,
      r.name as recipientName,
      o.message,
      o.status,
      o.dispatched_at as dispatchedAt
    FROM owl_dispatches o
    JOIN students r ON o.recipient_id = r.id
    WHERE o.sender_id = ? OR o.recipient_id = ?
    ORDER BY o.dispatched_at DESC
    LIMIT 10
  `).all(studentId, studentId);
};
