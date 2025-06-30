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

    const { id } = req.query;

    if (req.method === 'PUT') {
      // TODO: Update appointment in database when schema is ready
      res.status(200).json({ message: 'Appointment updated' });

    } else if (req.method === 'DELETE') {
      // TODO: Delete appointment from database when schema is ready
      res.status(200).json({ message: 'Appointment deleted successfully' });

    } else if (req.method === 'GET') {
      // TODO: Get specific appointment from database when schema is ready
      res.status(404).json({ error: 'Appointment not found' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Appointment API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
