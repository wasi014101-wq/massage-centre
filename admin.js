/* ===== Serenity Spa - Admin Panel Engine ===== */

const CONFIG_KEY = 'serenity_site_config';
const PASSCODE_KEY = 'serenity_admin_passcode';
const SESSION_KEY = 'serenity_admin_session';

const DEFAULT_CONFIG = {
  admin_passcode: 'admin123',
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

document.addEventListener('DOMContentLoaded', async () => {
  const authOverlay = document.getElementById('admin-auth-overlay');
  const adminWrapper = document.getElementById('admin-wrapper');
  const loginForm = document.getElementById('admin-login-form');
  const passcodeInput = document.getElementById('admin-passcode');
  const authError = document.getElementById('auth-error');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const saveBtn = document.getElementById('admin-save-btn');
  const resetBtn = document.getElementById('admin-reset-btn');
  const toast = document.getElementById('admin-status-toast');

  // Fetch central config for shared admin password & site settings
  let activeConfig = { ...DEFAULT_CONFIG };
  try {
    const res = await fetch('site_config.json?v=' + Date.now());
    if (res.ok) {
      const serverConfig = await res.json();
      activeConfig = { ...DEFAULT_CONFIG, ...serverConfig };
    }
  } catch (e) {
    // Fallback if offline
  }

  const rawLocal = localStorage.getItem(CONFIG_KEY);
  if (rawLocal) {
    activeConfig = { ...activeConfig, ...JSON.parse(rawLocal) };
  }

  // Check active authentication session
  if (sessionStorage.getItem(SESSION_KEY) === 'active') {
    showDashboard();
  }

  // Handle Login Submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPasscode = passcodeInput.value.trim();
    const currentPasscode = localStorage.getItem(PASSCODE_KEY) || activeConfig.admin_passcode || 'admin123';

    if (enteredPasscode === currentPasscode) {
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

    if (masterKey === 'RESET2026') {
      if (newPass.length < 6) {
        if (resetError) {
          resetError.textContent = 'New passcode must be at least 6 characters.';
          resetError.style.display = 'block';
        }
        return;
      }

      localStorage.setItem(PASSCODE_KEY, newPass);
      activeConfig.admin_passcode = newPass;
      localStorage.setItem(CONFIG_KEY, JSON.stringify(activeConfig));

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
    const config = raw ? { ...activeConfig, ...JSON.parse(raw) } : { ...activeConfig };

    if (document.getElementById('cfg-brand-name')) document.getElementById('cfg-brand-name').value = config.brand_name || 'Serenity Spa';
    if (document.getElementById('cfg-whatsapp')) document.getElementById('cfg-whatsapp').value = config.whatsapp_number || '';
    if (document.getElementById('cfg-phone-display')) document.getElementById('cfg-phone-display').value = config.phone_display || '';
    if (document.getElementById('cfg-address')) document.getElementById('cfg-address').value = config.address || '';
    if (document.getElementById('cfg-hours')) document.getElementById('cfg-hours').value = config.hours || '';

    if (document.getElementById('cfg-promo-enable')) document.getElementById('cfg-promo-enable').checked = !!config.promo_enabled;
    if (document.getElementById('cfg-promo-text')) document.getElementById('cfg-promo-text').value = config.promo_text || '';

    if (document.getElementById('cfg-hero-title')) document.getElementById('cfg-hero-title').value = config.hero_title || '';
    if (document.getElementById('cfg-hero-desc')) document.getElementById('cfg-hero-desc').value = config.hero_desc || '';

    if (document.getElementById('cfg-about-title')) document.getElementById('cfg-about-title').value = config.about_title || '';
    if (document.getElementById('cfg-about-desc')) document.getElementById('cfg-about-desc').value = config.about_desc || '';

    if (document.getElementById('cfg-stat-clients')) document.getElementById('cfg-stat-clients').value = config.stat_clients || 5000;
    if (document.getElementById('cfg-stat-years')) document.getElementById('cfg-stat-years').value = config.stat_years || 10;
    if (document.getElementById('cfg-stat-therapists')) document.getElementById('cfg-stat-therapists').value = config.stat_therapists || 15;
    if (document.getElementById('cfg-stat-services')) document.getElementById('cfg-stat-services').value = config.stat_services || 8;

    if (document.getElementById('cfg-title-swedish')) document.getElementById('cfg-title-swedish').value = config.title_swedish || '';
    if (document.getElementById('cfg-desc-swedish')) document.getElementById('cfg-desc-swedish').value = config.desc_swedish || '';
    if (document.getElementById('cfg-price-swedish')) document.getElementById('cfg-price-swedish').value = config.price_swedish || '';
    if (document.getElementById('cfg-img-swedish')) document.getElementById('cfg-img-swedish').value = config.img_swedish || 'images/swedish.png';

    if (document.getElementById('cfg-title-deeptissue')) document.getElementById('cfg-title-deeptissue').value = config.title_deeptissue || '';
    if (document.getElementById('cfg-desc-deeptissue')) document.getElementById('cfg-desc-deeptissue').value = config.desc_deeptissue || '';
    if (document.getElementById('cfg-price-deeptissue')) document.getElementById('cfg-price-deeptissue').value = config.price_deeptissue || '';
    if (document.getElementById('cfg-img-deeptissue')) document.getElementById('cfg-img-deeptissue').value = config.img_deeptissue || 'images/deep-tissue.png';

    if (document.getElementById('cfg-title-thai')) document.getElementById('cfg-title-thai').value = config.title_thai || '';
    if (document.getElementById('cfg-desc-thai')) document.getElementById('cfg-desc-thai').value = config.desc_thai || '';
    if (document.getElementById('cfg-price-thai')) document.getElementById('cfg-price-thai').value = config.price_thai || '';
    if (document.getElementById('cfg-img-thai')) document.getElementById('cfg-img-thai').value = config.img_thai || 'images/thai.png';

    if (document.getElementById('cfg-title-sports')) document.getElementById('cfg-title-sports').value = config.title_sports || '';
    if (document.getElementById('cfg-desc-sports')) document.getElementById('cfg-desc-sports').value = config.desc_sports || '';
    if (document.getElementById('cfg-price-sports')) document.getElementById('cfg-price-sports').value = config.price_sports || '';
    if (document.getElementById('cfg-img-sports')) document.getElementById('cfg-img-sports').value = config.img_sports || 'images/sports.png';

    if (document.getElementById('cfg-title-couples')) document.getElementById('cfg-title-couples').value = config.title_couples || '';
    if (document.getElementById('cfg-desc-couples')) document.getElementById('cfg-desc-couples').value = config.desc_couples || '';
    if (document.getElementById('cfg-price-couples')) document.getElementById('cfg-price-couples').value = config.price_couples || '';
  function getFormConfig() {
    const storedPasscode = localStorage.getItem(PASSCODE_KEY) || activeConfig.admin_passcode || 'admin123';
    return {
      admin_passcode: storedPasscode,
      brand_name: document.getElementById('cfg-brand-name')?.value.trim() || 'Serenity Spa',
      whatsapp_number: document.getElementById('cfg-whatsapp')?.value.trim() || '966501234567',
      phone_display: document.getElementById('cfg-phone-display')?.value.trim() || '+966 50 123 4567',
      address: document.getElementById('cfg-address')?.value.trim() || '',
      hours: document.getElementById('cfg-hours')?.value.trim() || '',
      promo_enabled: document.getElementById('cfg-promo-enable')?.checked || false,
      promo_text: document.getElementById('cfg-promo-text')?.value.trim() || '',
      hero_title: document.getElementById('cfg-hero-title')?.value.trim() || '',
      hero_desc: document.getElementById('cfg-hero-desc')?.value.trim() || '',
      about_title: document.getElementById('cfg-about-title')?.value.trim() || '',
      about_desc: document.getElementById('cfg-about-desc')?.value.trim() || '',
      stat_clients: parseInt(document.getElementById('cfg-stat-clients')?.value) || 5000,
      stat_years: parseInt(document.getElementById('cfg-stat-years')?.value) || 10,
      stat_therapists: parseInt(document.getElementById('cfg-stat-therapists')?.value) || 15,
      stat_services: parseInt(document.getElementById('cfg-stat-services')?.value) || 8,
      title_swedish: document.getElementById('cfg-title-swedish')?.value.trim() || '',
      desc_swedish: document.getElementById('cfg-desc-swedish')?.value.trim() || '',
      price_swedish: document.getElementById('cfg-price-swedish')?.value.trim() || '',
      img_swedish: document.getElementById('cfg-img-swedish')?.value.trim() || 'images/swedish.png',
      title_deeptissue: document.getElementById('cfg-title-deeptissue')?.value.trim() || '',
      desc_deeptissue: document.getElementById('cfg-desc-deeptissue')?.value.trim() || '',
      price_deeptissue: document.getElementById('cfg-price-deeptissue')?.value.trim() || '',
      img_deeptissue: document.getElementById('cfg-img-deeptissue')?.value.trim() || 'images/deep-tissue.png',
      title_thai: document.getElementById('cfg-title-thai')?.value.trim() || '',
      desc_thai: document.getElementById('cfg-desc-thai')?.value.trim() || '',
      price_thai: document.getElementById('cfg-price-thai')?.value.trim() || '',
      img_thai: document.getElementById('cfg-img-thai')?.value.trim() || 'images/thai.png',
      title_sports: document.getElementById('cfg-title-sports')?.value.trim() || '',
      desc_sports: document.getElementById('cfg-desc-sports')?.value.trim() || '',
      price_sports: document.getElementById('cfg-price-sports')?.value.trim() || '',
      img_sports: document.getElementById('cfg-img-sports')?.value.trim() || 'images/sports.png',
      title_couples: document.getElementById('cfg-title-couples')?.value.trim() || '',
      desc_couples: document.getElementById('cfg-desc-couples')?.value.trim() || '',
      price_couples: document.getElementById('cfg-price-couples')?.value.trim() || '',
      img_couples: document.getElementById('cfg-img-couples')?.value.trim() || 'images/couples.png'
    };
  }

  const CLOUD_BIN_DEFAULT = '6699d8e7e41b4d34e414c5b1';
  const CLOUD_KEY_DEFAULT = '$2a$10$7Z8H19o9.X7a/WpG1pE30.fD';

  async function pushToCloudDatabase(currentConfig) {
    const binId = document.getElementById('cfg-cloud-bin-id')?.value.trim() || localStorage.getItem('serenity_cloud_bin') || CLOUD_BIN_DEFAULT;
    const key = document.getElementById('cfg-cloud-master-key')?.value.trim() || localStorage.getItem('serenity_cloud_key') || CLOUD_KEY_DEFAULT;

    localStorage.setItem('serenity_cloud_bin', binId);
    localStorage.setItem('serenity_cloud_key', key);

    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': key
        },
        body: JSON.stringify(currentConfig)
      });
      if (res.ok) {
        showToast('☁️ SAVED TO CLOUD DATABASE! All visitors across all devices will see your updates live.');
      } else {
        showToast('✅ Saved locally. Click "Export site_config.json" to sync manually if offline.');
      }
    } catch (e) {
      showToast('✅ Saved locally.');
    }
  }

  async function saveConfigFromForm() {
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

    const currentConfig = getFormConfig();
    localStorage.setItem(CONFIG_KEY, JSON.stringify(currentConfig));

    // Save to Cloud Database Live across all devices
    await pushToCloudDatabase(currentConfig);
  }

  saveBtn?.addEventListener('click', saveConfigFromForm);

  // Export site_config.json for live global website sync across all devices
  const exportJsonBtn = document.getElementById('admin-export-json-btn');
  exportJsonBtn?.addEventListener('click', () => {
    saveConfigFromForm();
    const currentConfig = getFormConfig();
    const configStr = JSON.stringify(currentConfig, null, 2);
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site_config.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 site_config.json exported! Upload to GitHub to update passwords, branding & images across all devices worldwide.');
  });

  // Reset to Defaults
  resetBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all site settings to defaults?')) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      localStorage.removeItem(PASSCODE_KEY);
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
