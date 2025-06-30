import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/database';

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
  try {
    // Verify admin token
    verifyToken(req);

    const { id } = req.query;

    if (req.method === 'PUT') {
      // Update appointment
      const { status, notes, workbench_number } = req.body;

      const result = await query(
        `UPDATE appointments 
         SET status = $1, notes = $2, workbench_number = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 
         RETURNING *`,
        [status, notes, workbench_number, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(200).json(result.rows[0]);

    } else if (req.method === 'DELETE') {
      // Delete appointment
      const result = await query(
        'DELETE FROM appointments WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(200).json({ message: 'Appointment deleted successfully' });

    } else if (req.method === 'GET') {
      // Get specific appointment
      const result = await query(
        'SELECT * FROM appointments WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(200).json(result.rows[0]);

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
