// Global JavaScript for Horizon Coach - Tourist Bus & Traveller Rental

document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  // Attach listener to ALL theme toggle buttons (desktop, header switch, mobile)
  const allThemeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile, .header-theme-switch, [id^="theme-toggle"]');
  allThemeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#theme-icon, #theme-icon-mobile, .theme-icon');
    themeIcons.forEach(icon => {
      if (!icon) return;
      if (theme === 'light') {
        icon.className = 'fa-regular fa-moon text-xs text-white';
      } else {
        icon.className = 'fa-regular fa-sun text-xs text-white';
      }
    });

    // Update Mobile Switch Track UI
    const themeSwitchTracks = document.querySelectorAll('#theme-switch-track, .theme-switch-track');
    themeSwitchTracks.forEach(track => {
      if (theme === 'dark') {
        track.classList.add('active-theme');
      } else {
        track.classList.remove('active-theme');
      }
    });
  }

  // RTL Manager
  const initialIsRtl = localStorage.getItem('rtl') === 'true';

  // Apply initial RTL direction
  updateRtlState(initialIsRtl ? 'rtl' : 'ltr');

  function updateRtlState(dir) {
    document.documentElement.setAttribute('dir', dir);
    const rtlSwitchTracks = document.querySelectorAll('#rtl-switch-track, .rtl-switch-track');
    rtlSwitchTracks.forEach(track => {
      if (dir === 'rtl') {
        track.classList.add('active-rtl');
      } else {
        track.classList.remove('active-rtl');
      }
    });

    const rtlIcons = document.querySelectorAll('#rtl-icon, .rtl-icon');
    rtlIcons.forEach(icon => {
      if (dir === 'rtl') {
        icon.classList.add('text-[#0D9488]', 'rotate-180');
      } else {
        icon.classList.remove('text-[#0D9488]', 'rotate-180');
      }
    });
  }

  function toggleRtl() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem('rtl', newDir === 'rtl' ? 'true' : 'false');
    updateRtlState(newDir);
  }

  // Attach listener to ALL RTL toggle buttons
  const allRtlButtons = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile, [id^="rtl-toggle"]');
  allRtlButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleRtl();
    });
  });

  // Scroll Progress Indicator
  window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgress.style.width = scrolled + '%';
    }

    // Sticky Navbar Styling & Back to Top visibility
    const navbar = document.querySelector('nav');
    const backToTopBtn = document.getElementById('back-to-top');

    if (window.scrollY > 50) {
      navbar?.classList.add('shadow-xl', 'bg-opacity-95', 'border-b', 'border-white/10');
    } else {
      navbar?.classList.remove('shadow-xl', 'bg-opacity-95', 'border-b', 'border-white/10');
    }

    if (window.scrollY > 300) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  // Back to top scroll handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Menu slide toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Inject icons into mobile menu links dynamically
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
  const iconMapping = {
    'index.html': 'fa-solid fa-house',
    'home-2.html': 'fa-solid fa-compass',
    'services.html': 'fa-solid fa-bus',
    'prescriptions.html': 'fa-solid fa-tags',
    'about.html': 'fa-solid fa-circle-info',
    'contact.html': 'fa-solid fa-envelope',
    'login.html': 'fa-solid fa-right-to-bracket',
    'register.html': 'fa-solid fa-user-plus',
    'dashboard.html': 'fa-solid fa-chart-line',
    'doctors.html': 'fa-solid fa-id-card',
    'medicines.html': 'fa-solid fa-couch',
    'health-blog.html': 'fa-solid fa-map-location-dot'
  };

  mobileMenuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !link.querySelector('i') && !link.classList.contains('mobile-signup-btn')) {
      const filename = href.split('/').pop().split('#')[0].split('?')[0] || 'index.html';
      const iconClass = iconMapping[filename];
      if (iconClass) {
        const iconEl = document.createElement('i');
        iconEl.className = iconClass + ' mr-2 text-xs';
        link.insertBefore(iconEl, link.firstChild);
      }
    }
  });

  // Active Page & Dropdown Highlighter
  const currentPath = window.location.pathname;
  let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1).split('#')[0].split('?')[0];
  if (!currentPage || currentPage === '/') {
    currentPage = 'index.html';
  }

  const fleetPages = ['services.html', 'medicines.html', 'health-blog.html', 'doctors.html'];

  // Highlight standard desktop & mobile nav links
  const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const hrefPage = href.split('/').pop().split('#')[0].split('?')[0];
      if (hrefPage === currentPage) {
        link.classList.remove('text-[#CBD5E1]', 'text-[#E2E8F0]', 'text-[#D1D5DB]', 'text-[#F3F4F6]', 'text-gray-300', 'text-gray-400', 'font-medium');
        link.classList.add('text-[#D4AF37]', 'font-bold', 'active', 'active-nav-link');
        link.style.color = '#D4AF37';

        if (link.closest('.group') || link.classList.contains('dropdown-item')) {
          link.classList.add('bg-[#0D9488]/15', 'text-[#D4AF37]', 'font-semibold', 'dropdown-active-item');
        }

        if (link.closest('#mobile-menu')) {
          link.classList.add('text-[#D4AF37]', 'font-bold', 'active', 'mobile-active-item');
        }
      }
    }
  });

  // Highlight Fleet nav link when on fleet sub-pages
  if (fleetPages.includes(currentPage)) {
    const fleetNavLinks = document.querySelectorAll('nav a[href="services.html"], #mobile-menu a[href="services.html"]');
    fleetNavLinks.forEach(link => {
      link.classList.remove('text-[#CBD5E1]', 'text-[#E2E8F0]', 'text-[#D1D5DB]', 'text-[#F3F4F6]', 'text-gray-300', 'text-gray-400', 'font-medium');
      link.classList.add('text-[#D4AF37]', 'font-bold', 'active', 'active-nav-link');
      link.style.color = '#D4AF37';
    });
  }

  // Home 2 Quick Fleet Matcher
  const tripSelect = document.getElementById('trip-type-select') || document.getElementById('symptom-select');
  const vehicleRec = document.getElementById('vehicle-recommendation') || document.getElementById('procedure-recommendation');
  if (tripSelect && vehicleRec) {
    vehicleRec.style.transition = 'opacity 0.15s ease';
    const fleetMap = {
      'family': '<span class="text-[#D4AF37] font-semibold">Recommended:</span> 12-Seater Luxury Tempo Traveller (Pushback AC)',
      'pilgrimage': '<span class="text-[#D4AF37] font-semibold">Recommended:</span> 17-Seater Executive Tempo Traveller (Ample Luggage)',
      'corporate': '<span class="text-[#D4AF37] font-semibold">Recommended:</span> 20-Seater Mini Bus or 27-Seater Corporate Coach',
      'wedding': '<span class="text-[#D4AF37] font-semibold">Recommended:</span> 35-Seater Tourist Bus or 45-Seater Luxury Coach',
      'school': '<span class="text-[#D4AF37] font-semibold">Recommended:</span> 45-Seater Luxury Coach (GPS & Speed Governor)'
    };

    tripSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (fleetMap[selected]) {
        vehicleRec.style.opacity = '0';
        setTimeout(() => {
          vehicleRec.innerHTML = fleetMap[selected];
          vehicleRec.style.opacity = '1';
        }, 150);
      }
    });
  }

  // Fleet Category Filter Buttons (on services.html)
  const filterButtons = document.querySelectorAll('.fleet-filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-card');
  if (filterButtons.length > 0 && fleetCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active', 'bg-[#0D9488]', 'text-white', 'border-[#0D9488]');
        });
        btn.classList.add('active', 'bg-[#0D9488]', 'text-white', 'border-[#0D9488]');

        const category = btn.getAttribute('data-filter');
        fleetCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
            card.classList.add('aos-animate');
          } else {
            card.classList.add('hidden');
          }
        });

        if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
          AOS.refresh();
        }
      });
    });
  }
});
