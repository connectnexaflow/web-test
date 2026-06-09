/* ============================================================
   VARDHMAN HOMEOPATHY — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. NAVBAR — scroll shadow + active link highlight
  ---------------------------------------------------------- */
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Highlight nav link matching current section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navbarNav .nav-link');

  const observerOptions = { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) { sectionObserver.observe(section); });


  /* ----------------------------------------------------------
     2. HERO CAROUSEL — fix overlap + auto-play
  ---------------------------------------------------------- */

  // Fix: Bootstrap needs carousel-items hidden by default.
  // .hero-slide uses display:flex which breaks Bootstrap's hide/show.
  // We override here so only the active slide is flex.
  function fixCarouselDisplay() {
    document.querySelectorAll('.carousel-item.hero-slide').forEach(function (item) {
      item.style.display = item.classList.contains('active') ? 'flex' : 'none';
    });
  }

  fixCarouselDisplay();

  const heroCarouselEl = document.getElementById('heroCarousel');
  if (heroCarouselEl) {
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
      interval: 5000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    });

    // Re-apply display fix on every slide transition
    heroCarouselEl.addEventListener('slide.bs.carousel', function (e) {
      const items = heroCarouselEl.querySelectorAll('.carousel-item.hero-slide');
      items.forEach(function (item, i) {
        item.style.display = (i === e.to) ? 'flex' : 'none';
      });
    });
  }


  /* ----------------------------------------------------------
     3. TESTIMONIAL CAROUSEL
  ---------------------------------------------------------- */
  const testimonialCarouselEl = document.getElementById('testimonialCarousel');
  if (testimonialCarouselEl) {
    new bootstrap.Carousel(testimonialCarouselEl, {
      interval: 6000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    });
  }


  /* ----------------------------------------------------------
     4. SCROLL-REVEAL — fade up cards & sections on enter
  ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.treatment-card, .testimonial-card, .about-text-content, .about-image-block, .hours-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });
  } else {
    // Fallback for old browsers — just show everything
    revealTargets.forEach(function (el) { el.classList.add('revealed'); });
  }


  /* ----------------------------------------------------------
     5. SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Close mobile navbar if open
        const collapse = document.getElementById('navbarNav');
        if (collapse && collapse.classList.contains('show')) {
          new bootstrap.Collapse(collapse).hide();
        }
      }
    });
  });


  /* ----------------------------------------------------------
     6. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------
     7. PHONE LINK — click-to-call tracking (console log)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      console.log('Call initiated:', this.href);
      // Replace with your analytics event if needed:
      // gtag('event', 'phone_call', { value: this.href });
    });
  });

});


/* ============================================================
   REQUIRED CSS ADDITIONS — paste into your <style> block
   (replaces the conflicting display:flex on .hero-slide)
   ============================================================

.hero-slide {
  min-height: 620px;
  align-items: center;        <-- REMOVED display:flex from here
  position: relative;
  overflow: hidden;
}
.carousel-item.hero-slide.active {
  display: flex;              <-- ADDED: only active slide is flex
}

.reveal-ready {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal-ready.revealed {
  opacity: 1;
  transform: translateY(0);
}

============================================================ */
