// app.ts — Portfolio Application Logic
import type { PortfolioData, Project, Experience, Certification } from './types.js';

// ── Data Loading ────────────────────────────────────────────────────────────
async function loadPortfolioData(): Promise<PortfolioData> {
  const res = await fetch('./data/portfolio.json');
  if (!res.ok) throw new Error('Failed to load portfolio data');
  return res.json() as Promise<PortfolioData>;
}

// ── Render Helpers ───────────────────────────────────────────────────────────
function renderHero(data: PortfolioData): void {
  const p = data.personal;
  (document.getElementById('hero-name') as HTMLElement).textContent = p.name;
  (document.getElementById('hero-title') as HTMLElement).textContent = p.title;
  (document.getElementById('hero-subtitle') as HTMLElement).textContent = p.subtitle;
  (document.getElementById('hero-email') as HTMLAnchorElement).href = `mailto:${p.email}`;
  (document.getElementById('hero-linkedin') as HTMLAnchorElement).href = p.linkedin;
  (document.getElementById('hero-github') as HTMLAnchorElement).href = p.github;
  (document.getElementById('hero-location') as HTMLElement).textContent = p.location;
}

function renderSkills(data: PortfolioData): void {
  const container = document.getElementById('skills-grid') as HTMLElement;
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

function renderExperience(data: PortfolioData): void {
  const container = document.getElementById('experience-list') as HTMLElement;
  container.innerHTML = data.experience.map((exp: Experience) => `
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

function renderProjects(data: PortfolioData): void {
  const container = document.getElementById('projects-grid') as HTMLElement;
  container.innerHTML = data.projects.map((proj: Project, i: number) => `
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

function renderEducation(data: PortfolioData): void {
  const edu = data.education;
  const container = document.getElementById('education-block') as HTMLElement;
  const gpa = (edu as any).gpa ? `<span class="edu-gpa">GPA ${(edu as any).gpa}</span>` : '';
  const cw = (edu as any).coursework ? `<div class="edu-coursework">Coursework: ${(edu as any).coursework}</div>` : '';
  container.innerHTML = `
    <div class="edu-card">
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-institution">${edu.institution}</div>
      <div class="edu-meta">${edu.location} &nbsp;·&nbsp; ${edu.duration} &nbsp;${gpa}</div>
      ${cw}
    </div>
  `;
}

function renderCertifications(data: PortfolioData): void {
  const container = document.getElementById('certs-list') as HTMLElement;
  container.innerHTML = data.certifications.map((cert: Certification) => `
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
function initNav(): void {
  const nav = document.getElementById('main-nav') as HTMLElement;
  const links = nav.querySelectorAll<HTMLAnchorElement>('.nav-link');

  // Active section highlight on scroll
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = nav.querySelector<HTMLAnchorElement>(`[href="#${entry.target.id}"]`);
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
function initScrollAnimations(): void {
  const els = document.querySelectorAll<HTMLElement>('.fade-in');
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
function typeEffect(el: HTMLElement, text: string, speed = 38): void {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// ── Cursor Trail ─────────────────────────────────────────────────────────────
function initCursorTrail(): void {
  const trail: HTMLElement[] = [];
  const NUM = 8;
  for (let i = 0; i < NUM; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.opacity = String(1 - i / NUM);
    dot.style.transform = `scale(${1 - i * 0.08})`;
    document.body.appendChild(dot);
    trail.push(dot);
  }
  const positions: { x: number; y: number }[] = Array(NUM).fill({ x: 0, y: 0 });
  document.addEventListener('mousemove', e => {
    positions[0] = { x: e.clientX, y: e.clientY };
  });
  function animate(): void {
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
async function main(): Promise<void> {
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
  const titleEl = document.getElementById('hero-title') as HTMLElement;
  typeEffect(titleEl, data.personal.title, 42);

  // Stagger fade-in triggers
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.fade-in').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
    initScrollAnimations();
  }, 100);
}

document.addEventListener('DOMContentLoaded', main);
