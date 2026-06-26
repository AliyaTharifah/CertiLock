// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminId');
        window.location.href = 'login.html';
    });
}

// Custom File Upload Display
const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
    input.addEventListener('change', function() {
        const fileNameSpan = this.parentElement.querySelector('#fileName');
        if (fileNameSpan && this.files && this.files.length > 0) {
            fileNameSpan.textContent = this.files[0].name;
        } else if (fileNameSpan) {
            fileNameSpan.textContent = '';
        }
    });
});

// Helper for UI Alerts
function showAlert(elementId, message, type) {
    const alertBox = document.getElementById(elementId);
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    }
}
