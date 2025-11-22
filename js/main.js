/* ---------- MATRIX BACKGROUND (UNCHANGED - kept exactly) ---------- */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const chars = Array.from({length:150}, () => ({
  x: Math.random()*w,
  y: Math.random()*h,
  speed: 0.2+Math.random()*1,
  char: katakana[Math.floor(Math.random()*katakana.length)],
  size: 14+Math.random()*18
}));

function draw() {
  ctx.clearRect(0,0,w,h);
  chars.forEach(c => {
    ctx.font = `${c.size}px monospace`;
    ctx.fillStyle = `rgba(0,255,255,${0.1 + Math.random()*0.5})`;
    ctx.fillText(c.char, c.x, c.y);
    c.y -= c.speed;
    if (c.y < -20) { c.y = h+20; c.x = Math.random()*w; c.char = katakana[Math.floor(Math.random()*katakana.length)]; }
  });
  requestAnimationFrame(draw);
}

draw();
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


/* ---------- CONTACT FORM: open mailto with name+message (only required fields) ---------- */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  if (!name || !message) {
    alert('Merci de renseigner votre nom et votre message.');
    return;
  }

  const to = 'valentin.houpert@free.fr';
  const subject = encodeURIComponent(`Contact via site — ${name}`);
  const bodyText = `Nom: ${name}\n\nMessage:\n${message}\n\n---\nEnvoyé depuis BLIXOWW site`;
  const body = encodeURIComponent(bodyText);

  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
  window.location.href = mailto;

  // Ajout d'un feedback visuel
  const submitBtn = document.querySelector('.contact-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Message envoyé !';
  submitBtn.classList.add('btn-neon');
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Envoyer';
    submitBtn.classList.remove('btn-neon');
    contactForm.reset();
  }, 2200);
});

const netrunnerBtn = document.getElementById('netrunner-toggle');

if (netrunnerBtn) {
    netrunnerBtn.addEventListener('click', () => {
        document.body.classList.toggle('netrunner-mode');
        netrunnerBtn.textContent = document.body.classList.contains('netrunner-mode')
            ? 'NetRunner Mode Actif'
            : 'NetRunner Mode Inactif';
    });
}
