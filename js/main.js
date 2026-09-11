(() => {
  'use strict';

  const TRANSLATIONS = {
    pl: {
      title: 'Jakub Barczyk · Lider Technologiczny i Konsultant IT',
      meta: 'Jakub Barczyk — Lider Technologiczny, Konsultant IT, Trener Inżynierii i Wykładowca Akademicki z Polski.',
      name: 'Proszę podać imię i nazwisko.',
      email: 'Proszę podać adres e-mail.',
      emailInvalid: 'Proszę podać poprawny adres e-mail.',
      subject: 'Proszę podać temat.',
      message: 'Proszę wpisać wiadomość.',
      fallback: 'To pole jest wymagane.',
    },
    en: {
      title: 'Jakub Barczyk · Tech Lead & IT Consultant',
      meta: 'Jakub Barczyk — Tech Lead, IT Consultant, Engineering Trainer and University Lecturer based in Poland.',
      name: 'Please enter your name.',
      email: 'Please enter your email.',
      emailInvalid: 'Please enter a valid email address.',
      subject: 'Please enter a subject.',
      message: 'Please enter a message.',
      fallback: 'This field is required.',
    },
  };

  const STORAGE_KEY = 'jb-lang';
  let currentLang = 'pl';
  try {
    currentLang = localStorage.getItem(STORAGE_KEY) || 'pl';
  } catch {}

  const setLanguage = (lang) => {
    currentLang = lang === 'en' ? 'en' : 'pl';
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch {}
    document.documentElement.lang = currentLang;

    const t = TRANSLATIONS[currentLang];
    // Update document title and meta description for accessibility & SEO
    document.title = t.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.meta);
    }

    // Update lang-btn aria-pressed states
    document.querySelectorAll('.lang-btn').forEach((button) => {
      const active = button.dataset.lang === currentLang;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const header = document.querySelector('.site-header');

  let scrollTicking = false;
  const updateScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 32);
    }
    scrollTicking = false;
  };

  const onScroll = () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScroll);
      scrollTicking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(updateScroll);

  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('is-open');
    navMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  // Close when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close menu if resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
      closeNav();
    }
  }, { passive: true });

  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealEls     = document.querySelectorAll('.reveal');
  const revealStagger = document.querySelectorAll('.reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
  revealStagger.forEach((el) => revealObserver.observe(el));

  // Initialise language on load
  setLanguage(currentLang);

  // Bind lang buttons
  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        name:    document.getElementById('contact-name'),
        email:   document.getElementById('contact-email'),
        subject: document.getElementById('contact-subject'),
        message: document.getElementById('contact-message'),
      };

      const t = TRANSLATIONS[currentLang];
      let valid = true;

      Object.entries(fields).forEach(([key, field]) => {
        const errorEl = field.parentElement.querySelector('.form-error');

        field.removeAttribute('aria-invalid');
        if (errorEl) errorEl.textContent = '';

        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) {
            errorEl.textContent = t[key] || t.fallback;
          }
        } else if (field.type === 'email' && !field.checkValidity()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) {
            errorEl.textContent = t.emailInvalid;
          }
        }
      });

      if (!valid) {
        // Move focus to first invalid field
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Build and open mailto link
      const body = [
        `From: ${fields.name.value.trim()} <${fields.email.value.trim()}>`,
        '',
        fields.message.value.trim(),
      ].join('\n');

      const mailto =
        `mailto:jsbarczyk@gmail.com` +
        `?subject=${encodeURIComponent(fields.subject.value.trim())}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      // Show success notice
      if (formSuccess) {
        formSuccess.removeAttribute('hidden');
      }
    });

    // Clear error state on input
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        field.removeAttribute('aria-invalid');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

})();
