/* ================================================================
   HOLYCROSS ENGINEERING COLLEGE — SHARED SCRIPTS
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ───────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link ───────────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll reveal ──────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ── Animated counters ──────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = (target * eased).toFixed(decimals);
      el.textContent = prefix + current + suffix;
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => cObserver.observe(el));
  }

  /* ── Form validation ────────────────────────────────────────── */
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {

    const showError = (input, msg) => {
      input.classList.add('error');
      let err = input.nextElementSibling;
      if (!err || !err.classList.contains('form-error')) {
        err = document.createElement('span');
        err.className = 'form-error';
        input.parentNode.appendChild(err);
      }
      err.textContent = msg;
    };

    const clearError = (input) => {
      input.classList.remove('error');
      const err = input.nextElementSibling;
      if (err && err.classList.contains('form-error')) err.textContent = '';
    };

    const rules = {
      name:    { required: true, minLen: 2, label: 'Full name' },
      email:   { required: true, email: true, label: 'Email' },
      phone:   { required: true, pattern: /^\d{10}$/, label: 'Phone (10 digits)' },
      course:  { required: true, label: 'Course' },
      message: { required: false },
    };

    inquiryForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('blur', () => validateField(el));
    });

    function validateField(el) {
      const rule = rules[el.name];
      if (!rule) return true;
      if (rule.required && !el.value.trim()) {
        showError(el, `${rule.label || 'This field'} is required`);
        return false;
      }
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        showError(el, 'Enter a valid email address');
        return false;
      }
      if (rule.pattern && !rule.pattern.test(el.value.trim())) {
        showError(el, `Please enter a valid ${rule.label}`);
        return false;
      }
      if (rule.minLen && el.value.trim().length < rule.minLen) {
        showError(el, `${rule.label} must be at least ${rule.minLen} characters`);
        return false;
      }
      clearError(el);
      return true;
    }

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      inquiryForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
        if (!validateField(el)) valid = false;
      });
      if (valid) {
        const btn = inquiryForm.querySelector('[type="submit"]');
        btn.textContent = 'Submitting…';
        btn.disabled = true;
        setTimeout(() => {
          inquiryForm.innerHTML = `
            <div style="text-align:center;padding:48px 24px">
              <div style="font-size:3rem;margin-bottom:16px">✅</div>
              <h3 style="color:var(--blue-900);margin-bottom:12px">Application Received!</h3>
              <p style="color:var(--gray-500)">Thank you for your enquiry. Our admissions team will contact you within 24 hours.</p>
            </div>`;
        }, 1200);
      }
    });
  }

  /* ── Smooth scroll for anchor links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
