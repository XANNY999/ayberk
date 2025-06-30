import jwt from 'jsonwebtoken';
import { query } from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET || 'storm_garage_secret_key_2024';

    console.log('Login attempt:', { username });

    // Check against database first
    try {
      const result = await query(
        'SELECT * FROM admin_users WHERE username = $1 AND password_hash = $2',
        [username, password]
      );

      if (result.rows.length > 0) {
        // Database authentication successful
        const token = jwt.sign(
          { username: username, role: 'admin' },
          jwtSecret,
          { expiresIn: '24h' }
        );

        // Update last login
        await query(
          'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE username = $1',
          [username]
        );

        res.status(200).json({
          success: true,
          token: token,
          message: 'Login successful'
        });
        return;
      }
    } catch (dbError) {
      console.log('Database auth failed, trying env vars:', dbError.message);
    }

    // Fallback to environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (username === adminUsername && password === adminPassword) {
      // Generate JWT token
      const token = jwt.sign(
        { username: adminUsername, role: 'admin' },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        token: token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
