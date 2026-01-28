# Avalon Games Platform 🎮

Platform Top-Up Game profesional yang aman, cepat, dan responsif. Terintegrasi dengan **Midtrans** (Pembayaran) dan **Apigames** (Provider Game).

![Avalon Games Banner](https://i.ibb.co/8Lc8HJbB/avalon.png)

## ✨ Fitur Utama (Features)

### 👤 Frontend (User)
*   **Browsing Game**: Kategori game lengkap (Mobile Legends, Free Fire, dll) dengan filter & pencarian.
*   **Dynamic Banners**: Banner informasi promo yang dinamis dan terupdate.
*   **Transaksi Instan**: Cek ID otomatis dan pembayaran via Midtrans Snap.
*   **Sistem Voucher**: Gunakan kode promo untuk diskon spesial saat checkout.
*   **Mobile Responsive**: Tampilan optimal di HP dengan Mobile Navbar & Layout adaptif.
*   **User Profile**: Kelola data diri dan riwayat transaksi.
*   **Auth System**: Login, Register, dan Verifikasi Email (OTP).

### 🛡️ Dashboard Admin
*   **Traffic Analytics**: Grafik kunjungan website harian real-time.
*   **Banner Management**: Upload, aktifkan, atau hapus banner promo.
*   **Voucher Management**: Buat kode voucher, atur diskon, kuota, dan masa berlaku.
*   **System Logs**: Pantau aktivitas sistem (Login, Error, Transaksi) secara detail.
*   **Manajemen User & Transaksi**: Lihat status transaksi dan daftar pengguna.

## 📋 Prasyarat (Prerequisites)

*   **Node.js** (v18+)
*   **PostgreSQL** (Database)
*   **Midtrans Account** (Payment Gateway)
*   **Apigames Account** (Provider Topup)

## 🚀 Cara Menjalankan (Installation)

### 1. Setup Backend
1.  Masuk ke folder backend: `cd backend`
2.  Install dependencies: `npm install`
3.  Buat file `.env` di dalam folder `backend` (lihat contoh di bawah).
4.  Jalankan server:
    ```bash
    node server.js
    ```
    *(Database akan otomatis tersinkronisasi dan Admin default akan dibuat)*

### 2. Setup Frontend
1.  Buka terminal baru di root project.
2.  Install dependencies: `npm install`
3.  Jalankan mode development:
    ```bash
    npm run dev
    ```
4.  Buka browser di: `http://localhost:3000` (atau port yang dimunculkan terminal).

---

## ⚙️ Konfigurasi .env (Backend)

Pastikan file `.env` di folder `backend/` memiliki konfigurasi ini:

```properties
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=avalon

# Security
JWT_SECRET=your_super_secret_key

# Third Party Services
APIGAMES_MERCHANT_ID=M2xxxx
APIGAMES_SECRET_KEY=xxxxxx

MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false

# Email Service (Nodemailer)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔑 Akun Default (Seeder)

Saat backend pertama kali dijalankan, sistem akan membuat akun Admin otomatis:
*   **Username**: `admin`
*   **Password**: `admin123`
*   **Role**: `Admin`

Gunakan akun ini untuk mengakses Dashboard Admin di `/admin`.

## 📂 Struktur Project

*   `/pages` - Halaman React (Landing, Admin, Login, dll).
*   `/backend/models` - Schema Database (User, Game, Transaction, Voucher, Banner, Log, Stats).
*   `/backend/controllers` - Logika bisnis API.
*   `/services` - Frontend Service untuk komunikasi ke API.

## 📱 Mobile Support
Website ini sudah mendukung **Responsive Design**.
*   Menu navigasi otomatis berubah menjadi **Hamburger Menu** di layar kecil.
*   Grid game menyesuaikan ukuran layar (2 kolom di HP, 5 kolom di Desktop).


##Preview
![Avalon Games Preview](https://i.ibb.co/B273Y6ZS/DEMO.jpg)

---
*Powered by Avalon Ecosystem. Developed by RizkiADP.*
