/* ========================================
   SantaMariaSolar — script.js
   ======================================== */

// ---- Navbar scroll effect ----
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  updateActiveLink();
});

// ---- Back to top ----
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ---- Intersection Observer — reveal animations ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside the same parent grid
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Count-up animation for hero stats ----
const statNums = document.querySelectorAll('.stat-num[data-count]');

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Contact form submission ----
const quoteForm  = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');

quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }

  // Simulate form submission (replace with actual backend/FormSubmit/Netlify)
  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    quoteForm.hidden   = true;
    formSuccess.hidden = false;
  }, 1200);
});

// ---- Gallery lightbox (simple CSS-class toggle) ----
const galleryClickItems = document.querySelectorAll('.gallery-item');
galleryClickItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.92);
      display:flex; align-items:center; justify-content:center; padding:2rem;
      cursor:zoom-out; animation: fadeIn .2s ease;
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200');
    lightboxImg.style.cssText = `
      max-width:100%; max-height:90vh; border-radius:16px;
      box-shadow:0 20px 80px rgba(0,0,0,.6); pointer-events:none;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
      position:absolute; top:1.5rem; right:1.5rem; background:rgba(255,255,255,.15);
      color:#fff; border:none; cursor:pointer; width:44px; height:44px;
      border-radius:50%; font-size:1.1rem; display:flex; align-items:center;
      justify-content:center; transition:background .2s;
    `;
    closeBtn.onmouseenter = () => { closeBtn.style.background = 'rgba(245,158,11,.8)'; };
    closeBtn.onmouseleave = () => { closeBtn.style.background = 'rgba(255,255,255,.15)'; };

    overlay.appendChild(lightboxImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', (ev) => { ev.stopPropagation(); close(); });

    document.addEventListener('keydown', function esc(ev) {
      if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  });
});

// ---- Gallery filter tabs ----
const filterBtns  = document.querySelectorAll('.gfilter');
const galleryItems = document.querySelectorAll('.gallery-item[data-cat]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.cat;
      // 'diy' filter shows diy category; 'all' shows everything
      const show = filter === 'all' || cat === filter;
      item.classList.toggle('hidden', !show);

      if (show && !item.classList.contains('visible')) {
        setTimeout(() => item.classList.add('visible'), 50);
      }
    });
  });
});

// ---- Add fadeIn keyframe dynamically ----
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`;
document.head.appendChild(style);
