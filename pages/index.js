import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate session ID
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);

    // Welcome message
    setMessages([{
      type: 'bot',
      content: 'Merhaba! Storm Garage elektrikli scooter servisine hoş geldiniz! 🛴\n\nSize nasıl yardımcı olabilirim? Randevu almak, scooter bakımı hakkında bilgi almak veya teknik sorularınız için buradayım.',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        sessionId: sessionId,
        messages: messages.filter(msg => msg.type === 'user' || msg.type === 'bot').map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      });

      const botMessage = {
        type: 'bot',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Check if appointment info is provided and create appointment
      if (response.data.appointmentInfo) {
        try {
          const appointmentResponse = await axios.post('/api/appointments', response.data.appointmentInfo);
          console.log('Appointment created:', appointmentResponse.data);
          
          // Add success message
          const successMessage = {
            type: 'bot',
            content: '✅ Randevunuz başarıyla oluşturuldu! Admin onayından sonra size bilgi verilecektir.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, successMessage]);
        } catch (appointmentError) {
          console.error('Appointment creation error:', appointmentError);
          
          // Add error message
          const errorMessage = {
            type: 'bot',
            content: '❌ Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin veya telefon ile iletişime geçin.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      <Head>
        <title>Storm Garage - Elektrikli Scooter Servisi</title>
        <meta name="description" content="Storm Garage elektrikli scooter tamiri ve bakımı. AI asistan ile randevu alın." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-storm-dark">
        {/* Header */}
        <header className="bg-storm-light shadow-sm border-b border-storm-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-storm-blue">⚡ Storm Garage</div>
                <div className="ml-3 text-sm text-gray-600">Elektrikli Scooter Servisi</div>
              </div>
              <a 
                href="/admin" 
                className="text-sm text-gray-500 hover:text-storm-blue transition-colors"
              >
                Admin Panel
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-storm-blue text-white px-6 py-4">
              <h1 className="text-xl font-semibold">Storm Garage AI Asistan</h1>
              <p className="text-blue-100 text-sm mt-1">
                Randevu almak ve sorularınız için benimle konuşabilirsiniz
              </p>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 chat-container">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`chat-message ${message.type}`}>
                      <div className="text-sm">
                        {formatMessage(message.content)}
                      </div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-message bot">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex space-x-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın... (Enter ile gönder)"
                  className="flex-1 input-field resize-none"
                  rows="2"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-storm-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-white mb-3">🔧 Hizmetlerimiz</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Genel bakım ve kontrol</li>
                <li>• Fren sistemi tamiri</li>
                <li>• Batarya değişimi</li>
                <li>• Lastik değişimi</li>
                <li>• Motor bakımı</li>
                <li>• Elektronik sistem tamiri</li>
              </ul>
            </div>

            <div className="bg-storm-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-white mb-3">📞 İletişim</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p><strong className="text-white">Çalışma Saatleri:</strong><br />Pazartesi - Cumartesi: 09:00 - 18:00</p>
                <p><strong className="text-white">Kapasite:</strong><br />2 tezgah - Aynı anda 2 scooter</p>
                <p><strong className="text-white">Randevu:</strong><br />AI asistan ile hemen randevu alın!</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
