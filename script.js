// Sample data storage (in real app, use database)
let bloodDonors = JSON.parse(localStorage.getItem('bloodDonors')) || [];
let moneyDonors = JSON.parse(localStorage.getItem('moneyDonors')) || [];
let adminLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderDonors();
    setupMobileMenu();
    
    // Load initial empty donors
    if (bloodDonors.length === 0) {
        bloodDonors = [{name: '000', bloodGroup: '000', department: '000', comments: '000'}];
        saveData();
        renderDonors();
    }
});

// Mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
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

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update stats
function updateStats() {
    document.getElementById('totalDonors').textContent = bloodDonors.length;
    document.getElementById('totalAmount').textContent = moneyDonors.reduce((sum, donor) => sum + parseInt(donor.amount || 0), 0);
}

// Render public donors list (only names and departments for trust)
function renderDonors() {
    const grid = document.getElementById('donorsGrid');
    
    if (bloodDonors.length === 0 || (bloodDonors.length === 1 && bloodDonors[0].name === '000')) {
        grid.innerHTML = `
            <div class="donor-card empty">
                <i class="fas fa-users"></i>
                <h3>No donors yet</h3>
                <p>Be the first to register and save lives!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = bloodDonors
        .filter(donor => donor.name !== '000') // Filter out placeholder
        .map(donor => `
            <div class="donor-card">
                <h3>${donor.name}</h3>
                <div class="donor-info">
                    <i class="fas fa-building"></i>
                    <span>${donor.department}</span>
                </div>
                ${donor.bloodGroup !== '000' ? `<span class="blood-badge">${donor.bloodGroup}</span>` : ''}
                ${donor.comments && donor.comments !== '000' ? `<div class="donor-comments">${donor.comments}</div>` : ''}
            </div>
        `).join('');
}

// Blood donor form
document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donor = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        department: document.getElementById('department').value,
        comments: document.getElementById('comments').value || 'No comments'
    };
    
    bloodDonors.push(donor);
    saveData();
    updateStats();
    renderDonors();
    
    // Show success
    showSuccess('Thank you for registering! You are now part of our lifesaving community.');
    this.reset();
});

// Money donation form
document.getElementById('moneyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donation = {
        name: document.getElementById('moneyName').value,
        amount: document.getElementById('amount').value,
        department: document.getElementById('moneyDept').value,
        comments: document.getElementById('moneyComments').value || 'Thank you for your generous donation!'
    };
    
    moneyDonors.push(donation);
    saveData();
    updateStats();
    
    showSuccess(`Thank you for your ${donation.amount} PKR donation! Your support means the world.`);
    this.reset();
});

// Admin functions
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
    adminLoggedIn = false;
}

document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'publicrelations_advertising') {
        adminLoggedIn = true;
        showAdminPanel();
    } else {
        alert('Incorrect password!');
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
    // Blood donors
    document.getElementById('adminBloodList').innerHTML = bloodDonors.map((donor, index) => `
        <div class="admin-item">
            <h4>${donor.name}</h4>
            <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
            <p><strong>Contact:</strong> ${donor.contact}</p>
            <p><strong>Department:</strong> ${donor.department}</p>
            <p><strong>Comments:</strong> ${donor.comments}</p>
        </div>
    `).join('');
    
    // Money donors
    document.getElementById('adminMoneyList').innerHTML = moneyDonors.map((donor, index) => `
        <div class="admin-item">
            <h4>${donor.name} - ${donor.amount} PKR</h4>
            <p><strong>Department:</strong> ${donor.department}</p>
            <p><strong>Comments:</strong> ${donor.comments}</p>
        </div>
    `).join('');
}

// Data persistence
function saveData() {
    localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors));
    localStorage.setItem('moneyDonors', JSON.stringify(moneyDonors));
}

function showSuccess(message) {
    // Create success message
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        document.querySelector('.form-container').insertBefore(successMsg, document.querySelector('.form-container form'));
    }
    
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// Close modals on outside click
window.onclick = function(event) {
    const adminModal = document.getElementById('adminModal');
    const adminPanel = document.getElementById('adminPanel');
    
    if (event.target === adminModal) {
        closeAdminLogin();
    }
    if (event.target === adminPanel) {
        closeAdminPanel();
    }
}