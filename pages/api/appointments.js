import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      scooter_brand,
      scooter_model,
      issue_description,
      preferred_date,
      preferred_time
    } = req.body;

    // Validate required fields
    if (!customer_name || !customer_phone || !scooter_brand || !scooter_model || !issue_description || !preferred_date || !preferred_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get estimated service time based on scooter model
    let estimated_duration = 60; // default 60 minutes
    
    try {
      const scooterResult = await pool.query(
        'SELECT estimated_service_time FROM scooter_models WHERE LOWER(brand) = LOWER($1) AND LOWER(model) LIKE LOWER($2)',
        [scooter_brand, `%${scooter_model}%`]
      );
      
      if (scooterResult.rows.length > 0) {
        estimated_duration = scooterResult.rows[0].estimated_service_time;
      }
    } catch (dbError) {
      console.log('Could not fetch scooter model info, using default duration');
    }

    // Create appointment
    const result = await pool.query(
      `INSERT INTO appointments 
       (customer_name, customer_phone, customer_email, scooter_brand, 
        scooter_model, issue_description, preferred_date, preferred_time, 
        estimated_duration, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending') 
       RETURNING *`,
      [
        customer_name,
        customer_phone,
        customer_email || null,
        scooter_brand,
        scooter_model,
        issue_description,
        preferred_date,
        preferred_time,
        estimated_duration
      ]
    );

    res.status(201).json({
      success: true,
      appointment: result.rows[0],
      message: 'Randevunuz başarıyla oluşturuldu. Admin onayından sonra size bilgi verilecektir.'
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Randevu oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    });
  }
}
