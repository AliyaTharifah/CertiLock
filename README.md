# CertiLock

CertiLock adalah aplikasi web untuk mengamankan dan memverifikasi sertifikat digital menggunakan teknik steganografi **Least Significant Bit (LSB)** dan algoritma kompresi **Run Length Encoding (RLE)**.

## Fitur Utama
1. **Pengamanan (Generate):** Mengompresi data verifikasi sertifikat dengan RLE, mengubahnya menjadi biner, dan menyisipkannya ke piksel gambar (LSB).
2. **Verifikasi (Verify):** Mengekstrak data biner dari gambar, mendekompresinya, dan menampilkannya untuk memastikan keaslian sertifikat.
3. **Admin Dashboard:** Manajemen pembuatan sertifikat aman oleh Admin terautentikasi.

## Teknologi
- **Frontend:** HTML5, Vanilla CSS (Modern Dark Mode, Glassmorphism), Vanilla JavaScript.
- **Backend:** Node.js, Express.js.
- **Steganografi:** `jimp` (Penyisipan RGB LSB).
- **Database:** SQLite (untuk pencatatan histori).

## Instalasi & Cara Menjalankan

1. Telah menginstal Node.js.
2. Buka terminal di folder root `CertiLock`.
3. Instal semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   node backend/server.js
   ```
5. Akses aplikasi melalui browser: `http://localhost:3000`
