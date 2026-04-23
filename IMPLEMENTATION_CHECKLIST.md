# ✅ Quick Start Checklist

## 🔧 Setup Awal

- [ ] Database sudah di-migrate: `php artisan migrate`
- [ ] Sample data sudah di-seed: `php artisan db:seed`
- [ ] Composer dependencies installed: `composer install`
- [ ] NPM/Yarn packages installed: `npm install`

## 🔐 Konfigurasi

- [ ] `.env` sudah dikonfigurasi dengan database
- [ ] `APP_KEY` sudah di-generate: `php artisan key:generate`
- [ ] MIDTRANS credentials di `.env`:
  - [ ] `MIDTRANS_SERVER_KEY` (dari Midtrans dashboard)
  - [ ] `MIDTRANS_CLIENT_KEY` (dari Midtrans dashboard)
  - [ ] `MIDTRANS_IS_PRODUCTION=false` (untuk testing)

## 📧 Email Setup (Optional tapi disarankan)

- [ ] Mail driver configured di `.env` (SMTP/Mailtrap)
- [ ] Mail from address configured
- [ ] Queue driver configured: `QUEUE_CONNECTION=sync` atau `database`

## 🚀 Menjalankan Project

```bash
# Terminal 1: Backend
php artisan serve

# Terminal 2: Frontend
npm run dev

# Terminal 3: (Optional) Queue worker untuk email
php artisan queue:work
```

## 🧪 Testing Flow

### 1. Register User
- [ ] Buka http://localhost:8000/register
- [ ] Isi: nama, email, phone, address, password
- [ ] Submit → auto-login ke dashboard

### 2. Browse & Book Court
- [ ] Klik "Daftar Lapangan" atau ke http://localhost:8000/courts
- [ ] Klik lapangan untuk lihat detail
- [ ] Pilih tanggal → akan muncul kartu jam (slot picker)
- [ ] Pilih 1+ jam dengan klik kartu (multi-select)
- [ ] Lihat ringkasan harga
- [ ] Lanjut ke booking → isikan form booking
- [ ] Submit booking

### 3. Pembayaran
- [ ] Dari booking detail, klik "Bayar Sekarang" atau "Lanjut Pembayaran"
- [ ] Akan muncul Midtrans payment page
- [ ] Pilih metode pembayaran (test credentials ada di IMPLEMENTATION_GUIDE.md)
- [ ] Complete payment
- [ ] Redirect ke booking detail dengan status "Terbayar"
- [ ] Check email untuk payment confirmation

### 4. Riwayat Booking
- [ ] Dashboard → Klik "Riwayat Booking"
- [ ] Lihat semua booking dengan status dan harga
- [ ] Klik booking untuk lihat detail

## 📊 Admin Testing (Optional)

Test credentials:
- Email: `admin@example.com`
- Password: `password`

(Admin panel belum diimplementasikan, bisa ditambah di phase berikutnya)

---

## 🐛 Debug Tips

### Melihat Logs
```bash
tail -f storage/logs/laravel.log    # Real-time logs
```

### Database Query Logging
Di `.env`:
```env
DB_LOG=true
```

### Midtrans Debug
- Buka Midtrans Dashboard → Logs
- Cek webhook incoming notifikasi
- Verify signature & request body

### Email Debug
Di `config/mail.php`:
```php
'driver' => env('MAIL_MAILER', 'log'),
```
(akan log email ke storage/logs saat MAIL_MAILER=log)

---

## 📝 File Penting untuk Modifikasi

Jika ingin customize:

1. **Email Templates**: `resources/views/emails/`
2. **React Components**: `resources/js/pages/`
3. **Pricing Logic**: `app/Services/MidtransService.php` + `CourtController.php`
4. **Validation**: `app/Http/Requests/StoreBookingRequest.php`
5. **Models**: `app/Models/`
6. **Routes**: `routes/web.php`

---

## 🌍 Deployment Considerations

- [ ] Database migrations run: `php artisan migrate --force`
- [ ] Compiled assets: `npm run build`
- [ ] Environment production: `APP_ENV=production`
- [ ] Midtrans production keys setup
- [ ] SSL certificate configured
- [ ] Email service properly configured
- [ ] Queue worker process running (supervisor/systemd)
- [ ] Scheduled tasks configured (Laravel scheduler via crontab)

---

## 🔄 Scheduled Commands

Terminal setup (crontab):
```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

Berguna untuk:
- Auto-expire pending bookings setiap jam
- Auto-complete passed bookings

---

## 📚 Documentation Files

- **IMPLEMENTATION_GUIDE.md** - Comprehensive guide lengkap
- **IMPLEMENTATION_CHECKLIST.md** - (file ini) Quick reference
- Code comments inline untuk detail implementasi

---

## 🎯 Verifikasi Implementasi

Pastikan semua sudah working:

- [ ] Routes: `php artisan route:list | grep court|booking|transaction`
- [ ] Migrations: `php artisan migrate:status`
- [ ] Models: Check model relationships working
- [ ] Controllers: No syntax errors
- [ ] React Components: No build errors
- [ ] Midtrans: Can generate payment token

---

## 💡 Pro Tips

1. **Testing payment tanpa Midtrans API:**
   - Gunakan test mode credentials
   - Check Midtrans logs untuk webhook notifications
   - Gunakan test payment methods

2. **Debugging Inertia routes:**
   - Add `return Inertia::render('ComponentName', $props)` di controller
   - Check network tab di browser
   - Verify component path matches file location

3. **Database optimization:**
   - Gunakan `->with()` untuk eager load relationships
   - Hindari N+1 queries
   - Index sering di-query columns

4. **Performance:**
   - Implement caching untuk court listing
   - Use paginate untuk big datasets
   - Optimize images sebelum upload

---

**Terakhir diupdate:** 23 April 2026

Jika ada error, lihat storage/logs/laravel.log untuk detail.

Good luck! 🚀
