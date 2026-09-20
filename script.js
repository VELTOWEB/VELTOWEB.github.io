(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const header = document.querySelector('.header');
  const menu = document.querySelector('#mobile-menu');
  const menuButton = document.querySelector('.menu-button');
  const closeMenu = () => { if (menu.open) menu.close(); };
  menuButton.addEventListener('click', () => {
    menu.showModal();
    document.body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
  });
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    const target = document.querySelector(link.hash);
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
  }));
  mobile.addEventListener('change', () => { if (!mobile.matches) closeMenu(); });
  // Without observer support, all content remains visible.
  let revealObserver;
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reduced.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0, rootMargin:'0px 0px -30px 0px'});
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('reveal-pending'); revealObserver.observe(el);
      }
    });
  }
  const pictures = [...document.querySelectorAll('.project-picture')];
  const glow = document.querySelector('.hero-glow');
  const progress = document.querySelector('.scroll-progress');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main > section[id]')];
  let queued = false;
  function updateScroll() {
    queued = false;
    const y = scrollY;
    header.classList.toggle('scrolled', y > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .38) current = section.id; });
    navLinks.forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (!reduced.matches && !mobile.matches) {
      pictures.forEach(picture => {
        const rect = picture.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) {
          const offset = Math.max(-8, Math.min(8, (innerHeight / 2 - rect.top - rect.height / 2) * .018));
          picture.style.setProperty('--parallax-y', offset + 'px');
        }
      });
      glow.style.setProperty('--glow-y', Math.min(y * .12, 100) + 'px');
    } else {
      pictures.forEach(picture => picture.style.removeProperty('--parallax-y'));
      glow.style.removeProperty('--glow-y');
    }
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('load', schedule);
  reduced.addEventListener('change', () => {
    if (reduced.matches) { revealObserver?.disconnect(); reveals.forEach(el => el.classList.remove('reveal-pending')); }
    schedule();
  });
  updateScroll();
})();
