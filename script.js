// 🔥 PERFECT WORKING VERSION - Copy Entire File
let bloodDonors = [];
let moneyDonors = [];

// Load data
function loadData() {
    const bloodData = localStorage.getItem('bloodDonors');
    const moneyData = localStorage.getItem('moneyDonors');
    if (bloodData) bloodDonors = JSON.parse(bloodData);
    if (moneyData) moneyDonors = JSON.parse(moneyData);
    
    if (bloodDonors.length === 0) {
        bloodDonors = [{name: '000', bloodGroup: '000', department: '000', comments: '000', timestamp: Date.now()}];
        saveData();
    }
}

// Save data
function saveData() {
    localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors));
    localStorage.setItem('moneyDonors', JSON.stringify(moneyDonors));
}

// Update homepage stats
function updateStats() {
    const realBlood = bloodDonors.filter(d => d.name !== '000').length;
    document.getElementById('totalBloodDonors').textContent = realBlood;
    document.getElementById('totalMoneyDonors').textContent = moneyDonors.length;
    
    const totalPKR = moneyDonors.reduce((sum, d) => sum + (parseInt(d.amount) || 0), 0);
    document.getElementById('totalAmount').textContent = totalPKR.toLocaleString();
}

// Show all donors on main page
function renderDonors() {
    const grid = document.getElementById('donorsGrid');
    const realBlood = bloodDonors.filter(d => d.name !== '000');
    const allDonors = [...realBlood, ...moneyDonors];
    
    if (allDonors.length === 0) {
        grid.innerHTML = '<div class="donor-card empty" style="grid-column: 1 / -1;"><i class="fas fa-heartbeat" style="font-size: 5rem; color: #d32f2f;"></i><h3>No donors yet</h3><p>Be first to save lives!</p></div>';
        return;
    }
    
    allDonors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    grid.innerHTML = allDonors.map(donor => {
        const isBlood = donor.bloodGroup;
        return `
            <div class="donor-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>${donor.name}</h3>
                    <span class="donor-type">${isBlood ? '🩸 Blood' : '💰 PKR'}</span>
                </div>
                <div class="donor-info">
                    <i class="fas fa-building"></i> ${donor.department}
                </div>
                ${isBlood ? `<span class="blood-badge">${donor.bloodGroup}</span>` : ''}
                ${donor.amount ? `<div class="money-badge">₨${parseInt(donor.amount).toLocaleString()}</div>` : ''}
                ${donor.comments ? `<div class="donor-comments">"${donor.comments}"</div>` : ''}
                <div style="font-size: 0.8rem; color: #999; margin-top: 1rem; text-align: right;">
                    <i class="fas fa-clock"></i> ${new Date(donor.timestamp).toLocaleDateString('en-PK')}
                </div>
            </div>
        `;
    }).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateStats();
    renderDonors();
    setupMobileMenu();
    
    setInterval(() => {
        loadData();
        updateStats();
        renderDonors();
    }, 2000);
});

// Blood donor form
document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        bloodGroup: document.getElementById('bloodGroup').value,
        department: document.getElementById('department').value.trim(),
        comments: document.getElementById('comments').value.trim() || 'Great work!',
        timestamp: Date.now()
    };
    
    bloodDonors.push(formData);
    saveData();
    updateStats();
    renderDonors();
    
    showSuccess(`🩸 ${formData.name} registered! Blood Donor #${bloodDonors.filter(d => d.name !== '000').length}`);
    this.reset();
});

// Money form
document.getElementById('moneyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('moneyName').value.trim(),
        amount: parseInt(document.getElementById('amount').value),
        department: document.getElementById('moneyDept').value.trim(),
        comments: document.getElementById('moneyComments').value.trim() || 'Thank you!',
        timestamp: Date.now()
    };
    
    moneyDonors.push(formData);
    saveData();
    updateStats();
    renderDonors();
    
    showSuccess(`💰 ${formData.name}: ₨${formData.amount.toLocaleString()} received!`);
    this.reset();
});

// Mobile menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({behavior: 'smooth'});
    });
});

// ADMIN FUNCTIONS - FIXED
function showAdminLogin() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminLogin() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function showAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdmin();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (document.getElementById('adminPassword').value === 'publicrelations_advertising') {
        showAdminPanel();
    } else {
        alert('❌ Wrong password!');
    }
});

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tab).classList.add('active');
}

function renderAdmin() {
    // Blood tab
    const realBlood = bloodDonors.filter(d => d.name !== '000').length;
    document.getElementById('adminBloodList').innerHTML = `
        <div style="background: linear-gradient(135deg, #d32f2f, #b71c1c); color: white; padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem; text-align: center;">
            <h3>🩸 Blood Donors: ${realBlood}</h3>
        </div>
        ${bloodDonors.map((d, i) => `
            <div class="admin-item">
                <h4>#${i+1} ${d.name === '000' ? '(Sample)' : d.name}</h4>
                ${d.name !== '000' ? `
                    <p><strong>Blood:</strong> ${d.bloodGroup} | <strong>Phone:</strong> ${d.contact}</p>
                ` : ''}
                <p><strong>Dept:</strong> ${d.department}</p>
                <p><strong>Comments:</strong> ${d.comments}</p>
            </div>
        `).join('')}
    `;
    
    // Money tab
    const totalPKR = moneyDonors.reduce((sum, d) => sum + (parseInt(d.amount) || 0), 0);
    document.getElementById('adminMoneyList').innerHTML = `
        <div style="background: linear-gradient(135deg, #4caf50, #388e3c); color: white; padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem; text-align: center;">
            <h3>💰 Money: ${moneyDonors.length} donors | ₨${totalPKR.toLocaleString()}</h3>
        </div>
        ${moneyDonors.map((d, i) => `
            <div class="admin-item">
                <h4>#${i+1} ${d.name} - ₨${parseInt(d.amount).toLocaleString()}</h4>
                <p><strong>Dept:</strong> ${d.department}</p>
                <p><strong>Comments:</strong> ${d.comments}</p>
            </div>
        `).join('')}
    `;
}

function showSuccess(msg) {
    let msgEl = document.querySelector('.success-message');
    if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'success-message';
        document.querySelector('.form-container')?.insertBefore(msgEl, document.querySelector('.form-container form'));
    }
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(() => msgEl.style.display = 'none', 4000);
}

window.onclick = function(e) {
    if (e.target.id === 'adminModal') closeAdminLogin();
    if (e.target.id === 'adminPanel') closeAdminPanel();
};