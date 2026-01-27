# Avalon Games Platform

Platform Top-Up Game otomatis yang terintegrasi dengan **Midtrans** (Pembayaran) dan **Apigames** (Provider Vouchers/Diamonds). Dibangun menggunakan React (Frontend) dan Node.js Express (Backend).

## 📋 Prasyarat (Prerequisites)

Sebelum memulai, pastikan Anda telah menginstal:
*   **Node.js** (v16 atau lebih baru)
*   **PostgreSQL** (Database)
*   Account & API Keys dari [Midtrans](https://midtrans.com/) (Sandbox/Production)
*   Account & API Keys dari [Apigames](https://apigames.id/)

## 🚀 Cara Menjalankan (Step-by-Step)

### 1. Setup Database
1.  Buka terminal atau tool database Anda (pgAdmin/DBeaver).
2.  Buat database baru dengan nama `avalon`:
    ```sql
    CREATE DATABASE avalon;
    ```
    *(Tabel akan otomatis dibuat saat backend dijalankan pertama kali)*

---

### 2. Konfigurasi Backend (Server)

1.  Masuk ke folder backend:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Buat file `.env` di dalam folder `backend` dan isi konfigurasi berikut:
    ```properties
    PORT=5000
    
    # Database Config
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=root  # Sesuaikan dengan password database local Anda
    DB_NAME=avalon
    
    # Keamanan
    JWT_SECRET=rahasia_super_aman_123

    # Apigames (Provider)
    APIGAMES_MERCHANT_ID=M2xxxxxxxxx
    APIGAMES_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

    # Midtrans (Payment Gateway)
    # Gunakan kunci SANDBOX untuk testing awal
    MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
    MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
    MIDTRANS_IS_PRODUCTION=false  # Set 'true' jika sudah siap live
    ```
4.  Jalankan server:
    ```bash
    node server.js
    ```
    *Jika sukses, akan muncul pesan `Server is running on port 5000` dan `Synced db`.*

---

### 3. Konfigurasi Frontend (Web)

1.  Buka terminal baru (biarkan terminal backend tetap jalan).
2.  Masuk ke folder root project (jika dari folder backend, `cd ..`).
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Jalankan website:
    ```bash
    npm run dev
    ```
5.  Buka browser di `http://localhost:5173`.

## 🛠️ Fitur & Cara Testing

### 1. Cek Username (Validasi ID)
*   Saat user memasukkan ID Game (misal Mobile Legends), klik tombol **CEK**.
*   Backend akan menghubungi Apigames untuk memastikan ID valid dan menampilkan Nickname user.

### 2. Pembayaran (Midtrans Snap)
*   Pilih item, klik **Beli**.
*   Akan muncul popup pembayaran.
*   **Mode Sandbox**: Pilih metode pembayaran simulator (contoh: BCA Virtual Account), lalu bayar lewat simulator Midtrans.

### 3. Top Up Otomatis
*   Setelah pembayaran sukses (`Settlement`), backend otomatis mengirim request ke Apigames.
*   Apigames akan memproses kirim Diamond ke akun user secara real-time.

## ⚠️ Troubleshooting Umum

*   **Error "Merchant not found" (Midtrans)**:
    *   Pastikan Client Key & Server Key di `.env` sesuai dengan environment (Sandbox vs Production).
    *   Jangan lupa restart backend (`Ctrl+C` lalu `node server.js`) setiap ada perubahan di `.env`.

*   **Error "Signature not valid" (Apigames)**:
    *   Request transaksi ke Apigames menggunakan method `GET` query params dengan rumus signature `MD5(merchant_id:secret_key:ref_id)`. Logic ini sudah ditangani di `provider.service.js`.

*   **Database Error**:
    *   Pastikan PostgreSQL service sedang berjalan dan username/password di `.env` benar.

## 📂 Struktur Project

*   `/backend` - Server API, logika Transaksi, Payment, dan Provider.
*   `/src` & `pages` - Halaman Frontend React.
*   `/services` - Frontend services (API calls).

---
*Dibuat oleh Tim Development Avalon Games Platform.*
