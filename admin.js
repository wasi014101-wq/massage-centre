/* ===== Serenity Spa - Admin Panel Engine ===== */

const CONFIG_KEY = 'serenity_site_config';
const PASSCODE_KEY = 'serenity_admin_passcode';
const SESSION_KEY = 'serenity_admin_session';

const DEFAULT_CONFIG = {
  brand_name: 'Serenity Spa',
  whatsapp_number: '966501234567',
  phone_display: '+966 50 123 4567',
  address: 'Olaya Street, Riyadh, Saudi Arabia',
  hours: 'Daily: 10 AM – 12 AM',
  promo_enabled: false,
  promo_text: '🎉 Special Offer: Book today and get 20% OFF on all relaxation packages!',
  hero_title: 'Professional <span>Massage Services</span> in Riyadh',
  hero_desc: 'Relax your body, relieve stress, and enjoy premium massage services with experienced therapists. Your journey to complete relaxation starts here.',
  stat_clients: 5000,
  stat_years: 10,
  stat_therapists: 15,
  stat_services: 8,
  img_swedish: 'images/swedish.png',
  img_deeptissue: 'images/deep-tissue.png',
  img_thai: 'images/thai.png',
  img_sports: 'images/sports.png',
  img_couples: 'images/couples.png'
};

document.addEventListener('DOMContentLoaded', () => {
  const authOverlay = document.getElementById('admin-auth-overlay');
  const adminWrapper = document.getElementById('admin-wrapper');
  const loginForm = document.getElementById('admin-login-form');
  const passcodeInput = document.getElementById('admin-passcode');
  const authError = document.getElementById('auth-error');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const saveBtn = document.getElementById('admin-save-btn');
  const resetBtn = document.getElementById('admin-reset-btn');
  const toast = document.getElementById('admin-status-toast');

  // Check active authentication session
  if (sessionStorage.getItem(SESSION_KEY) === 'active') {
    showDashboard();
  }

  // Handle Login Submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPasscode = passcodeInput.value.trim();
    const storedPasscode = localStorage.getItem(PASSCODE_KEY) || 'admin123';

    if (enteredPasscode === storedPasscode) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      authError.style.display = 'none';
      showDashboard();
    } else {
      authError.style.display = 'block';
    }
  });

  // Toggle Reset Passcode Form
  const toggleResetBtn = document.getElementById('toggle-reset-btn');
  const resetForm = document.getElementById('admin-reset-form');
  const resetError = document.getElementById('reset-error');
  const resetSuccess = document.getElementById('reset-success');

  toggleResetBtn?.addEventListener('click', () => {
    if (resetForm) {
      resetForm.style.display = resetForm.style.display === 'none' ? 'block' : 'none';
    }
  });

  // Handle Reset Form Submission
  resetForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const masterKey = document.getElementById('reset-master-key')?.value.trim();
    const newPass = document.getElementById('reset-new-pass')?.value.trim();

    // Master Key check (DEFAULT: RESET2026)
    if (masterKey === 'RESET2026') {
      if (newPass.length < 6) {
        if (resetError) {
          resetError.textContent = 'New passcode must be at least 6 characters.';
          resetError.style.display = 'block';
        }
        return;
      }

      localStorage.setItem(PASSCODE_KEY, newPass);
      if (resetError) resetError.style.display = 'none';
      if (resetSuccess) resetSuccess.style.display = 'block';
      setTimeout(() => {
        if (resetForm) resetForm.style.display = 'none';
        if (resetSuccess) resetSuccess.style.display = 'none';
      }, 2500);
    } else {
      if (resetError) {
        resetError.textContent = 'Invalid Master Security Key. Default is RESET2026.';
        resetError.style.display = 'block';
      }
    }
  });

  // Handle Lock Session / Logout
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  });

  function showDashboard() {
    if (authOverlay) authOverlay.style.display = 'none';
    if (adminWrapper) adminWrapper.style.display = 'block';
    loadConfigIntoForm();
  }

  // Tab Switching
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabTarget = tab.dataset.tab;
      document.getElementById(tabTarget)?.classList.add('active');
    });
  });

  function loadConfigIntoForm() {
    const raw = localStorage.getItem(CONFIG_KEY);
    const config = raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_CONFIG };

    if (document.getElementById('cfg-brand-name')) document.getElementById('cfg-brand-name').value = config.brand_name || 'Serenity Spa';
    if (document.getElementById('cfg-whatsapp')) document.getElementById('cfg-whatsapp').value = config.whatsapp_number || '';
    if (document.getElementById('cfg-phone-display')) document.getElementById('cfg-phone-display').value = config.phone_display || '';
    if (document.getElementById('cfg-address')) document.getElementById('cfg-address').value = config.address || '';
    if (document.getElementById('cfg-hours')) document.getElementById('cfg-hours').value = config.hours || '';

    if (document.getElementById('cfg-promo-enable')) document.getElementById('cfg-promo-enable').checked = !!config.promo_enabled;
    if (document.getElementById('cfg-promo-text')) document.getElementById('cfg-promo-text').value = config.promo_text || '';

    if (document.getElementById('cfg-hero-title')) document.getElementById('cfg-hero-title').value = config.hero_title || '';
    if (document.getElementById('cfg-hero-desc')) document.getElementById('cfg-hero-desc').value = config.hero_desc || '';

    if (document.getElementById('cfg-stat-clients')) document.getElementById('cfg-stat-clients').value = config.stat_clients || 5000;
    if (document.getElementById('cfg-stat-years')) document.getElementById('cfg-stat-years').value = config.stat_years || 10;
    if (document.getElementById('cfg-stat-therapists')) document.getElementById('cfg-stat-therapists').value = config.stat_therapists || 15;
    if (document.getElementById('cfg-stat-services')) document.getElementById('cfg-stat-services').value = config.stat_services || 8;

    if (document.getElementById('cfg-img-swedish')) document.getElementById('cfg-img-swedish').value = config.img_swedish || 'images/swedish.png';
    if (document.getElementById('cfg-img-deeptissue')) document.getElementById('cfg-img-deeptissue').value = config.img_deeptissue || 'images/deep-tissue.png';
    if (document.getElementById('cfg-img-thai')) document.getElementById('cfg-img-thai').value = config.img_thai || 'images/thai.png';
    if (document.getElementById('cfg-img-sports')) document.getElementById('cfg-img-sports').value = config.img_sports || 'images/sports.png';
    if (document.getElementById('cfg-img-couples')) document.getElementById('cfg-img-couples').value = config.img_couples || 'images/couples.png';
  }

  function saveConfigFromForm() {
    const currentConfig = {
      brand_name: document.getElementById('cfg-brand-name')?.value.trim() || 'Serenity Spa',
      whatsapp_number: document.getElementById('cfg-whatsapp')?.value.trim() || '966501234567',
      phone_display: document.getElementById('cfg-phone-display')?.value.trim() || '+966 50 123 4567',
      address: document.getElementById('cfg-address')?.value.trim() || '',
      hours: document.getElementById('cfg-hours')?.value.trim() || '',
      promo_enabled: document.getElementById('cfg-promo-enable')?.checked || false,
      promo_text: document.getElementById('cfg-promo-text')?.value.trim() || '',
      hero_title: document.getElementById('cfg-hero-title')?.value.trim() || '',
      hero_desc: document.getElementById('cfg-hero-desc')?.value.trim() || '',
      stat_clients: parseInt(document.getElementById('cfg-stat-clients')?.value) || 5000,
      stat_years: parseInt(document.getElementById('cfg-stat-years')?.value) || 10,
      stat_therapists: parseInt(document.getElementById('cfg-stat-therapists')?.value) || 15,
      stat_services: parseInt(document.getElementById('cfg-stat-services')?.value) || 8,
      img_swedish: document.getElementById('cfg-img-swedish')?.value.trim() || 'images/swedish.png',
      img_deeptissue: document.getElementById('cfg-img-deeptissue')?.value.trim() || 'images/deep-tissue.png',
      img_thai: document.getElementById('cfg-img-thai')?.value.trim() || 'images/thai.png',
      img_sports: document.getElementById('cfg-img-sports')?.value.trim() || 'images/sports.png',
      img_couples: document.getElementById('cfg-img-couples')?.value.trim() || 'images/couples.png'
    };

    // Check Passcode Change
    const newPass = document.getElementById('cfg-new-passcode')?.value.trim();
    const confirmPass = document.getElementById('cfg-confirm-passcode')?.value.trim();

    if (newPass || confirmPass) {
      if (newPass !== confirmPass) {
        showToast('❌ Passcodes do not match!', true);
        return;
      }
      if (newPass.length < 6) {
        showToast('❌ Passcode must be at least 6 characters long.', true);
        return;
      }
      localStorage.setItem(PASSCODE_KEY, newPass);
      document.getElementById('cfg-new-passcode').value = '';
      document.getElementById('cfg-confirm-passcode').value = '';
      showToast('🔒 Admin passcode updated successfully!');
    }

    localStorage.setItem(CONFIG_KEY, JSON.stringify(currentConfig));
    showToast('✅ Settings saved! Website information updated.');
  }

  saveBtn?.addEventListener('click', saveConfigFromForm);

  // Reset to Defaults
  resetBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all site settings to defaults?')) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      loadConfigIntoForm();
      showToast('🔄 Settings reset to defaults.');
    }
  });

  function showToast(msg, isError = false) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = isError ? '#ef4444' : '#10b981';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }
});
