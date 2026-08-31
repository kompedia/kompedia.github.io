(() => {
  'use strict';

  const STORAGE_KEY = 'jb-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  /**
   * Set all translatable text and placeholders on the page.
   * @param {string} lang — 'en' | 'pl'
   */
  const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    // Update document title and meta description for accessibility & SEO
    if (lang === 'pl') {
      document.title = 'Jakub Barczyk · Lider Technologiczny i Konsultant IT';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'Jakub Barczyk — Lider Technologiczny, Konsultant IT, Trener Inżynierii i Wykładowca Akademicki z Polski.');
    } else {
      document.title = 'Jakub Barczyk · Tech Lead & IT Consultant';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'Jakub Barczyk — Tech Lead, IT Consultant, Engineering Trainer and University Lecturer based in Poland.');
    }

    // Text content — elements with data-en / data-pl
    document.querySelectorAll('[data-en]').forEach((el) => {
      const text = lang === 'pl' ? el.dataset.pl : el.dataset.en;
      if (text !== undefined && text !== '') el.textContent = text;
    });

    // Input / textarea placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach((el) => {
      const ph = lang === 'pl' ? el.dataset.plPlaceholder : el.dataset.enPlaceholder;
      if (ph !== undefined) el.placeholder = ph;
    });

    // Update lang-btn aria-pressed states
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  // Initialise on load
  setLanguage(currentLang);

  // Bind lang buttons
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  const header = document.querySelector('.site-header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 32);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('is-open');
    navMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // prevent scroll behind overlay
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

      // Simple client-side validation
      let valid = true;

      Object.entries(fields).forEach(([key, field]) => {
        const errorEl = field.parentElement.querySelector('.form-error');

        field.removeAttribute('aria-invalid');
        if (errorEl) errorEl.textContent = '';

        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) {
            errorEl.textContent =
              currentLang === 'pl'
                ? getErrorMessagePl(key)
                : getErrorMessageEn(key);
          }
        } else if (key === 'email' && !isValidEmail(field.value)) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) {
            errorEl.textContent =
              currentLang === 'pl'
                ? 'Proszę podać poprawny adres e-mail.'
                : 'Please enter a valid email address.';
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
        `mailto:jakub@jakubbarczyk.pl` +
        `?subject=${encodeURIComponent(fields.subject.value.trim())}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      // Show success notice
      if (formSuccess) {
        formSuccess.removeAttribute('hidden');
        const successText = formSuccess.querySelector('[data-en]');
        if (successText) {
          successText.textContent =
            currentLang === 'pl'
              ? successText.dataset.pl
              : successText.dataset.en;
        }
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

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getErrorMessageEn = (fieldKey) => {
    const map = {
      name:    'Please enter your name.',
      email:   'Please enter your email.',
      subject: 'Please enter a subject.',
      message: 'Please enter a message.',
    };
    return map[fieldKey] || 'This field is required.';
  };

  const getErrorMessagePl = (fieldKey) => {
    const map = {
      name:    'Proszę podać imię i nazwisko.',
      email:   'Proszę podać adres e-mail.',
      subject: 'Proszę podać temat.',
      message: 'Proszę wpisać wiadomość.',
    };
    return map[fieldKey] || 'To pole jest wymagane.';
  };

})();
