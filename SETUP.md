# Storm Garage Chatbot - Kurulum Rehberi

## 🗄️ Neon Database Kurulumu

### 1. Neon Hesabı Oluşturma
1. [Neon.tech](https://neon.tech) adresine gidin
2. Ücretsiz hesap oluşturun
3. Yeni bir PostgreSQL database projesi oluşturun

### 2. Database Connection String Alma
1. Neon dashboard'unda projenizi açın
2. "Connection Details" bölümünden connection string'i kopyalayın
3. Format: `postgresql://username:password@hostname/database?sslmode=require`

### 3. Environment Variables Güncelleme
`.env.local` dosyasını açın ve `DATABASE_URL`'i güncelleyin:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://your_username:your_password@your_hostname/your_database?sslmode=require
```

### 4. Database Schema Kurulumu
Neon SQL Editor'da veya psql ile `database/schema.sql` dosyasını çalıştırın:

```bash
# Eğer psql kuruluysa:
psql "postgresql://your_connection_string" -f database/schema.sql
```

Veya Neon SQL Editor'da schema.sql içeriğini kopyalayıp çalıştırın.

## 🚀 Çalıştırma

```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev
```

Uygulama http://localhost:3000 (veya 3001) adresinde çalışacak.

## 🔧 Test Etme

### Chatbot Testi
1. Ana sayfaya gidin
2. "Merhaba, randevu almak istiyorum" yazın
3. AI asistanın yanıt verdiğini kontrol edin

### Admin Panel Testi
1. `/admin` sayfasına gidin
2. Kullanıcı adı: `admin`, Şifre: `admin`
3. Dashboard'ın yüklendiğini kontrol edin

## 📊 Database Tabloları

Kurulum sonrası oluşacak tablolar:

- `chat_messages` - Chat geçmişi
- `appointments` - Randevu bilgileri
- `scooter_models` - Scooter modelleri (önceden doldurulmuş)
- `time_slots` - Zaman slotları
- `admin_users` - Admin kullanıcıları

## 🔐 Güvenlik

Production için:
1. `.env.local` dosyasındaki `ADMIN_PASSWORD`'ü değiştirin
2. `JWT_SECRET`'ı güçlü bir değerle değiştirin
3. Database şifrelerini güvenli tutun

## 🌐 Production Deployment

### Vercel Deployment
1. GitHub'a push edin
2. Vercel'e bağlayın
3. Environment variables ekleyin:
   - `CLAUDE_API_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

## 🆘 Sorun Giderme

### Database Bağlantı Hatası
- Connection string'in doğru olduğunu kontrol edin
- Neon database'inin aktif olduğunu kontrol edin
- SSL sertifikası sorunları için `?sslmode=require` ekleyin

### Claude API Hatası
- API key'in doğru olduğunu kontrol edin
- Rate limit'e takılmadığınızı kontrol edin

### Admin Panel Giriş Sorunu
- Username/password'ün doğru olduğunu kontrol edin
- JWT_SECRET'ın ayarlandığını kontrol edin

## 📞 Destek

Herhangi bir sorun için:
1. Terminal loglarını kontrol edin
2. Browser console'u kontrol edin
3. Environment variables'ları kontrol edin

---

**Storm Garage** - Elektrikli Scooter Servisi ⚡
