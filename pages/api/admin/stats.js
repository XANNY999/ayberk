import jwt from 'jsonwebtoken';

function verifyToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'storm_garage_secret_key_2024');
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

    // TODO: Get real statistics from database when schema is ready
    const stats = {
      totalMessages: 0,
      todayMessages: 0,
      pendingAppointments: 0
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
