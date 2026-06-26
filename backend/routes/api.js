const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const lsb = require('../utils/lsb');
const rle = require('../utils/rle');

const router = express.Router();

// Setup Multer untuk upload file ke folder "uploads/"
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API: Login Admin
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT id, username FROM admins WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (row) {
            res.json({ success: true, message: 'Login successful', adminId: row.id });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// API: Generate Certificate (Secure with LSB & RLE)
router.post('/generate', upload.single('certificateImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Harap unggah gambar sertifikat' });
        }

        const { cert_number, owner_name, event_name, issue_date, admin_id } = req.body;
        
        // 1. Siapkan payload data dalam bentuk JSON
        const payloadObj = {
            cert_number,
            owner_name,
            event_name,
            issue_date
        };
        const payloadString = JSON.stringify(payloadObj);
        
        // 2. Kompresi data menggunakan RLE
        const compressedPayload = rle.encode(payloadString);
        console.log(`Original Size: ${payloadString.length}, Compressed Size: ${compressedPayload.length}`);
        
        // 3. Tentukan path output gambar hasil LSB (harus .png agar data bit tidak rusak)
        const outputFileName = `secured-${Date.now()}.png`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);
        
        // 4. Sisipkan data ke gambar menggunakan LSB
        await lsb.encodeLSB(req.file.path, compressedPayload, outputPath);
        
        // 5. Simpan metadata ke database SQLite
        db.run(`INSERT INTO certificates (cert_number, owner_name, event_name, issue_date, admin_id) VALUES (?, ?, ?, ?, ?)`, 
            [cert_number, owner_name, event_name, issue_date, admin_id || 1], 
            function(err) {
                if (err) {
                    console.error("Gagal menyimpan ke DB:", err);
                    // Kita bisa abaikan error DB jika hanya untuk log, tapi baiknya dicatat.
                }
                
                // Return URL ke file stego-image
                res.json({ 
                    success: true, 
                    message: 'Sertifikat berhasil diamankan',
                    downloadUrl: `/api/download/${outputFileName}`
                });
            }
        );
        
    } catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API: Verify Certificate
router.post('/verify', upload.single('stegoImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Harap unggah gambar sertifikat untuk diverifikasi' });
        }
        
        // 1. Ekstrak data tersembunyi dari LSB
        const extractedData = await lsb.decodeLSB(req.file.path);
        
        if (!extractedData) {
            return res.json({ success: false, message: 'Sertifikat tidak valid. Tidak ada data tersembunyi yang ditemukan.' });
        }
        
        // 2. Dekompresi data dengan RLE
        const decompressedPayload = rle.decode(extractedData);
        
        // 3. Parse JSON
        let certData;
        try {
            certData = JSON.parse(decompressedPayload);
        } catch (e) {
            return res.json({ success: false, message: 'Sertifikat tidak valid. Format data tersembunyi rusak.' });
        }
        
        // Hapus file temporary yang diupload user untuk verifikasi
        fs.unlinkSync(req.file.path);
        
        res.json({
            success: true,
            message: 'Sertifikat valid',
            data: certData
        });
        
    } catch (error) {
        console.error("Error verifying certificate:", error);
        res.status(500).json({ success: false, message: 'Gagal memverifikasi sertifikat. File mungkin rusak atau tidak valid.' });
    }
});

// API: Download File
router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

module.exports = router;
