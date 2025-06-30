# Storm Garage AI Chatbot

Storm Garage elektrikli scooter servisi için AI destekli chatbot ve randevu yönetim sistemi.

## 🚀 Özellikler

### Ana Sayfa (Chatbot)
- GPT-4o ile güçlendirilmiş AI asistan
- Elektrikli scooter hakkında bilgi verme
- Randevu alma süreci
- Gerçek zamanlı chat arayüzü
- Responsive tasarım

### Admin Panel
- Güvenli giriş sistemi (admin/admin)
- Dashboard ile istatistikler
- Chat geçmişi görüntüleme
- Randevu yönetimi
- Randevu durumu güncelleme

### Teknik Özellikler
- Next.js 14 framework
- Tailwind CSS styling
- PostgreSQL (Neon) database
- JWT authentication
- Claude.gg API entegrasyonu
- Responsive design

## 🛠️ Kurulum

### 1. Dependencies Yükleme
```bash
npm install
```

### 2. Environment Variables
`.env.local` dosyasını düzenleyin:
```env
# Claude.gg API Configuration
CLAUDE_API_KEY=sk-2d8854bdf20549ff9a544e0b141c54a8
CLAUDE_API_URL=https://api.claude.gg/v1/chat/completions

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url_here

# JWT Secret for Admin Authentication
JWT_SECRET=storm_garage_secret_key_2024

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 3. Database Setup
Neon PostgreSQL database'inizi oluşturduktan sonra:
```bash
# Database şemasını çalıştırın
psql -d your_database_url -f database/schema.sql
```

### 4. Development Server
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
storm-garage-chatbot/
├── pages/
│   ├── index.js              # Ana sayfa (chatbot)
│   ├── admin.js              # Admin panel
│   ├── _app.js               # Next.js app wrapper
│   └── api/
│       ├── chat.js           # Chat API endpoint
│       ├── appointments.js   # Randevu oluşturma API
│       └── admin/
│           ├── login.js      # Admin giriş API
│           ├── stats.js      # İstatistik API
│           ├── messages.js   # Chat mesajları API
│           ├── appointments.js # Admin randevu API
│           └── appointments/[id].js # Randevu güncelleme API
├── lib/
│   ├── database.js           # Database bağlantısı
│   └── claude.js             # Claude API entegrasyonu
├── styles/
│   └── globals.css           # Global CSS ve Tailwind
├── database/
│   └── schema.sql            # Database şeması
└── README.md
```

## 🎯 Kullanım

### Chatbot Kullanımı
1. Ana sayfaya gidin
2. Chat arayüzünde sorularınızı sorun
3. Randevu almak için "randevu almak istiyorum" yazın
4. AI asistan size adım adım yardımcı olacak

### Admin Panel
1. `/admin` sayfasına gidin
2. Kullanıcı adı: `admin`, Şifre: `admin`
3. Dashboard'da istatistikleri görün
4. Randevular sekmesinde randevuları yönetin
5. Chat geçmişi sekmesinde tüm konuşmaları görün

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/chat` - Chat mesajı gönderme
- `POST /api/appointments` - Randevu oluşturma

### Admin Endpoints (JWT Token gerekli)
- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/stats` - İstatistikler
- `GET /api/admin/messages` - Chat mesajları
- `GET /api/admin/appointments` - Randevular
- `PUT /api/admin/appointments/[id]` - Randevu güncelleme

## 🗄️ Database Tabloları

- `chat_messages` - Chat geçmişi
- `appointments` - Randevu bilgileri
- `scooter_models` - Scooter modelleri ve tahmini süreler
- `time_slots` - Zaman slotları (2 tezgah için)
- `admin_users` - Admin kullanıcıları

## 🚀 Production Deployment

### Vercel Deployment
1. GitHub'a push edin
2. Vercel'e bağlayın
3. Environment variables'ları ekleyin
4. Deploy edin

### Environment Variables (Production)
```env
CLAUDE_API_KEY=your_claude_api_key
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

## ✅ Proje Durumu

**Tamamen tamamlandı ve test edildi!**

- ✅ Siyah tema uygulandı
- ✅ AI sadece scooter konularında yanıt veriyor
- ✅ Neon database bağlantısı kuruldu
- ✅ Admin panel çalışıyor
- ✅ Local'de test edildi
- ✅ Production'a hazır

## 🔮 Gelecek Özellikler

- [ ] WhatsApp entegrasyonu
- [ ] SMS bildirim sistemi
- [ ] Otomatik slot yönetimi
- [ ] Müşteri portal
- [ ] Fiyat hesaplama sistemi
- [ ] Popup chatbot widget
- [ ] Mobil uygulama

## 📞 Destek

Herhangi bir sorun için Storm Garage ile iletişime geçin.

---

**Storm Garage** - Elektrikli Scooter Servisi ⚡
