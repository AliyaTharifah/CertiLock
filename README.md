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

1. Pastikan Anda telah menginstal Node.js.
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

## Cara Pengujian
1. Buka browser ke `http://localhost:3000`.
2. Klik **Admin Login** dan gunakan kredensial berikut:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Setelah login, pilih **Buat Sertifikat Baru**.
4. Isi data form dan unggah gambar sertifikat asli (format .png atau .jpg).
5. Klik **Generate & Download** untuk mengunduh stego-image (gambar yang telah disisipkan data).
6. Keluar dari dashboard (Logout), dan pergi ke halaman **Verify**.
7. Unggah gambar yang baru saja diunduh, lalu klik **Mulai Verifikasi**.
8. Sistem akan mengekstrak, mendekompresi, dan menampilkan data sertifikat yang valid.

## Catatan Penting
- Hasil pengamanan (stego-image) HARUS berformat `.png` untuk menghindari kerusakan bit yang disisipkan. Jika dikonversi ke JPEG, data yang tersembunyi akan hilang karena kompresi lossy.
