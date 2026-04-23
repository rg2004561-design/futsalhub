# 🎯 Sistem Informasi Peminjaman Lapangan Futsal - Implementation Guide

## 📋 Ringkasan Implementasi

Sistem booking lapangan futsal berbasis web dengan integrasi **Midtrans** payment gateway telah berhasil dibangun. Berikut adalah detail lengkapnya:

---

## ✅ Fitur yang Sudah Diimplementasikan

### 🔐 **1. Authentication & User Management**
- ✓ Register dengan fields: nama, email, phone, address, password
- ✓ Login untuk user existing
- ✓ Password reset via email (siap untuk dikonfigurasi)
- ✓ Role-based access (user & admin)
- ✓ User model dengan extended fields (phone, address, role)

### 🏟️ **2. Court Management**
- ✓ Courts listing dengan search & filter
- ✓ Detail lapangan dengan galeri foto
- ✓ Pricing management (weekday & weekend)
- ✓ Fasilitas lapangan (JSON storage)
- ✓ Operating hours management

### 📅 **3. Booking System (Core Feature)**
- ✓ Browse courts dan lihat ketersediaan slots
- ✓ **Card-based slot picker** dengan multi-select (user bisa pilih 2+ jam)
- ✓ Draft → Pending → Paid → Completed booking flow
- ✓ Anti-double booking (database locks + validation)
- ✓ Booking code generation unik
- ✓ 24-hour payment deadline (expires_at)
- ✓ Booking history untuk user

### 💳 **4. Payment Gateway (Midtrans)**
- ✓ Midtrans Snap.js integration
- ✓ Generate payment token untuk setiap booking
- ✓ Support multiple payment methods:
  - Kartu Kredit/Debit
  - Transfer Bank
  - E-wallet (DANA, OVO, GCash, dll)
- ✓ Webhook handling dari Midtrans
- ✓ Automatic status update: Pending → Settlement (Paid)
- ✓ Transaction history dengan Midtrans response

### 📧 **5. Email Notifications**
- ✓ Booking confirmation email setelah booking dibuat
- ✓ Payment confirmation email setelah pembayaran sukses
- ✓ Booking reminder email template (siap diintegrasikan)
- ✓ Markdown email templates yang professional

### ⏲️ **6. Automatic Status Management**
- ✓ Artisan Command untuk update expired bookings
- ✓ Scheduled task: ekspirasi booking pending setelah 24jam
- ✓ Auto-complete untuk booking yang sudah lewat tanggalnya
- ✓ Transaction status sync dengan Midtrans

---

## 📁 Project Structure

```
app/
├── Models/
│   ├── User.php              # Extended dengan phone, address, role
│   ├── Court.php
│   ├── CourtPrice.php
│   ├── CourtPhoto.php
│   ├── Booking.php
│   ├── BookingSlot.php
│   └── Transaction.php
│
├── Http/Controllers/
│   ├── Auth/RegisteredUserController.php
│   ├── CourtController.php           # Browse & filter courts
│   ├── BookingController.php         # Booking CRUD
│   └── TransactionController.php     # Payment & Midtrans
│
├── Http/Requests/
│   └── StoreBookingRequest.php       # Booking validation
│
├── Policies/
│   └── BookingPolicy.php             # Authorization
│
├── Mail/
│   ├── BookingConfirmation.php
│   ├── PaymentConfirmation.php
│   └── BookingReminder.php
│
├── Services/
│   └── MidtransService.php           # Midtrans integration layer
│
└── Console/
    ├── Commands/
    │   └── UpdateExpiredBookings.php
    └── Kernel.php                    # Scheduled task

database/
├── migrations/           # 7 migrations dibuat
└── seeders/
    ├── DatabaseSeeder.php
    └── CourtSeeder.php               # Sample court data

resources/js/pages/
├── courts/
│   ├── index.tsx         # Listing lapangan
│   └── show.tsx          # Detail court dengan slot picker (CARD UI)
├── bookings/
│   ├── create.tsx        # Form booking
│   ├── show.tsx          # Booking detail
│   └── history.tsx       # User's booking history
├── payments/
│   └── index.tsx         # Payment page dengan Midtrans Snap
└── auth/
    └── register.tsx      # Extended dengan phone & address

routes/
└── web.php               # Court, Booking, Payment routes

config/
└── midtrans.php          # Midtrans configuration

.env                       # Updated dengan MIDTRANS credentials
```

---

## 🚀 Cara Setup & Menjalankan

### 1. **Install Dependencies**
```bash
composer install
npm install
```

### 2. **Database Setup**
```bash
php artisan migrate                 # Run migrations
php artisan db:seed                 # Seed sample courts
```

### 3. **Midtrans Configuration**
Update `.env` dengan credentials Midtrans:
```env
MIDTRANS_SERVER_KEY=YOUR_SERVER_KEY
MIDTRANS_CLIENT_KEY=YOUR_CLIENT_KEY
MIDTRANS_IS_PRODUCTION=false        # true untuk production
```

> **Dapatkan test credentials dari:** https://dashboard.midtrans.com/settings/config_info

### 4. **Run Development Server**
```bash
php artisan serve          # Backend - runs on http://localhost:8000
npm run dev                # Vite frontend dev server
```

### 5. **Queue Setup (untuk email)**
```bash
# Di .env, set QUEUE_CONNECTION=sync untuk development
# Atau gunakan: php artisan queue:work

# Untuk production, gunakan database queue:
php artisan queue:work --queue=default
```

---

## 🔧 Key Features Details

### 📍 **Slot Selection dengan Card UI**
Saat user memilih tanggal, menampilkan kartu untuk setiap jam yang tersedia:
- **Tersedia**: Border biru, bisa diklik, multi-select
- **Sudah pesan**: Opacity rendah, disabled (tampil "Sudah dipesan")
- **Dipilih**: Highlight biru dengan checkbox

User bisa memilih 2+ jam sekaligus untuk booking multi-jam.

### 🔒 **Anti Double-Booking**
1. Database locks pada query saat create booking
2. Validasi overlap antara slot yang dipilih dengan existing bookings
3. Real-time availability check saat user browse

### 💰 **Payment Flow**
1. Booking dibuat (status: draft)
2. User submit booking (status: pending, expires_at: +24 jam)
3. User membayar via Midtrans Snap → redirect ke payment page
4. Midtrans webhook update status ke "settlement" (paid)
5. Email konfirmasi pembayaran dikirim
6. Booking status berubah menjadi "paid"

### 📨 **Email Notifications**
- **On Booking Create**: "Konfirmasi Booking" (review + payment info)
- **On Payment Success**: "Konfirmasi Pembayaran"
- **Reminder** (manual trigger): "Pengingat Booking" sehari sebelum

### ⏳ **Automatic Expiry**
**Command**: `php artisan bookings:expire-outdated`
- Pending booking > 24 jam → dibatalkan
- Paid booking (tanggal lewat) → completed
- Run hourly via scheduler

---

## 🧪 Testing

### Test Data
**User untuk testing:**
- Admin: email: `admin@example.com`, password: `password`, role: admin
- Regular User: email: `test@example.com`, password: `password`

**Sample Courts:**
- Lapangan Premium 1, 2 (4 slots masing-masing)
- Lapangan Standard (2 slots)

**Pricing:**
- Weekday prime: Rp 80.000-100.000/jam
- Weekend prime: Rp 120.000-150.000/jam
- Off-peak: Rp 40.000-70.000/jam

### Test Midtrans Payment
Gunakan **test credentials dari Midtrans dashboard**:
```
Test Bank Transfer:
- Bank BCA: 1112481
- Bank Mandiri: 1111481

Test Credit Card:
- Card No: 5111 1111 1111 1142
- CVV: 123
- Exp: 12/25
```

---

## 📱 Frontend Pages

| Route | Component | Fitur |
|-------|-----------|-------|
| `/` | welcome | Landing page |
| `/courts` | courts/index | Daftar lapangan |
| `/courts/{slug}` | courts/show | Detail + slot picker (CARD UI) |
| `/bookings/create` | bookings/create | Form booking |
| `/bookings/{id}` | bookings/show | Detail booking |
| `/bookings` | bookings/history | Riwayat booking user |
| `/bookings/{id}/payment` | payments/index | Payment page (Snap.js) |
| `/register` | auth/register | Register (extended fields) |
| `/login` | auth/login | Login |

---

## 📊 Database Schema

**Tables:**
- `users` - Extended: phone, address, role
- `courts` - Lapangan
- `court_prices` - Pricing per jam & hari type
- `court_photos` - Galeri lapangan
- `bookings` - Booking records
- `booking_slots` - Time slots untuk setiap booking
- `transactions` - Payment records dari Midtrans

**Key Indexes:**
- `bookings(user_id, booking_date)`
- `booking_slots(booking_id, start_time)`
- `transactions(booking_id, transaction_id)`

---

## 🔐 Security Features

1. **Authorization**: Booking policy untuk user-only access
2. **Rate Limiting**: Throttle pada auth routes
3. **Signature Verification**: Midtrans webhook signature check
4. **Database Locks**: Pessimistic locking saat booking create
5. **CSRF Protection**: Laravel Sanctum/built-in CSRF token
6. **Input Validation**: Form requests + Laravelvalidation rules

---

## 🚨 Important Notes

### Untuk Production:
1. Set `MIDTRANS_IS_PRODUCTION=true` di .env
2. Update Server Key & Client Key dengan production credentials
3. Setup email driver yang proper (bukan `log`)
4. Enable SSL/HTTPS
5. Setup proper database backups
6. Configure queue worker untuk email delivery
7. Setup logging & monitoring
8. Rate limiting lebih ketat

### Webhook Configuration:
Di Midtrans Dashboard → Settings → Configuration:
- **Finish Redirect URL**: `https://yourdomain.com/payment-callback`
- **Unfinish Redirect URL**: `https://yourdomain.com/bookings/{booking_id}/payment`
- **Error Redirect URL**: `https://yourdomain.com/bookings/{booking_id}`
- **Webhook URL**: `https://yourdomain.com/webhook/midtrans`

### Email Driver:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io    # atau service lainnya
MAIL_PORT=465
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=ssl
```

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Admin panel untuk manage courts, prices, bookings
- [ ] WhatsApp notifikasi (via Twilio/WhatsApp Business API)
- [ ] Refund processing untuk booking cancelled
- [ ] Booking analytics & reports
- [ ] Rating & review untuk lapangan
- [ ] Loyalty program / loyalty points
- [ ] Mobile app (React Native)
- [ ] Calendar view untuk availability
- [ ] Export booking report (PDF)
- [ ] Complaint/Issue management system

---

## 📞 Support & Troubleshooting

**Common Issues:**

1. **Email tidak terkirim:**
   - Check `.env` mail configuration
   - Ensure queue worker running: `php artisan queue:work`
   - Check storage/logs untuk error details

2. **Midtrans payment error:**
   - Verify Server Key & Client Key valid
   - Check webhook logs di Midtrans dashboard
   - Ensure domain accessible dari Midtrans server

3. **Double-booking issue:**
   - Clear database locks: Check no running transactions
   - Verify migration ran: `php artisan migrate:status`

4. **Slot tidak muncul:**
   - Verify court prices seeded dengan benar
   - Check date format (Y-m-d)
   - Ensure court is marked `is_active = true`

---

**Dokumentasi dibuat pada:** 23 April 2026

Untuk info lebih lanjut, baca code comments dan dokumentasi inline di setiap file.
