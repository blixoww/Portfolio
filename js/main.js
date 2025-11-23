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


/* ---------- CONTACT FORM: send to backend if configured, else fallback to mailto ---------- */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !message) {
        alert('Merci de renseigner votre nom et votre message.');
        return;
    }

    const submitBtn = document.querySelector('.contact-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
        const response = await fetch('https://ton-backend.railway.app/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
        });

        const data = await response.json();

        if (data.ok) {
            alert('Message envoyé avec succès ! Je te réponds très vite.');
            contactForm.reset();
            submitBtn.textContent = 'Envoyé !';
            submitBtn.classList.add('btn-neon');
            setTimeout(() => {
                submitBtn.textContent = 'Envoyer';
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-neon');
            }, 3000);
        } else {
            throw new Error(data.error || 'Erreur inconnue');
        }
    } catch (err) {
        console.error('Erreur envoi:', err);
        const mailto = `mailto:valentin.houpert@free.fr?subject=Contact via portfolio — ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nom: ${name}\n\nMessage:\n${message}`)}`;
        window.location.href = mailto;
        submitBtn.textContent = 'Ouverture mail...';
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
  const _mail_b64 = 'dmFsaW50aW4uaG91cGVydEBmcmVlLmZy';
  const to = (typeof atob === 'function') ? atob(_mail_b64) : Buffer.from(_mail_b64, 'base64').toString('utf8');
  const subject = encodeURIComponent(`Contact via site — ${name}`);
  const bodyText = `Nom: ${name}\n\nMessage:\n${message}\n\n---\nEnvoyé depuis BLIXOWW site`;
  const body = encodeURIComponent(bodyText);

  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
  window.location.href = mailto;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Envoyer';
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
