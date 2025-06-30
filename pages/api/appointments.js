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

    // TODO: Save to database when schema is ready
    console.log('Appointment request:', {
      customer_name,
      customer_phone,
      customer_email,
      scooter_brand,
      scooter_model,
      issue_description,
      preferred_date,
      preferred_time
    });

    // Mock appointment response
    const mockAppointment = {
      id: Date.now(),
      customer_name,
      customer_phone,
      customer_email,
      scooter_brand,
      scooter_model,
      issue_description,
      preferred_date,
      preferred_time,
      estimated_duration: 60,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      appointment: mockAppointment,
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
