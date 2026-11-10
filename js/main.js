/**
 * ARDH ALFAN - Corporate Website JavaScript
 * High Performance Animations, Interactive Canvas, Modals & Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeroCanvas();
  initNavbarScroll();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  init3DTilt();
  initServiceFilters();
  initServiceModal();
  initGalleryLightbox();
  initEstimator();
  initContactForm();
  initBackToTop();
  initLanguageSwitcher();
  initScrollProgress();
});

/* ==========================================================================
   1. Custom Cursor Tracker
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const circle = document.querySelector('.cursor-circle');
  if (!dot || !circle) return;

  let mouseX = -100, mouseY = -100;
  let circleX = -100, circleY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expand cursor on interactive elements
  const hoverables = document.querySelectorAll('a, button, .service-card, .gallery-item, .selector-chip, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => circle.classList.add('active'));
    el.addEventListener('mouseleave', () => circle.classList.remove('active'));
  });
}

/* ==========================================================================
   2. Interactive Hero Canvas Network
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.4 ? 'rgba(151, 29, 29, ' : 'rgba(255, 255, 255, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion/attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(151, 29, 29, 0.8)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(151, 29, 29, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = 1 - dist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(173, 39, 39, ${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. Navbar Scroll & Active State
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (sections.length > 0) {
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            link.classList.remove('active');
            if (href === `#${current}`) {
              link.classList.add('active');
            }
          }
        });
      }
    }
  });
}

/* ==========================================================================
   4. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  links.forEach((l) => l.addEventListener('click', closeMenu));
}

/* ==========================================================================
   5. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up, .fade-in');

  // Immediately make all elements within or near initial viewport visible
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 50) {
      el.classList.add('visible');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. Animated Stat Counters
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        counters.forEach((counter) => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = counter.getAttribute('data-decimals') ? parseInt(counter.getAttribute('data-decimals')) : 0;
          const duration = 2000;
          let startTime = null;

          function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // EaseOutExpo curve
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeProgress * target;

            counter.textContent = currentVal.toFixed(decimals) + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toFixed(decimals) + suffix;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   7. 3D Card Hover Tilt
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.service-card, .hero-visual-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   8. Service Category Filtering
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   9. Service Detail Modal Data & Handler
   ========================================================================== */
const serviceData = {
  warehouse: {
    title: 'Warehouse Management Solutions (WMS)',
    img: 'assets/images/service-warehouse.jpg',
    desc: 'Cutting-edge warehouse management systems designed to streamline inventory flow, optimize picking accuracy, and maximize operational productivity across supply chain nodes.',
    features: [
      'Real-time inventory visibility & RFID/barcode tracking',
      'End-to-end order fulfillment from receiving to shipping confirmation',
      'Automated replenishment triggers & predictive demand forecasting',
      'Integrated return management and loss-prevention audits'
    ],
    scope: 'Ideal for manufacturing plants, regional distribution centers, and high-velocity e-commerce hubs.'
  },
  machinery: {
    title: 'Machinery Mobilization & Management',
    img: 'assets/images/service-machinery.jpg',
    desc: 'Heavy equipment and industrial fleet mobilization to meet tight construction, oil & gas, and industrial project deadlines without downtime.',
    features: [
      'Comprehensive fleet: Forklifts, mobile cranes, boom trucks & excavators',
      'Certified and licensed heavy machinery operators',
      'Preventive on-site maintenance and quick-swap mechanical support',
      'Flexible deployment: Daily, monthly, or turnkey project rentals'
    ],
    scope: 'Serving infrastructure projects, industrial zones, and petrochemical complexes Kingdom-wide.'
  },
  logistics: {
    title: 'Logistics & Transportation Services',
    img: 'assets/images/service-logistics.jpg',
    desc: 'Complete point-to-point movement of raw materials, manufactured products, and heavy cargo with full Kingdom-wide reach and satellite tracking.',
    features: [
      'Modern fleet of flatbed trailers, closed box trucks & curtain-siders',
      'Trip-basis, dedicated daily dispatch, and long-term route contracts',
      'Real-time GPS tracking and 24/7 centralized dispatch control',
      'Rigorous cargo safety protocols with certified handling compliance'
    ],
    scope: 'Covers all 13 provinces: Riyadh, Eastern Province, Western Region, and Neom.'
  },
  boneyard: {
    title: 'Boneyard Management & Material Reclamation',
    img: 'assets/images/service-boneyard.jpg',
    desc: 'Strategic sorting, inventorying, and reclamation of decommissioned industrial assets, surplus metals, and yard inventory to restore site productivity.',
    features: [
      'Categorized salvage inventorying and asset tagging',
      'Safe heavy scrap handling and metal sorting procedures',
      'Yard layout redesign for rapid equipment ingress and egress',
      'Environmental safety auditing & compliance with Saudi industrial laws'
    ],
    scope: 'Crucial for mega-plants, drill sites, and large civil contracting yards.'
  },
  waste: {
    title: 'Sustainable Waste Management & Facility Support',
    img: 'assets/images/service-waste.jpg',
    desc: 'Total environmental hygiene and waste handling. Providing state-of-the-art compactor rentals, skip bins, sewage removal, and industrial sanitization.',
    features: [
      'Stationary & portable compactor rentals with prompt disposal cycles',
      'Standard & heavy-duty skip services with regular pickup schedules',
      'Sewage removal, effluent tanks, and vacuum tanker operations',
      'Industrial deep cleaning, sanitization equipment, and chemical hygiene'
    ],
    scope: 'Tailored for construction camps, commercial plazas, and manufacturing facilities.'
  },
  manpower: {
    title: 'Human Resources & Manpower Solutions',
    img: 'assets/images/service-manpower.jpg',
    desc: 'Supplying highly vetted skilled and unskilled manpower to scale industrial output, reduce recruitment bottlenecks, and ensure peak site efficiency.',
    features: [
      'Skilled workforce: Certified welders, electricians, plumbers & carpenters',
      'Heavy & light vehicle drivers with valid Kingdom commercial licenses',
      'Professional site managers, project supervisors & safety coordinators',
      'Fully compliant payroll, medical coverage, and accommodation mobilization'
    ],
    scope: 'Supplying 10 to 1,000+ personnel for short-term surges or long-term operational contracts.'
  }
};

function initServiceModal() {
  const modal = document.getElementById('serviceModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal) return;

  function open(key) {
    const data = serviceData[key];
    if (!data) return;

    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalScope').textContent = data.scope;

    const list = document.getElementById('modalFeatures');
    list.innerHTML = '';
    data.features.forEach((f) => {
      const li = document.createElement('li');
      li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${f}`;
      list.appendChild(li);
    });

    const inquiryBtn = document.getElementById('modalInquireBtn');
    if (inquiryBtn) {
      inquiryBtn.onclick = () => {
        close();
        const select = document.getElementById('serviceSelect');
        if (select) select.value = key;
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      open(serviceKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

/* ==========================================================================
   10. Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.lightbox-close');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  function close() {
    lightbox.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
}

/* ==========================================================================
   11. Interactive Operations & Cost Estimator
   ========================================================================== */
function initEstimator() {
  const durationInput = document.getElementById('estDuration');
  const outPrice = document.getElementById('estOutPrice');
  if (!durationInput || !outPrice) return;

  const chips = document.querySelectorAll('.selector-chip');
  const scaleInput = document.getElementById('estScale');
  const durationVal = document.getElementById('durationVal');
  const scaleVal = document.getElementById('scaleVal');

  const outService = document.getElementById('estOutService');
  const outMobilization = document.getElementById('estOutMobilization');
  const outCoverage = document.getElementById('estOutCoverage');
  const bookBtn = document.getElementById('estBookBtn');

  let activeService = 'logistics';
  const serviceRates = {
    warehouse: { name: 'Warehouse Management', base: 18000, mob: '3 - 5 Days', cov: 'Provincial Facility' },
    machinery: { name: 'Machinery Mobilization', base: 14000, mob: '24 - 48 Hours', cov: 'On-site / Industrial' },
    logistics: { name: 'Logistics & Fleet Transport', base: 9500, mob: 'Immediate / 24h', cov: 'Entire Kingdom' },
    boneyard: { name: 'Boneyard Asset Cleanup', base: 22000, mob: '3 - 7 Days', cov: 'Industrial Yard' },
    waste: { name: 'Waste Management & Compactor', base: 8500, mob: '48 Hours', cov: 'Facility / Commercial' },
    manpower: { name: 'Skilled Manpower Outsourcing', base: 12000, mob: '2 - 4 Days', cov: 'Site Specific' }
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('selected'));
      chip.classList.add('selected');
      activeService = chip.getAttribute('data-service');
      calculate();
    });
  });

  if (durationInput) {
    durationInput.addEventListener('input', () => {
      durationVal.textContent = `${durationInput.value} ${durationInput.value == 1 ? 'Month' : 'Months'}`;
      calculate();
    });
  }

  if (scaleInput) {
    scaleInput.addEventListener('input', () => {
      scaleVal.textContent = `${scaleInput.value} Units / Personnel`;
      calculate();
    });
  }

  function calculate() {
    const s = serviceRates[activeService];
    if (!s) return;

    const duration = parseInt(durationInput.value);
    const scale = parseInt(scaleInput.value);

    // Dynamic tiered pricing algorithm
    const total = Math.round((s.base * (scale / 5) * duration * 0.9) / 500) * 500;
    const formatted = new Intl.NumberFormat('en-US').format(total);

    outService.textContent = s.name;
    outMobilization.textContent = s.mob;
    outCoverage.textContent = s.cov;
    outPrice.textContent = `SAR ${formatted}`;
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const select = document.getElementById('serviceSelect');
      if (select) select.value = activeService;
      const msg = document.getElementById('messageInput');
      if (msg) {
        msg.value = `Hello Ardh Alfan Team, I used your online estimator for [${serviceRates[activeService].name}] for a duration of ${durationInput.value} month(s) and scale of ${scaleInput.value} units/personnel. Please provide a formal RFP and schedule.`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  calculate();
}

/* ==========================================================================
   12. Contact Form & Toast Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('rfpContactForm');
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();

    if (!name || !email) {
      alert('Please fill in required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Submitting Request...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      // Show toast
      if (toast) {
        toastMsg.textContent = `Thank you, ${name}! Your inquiry has been submitted. Our team will contact you within 24 hours.`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }
    }, 1200);
  });
}

/* ==========================================================================
   13. Back to Top Button
   ========================================================================== */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress span');
  if (!bar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initBackToTop() {
  const btn = document.querySelector('.btn-backtop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   14. Bilingual Switcher (English <-> Arabic)
   ========================================================================== */
const translations = {
  en: {
    langBtn: 'العربية',
    tagline: 'Optimizing Efficiency, Elevating Success',
    badge: 'Kingdom of Saudi Arabia • End-to-End Industrial & Logistics Solutions',
    heroH1: 'Optimizing Efficiency, <span class="gradient-text">Elevating Success</span>',
    heroDesc: 'Specialized warehouse management, heavy machinery mobilization, logistics fleet, boneyard reclamation, and skilled manpower across the Kingdom of Saudi Arabia.',
    exploreBtn: 'Explore Solutions',
    estimateBtn: 'Operational Cost Estimator',
    servicesTitle: 'Comprehensive Industrial Services',
    servicesSubtitle: 'We offer customized solutions that improve your bottom line and ensure the seamless flow of your supply chain and site operations.'
  },
  ar: {
    langBtn: 'English',
    tagline: 'تحسين الكفاءة، والارتقاء بالنجاح',
    badge: 'المملكة العربية السعودية • حلول صناعية ولوجستية متكاملة',
    heroH1: 'تحسين الكفاءة، <span class="gradient-text">والارتقاء بالنجاح</span>',
    heroDesc: 'حلول متخصصة في إدارة المستودعات، حشد وإدارة المعدات الثقيلة، أسطول النقل والخدمات اللوجستية، إدارة ساحات التخزين، وحلول القوى العاملة الماهرة في جميع أنحاء المملكة.',
    exploreBtn: 'استكشف حلولنا',
    estimateBtn: 'حاسبة التكلفة ونطاق العمل',
    servicesTitle: 'خدماتنا الصناعية المتكاملة',
    servicesSubtitle: 'نقدم حلولاً مخصصة لا تعزز أرباحك فحسب، بل تضمن أيضاً التدفق السلس لعملياتك وسلسلة التوريد.'
  }
};

function initLanguageSwitcher() {
  const switchBtns = document.querySelectorAll('.lang-switch');
  let currentLang = 'en';

  switchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

      const t = translations[currentLang];
      switchBtns.forEach((b) => {
        const textSpan = b.querySelector('.lang-text');
        if (textSpan) {
          textSpan.textContent = t.langBtn;
        } else {
          b.textContent = t.langBtn;
        }
      });

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle) heroTitle.innerHTML = t.heroH1;

      const heroDesc = document.querySelector('.hero-desc');
      if (heroDesc) heroDesc.textContent = t.heroDesc;

      const heroBadge = document.querySelector('.hero-badge-text');
      if (heroBadge) heroBadge.textContent = t.badge;

      const sTitle = document.querySelector('#services .section-title');
      if (sTitle) sTitle.textContent = t.servicesTitle;

      const sSub = document.querySelector('#services .section-subtitle');
      if (sSub) sSub.textContent = t.servicesSubtitle;
    });
  });
}


/* ==========================================================================
   15. Hero Headline Word Rotator Animation
   ========================================================================== */
function initTextRotator() {
  const words = document.querySelectorAll('.rotator-word');
  if (!words.length) return;
  let currentIdx = 0;

  setInterval(() => {
    const currentWord = words[currentIdx];
    currentWord.classList.remove('active');
    currentWord.classList.add('leaving');

    setTimeout(() => {
      currentWord.classList.remove('leaving');
    }, 600);

    currentIdx = (currentIdx + 1) % words.length;
    words[currentIdx].classList.add('active');
  }, 2600);
}

/* ==========================================================================
   16. Hero Parallax Micro-Interaction
   ========================================================================== */
function initHeroParallax() {
  const hero = document.getElementById('home');
  const badge1 = document.querySelector('.floating-badge-1');
  const badge2 = document.querySelector('.floating-badge-2');
  const card = document.querySelector('.hero-visual-card');
  const blob1 = document.querySelector('.hero-glow-blob-1');
  const blob2 = document.querySelector('.hero-glow-blob-2');

  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (badge1) badge1.style.transform = `translate3d(${x * -22}px, ${y * -18}px, 0)`;
    if (badge2) badge2.style.transform = `translate3d(${x * 25}px, ${y * 20}px, 0)`;
    if (card) card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -8}deg)`;
    if (blob1) blob1.style.transform = `translate(${x * 35}px, ${y * 25}px)`;
    if (blob2) blob2.style.transform = `translate(${x * -35}px, ${y * -25}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    if (badge1) badge1.style.transform = '';
    if (badge2) badge2.style.transform = '';
    if (card) card.style.transform = '';
    if (blob1) blob1.style.transform = '';
    if (blob2) blob2.style.transform = '';
  });
}

/* ==========================================================================
   17. Interactive Click Ripple Waves
   ========================================================================== */
function initButtonRipples() {
  const elements = document.querySelectorAll('.btn, .filter-btn, .selector-chip, .lang-switch');
  elements.forEach((el) => {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - rect.left - radius}px`;
      ripple.style.top = `${e.clientY - rect.top - radius}px`;

      const existing = this.querySelector('.ripple-circle');
      if (existing) existing.remove();

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ==========================================================================
   18. Dynamic Cursor Sparks Trail
   ========================================================================== */
function initCursorSparks() {
  let lastSpark = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpark < 50) return; // 20fps emission limit for peak smoothness
    lastSpark = now;

    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left = `${e.clientX + (Math.random() - 0.5) * 8}px`;
    spark.style.top = `${e.clientY + (Math.random() - 0.5) * 8}px`;
    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 600);
  });
}
