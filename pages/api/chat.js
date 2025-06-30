import { getChatResponse, extractAppointmentInfo, isAppointmentRequest } from '../../lib/claude';
import { query } from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, messages = [] } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Get AI response
    const botResponse = await getChatResponse([
      ...messages,
      { role: 'user', content: message }
    ], sessionId);

    // Save chat message to database
    try {
      await query(
        'INSERT INTO chat_messages (session_id, user_message, bot_response, user_ip, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [
          sessionId,
          message,
          botResponse,
          req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
          req.headers['user-agent'] || 'unknown'
        ]
      );
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if database save fails
    }

    // Check if this is an appointment request and extract info
    let appointmentInfo = null;
    if (isAppointmentRequest(message)) {
      appointmentInfo = extractAppointmentInfo(message);
    }

    res.status(200).json({
      response: botResponse,
      appointmentInfo: appointmentInfo
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Üzgünüm, şu anda teknik bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.'
    });
  }
}
