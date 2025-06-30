import jwt from 'jsonwebtoken';
import { query } from '../../../lib/database';

function verifyToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin token
    verifyToken(req);

    // Get statistics
    const totalMessagesResult = await query(
      'SELECT COUNT(*) as count FROM chat_messages'
    );

    const todayMessagesResult = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE DATE(created_at) = CURRENT_DATE'
    );

    const pendingAppointmentsResult = await query(
      'SELECT COUNT(*) as count FROM appointments WHERE status = $1',
      ['pending']
    );

    const stats = {
      totalMessages: parseInt(totalMessagesResult.rows[0]?.count || 0),
      todayMessages: parseInt(todayMessagesResult.rows[0]?.count || 0),
      pendingAppointments: parseInt(pendingAppointmentsResult.rows[0]?.count || 0)
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Stats API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
