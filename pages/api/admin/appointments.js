import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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
      // Get all appointments
      const result = await pool.query(
        `SELECT id, customer_name, customer_phone, customer_email, 
                scooter_brand, scooter_model, issue_description, 
                preferred_date, preferred_time, estimated_duration, 
                status, workbench_number, notes, created_at, updated_at
         FROM appointments 
         ORDER BY created_at DESC`
      );

      res.status(200).json(result.rows);

    } else if (req.method === 'POST') {
      // Create new appointment
      const {
        customer_name,
        customer_phone,
        customer_email,
        scooter_brand,
        scooter_model,
        issue_description,
        preferred_date,
        preferred_time,
        estimated_duration
      } = req.body;

      const result = await pool.query(
        `INSERT INTO appointments 
         (customer_name, customer_phone, customer_email, scooter_brand, 
          scooter_model, issue_description, preferred_date, preferred_time, 
          estimated_duration) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          customer_name,
          customer_phone,
          customer_email,
          scooter_brand,
          scooter_model,
          issue_description,
          preferred_date,
          preferred_time,
          estimated_duration
        ]
      );

      res.status(201).json(result.rows[0]);

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
