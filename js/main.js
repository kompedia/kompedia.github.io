(() => {
  'use strict';

  const STORAGE_KEY = 'jb-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'pl';

  const TEMPLATE_CONTAINERS = [
    { containerId: 'hero-text-container', templateId: 'tpl-hero-text-en' },
    { containerId: 'about-header-container', templateId: 'tpl-about-header-en' },
    { containerId: 'about-text-container', templateId: 'tpl-about-text-en' },
    { containerId: 'services-header-container', templateId: 'tpl-services-header-en' },
    { containerId: 'services-grid-container', templateId: 'tpl-services-grid-en' },
    { containerId: 'portfolio-header-container', templateId: 'tpl-portfolio-header-en' },
    { containerId: 'portfolio-grid-container', templateId: 'tpl-portfolio-grid-en' },
    { containerId: 'contact-intro-container', templateId: 'tpl-contact-intro-en' },
  ];

  // Cache initial Polish HTML content from default markup
  const plContentCache = {};
  TEMPLATE_CONTAINERS.forEach(({ containerId }) => {
    const el = document.getElementById(containerId);
    if (el) {
      plContentCache[containerId] = el.innerHTML;
    }
  });

  const STATIC_TEXTS = {
    'nav-about': { en: 'About', pl: 'O mnie' },
    'nav-services': { en: 'Services', pl: 'Usługi' },
    'nav-portfolio': { en: 'Portfolio', pl: 'Portfolio' },
    'nav-contact': { en: 'Contact', pl: 'Kontakt' },
    'label-name': { en: 'Name', pl: 'Imię i nazwisko' },
    'label-email': { en: 'Email', pl: 'E-mail' },
    'label-subject': { en: 'Subject', pl: 'Temat' },
    'label-message': { en: 'Message', pl: 'Wiadomość' },
    'btn-submit': { en: 'Send message', pl: 'Wyślij wiadomość' },
    'form-success-text': {
      en: 'Your email client has been opened with the message pre-filled.',
      pl: 'Otwarto klienta poczty e-mail z wstępnie wypełnioną wiadomością.'
    },
    'footer-copy-text': {
      en: '© 2026 Jakub Barczyk. All rights reserved.',
      pl: '© 2026 Jakub Barczyk. Wszelkie prawa zastrzeżone.'
    }
  };

  const PLACEHOLDERS = {
    'contact-name': { en: 'Your name', pl: 'Twoje imię i nazwisko' },
    'contact-email': { en: 'your@email.com', pl: 'twoj@email.pl' },
    'contact-subject': { en: 'How can I help?', pl: 'W czym mogę pomóc?' },
    'contact-message': {
      en: 'Tell me about your project or training needs...',
      pl: 'Opowiedz o swoim projekcie lub potrzebach szkoleniowych...'
    }
  };

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

    // Render section contents (EN from templates, PL from cached default markup)
    TEMPLATE_CONTAINERS.forEach(({ containerId, templateId }) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (lang === 'en') {
        const tpl = document.getElementById(templateId);
        if (tpl) {
          container.innerHTML = '';
          container.appendChild(tpl.content.cloneNode(true));
        }
      } else if (plContentCache[containerId]) {
        container.innerHTML = plContentCache[containerId];
      }
    });

    // Update static text elements
    Object.entries(STATIC_TEXTS).forEach(([id, translations]) => {
      const el = document.getElementById(id);
      if (el && translations[lang]) {
        el.textContent = translations[lang];
      }
    });

    // Update form placeholders
    Object.entries(PLACEHOLDERS).forEach(([id, translations]) => {
      const el = document.getElementById(id);
      if (el && translations[lang]) {
        el.placeholder = translations[lang];
      }
    });

    // Update lang-btn aria-pressed states
    document.querySelectorAll('.lang-btn').forEach((button) => {
      const active = button.dataset.lang === lang;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Re-observe any newly injected reveal elements
    if (typeof revealObserver !== 'undefined') {
      document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => revealObserver.observe(el));
      document.querySelectorAll('.reveal-stagger:not(.is-revealed)').forEach((el) => revealObserver.observe(el));
    }
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
        const successText = document.getElementById('form-success-text');
        if (successText && STATIC_TEXTS['form-success-text']) {
          successText.textContent = STATIC_TEXTS['form-success-text'][currentLang];
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
