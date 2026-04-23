/* ═══════════════════════════════════════════════
   DANIEL C PORTFOLIO — script.js
═══════════════════════════════════════════════ */

/* ── Custom Cursor ── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .service-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'var(--cyan)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'var(--blue-lt)';
  });
});

/* ── Typing Animation ── */
const typedEl = document.getElementById('typedName');
const names   = ['Daniel C', 'Web Dev', 'Freelancer', 'Daniel C'];
let   nameIdx = 0;
let   charIdx = 0;
let   isDeleting = false;
let   typingSpeed = 120;

function typeEffect() {
  const current = names[nameIdx];

  if (isDeleting) {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    typingSpeed = 60;
  } else {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    typingSpeed = 120;
  }

  if (!isDeleting && charIdx === current.length) {
    isDeleting = true;
    typingSpeed = 1800; // pause at end
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    nameIdx = (nameIdx + 1) % names.length;
    typingSpeed = 300;
  }

  setTimeout(typeEffect, typingSpeed);
}

setTimeout(typeEffect, 500);

/* ── Navbar: scroll behavior + active section ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const backTop  = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Scrolled class
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  if (scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }

  // Active nav link
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
});

/* ── Back to top ── */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── Animated Counters ── */
function animateCounter(el, target, duration = 1800) {
  const suffix = el.textContent.replace(/[0-9]/g, '');
  let start    = 0;
  const step   = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const raw  = el.textContent.trim();
      const num  = parseInt(raw.replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        animateCounter(el, num);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num, .big-stat span').forEach(el => {
  counterObserver.observe(el);
});

/* ── Parallax glow on hero ── */
const heroGlows = document.querySelectorAll('.hero-glow');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  heroGlows.forEach((glow, i) => {
    const speed = i === 0 ? 0.3 : -0.2;
    glow.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

/* ── Tilt effect on cards ── */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const xPos  = (e.clientX - rect.left) / rect.width  - 0.5;
      const yPos  = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-yPos * intensity}deg) rotateY(${xPos * intensity}deg)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
    });
  });
}

addTilt('.service-card', 6);
addTilt('.project-card', 5);
addTilt('.testi-card',   4);
addTilt('.skill-card',   8);

/* ── Glowing mouse trail on hero ── */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    hero.style.setProperty('--mx', x + 'px');
    hero.style.setProperty('--my', y + 'px');
  });
}

/* ── Skill cards hover glow ── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 16px 40px rgba(0,150,255,0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ── Nav logo scroll to top ── */
document.querySelector('.nav-logo').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Page load animation ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity    = '1';
  }, 50);
});