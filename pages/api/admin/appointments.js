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
  try {
    // Verify admin token
    verifyToken(req);

    if (req.method === 'GET') {
      // TODO: Get real appointments from database when schema is ready
      res.status(200).json([]);

    } else if (req.method === 'POST') {
      // TODO: Create appointment in database when schema is ready
      res.status(201).json({ message: 'Appointment created' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Appointments API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
