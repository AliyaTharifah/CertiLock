// Base API URL
const API_URL = 'http://localhost:3000/api';

// --- Login Handler ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loader = document.getElementById('loginLoader');
        const btn = document.getElementById('loginBtn');

        loader.style.display = 'inline-block';
        btn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (result.success) {
                localStorage.setItem('adminId', result.adminId);
                window.location.href = 'dashboard.html';
            } else {
                showAlert('loginAlert', result.message, 'error');
            }
        } catch (error) {
            showAlert('loginAlert', 'Gagal terhubung ke server', 'error');
        } finally {
            loader.style.display = 'none';
            btn.disabled = false;
        }
    });
}

// --- Generate Certificate Handler ---
const generateForm = document.getElementById('generateForm');
if (generateForm) {
    generateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('certificateImage');
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('genAlert', 'Harap unggah gambar', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('certificateImage', fileInput.files[0]);
        formData.append('cert_number', document.getElementById('certNumber').value);
        formData.append('owner_name', document.getElementById('ownerName').value);
        formData.append('event_name', document.getElementById('eventName').value);
        formData.append('issue_date', document.getElementById('issueDate').value);
        formData.append('admin_id', localStorage.getItem('adminId'));

        const loader = document.getElementById('genLoader');
        const btn = document.getElementById('generateBtn');

        loader.style.display = 'inline-block';
        btn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                showAlert('genAlert', 'Sertifikat berhasil diamankan! Mengunduh...', 'success');
                generateForm.reset();
                document.getElementById('fileName').textContent = '';
                
                // Trigger download
                window.location.href = `http://localhost:3000${result.downloadUrl}`;
            } else {
                showAlert('genAlert', result.message, 'error');
            }
        } catch (error) {
            showAlert('genAlert', 'Gagal memproses sertifikat', 'error');
        } finally {
            loader.style.display = 'none';
            btn.disabled = false;
        }
    });
}

// --- Verify Certificate Handler ---
const verifyForm = document.getElementById('verifyForm');
if (verifyForm) {
    verifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('stegoImage');
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('alertBox', 'Harap unggah gambar untuk diverifikasi', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('stegoImage', fileInput.files[0]);

        const loader = document.getElementById('verifyLoader');
        const btn = document.getElementById('verifyBtn');
        const resultBox = document.getElementById('resultBox');

        loader.style.display = 'inline-block';
        btn.disabled = true;
        resultBox.style.display = 'none';

        try {
            const response = await fetch(`${API_URL}/verify`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                // Tampilkan data
                document.getElementById('resNo').textContent = result.data.cert_number;
                document.getElementById('resName').textContent = result.data.owner_name;
                document.getElementById('resEvent').textContent = result.data.event_name;
                document.getElementById('resDate').textContent = result.data.issue_date;
                
                resultBox.style.display = 'block';
                showAlert('alertBox', result.message, 'success');
            } else {
                showAlert('alertBox', result.message, 'error');
            }
        } catch (error) {
            showAlert('alertBox', 'Gagal memverifikasi. Gambar mungkin rusak atau bukan sertifikat asli.', 'error');
        } finally {
            loader.style.display = 'none';
            btn.disabled = false;
        }
    });
}
