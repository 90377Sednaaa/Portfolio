function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const isAuto = carousel.hasAttribute('data-carousel-auto');
    const delay = parseInt(carousel.dataset.carouselDelay) || 3000;

    let current = 0;
    let timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
    }

    function startAuto() {
      timer = setInterval(() => goTo(current + 1), delay);
    }

    function stopAuto() {
      clearInterval(timer);
    }

    prevBtn.addEventListener('click', () => {
      stopAuto();
      goTo(current - 1);
      if (isAuto) startAuto(); // restart timer after manual click
    });

    nextBtn.addEventListener('click', () => {
      stopAuto();
      goTo(current + 1);
      if (isAuto) startAuto();
    });

    // Pause on hover
    if (isAuto) {
      startAuto();
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }
  });
}

document.addEventListener('DOMContentLoaded', initCarousels);