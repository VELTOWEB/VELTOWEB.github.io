(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mobileViewport = window.matchMedia('(max-width: 900px)');

  root.classList.add('js-ready');

  /* =====================================================
     INTRO
     ===================================================== */
  const intro = document.querySelector('.intro');
  let introSeen = false;

  try {
    introSeen = sessionStorage.getItem('veltoweb-intro-seen') === 'true';
    sessionStorage.setItem('veltoweb-intro-seen', 'true');
  } catch (_) {
    introSeen = false;
  }

  const finishIntro = () => {
    body.classList.add('is-loaded');

    document.querySelectorAll('.hero-reveal').forEach((element) => {
      element.addEventListener('animationend', () => {
        element.classList.remove('hero-reveal');
      }, { once: true });
    });

    if (!intro || reduceMotion.matches) {
      intro?.classList.add('is-removed');
      return;
    }

    intro.classList.add('is-finished');
    window.setTimeout(() => {
      intro.classList.add('is-removed');
      body.classList.remove('intro-open');
    }, 760);
  };

  if (reduceMotion.matches) {
    finishIntro();
  } else {
    body.classList.add('intro-open');
    window.setTimeout(finishIntro, introSeen ? 180 : 720);
  }

  /* =====================================================
     MOBILE MENU
     ===================================================== */
  const menu = document.querySelector('#mobile-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  let menuWasOpenedBy = null;

  const focusableInMenu = () => [
    ...menu.querySelectorAll('a[href], button:not([disabled])')
  ];

  const openMenu = () => {
    menuWasOpenedBy = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', '메뉴 닫기');
    body.classList.add('menu-open');
    window.setTimeout(() => menuClose.focus(), 80);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
    body.classList.remove('menu-open');
    if (restoreFocus) menuWasOpenedBy?.focus();
  };

  menuToggle?.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  menuClose?.addEventListener('click', () => closeMenu());

  menu?.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
  });

  document.addEventListener('keydown', (event) => {
    if (!menu?.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = focusableInMenu();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileViewport.addEventListener('change', (event) => {
    if (!event.matches) closeMenu({ restoreFocus: false });
  });

  /* =====================================================
     SCROLL STATE / NAVIGATION / PARALLAX
     ===================================================== */
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress');
  const sections = [...document.querySelectorAll('main > section[id]')];
  const desktopLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const ambient = document.querySelector('.hero__ambient');
  let scrollFrame = 0;

  const sectionAtHeader = () => {
    const marker = Math.min(110, window.innerHeight * 0.2);
    return sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= marker && rect.bottom > marker;
    }) || sections[0];
  };

  const updateScrollState = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const currentSection = sectionAtHeader();
    const currentId = currentSection?.id || '';
    const lightNavigation = currentSection?.dataset.navTheme === 'light';

    header.classList.toggle('is-scrolled', y > 24);
    header.classList.toggle('is-light', lightNavigation);
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;

    desktopLinks.forEach((link) => {
      const active = link.hash === `#${currentId}`;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (ambient && !reduceMotion.matches && !mobileViewport.matches) {
      ambient.style.setProperty('--ambient-y', `${Math.min(y * 0.13, 130)}px`);
      ambient.style.setProperty('--ambient-x', `${Math.min(y * 0.025, 24)}px`);
    }
  };

  const scheduleScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  };

  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  window.addEventListener('load', scheduleScrollUpdate);
  updateScrollState();

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */
  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver = null;

  const setupReveals = () => {
    revealObserver?.disconnect();

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.remove('reveal-pending'));
      return;
    }

    revealElements.forEach((element) => element.classList.add('reveal-pending'));

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -7% 0px'
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  };

  setupReveals();

  /* =====================================================
     PROJECT INTERACTION
     ===================================================== */
  const projectLinks = [...document.querySelectorAll('.project__link')];

  const resetProjectImage = (media) => {
    media.style.removeProperty('--image-x');
    media.style.removeProperty('--image-y');
  };

  if (finePointer.matches && !reduceMotion.matches) {
    projectLinks.forEach((link) => {
      const media = link.querySelector('.project__media');
      let projectFrame = 0;

      link.addEventListener('pointermove', (event) => {
        if (projectFrame) return;
        projectFrame = requestAnimationFrame(() => {
          projectFrame = 0;
          const rect = media.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
          media.style.setProperty('--image-x', `${x.toFixed(2)}px`);
          media.style.setProperty('--image-y', `${y.toFixed(2)}px`);
        });
      });

      link.addEventListener('pointerleave', () => resetProjectImage(media));
    });
  }

  /* =====================================================
     HERO POINTER RESPONSE
     ===================================================== */
  const heroTilt = document.querySelector('[data-tilt]');

  if (heroTilt && finePointer.matches && !reduceMotion.matches) {
    let tiltFrame = 0;

    heroTilt.addEventListener('pointermove', (event) => {
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        tiltFrame = 0;
        const rect = heroTilt.getBoundingClientRect();
        const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
        const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
        heroTilt.style.setProperty('--tilt-x', `${(normalizedX * 8).toFixed(2)}px`);
        heroTilt.style.setProperty('--tilt-y', `${(normalizedY * 8).toFixed(2)}px`);
        heroTilt.style.setProperty('--tilt-r', `${(-2 + normalizedX * 1.8).toFixed(2)}deg`);
      });
    });

    heroTilt.addEventListener('pointerleave', () => {
      heroTilt.style.removeProperty('--tilt-x');
      heroTilt.style.removeProperty('--tilt-y');
      heroTilt.style.removeProperty('--tilt-r');
    });
  }

  /* =====================================================
     CUSTOM CURSOR
     ===================================================== */
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor?.querySelector('.cursor__label');

  if (cursor && finePointer.matches && !reduceMotion.matches) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let cursorFrame = 0;

    const renderCursor = () => {
      cursorX += (pointerX - cursorX) * 0.22;
      cursorY += (pointerY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(pointerX - cursorX) > 0.1 || Math.abs(pointerY - cursorY) > 0.1) {
        cursorFrame = requestAnimationFrame(renderCursor);
      } else {
        cursorFrame = 0;
      }
    };

    document.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add('is-visible');
      if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
    }, { passive: true });

    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));

    document.querySelectorAll('[data-cursor]').forEach((target) => {
      target.addEventListener('pointerenter', () => {
        cursorLabel.textContent = target.dataset.cursor || 'VIEW';
        cursor.classList.add('is-active');
      });
      target.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }

  /* =====================================================
     PREFERENCE CHANGES
     ===================================================== */
  reduceMotion.addEventListener('change', () => {
    setupReveals();
    updateScrollState();
  });
})();
