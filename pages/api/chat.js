import { getChatResponse, extractAppointmentInfo, isAppointmentRequest } from '../../lib/claude';

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

    // TODO: Save chat message to database when schema is ready
    console.log('Chat message:', { sessionId, message, botResponse });

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
