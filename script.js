// ============================================
// PORTFOLIO SCRIPT - J. Rajalakshmi
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // PARTICLE ANIMATION
    // ============================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDirection * 0.003;

                if (this.opacity <= 0.05 || this.opacity >= 0.6) {
                    this.fadeDirection *= -1;
                }

                if (this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle?.querySelector('.sun-icon');
    const moonIcon = themeToggle?.querySelector('.moon-icon');

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.remove('light-mode');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            document.documentElement.classList.add('light-mode');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Update charts for theme
        updateChartsTheme();
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setTheme(false);
    }

    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('light-mode');
        setTheme(isDark);
    });

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop?.classList.add('show');
        } else {
            backToTop?.classList.remove('show');
        }

        // Active nav link
        updateActiveNavLink();
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // SKILL PROGRESS BAR ANIMATION
    // ============================================
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.progress-fill');
                fills.forEach((fill, i) => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                        fill.style.width = width;
                    }, i * 150);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const skillsList = document.querySelector('.skills-list');
    if (skillsList) progressObserver.observe(skillsList);

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = performance.now();
        const isFloat = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = isFloat
                ? (target * eased).toFixed(1)
                : Math.floor(target * eased);
            element.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-big, .kpi-value');
                counters.forEach(counter => {
                    const text = counter.textContent.trim();
                    const match = text.match(/^([\d.]+)(.*)$/);
                    if (match) {
                        const num = parseFloat(match[1]);
                        const suffix = match[2];
                        animateCounter(counter, num, suffix);
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stats-grid, .kpi-grid').forEach(grid => {
        counterObserver.observe(grid);
    });

    // ============================================
    // CHARTS
    // ============================================
    let skillsChart, accuracyChart, masteryChart;

    function getChartColors() {
        const isLight = document.documentElement.classList.contains('light-mode');
        return {
            textColor: isLight ? '#1e293b' : '#e5e7eb',
            gridColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
            tooltipBg: isLight ? '#ffffff' : '#1a1f3a',
            tooltipText: isLight ? '#1e293b' : '#e5e7eb'
        };
    }

    function initCharts() {
        const colors = getChartColors();

        // Skills Radar Chart
        const skillsCtx = document.getElementById('skillsChart');
        if (skillsCtx) {
            skillsChart = new Chart(skillsCtx, {
                type: 'radar',
                data: {
                    labels: ['SQL', 'Python', 'Excel', 'Power BI', 'Data Cleaning', 'Analytics'],
                    datasets: [{
                        label: 'Proficiency',
                        data: [85, 75, 90, 80, 88, 82],
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        borderWidth: 2,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                color: colors.textColor,
                                backdropColor: 'transparent',
                                font: { size: 11 }
                            },
                            grid: { color: colors.gridColor },
                            angleLines: { color: colors.gridColor },
                            pointLabels: {
                                color: colors.textColor,
                                font: { size: 13, family: 'Inter', weight: '600' }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: colors.tooltipBg,
                            titleColor: colors.tooltipText,
                            bodyColor: colors.tooltipText,
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: ctx => `${ctx.label}: ${ctx.raw}%`
                            }
                        }
                    }
                }
            });
        }

        // Accuracy Line Chart
        const accuracyCtx = document.getElementById('accuracyChart');
        if (accuracyCtx) {
            accuracyChart = new Chart(accuracyCtx, {
                type: 'line',
                data: {
                    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                    datasets: [{
                        label: 'Accuracy %',
                        data: [94, 96, 97.5, 98.2, 99, 99.8],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: { color: colors.gridColor },
                            ticks: { color: colors.textColor, font: { size: 12 } }
                        },
                        y: {
                            min: 90,
                            max: 100,
                            grid: { color: colors.gridColor },
                            ticks: {
                                color: colors.textColor,
                                font: { size: 12 },
                                callback: v => v + '%'
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: colors.tooltipBg,
                            titleColor: colors.tooltipText,
                            bodyColor: colors.tooltipText,
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: ctx => `Accuracy: ${ctx.raw}%`
                            }
                        }
                    }
                }
            });
        }

        // Mastery Doughnut Chart
        const masteryCtx = document.getElementById('masteryChart');
        if (masteryCtx) {
            masteryChart = new Chart(masteryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['SQL', 'Python', 'Excel', 'Power BI', 'Data Cleaning', 'Analytics'],
                    datasets: [{
                        data: [85, 75, 90, 80, 88, 82],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(6, 182, 212, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(245, 158, 11, 0.8)'
                        ],
                        borderColor: 'transparent',
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: colors.textColor,
                                padding: 16,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: { size: 12, family: 'Inter' }
                            }
                        },
                        tooltip: {
                            backgroundColor: colors.tooltipBg,
                            titleColor: colors.tooltipText,
                            bodyColor: colors.tooltipText,
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: ctx => `${ctx.label}: ${ctx.raw}%`
                            }
                        }
                    }
                }
            });
        }
    }

    function updateChartsTheme() {
        const colors = getChartColors();

        [skillsChart, accuracyChart, masteryChart].forEach(chart => {
            if (!chart) return;

            if (chart.config.type === 'radar') {
                chart.options.scales.r.ticks.color = colors.textColor;
                chart.options.scales.r.grid.color = colors.gridColor;
                chart.options.scales.r.angleLines.color = colors.gridColor;
                chart.options.scales.r.pointLabels.color = colors.textColor;
            } else if (chart.config.type === 'line') {
                chart.options.scales.x.grid.color = colors.gridColor;
                chart.options.scales.x.ticks.color = colors.textColor;
                chart.options.scales.y.grid.color = colors.gridColor;
                chart.options.scales.y.ticks.color = colors.textColor;
            } else if (chart.config.type === 'doughnut') {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }

            chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
            chart.options.plugins.tooltip.titleColor = colors.tooltipText;
            chart.options.plugins.tooltip.bodyColor = colors.tooltipText;
            chart.update();
        });
    }

    initCharts();


    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate sending (no backend)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    function showFormMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message show ${type}`;
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // TYPING EFFECT ON HERO
    // ============================================
    const heroSubtitle = document.querySelector('.hero-subtitle h2');
    if (heroSubtitle) {
        const roles = ['Data Analyst', 'SQL Expert', 'Python Developer', 'BI Specialist'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                heroSubtitle.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                heroSubtitle.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400; // Pause before typing next
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 2000);
    }

});
