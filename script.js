/* ===== Serenity Spa - Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Page Loader ----
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('loaded'), 500);
  });

  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ---- Mobile Menu ----
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  const overlay = document.querySelector('.navbar-overlay');
  const navLinks = document.querySelectorAll('.navbar-link');

  function openMenu() {
    menu?.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    toggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu?.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
    toggle?.setAttribute('aria-expanded', 'false');
  }

  toggle?.addEventListener('click', () => {
    menu?.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ---- Active Nav Link Highlighting ----
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.navbar-link[href="#${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
      });

      // Open clicked item if it was closed
      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger child animations
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animated Counter ----
  const counters = document.querySelectorAll('.hero-stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target) || 0;
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // ---- Back to Top Button ----
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 600);
  });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Lazy Load Images ----
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => img.classList.add('loaded'));
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px'
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // ---- Parallax on Hero ----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
    });
  }

  // ---- Year for copyright ----
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- DYNAMIC SITE CONFIGURATION ENGINE ----
  const CONFIG_KEY = 'serenity_site_config';
  const CUSTOMER_KEY = 'serenity_customer_account';

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
    stat_services: 8
  };

  const CLOUD_BIN_DEFAULT = '6699d8e7e41b4d34e414c5b1';
  const LIVE_CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019f9e67836a2b88';

  async function applyDynamicConfig() {
    let globalCfg = {};

    // 1. Live Cloud Database Sync (0 GitHub / 0 file uploads required!)
    try {
      const res = await fetch(LIVE_CLOUD_DB_URL);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && Object.keys(json.data).length > 0) {
          globalCfg = json.data;
        }
      }
    } catch (e) {}

    // 2. Local/Static Fallback: site_config.json
    if (!globalCfg || !Object.keys(globalCfg).length) {
      try {
        const res = await fetch('site_config.json?v=' + Date.now());
        if (res.ok) {
          globalCfg = await res.json();
        }
      } catch (err) {}
    }

    const raw = localStorage.getItem(CONFIG_KEY);
    const localCfg = raw ? JSON.parse(raw) : {};
    // Merge order: DEFAULT -> Server (site_config.json) -> Local Admin Edits (take top priority locally)
    const cfg = { ...DEFAULT_CONFIG, ...globalCfg, ...localCfg };

    // Update Brand Name everywhere
    const brandName = cfg.brand_name || 'Serenity Spa';
    document.querySelectorAll('.navbar-logo span').forEach(el => el.textContent = brandName);
    document.title = `${brandName} — Premium Massage Services in Riyadh, Saudi Arabia`;

    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
      heroBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> ${brandName} Riyadh`;
    }

    // Promo Announcement Banner
    const promoBanner = document.getElementById('promo-banner');
    const promoText = document.getElementById('promo-banner-text');
    const promoClose = document.getElementById('promo-banner-close');

    if (promoBanner && cfg.promo_enabled && cfg.promo_text) {
      if (promoText) promoText.textContent = cfg.promo_text;
      promoBanner.style.display = 'block';
    } else if (promoBanner) {
      promoBanner.style.display = 'none';
    }

    promoClose?.addEventListener('click', () => {
      if (promoBanner) promoBanner.style.display = 'none';
    });

    // Customer Account Data
    const customerAccountRaw = localStorage.getItem(CUSTOMER_KEY);
    const customerAccount = customerAccountRaw ? JSON.parse(customerAccountRaw) : null;
    const accountBtnLabel = document.getElementById('account-btn-label');

    if (customerAccount && accountBtnLabel) {
      accountBtnLabel.textContent = customerAccount.name ? `Account (${customerAccount.name.split(' ')[0]})` : 'My Account';
    }

    // WhatsApp URL with Customer Profile pre-fill if available
    const waNumber = cfg.whatsapp_number || '966501234567';
    let baseMsg = "Hello, I would like to book a massage appointment.";

    if (customerAccount && customerAccount.name) {
      baseMsg = `Hello, my name is ${customerAccount.name} (${customerAccount.phone}). I would like to book a massage appointment.`;
    }

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(baseMsg)}`;
    
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.href = waUrl;
    });

    // Update Phone links & text
    const phoneDisplay = cfg.phone_display || '+966 50 123 4567';
    const phoneDigits = waNumber;
    
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.href = `tel:+${phoneDigits}`;
      if (link.dataset.siteKey === 'phone_link_text') link.textContent = phoneDisplay;
    });

    const waLinkText = document.querySelector('[data-site-key="whatsapp_link_text"]');
    if (waLinkText) waLinkText.textContent = phoneDisplay;

    const addressText = document.querySelector('[data-site-key="address_text"]');
    if (addressText && cfg.address) addressText.textContent = cfg.address;

    const hoursText = document.querySelector('[data-site-key="hours_text"]');
    if (hoursText && cfg.hours) hoursText.textContent = cfg.hours;

    // Update About Us Section
    const aboutTitle = document.querySelector('[data-site-key="about_title"]');
    if (aboutTitle && cfg.about_title) aboutTitle.innerHTML = cfg.about_title;

    const aboutDesc = document.querySelector('[data-site-key="about_desc"]');
    if (aboutDesc && cfg.about_desc) aboutDesc.textContent = cfg.about_desc;

    // Update Hero Content
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && cfg.hero_title) heroTitle.innerHTML = cfg.hero_title;

    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc && cfg.hero_desc) heroDesc.textContent = cfg.hero_desc;

    // Update Stat Numbers
    const clientsStat = document.querySelector('.hero-stat-number[data-target="5000"], .hero-stat-number:nth-child(1)');
    if (clientsStat && cfg.stat_clients) clientsStat.dataset.target = cfg.stat_clients;

    const yearsStat = document.querySelector('.hero-stat-number[data-target="10"], .hero-stat-number:nth-child(2)');
    if (yearsStat && cfg.stat_years) yearsStat.dataset.target = cfg.stat_years;

    const therapistsStat = document.querySelector('.hero-stat-number[data-target="15"], .hero-stat-number:nth-child(3)');
    if (therapistsStat && cfg.stat_therapists) therapistsStat.dataset.target = cfg.stat_therapists;

    const servicesStat = document.querySelector('.hero-stat-number[data-target="8"], .hero-stat-number:nth-child(4)');
    if (servicesStat && cfg.stat_services) servicesStat.dataset.target = cfg.stat_services;

    // Update Service Titles, Descriptions, Prices & Images
    ['swedish', 'deeptissue', 'thai', 'sports', 'couples'].forEach(key => {
      const imgEl = document.querySelector(`img[data-service-img="${key}"]`);
      if (imgEl && cfg[`img_${key}`]) imgEl.src = cfg[`img_${key}`];

      const titleEl = document.querySelector(`[data-service-title="${key}"]`);
      if (titleEl && cfg[`title_${key}`]) titleEl.textContent = cfg[`title_${key}`];

      const descEl = document.querySelector(`[data-service-desc="${key}"]`);
      if (descEl && cfg[`desc_${key}`]) descEl.textContent = cfg[`desc_${key}`];

      const priceEl = document.querySelector(`[data-service-price="${key}"]`);
      if (priceEl && cfg[`price_${key}`]) priceEl.textContent = cfg[`price_${key}`];
    });
  }

  // ---- CUSTOMER ACCOUNT MODAL CONTROLLER ----
  const accountOpenBtn = document.getElementById('account-modal-open-btn');
  const accountOverlay = document.getElementById('customer-modal-overlay');
  const accountCloseBtn = document.getElementById('customer-modal-close');
  const accountForm = document.getElementById('customer-account-form');

  accountOpenBtn?.addEventListener('click', () => {
    // Populate form if data exists
    const rawAcc = localStorage.getItem(CUSTOMER_KEY);
    if (rawAcc) {
      const acc = JSON.parse(rawAcc);
      if (document.getElementById('cust-name')) document.getElementById('cust-name').value = acc.name || '';
      if (document.getElementById('cust-phone')) document.getElementById('cust-phone').value = acc.phone || '';
      if (document.getElementById('cust-email')) document.getElementById('cust-email').value = acc.email || '';
    }
    if (accountOverlay) accountOverlay.style.display = 'flex';
  });

  accountCloseBtn?.addEventListener('click', () => {
    if (accountOverlay) accountOverlay.style.display = 'none';
  });

  accountForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const accData = {
      name: document.getElementById('cust-name').value.trim(),
      phone: document.getElementById('cust-phone').value.trim(),
      email: document.getElementById('cust-email').value.trim()
    };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(accData));
    if (accountOverlay) accountOverlay.style.display = 'none';
    applyDynamicConfig();
    alert(`Account saved for ${accData.name}! Your details will pre-fill when booking via WhatsApp.`);
  });

  // ---- Auto-lift WhatsApp button when footer is reached ----
  const footerEl = document.querySelector('footer');
  const waFloat = document.querySelector('.whatsapp-float');

  if (footerEl && waFloat) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        waFloat.classList.toggle('footer-active', entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    footerObserver.observe(footerEl);
  }

  applyDynamicConfig();
});


