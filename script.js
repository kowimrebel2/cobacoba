// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple demo validation
        if (username === 'yadi saputra' && password === '123123') {
            // Hide login page and show dashboard
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('studentName').textContent = 'Yadi Saputra';
            
            // Success message
            showNotification('Login berhasil! Selamat datang di SIAKAD', 'success');
        } else {
            // Error message
            showNotification('Username atau password salah!', 'error');
        }
    });

    // Handle add MK form submission
    document.getElementById('addMkForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCustomMataKuliah();
    });

    // Handle add Jadwal form submission
    document.getElementById('addJadwalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCustomJadwal();
    });
});

// Toggle mobile menu
function toggleMobileMenu() {
    const menuContainer = document.querySelector('.menu-items-container');
    menuContainer.classList.toggle('show');
}

// Navigation functionality
function showContent(contentId) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected content
    document.getElementById(contentId).classList.add('active');
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Close mobile menu after selection
    if (window.innerWidth <= 767) {
        document.querySelector('.menu-items-container').classList.remove('show');
    }
}

// Logout functionality
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        // Hide dashboard and show login page
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        // Reset menu to default
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => item.classList.remove('active'));
        document.querySelector('.menu-item').classList.add('active');
        
        // Show beranda by default
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('beranda').classList.add('active');
        
        showNotification('Anda telah logout', 'info');
    }
}

// Payment with QRIS
function bayarDenganQRIS() {
    // Show QRIS modal
    document.getElementById('qrisModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset payment status
    document.getElementById('paymentStatus').innerHTML = `
        <p class="payment-waiting"><i class="fas fa-spinner fa-spin"></i> Menunggu pembayaran...</p>
    `;
    
    // Simulate payment process
    setTimeout(() => {
        const isSuccess = Math.random() < 0.8;
        
        if (isSuccess) {
            document.getElementById('paymentStatus').innerHTML = `
                <div class="payment-success-message">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <p>Pembayaran berhasil!</p>
                        <p>UKT Semester Genap 2024/2025 telah lunas.</p>
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                closeModal();
                updatePaymentStatus();
            }, 2000);
        } else {
            document.getElementById('paymentStatus').innerHTML = `
                <div class="payment-failed-message">
                    <i class="fas fa-times-circle"></i>
                    <div>
                        <p>Pembayaran gagal</p>
                        <p>Silakan coba lagi atau gunakan metode pembayaran lain.</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="bayarDenganQRIS()">Coba Lagi</button>
            `;
        }
    }, 3000);
}

function closeModal() {
    document.getElementById('qrisModal').style.display = 'none';
    document.getElementById('addMkModal').style.display = 'none';
    document.getElementById('addJadwalModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updatePaymentStatus() {
    const row = document.querySelector('#pembayaran tbody tr:first-child');
    
    if (row) {
        const statusCell = row.querySelector('.status-unpaid');
        if (statusCell) {
            statusCell.textContent = 'Lunas';
            statusCell.className = 'status-paid';
            
            const dateCell = row.children[4];
            dateCell.textContent = new Date().toLocaleDateString('id-ID');
            
            const button = row.querySelector('.btn-primary');
            button.textContent = 'Cetak';
            button.className = 'btn btn-success';
            button.onclick = function() {
                showNotification('Struk pembayaran akan diunduh', 'info');
            };
        }
    }
    
    showNotification('Pembayaran UKT berhasil!', 'success');
}

// MK Management
function showAddMkModal() {
    document.getElementById('addMkModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAddMkModal() {
    document.getElementById('addMkModal').style.display = 'none';
    document.getElementById('addMkForm').reset();
    document.body.style.overflow = 'auto';
}

function addCustomMataKuliah() {
    const kode = document.getElementById('mkKode').value;
    const nama = document.getElementById('mkNama').value;
    const sks = document.getElementById('mkSks').value;
    const dosen = document.getElementById('mkDosen').value;
    const kelas = document.getElementById('mkKelas').value;
    
    if (kode && nama && sks && dosen && kelas) {
        const tbody = document.querySelector('#krs tbody');
        const newRow = tbody.insertRow();
        
        newRow.innerHTML = `
            <td>${kode}</td>
            <td>${nama}</td>
            <td>${sks}</td>
            <td>${dosen}</td>
            <td>${kelas}</td>
            <td><button class="btn btn-warning" onclick="hapusMataKuliah(this)"><i class="fas fa-trash"></i> Hapus</button></td>
        `;
        
        updateTotalSKS();
        closeAddMkModal();
        showNotification(`Mata kuliah ${nama} berhasil ditambahkan!`, 'success');
    } else {
        showNotification('Harap isi semua field!', 'error');
    }
}

function hapusMataKuliah(button) {
    const row = button.closest('tr');
    const mkName = row.children[1].textContent;
    
    if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${mkName}"?`)) {
        row.remove();
        updateTotalSKS();
        showNotification(`Mata kuliah ${mkName} berhasil dihapus!`, 'info');
    }
}

function updateTotalSKS() {
    const rows = document.querySelectorAll('#krs tbody tr');
    let totalSKS = 0;
    
    rows.forEach(row => {
        totalSKS += parseInt(row.children[2].textContent);
    });

    document.querySelector('#krs .card p strong').textContent = `Total SKS: ${totalSKS}`;
}

// Jadwal Management
function showAddJadwalModal() {
    document.getElementById('addJadwalModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAddJadwalModal() {
    document.getElementById('addJadwalModal').style.display = 'none';
    document.getElementById('addJadwalForm').reset();
    document.body.style.overflow = 'auto';
}

function addCustomJadwal() {
    const hari = document.getElementById('jadwalHari').value;
    const waktu = document.getElementById('jadwalWaktu').value;
    const mk = document.getElementById('jadwalMk').value;
    const dosen = document.getElementById('jadwalDosen').value;
    const ruangan = document.getElementById('jadwalRuangan').value;
    
    if (hari && waktu && mk && dosen && ruangan) {
        const tbody = document.querySelector('#jadwal tbody');
        const newRow = tbody.insertRow();
        
        newRow.innerHTML = `
            <td>${hari}</td>
            <td>${waktu}</td>
            <td>${mk}</td>
            <td>${dosen}</td>
            <td>${ruangan}</td>
            <td><button class="btn btn-warning" onclick="hapusJadwal(this)"><i class="fas fa-trash"></i> Hapus</button></td>
        `;
        
        closeAddJadwalModal();
        showNotification(`Jadwal ${mk} berhasil ditambahkan!`, 'success');
    } else {
        showNotification('Harap isi semua field!', 'error');
    }
}

function hapusJadwal(button) {
    const row = button.closest('tr');
    const jadwalMk = row.children[2].textContent;
    
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal "${jadwalMk}"?`)) {
        row.remove();
        showNotification(`Jadwal ${jadwalMk} berhasil dihapus!`, 'info');
    }
}

// Profile Photo Upload
function uploadPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePhoto').src = e.target.result;
            showNotification('Foto profil berhasil diubah!', 'success');
        }
        reader.readAsDataURL(file);
    }
}

// Download Functions
function downloadKRS() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunduh...';
    button.classList.add('downloading');
    
    setTimeout(() => {
        showNotification('KRS berhasil diunduh (simulasi)', 'success');
        button.innerHTML = originalText;
        button.classList.remove('downloading');
    }, 2000);
}

function downloadKHS() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunduh...';
    button.classList.add('downloading');
    
    setTimeout(() => {
        showNotification('KHS berhasil diunduh (simulasi)', 'success');
        button.innerHTML = originalText;
        button.classList.remove('downloading');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        closeModal();
    }
}

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 767) {
        document.querySelector('.menu-items-container').style.display = 'block';
    } else {
        document.querySelector('.menu-items-container').style.display = 'none';
    }
});