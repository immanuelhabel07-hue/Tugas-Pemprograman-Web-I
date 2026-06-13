/* ========================================
   PORTFOLIO — INTERACTIVE SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initNavigation();
    initScrollReveal();
    initSkillBars();
    initCountUp();
    initContactForm();
});

/* ========== PARTICLE BACKGROUND ========== */

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;

    mouse = { x: null, y: null, radius: 120 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.baseOpacity = this.opacity;

            const colors = [
                'rgba(0, 229, 255,',   // cyan
                'rgba(179, 136, 255,',  // purple
                'rgba(255, 77, 255,',   // magenta
                'rgba(68, 138, 255,',   // blue
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                    this.opacity = Math.min(this.baseOpacity + force * 0.5, 1);
                } else {
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }
            }

            // Wrap around
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();

            // Glow
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                ctx.fill();
            }
        }
    }

    function init() {
        resize();
        const count = Math.min(Math.floor((width * height) / 8000), 150);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        // Reinit particles if count significantly changed
        const newCount = Math.min(Math.floor((width * height) / 8000), 150);
        if (Math.abs(newCount - particles.length) > 20) {
            particles = Array.from({ length: newCount }, () => new Particle());
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();
}

/* ========== TYPING ANIMATION ========== */

function initTypingAnimation() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
        'Profesional Data Lapangan',
        'Petugas Sensus & Survei',
        'Ketua KPPS',
        'Mahasiswa Informatika',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 80;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            speed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400; // Pause before next word
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1200);
}

/* ========== NAVIGATION ========== */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;

        // Active section highlight
        updateActiveLink();
    });

    // Hamburger toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('open');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('open');
        });
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
}

/* ========== SCROLL REVEAL ========== */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay
                const delay = Array.from(entry.target.parentNode.children)
                    .filter(c => c.classList.contains('reveal'))
                    .indexOf(entry.target) * 100;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ========== SKILL BARS ========== */

function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const width = target.getAttribute('data-width');
                target.style.width = width + '%';
                target.classList.add('animated');
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.3
    });

    fills.forEach(fill => observer.observe(fill));
}

/* ========== COUNT UP ANIMATION ========== */

function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500;
                    const step = target / (duration / 16);
                    let current = 0;

                    const update = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    update();
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ========== CONTACT FORM ========== */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Show success state
        btn.innerHTML = '<span>✅ Pesan Terkirim!</span>';
        btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}
