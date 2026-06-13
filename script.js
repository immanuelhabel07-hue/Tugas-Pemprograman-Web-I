/* =============================================================
   CYBER GLASS PORTFOLIO — script.js
   Immanuel Habel Guru | UNSIA IF205
   ============================================================= */

// ============================================================
// 1. AOS INIT
// ============================================================
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

// ============================================================
// 2. NAVBAR SCROLL
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
  toggleBackToTop();
});

// ============================================================
// 3. ACTIVE NAV LINK ON SCROLL
// ============================================================
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(sec => {
    const sTop = sec.offsetTop - 100;
    if (window.scrollY >= sTop) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Close mobile menu when link clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(menu);
    if (bsCollapse) bsCollapse.hide();
  });
});

// ============================================================
// 4. TYPING EFFECT
// ============================================================
const typingTexts = [
  'Mahasiswa Informatika S1',
  'Petugas Pendataan BPS',
  'Web Developer Junior',
  'Desainer UI/UX',
  'Fintech Enthusiast'
];
let tIndex = 0, cIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  if (!typingEl) return;
  const current = typingTexts[tIndex];

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, cIndex + 1);
    cIndex++;
    if (cIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.substring(0, cIndex - 1);
    cIndex--;
    if (cIndex === 0) {
      isDeleting = false;
      tIndex = (tIndex + 1) % typingTexts.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 90);
}
typeEffect();

// ============================================================
// 5. COUNTER ANIMATION
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (target === 50 ? '+' : '');
      }
    };
    update();
  });
}

// Trigger counters when hero visible
const heroObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObs.disconnect(); } });
}, { threshold: 0.4 });
const heroSection = document.getElementById('home');
if (heroSection) heroObs.observe(heroSection);

// ============================================================
// 6. SKILL BAR ANIMATION
// ============================================================
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

// ============================================================
// 7. PARTICLE CANVAS
// ============================================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

const PARTICLE_COUNT = 70;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// ============================================================
// 8. MOUSE GLOW
// ============================================================
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ============================================================
// 9. BACK TO TOP
// ============================================================
const btt = document.getElementById('back-to-top');
function toggleBackToTop() {
  if (window.scrollY > 400) {
    btt.classList.add('show');
  } else {
    btt.classList.remove('show');
  }
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================================
// 10. CONTACT FORM
// ============================================================
function sendMessage() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const fb = document.getElementById('form-feedback');

  if (!name || !email || !subject || !message) {
    fb.style.display = 'block';
    fb.className = 'form-feedback error';
    fb.textContent = 'Mohon isi semua field sebelum mengirim pesan.';
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fb.style.display = 'block';
    fb.className = 'form-feedback error';
    fb.textContent = 'Format email tidak valid.';
    return;
  }

  const btn = document.querySelector('#contact .btn-primary-custom');
  btn.textContent = 'Mengirim...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    fb.style.display = 'block';
    fb.className = 'form-feedback success';
    fb.textContent = `✓ Pesan dari ${name} berhasil dikirim! Saya akan segera membalas.`;
    btn.innerHTML = '<i class="bi bi-send me-2"></i>Kirim Pesan';
    btn.style.opacity = '1';
    ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => document.getElementById(id).value = '');
  }, 1200);
}

// ============================================================
// 11. SMOOTH SCROLL for all anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 12. SCROLL REVEAL for skill bars (fallback)
// ============================================================
window.addEventListener('load', () => {
  // Trigger visible skill bars on page load if already in view
  document.querySelectorAll('.skill-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      card.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
});
