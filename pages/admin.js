import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('admin_token', response.data.token);
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        alert('Geçersiz kullanıcı adı veya şifre');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Giriş yapılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, messagesRes, appointmentsRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/admin/messages', { headers }),
        axios.get('/api/admin/appointments', { headers })
      ]);

      setStats(statsRes.data);
      setChatMessages(messagesRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`/api/admin/appointments/${appointmentId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      loadDashboardData(); // Refresh data
      alert('Randevu durumu güncellendi');
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Güncelleme sırasında hata oluştu');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Panel - Storm Garage</title>
        </Head>
        
        <div className="min-h-screen bg-storm-dark flex items-center justify-center">
          <div className="max-w-md w-full bg-storm-light rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-storm-blue">⚡ Storm Garage</h1>
              <p className="text-gray-300 mt-2">Admin Panel Girişi</p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-white text-sm font-bold mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Storm Garage</title>
      </Head>

      <div className="min-h-screen bg-storm-dark">
        {/* Header */}
        <header className="bg-storm-light shadow-sm border-b border-storm-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-storm-blue">⚡ Storm Garage</div>
                <div className="ml-3 text-sm text-gray-300">Admin Panel</div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-sm text-gray-300 hover:text-storm-blue">
                  Ana Sayfa
                </a>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'appointments', label: 'Randevular', icon: '📅' },
                { id: 'messages', label: 'Chat Geçmişi', icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-storm-blue text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-storm-dark mb-2">
                  Toplam Mesaj
                </h3>
                <p className="text-3xl font-bold text-storm-blue">
                  {stats.totalMessages || 0}
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-storm-dark mb-2">
                  Bekleyen Randevular
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingAppointments || 0}
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-storm-dark mb-2">
                  Bugünkü Mesajlar
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.todayMessages || 0}
                </p>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-storm-dark mb-4">
                Randevu Yönetimi
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scooter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih/Saat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.customer_phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.scooter_brand} {appointment.scooter_model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.issue_description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(appointment.preferred_date).toLocaleDateString('tr-TR')}
                          <br />
                          {appointment.preferred_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'pending' ? 'Bekliyor' :
                             appointment.status === 'confirmed' ? 'Onaylandı' :
                             appointment.status === 'completed' ? 'Tamamlandı' : 'İptal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={appointment.status}
                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Bekliyor</option>
                            <option value="confirmed">Onayla</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="cancelled">İptal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-storm-dark mb-4">
                Chat Geçmişi
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Session: {message.session_id.slice(-8)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded mb-2">
                      <p className="text-sm text-blue-800">
                        <strong>Kullanıcı:</strong> {message.user_message}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-800">
                        <strong>Bot:</strong> {message.bot_response}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
