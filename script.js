// Global data arrays
let bloodDonors = [];
let moneyDonors = [];

// Initialize with placeholder if empty
function initData() {
    const localBlood = localStorage.getItem('bloodDonors');
    const localMoney = localStorage.getItem('moneyDonors');
    
    if (localBlood) bloodDonors = JSON.parse(localBlood);
    if (localMoney) moneyDonors = JSON.parse(localMoney);
    
    // Add placeholder ONLY if no blood donors
    if (bloodDonors.length === 0) {
        bloodDonors = [{name: '000', bloodGroup: '000', department: '000', comments: '000', timestamp: Date.now()}];
        saveData();
    }
}

// Save data
function saveData() {
    localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors));
    localStorage.setItem('moneyDonors', JSON.stringify(moneyDonors));
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    updateStats();
    renderDonors();
}

// Listen for updates
window.addEventListener('storage', function(e) {
    if (e.key === 'bloodDonors' || e.key === 'moneyDonors') {
        initData();
        updateStats();
        renderDonors();
    }
});

window.addEventListener('dataUpdated', function() {
    initData();
    updateStats();
    renderDonors();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initData();
    updateStats();
    renderDonors();
    setupMobileMenu();
    
    setInterval(() => {
        initData();
        updateStats();
        renderDonors();
    }, 3000); // Check every 3 seconds
});

// FIXED STATS - SEPARATE COUNTS
// 🔥 FIXED STATS - Shows SEPARATE COUNTS
function updateStats() {
    // Count REAL blood donors (exclude placeholder)
    const realBloodDonors = bloodDonors.filter(d => d.name !== '000').length;
    document.getElementById('totalBloodDonors').textContent = realBloodDonors;
    
    // Count money donors
    document.getElementById('totalMoneyDonors').textContent = moneyDonors.length;
    
    // Total money donated
    const totalMoney = moneyDonors.reduce((sum, donor) => sum + parseInt(donor.amount || 0), 0);
    document.getElementById('totalAmount').textContent = totalMoney.toLocaleString();
}

// FIXED DONORS GRID - Shows ALL donors (Blood + Money)
function renderDonors() {
    const grid = document.getElementById('donorsGrid');
    
    // Get REAL blood donors
    const realBloodDonors = bloodDonors.filter(donor => donor.name !== '000');
    
    // Get money donors
    const realMoneyDonors = moneyDonors;
    
    // Combine ALL donors
    const allDonors = [...realBloodDonors, ...realMoneyDonors];
    
    if (allDonors.length === 0) {
        grid.innerHTML = `
            <div class="donor-card empty" style="grid-column: 1 / -1;">
                <i class="fas fa-heartbeat" style="font-size: 5rem; color: #d32f2f;"></i>
                <h3>No donors yet</h3>
                <p>Join our mission to save lives!</p>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp (newest first)
    allDonors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    grid.innerHTML = allDonors.map(donor => {
        // Check if blood or money donor
        const isBloodDonor = donor.bloodGroup;
        const donorType = isBloodDonor ? '🩸 Blood Donor' : '💰 Money Donor';
        
        return `
            <div class="donor-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>${donor.name}</h3>
                    <span class="donor-type">${donorType}</span>
                </div>
                <div class="donor-info">
                    <i class="fas fa-building"></i>
                    <span>${donor.department}</span>
                </div>
                ${isBloodDonor ? `<span class="blood-badge">${donor.bloodGroup}</span>` : ''}
                ${donor.amount ? `<div ${donor.amount ? `<div class="money-badge">₨${parseInt(donor.amount).toLocaleString()}</div>` : ''}
                ${donor.comments ? `<div class="donor-comments">"${donor.comments}"</div>` : ''}
                <div style="font-size: 0.8rem; color: #999; margin-top: 1rem; text-align: right;">
                    <i class="fas fa-clock"></i> ${new Date(donor.timestamp).toLocaleDateString('en-PK')}
                </div>
            </div>
        `;
    }).join('');
}

// Blood donor form
document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donor = {
        name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        bloodGroup: document.getElementById('bloodGroup').value,
        department: document.getElementById('department').value.trim(),
        comments: document.getElementById('comments').value.trim() || 'Proud to support Blood Link Foundation!',
        timestamp: Date.now()
    };
    
    bloodDonors.push(donor);
    saveData();
    
    showSuccess(`🩸 Welcome ${donor.name}! You are Blood Donor #${bloodDonors.filter(d => d.name !== '000').length}`);
    this.reset();
    document.getElementById('donors').scrollIntoView({behavior: 'smooth'});
});

// Money donation form
document.getElementById('moneyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donation = {
        name: document.getElementById('moneyName').value.trim(),
        amount: parseInt(document.getElementById('amount').value),
        department: document.getElementById('moneyDept').value.trim(),
        comments: document.getElementById('moneyComments').value.trim() || 'Thank you for your generous support!',
        timestamp: Date.now()
    };
    
    moneyDonors.push(donation);
    saveData();
    
    showSuccess(`💰 Thank you ${donation.name}! Your ₨${donation.amount.toLocaleString()} donation received.`);
    this.reset();
});

// Mobile menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
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
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Admin Panel
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
    renderAdminLists();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'publicrelations_advertising') {
        showAdminPanel();
    } else {
        alert('❌ Wrong Password!');
        document.getElementById('adminPassword').value = '';
    }
});

// Admin tabs
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function renderAdminLists() {
    // Blood Donors Tab
    const realBloodCount = bloodDonors.filter(d => d.name !== '000').length;
    document.getElementById('adminBloodList').innerHTML = `
        <div style="background: linear-gradient(135deg, #d32f2f, #b71c1c); color: white; padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem; text-align: center;">
            <h3>🩸 Total Blood Donors: ${realBloodCount}</h3>
        </div>
        ${bloodDonors.map((donor, index) => `
            <div class="admin-item" style="border-left-color: ${donor.name === '000' ? '#ccc' : '#d32f2f'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4>#${index + 1} ${donor.name} - ₨${parseInt(donor.amount).toLocaleString()}</h4>
                    <span style="font-size: 0.8rem; color: #666;">${new Date(donor.timestamp).toLocaleString('en-PK')}</span>
                </div>
                ${donor.name !== '000' ? `
                    <p><strong>🩸 Blood Group:</strong> ${donor.bloodGroup}</p>
                    <p><strong>📱 Contact:</strong> ${donor.contact}</p>
                ` : ''}
                <p><strong>🏫 Department:</strong> ${donor.department}</p>
                <p><strong>💬 Comments:</strong> ${donor.comments}</p>
            </div>
        `).join('')}
    `;
    
    // Money Donors Tab
    const totalMoney = moneyDonors.reduce((sum, donor) => sum + parseInt(donor.amount || 0), 0);
    document.getElementById('adminMoneyList').innerHTML = `
        <div style="background: linear-gradient(135deg, #4caf50, #388e3c); color: white; padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem; text-align: center;">
            <h3>💰 Total Money Donors: ${moneyDonors.length} | Total: ₹${totalMoney.toLocaleString()}</h3>
        </div>
        ${moneyDonors.map((donor, index) => `
            <div class="admin-item" style="border-left-color: #4caf50;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4>#${index + 1} ${donor.name} - ₹${parseInt(donor.amount).toLocaleString()}</h4>
                    <span style="font-size: 0.8rem; color: #666;">${new Date(donor.timestamp).toLocaleString('en-PK')}</span>
                </div>
                <p><strong>🏫 Department:</strong> ${donor.department}</p>
                <p><strong>💬 Comments:</strong> ${donor.comments}</p>
            </div>
        `).join('')}
    `;
}

// Success message
function showSuccess(message) {
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.insertBefore(successMsg, formContainer.querySelector('form'));
        }
    }
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 5000);
}

// Close modals
window.onclick = function(event) {
    const adminModal = document.getElementById('adminModal');
    const adminPanel = document.getElementById('adminPanel');
    if (event.target === adminModal) closeAdminLogin();
    if (event.target === adminPanel) closeAdminPanel();
};