/* ---------- MATRIX BACKGROUND ---------- */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const columns = Math.floor(w / 20);
const drops = Array(columns).fill(1);

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#0ff';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0, 255, 255, ${0.05 + Math.random() * 0.1})`;
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
draw();
requestAnimationFrame(function loop() {
    draw();
    requestAnimationFrame(loop);
});
/* ---------- end matrix ---------- */


/* ---------- PROJECT DETAILS (simple modal-like overlay using alert fallback) ---------- */
const projectDetails = {
  "task-tracker": {
    title: "Task Tracker API",
    content: "API REST Java (Spring Boot) pour gestion de tâches. Conception multi-layer, tests unitaires, Dockerisation et déploiement. J'ai géré la persistence PostgreSQL, CI basique (GitHub Actions) et documentation OpenAPI."
  },
  "local-ai": {
    title: "Local AI Chatbot",
    content: "Expérimentation d'un agent local avec Ollama, interface desktop via Tauri + React + TypeScript. Backend en Rust, packaging multiplateforme et gestion locale des modèles."
  },
  "iac-platform": {
    title: "IaC Platform (WIP)",
    content: "Architecture IaC pour multi-environnements : Terraform modules, workflows GitOps pour déploiements, orchestré sur Kubernetes. Travail en cours."
  }
};

document.querySelectorAll('.details-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const key = btn.getAttribute('data-target');
    const data = projectDetails[key];
    if (!data) return;
    if (window.showModal) {
      const d = document.createElement('dialog');
      d.className = 'project-modal';
      d.innerHTML = `<h3>${data.title}</h3><p>${data.content}</p><button id="close-modal">Close</button>`;
      document.body.appendChild(d);
      d.showModal();
      d.querySelector('#close-modal').addEventListener('click', () => { d.close(); d.remove(); });
    } else {
      alert(data.title + "\n\n" + data.content);
    }
  });
});

/* ---------- end project details ---------- */

/* ---------- NETRUNNER MODE TOGGLE + MOBILE MENU ---------- */
(() => {
  const netrunnerBtn = document.getElementById('netrunner-toggle');
  const menuBtn = document.querySelector('.hamburger');
  const topNav = document.querySelector('.top-nav');

  // NETRUNNER: persistence via localStorage
  const setNetrunner = (active) => {
    if (active) {
      document.body.classList.add('netrunner-mode');
      localStorage.setItem('netrunner', '1');
    } else {
      document.body.classList.remove('netrunner-mode');
      localStorage.removeItem('netrunner');
    }
    if (netrunnerBtn) {
      netrunnerBtn.textContent = active ? 'NetRunner Mode Actif' : 'Activer le mode NetRunner';
      netrunnerBtn.style.opacity = active ? '1' : '0.6';
    }
  };

  try {
    const stored = localStorage.getItem('netrunner');
    setNetrunner(!!stored);
  } catch (err) {
    setNetrunner(false);
  }

  if (netrunnerBtn) {
    netrunnerBtn.addEventListener('click', () => {
      const active = document.body.classList.contains('netrunner-mode');
      setNetrunner(!active);
    });
  }

  if (menuBtn && topNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      topNav.classList.toggle('active');
    });

    topNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        topNav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
