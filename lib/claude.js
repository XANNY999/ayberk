import axios from 'axios';

const CLAUDE_API_URL = 'https://api.claude.gg/v1/chat/completions';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const STORM_GARAGE_PROMPT = `Sen Storm Garage elektrikli scooter servisinin AI asistanısın. 

ÖNEMLİ: SADECE elektrikli scooter ve Storm Garage servisi ile ilgili konularda yardım edebilirsin. Başka hiçbir konuda (ev, tesisatçılık, genel yaşam tavsiyeleri, teknoloji, vs.) yardım etmezsin.

GÖREV ALANI:
1. STORM GARAGE SERVİSİ:
- Elektrikli scooter tamiri ve bakımı
- 2 tezgah kapasitesi
- Randevu alma sistemi
- Servis hizmetleri ve fiyatları

2. ELEKTRİKLİ SCOOTER KONULARI:
- Scooter bakımı ve tamiri
- Fren, batarya, lastik, motor sorunları
- Güvenlik önerileri
- Marka ve model bilgileri

3. RANDEVU SİSTEMİ:
Randevu için topla: İsim, telefon, scooter marka/model, sorun, tarih/saat

YASAK KONULAR:
- Ev tamiri, tesisatçılık, elektrikçilik
- Genel yaşam tavsiyeleri
- Teknoloji, bilgisayar, telefon
- Sağlık, hukuk, finans
- Diğer tüm konular

KURAL: Elektrikli scooter ve Storm Garage dışında bir soru gelirse şu yanıtı ver:
"Üzgünüm, ben sadece Storm Garage elektrikli scooter servisi konularında yardımcı olabilirim. Scooter'ınızla ilgili bir sorunuz var mı?"

Şimdi müşteriyle konuşmaya başla!`;

export async function getChatResponse(messages, sessionId) {
  try {
    // Add system prompt as the first message
    const systemMessage = {
      role: 'system',
      content: STORM_GARAGE_PROMPT
    };

    const apiMessages = [systemMessage, ...messages];

    const response = await axios.post(CLAUDE_API_URL, {
      model: 'gpt-4o',
      messages: apiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${CLAUDE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from Claude API');
    }
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    
    // Fallback response
    return 'Üzgünüm, şu anda teknik bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin veya doğrudan telefon ile iletişime geçin.';
  }
}

export function extractAppointmentInfo(message) {
  // Simple regex patterns to extract appointment information
  const patterns = {
    name: /(?:adım|ismim|ben)\s+([a-zA-ZğüşıöçĞÜŞİÖÇ\s]+)/i,
    phone: /(?:telefon|numara|tel).*?(\d{10,11})/i,
    email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    scooter: /(?:scooter|skuter).*?(xiaomi|ninebot|segway|kugoo|mi|pro)/i,
    issue: /(?:sorun|problem|arıza|bozuk).*?([a-zA-ZğüşıöçĞÜŞİÖÇ\s]+)/i,
  };

  const extracted = {};
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = message.match(pattern);
    if (match) {
      extracted[key] = match[1].trim();
    }
  }

  return extracted;
}

export function isAppointmentRequest(message) {
  const appointmentKeywords = [
    'randevu', 'appointment', 'gelir', 'gelirim', 'getir', 'getiririm',
    'tamir', 'bakım', 'kontrol', 'servis', 'tamirci'
  ];
  
  return appointmentKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}
