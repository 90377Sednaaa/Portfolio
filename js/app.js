// ============================================================
// PORTFOLIO INTERACTIVE JAVASCRIPT CORE
// ============================================================

/**
 * Version Switcher Engine
 * Seamlessly toggles between New and Classic portfolios
 */
function initVersionSwitcher() {
  const newPortfolio = document.getElementById('portfolio-new');
  const oldPortfolio = document.getElementById('portfolio-old');
  const overlay = document.getElementById('crt-transition-overlay');
  const buttons = document.querySelectorAll('[data-switch-version]');

  if (!newPortfolio || !oldPortfolio) return;

  function setVersion(targetVersion, withTransition = true) {
    const isNew = targetVersion === 'new';

    function applyDOMChanges() {
      if (isNew) {
        newPortfolio.classList.remove('hidden');
        oldPortfolio.classList.add('hidden');
        document.body.classList.remove('old-portfolio-active');
        document.body.classList.add('new-portfolio-active');
      } else {
        newPortfolio.classList.add('hidden');
        oldPortfolio.classList.remove('hidden');
        document.body.classList.remove('new-portfolio-active');
        document.body.classList.add('old-portfolio-active');
      }

      // Update toggle buttons UI state
      buttons.forEach(btn => {
        const btnVer = btn.getAttribute('data-switch-version');
        const isActive = btnVer === targetVersion;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        const dot = btn.querySelector('[data-version-dot]');

        if (isActive) {
          btn.classList.add('active-version', 'bg-[#161514]', 'text-[#F4EFE6]');
          btn.classList.remove('text-[#57534E]', 'hover:text-[#161514]');
          if (dot) dot.classList.remove('hidden');
        } else {
          btn.classList.remove('active-version', 'bg-[#161514]', 'text-[#F4EFE6]');
          btn.classList.add('text-[#57534E]', 'hover:text-[#161514]');
          if (dot) dot.classList.add('hidden');
        }
      });

      // Update indicator text
      document.querySelectorAll('[data-version-indicator]').forEach(ind => {
        ind.textContent = isNew ? 'NEW' : 'CLASSIC';
      });

      localStorage.setItem('lean_portfolio_version', targetVersion);

      // Recalculate ScrollTrigger coordinates after DOM visibility change
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    }

    if (withTransition && overlay) {
      overlay.classList.remove('pointer-events-none', 'opacity-0');
      overlay.classList.add('opacity-100');

      setTimeout(() => {
        applyDOMChanges();
      }, 180);

      setTimeout(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
          overlay.classList.add('pointer-events-none');
        }, 250);
      }, 360);
    } else {
      applyDOMChanges();
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetVersion = btn.getAttribute('data-switch-version');
      setVersion(targetVersion, true);
    });
  });

  const savedVersion = localStorage.getItem('lean_portfolio_version') || 'new';
  setVersion(savedVersion, false);
}

/**
 * Mobile Navigation Drawer Controller
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!menuBtn || !menu) return;

  const openIcon = menuBtn.querySelector('.menu-open-icon');
  const closeIcon = menuBtn.querySelector('.menu-close-icon');

  function toggleMenu(isOpen) {
    const willOpen = typeof isOpen === 'boolean' ? isOpen : menu.classList.contains('hidden');
    if (willOpen) {
      menu.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
      if (openIcon) openIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });
}



/**
 * Universal Carousel Engine for Project & Experience Showcase
 */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;

    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const isAuto = carousel.hasAttribute('data-carousel-auto');
    const delay = parseInt(carousel.dataset.carouselDelay) || 3500;
    const indexDisplay = carousel.querySelector('[data-carousel-index]');

    let current = 0;
    let timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (indexDisplay) {
        indexDisplay.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      }
    }

    function startAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), delay);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAuto();
        goTo(current - 1);
        if (isAuto) startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAuto();
        goTo(current + 1);
        if (isAuto) startAuto();
      });
    }

    if (isAuto) {
      startAuto();
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }

    goTo(0);
  });
}

/**
 * Smooth Card Entrance Animations using GSAP ScrollTrigger
 */
function initScrollReveals() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined' || prefersReduced) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.gsap-reveal-card').forEach((card) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
}

// Master Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initVersionSwitcher();
  initMobileMenu();
  initCarousels();
  initScrollReveals();
});