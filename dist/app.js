// ── Data Loading ────────────────────────────────────────────────────────────
async function loadPortfolioData() {
    const res = await fetch('./data/portfolio.json');
    if (!res.ok)
        throw new Error('Failed to load portfolio data');
    return res.json();
}
// ── Render Helpers ───────────────────────────────────────────────────────────
function renderHero(data) {
    const p = data.personal;
    document.getElementById('hero-name').textContent = p.name;
    document.getElementById('hero-title').textContent = p.title;
    document.getElementById('hero-subtitle').textContent = p.subtitle;
    document.getElementById('hero-email').href = `mailto:${p.email}`;
    document.getElementById('hero-linkedin').href = p.linkedin;
    document.getElementById('hero-github').href = p.github;
    document.getElementById('hero-location').textContent = p.location;
}
function renderSkills(data) {
    const container = document.getElementById('skills-grid');
    container.innerHTML = '';
    for (const [category, items] of Object.entries(data.skills)) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
      <h3 class="skill-category">${category}</h3>
      <div class="skill-tags">
        ${items.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    `;
        container.appendChild(card);
    }
}
function renderExperience(data) {
    const container = document.getElementById('experience-list');
    container.innerHTML = data.experience.map((exp) => `
    <div class="exp-card">
      <div class="exp-header">
        <div>
          <h3 class="exp-role">${exp.role}</h3>
          <span class="exp-company">${exp.company}</span>
        </div>
        <div class="exp-meta">
          <span class="exp-duration">${exp.duration}</span>
          <span class="exp-location">${exp.location}</span>
        </div>
      </div>
      <ul class="exp-highlights">
        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}
function renderProjects(data) {
    const container = document.getElementById('projects-grid');
    container.innerHTML = data.projects.map((proj, i) => `
    <div class="project-card" style="animation-delay: ${i * 0.12}s">
      <div class="project-index">${String(i + 1).padStart(2, '0')}</div>
      <h3 class="project-title">${proj.title}</h3>
      <p class="project-desc">${proj.description}</p>
      <ul class="project-highlights">
        ${proj.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
      <div class="project-tags">
        ${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}
function renderEducation(data) {
    const edu = data.education;
    const container = document.getElementById('education-block');
    const gpa = edu.gpa ? `<span class="edu-gpa">GPA ${edu.gpa}</span>` : '';
    const cw = edu.coursework ? `<div class="edu-coursework">Coursework: ${edu.coursework}</div>` : '';
    container.innerHTML = `
    <div class="edu-card">
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-institution">${edu.institution}</div>
      <div class="edu-meta">${edu.location} &nbsp;·&nbsp; ${edu.duration} &nbsp;${gpa}</div>
      ${cw}
    </div>
  `;
}
function renderCertifications(data) {
    const container = document.getElementById('certs-list');
    container.innerHTML = data.certifications.map((cert) => `
    <div class="cert-card">
      <div class="cert-name">${cert.name}</div>
      <div class="cert-meta">
        <span class="cert-issuer">${cert.issuer}</span>
        <span class="cert-date">${cert.date}</span>
      </div>
    </div>
  `).join('');
}
// ── Navigation ───────────────────────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('main-nav');
    const links = nav.querySelectorAll('.nav-link');
    // Active section highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = nav.querySelector(`[href="#${entry.target.id}"]`);
                active?.classList.add('active');
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
    // Shrink nav on scroll
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}
// ── Scroll Animations ────────────────────────────────────────────────────────
function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
}
// ── Typing Effect ────────────────────────────────────────────────────────────
function typeEffect(el, text, speed = 38) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length)
            clearInterval(interval);
    }, speed);
}
// ── Cursor Trail ─────────────────────────────────────────────────────────────
function initCursorTrail() {
    const trail = [];
    const NUM = 8;
    for (let i = 0; i < NUM; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.style.opacity = String(1 - i / NUM);
        dot.style.transform = `scale(${1 - i * 0.08})`;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    const positions = Array(NUM).fill({ x: 0, y: 0 });
    document.addEventListener('mousemove', e => {
        positions[0] = { x: e.clientX, y: e.clientY };
    });
    function animate() {
        for (let i = NUM - 1; i > 0; i--) {
            positions[i] = {
                x: positions[i].x + (positions[i - 1].x - positions[i].x) * 0.35,
                y: positions[i].y + (positions[i - 1].y - positions[i].y) * 0.35,
            };
        }
        trail.forEach((dot, i) => {
            dot.style.left = `${positions[i].x}px`;
            dot.style.top = `${positions[i].y}px`;
        });
        requestAnimationFrame(animate);
    }
    animate();
}
// ── Bootstrap ────────────────────────────────────────────────────────────────
async function main() {
    const data = await loadPortfolioData();
    renderHero(data);
    renderSkills(data);
    renderExperience(data);
    renderProjects(data);
    renderEducation(data);
    renderCertifications(data);
    initNav();
    initScrollAnimations();
    initCursorTrail();
    // Typing effect on hero
    const titleEl = document.getElementById('hero-title');
    typeEffect(titleEl, data.personal.title, 42);
    // Stagger fade-in triggers
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.07}s`;
        });
        initScrollAnimations();
    }, 100);
}
document.addEventListener('DOMContentLoaded', main);
export {};
//# sourceMappingURL=app.js.map