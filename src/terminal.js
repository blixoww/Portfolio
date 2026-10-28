/*
 * Terminal interactif du portfolio.
 * Toute sortie passe par textContent / createElement : aucune saisie
 * utilisateur n'est jamais interprétée comme du HTML.
 */

const output = document.getElementById('output');
const screen = document.getElementById('screen');
const form = document.getElementById('prompt-form');
const input = document.getElementById('cmd');
const promptLabel = document.getElementById('prompt-label');

const HOME = '/home/valentin';
const LINKEDIN = 'https://www.linkedin.com/in/valentin-georges-14956a27b/';
const GITHUB = 'https://github.com/blixoww';

/* ---------- Rendu ---------- */

// Un segment est soit une chaîne, soit { text, cls }, soit { text, href }.
const segment = (part) => {
  if (typeof part === 'string') return document.createTextNode(part);
  if (part.href) {
    const a = document.createElement('a');
    a.href = part.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = part.text;
    return a;
  }
  const span = document.createElement('span');
  span.className = part.cls || '';
  span.textContent = part.text;
  return span;
};

const print = (...parts) => {
  const line = document.createElement('pre');
  line.className = 'line';
  parts.forEach((p) => line.appendChild(segment(p)));
  output.appendChild(line);
  return line;
};

const printLines = (text, cls) => print(cls ? { text, cls } : text);
const scrollToBottom = () => { screen.scrollTop = screen.scrollHeight; };

/* ---------- Système de fichiers virtuel ---------- */

const FILES = {
  'about.txt': [
    'Valentin Georges — Ingénieur DevOps & Cloud (Toulouse)',
    '',
    "J'automatise, sécurise et exploite des plateformes cloud-native",
    'sur GCP et Kubernetes, dans les secteurs aéronautique, spatial',
    'et défense. Infrastructure as code, GitOps, observabilité.',
  ].join('\n'),
  'skills.yaml': [
    'cloud:         [gcp, gke, cloud-sql, pub-sub, artifact-registry, aws]',
    'k8s-tools:     [kubectl, k9s, helm, kustomize]',
    'iac:           [terraform, kustomize, ansible]',
    'cicd:          [gitlab-ci, github-actions, argocd, jenkins, docker]',
    'security:      [iam-least-privilege, workload-identity, oidc, saml, sonarqube, trivy, vault]',
    'observability: [prometheus, grafana, cloud-monitoring, zabbix, elk]',
    'systems:       [sles, rhel, fedora, debian, systemd, apparmor, proxmox, vsphere]',
    'languages:     [java, python, bash, sql, go (bases)]',
  ].join('\n'),
  'experience.log': [
    '[2026-09 → now ] DevOps Engineer      @ CELAD     — Défense & Spatial (GKE, Terraform, GitLab CI)',
    '[2026-04 → 09  ] Linux & DevOps Eng.  @ LH&TECH   — Aérospatial (SLES 15, AppArmor, SonarQube)',
    '[2026-02 → now ] DevOps (bénévole)    @ NELIXAIR  — Debian, Docker, Ansible, Zabbix',
    '[2023-09 → 24  ] Alternant SSI        @ CADA      — RGPD & sécurité des SI',
    '[2022-06 → 08  ] Stage Dev & DevOps                — Java 17, Argon2, CI/CD',
  ].join('\n'),
  'contact.txt': 'LinkedIn et GitHub : tapez `contact`.',
};

const PROJECTS = {
  'netheryx.md': 'Mod Minecraft (Forge, Java 17) — 12 biomes, 26 créatures, générateur Python, CI/CD et releases GitHub.',
  'gcp-platform.md': 'Plateforme GCP en IaC — Terraform, Cloud SQL privé, cluster k3s, Kustomize, ArgoCD, External Secrets.',
  'gitops-java-api.md': 'API Spring Boot déployée sur Kubernetes via GitHub Actions + ArgoCD.',
  'devops-stack.md': 'Jenkins → Kubernetes, métriques Prometheus et dashboards Grafana.',
  'terraform-aws.md': 'Socle AWS (VPC, EC2, S3, IAM) en Terraform.',
};

const TREE = {
  [HOME]: { dirs: ['projects'], files: FILES },
  [`${HOME}/projects`]: { dirs: [], files: PROJECTS },
};

let cwd = HOME;

const displayPath = (p) => (p.startsWith(HOME) ? `~${p.slice(HOME.length)}` : p);

const resolve = (arg = '') => {
  let path = arg.trim();
  if (!path || path === '~') return HOME;
  if (path.startsWith('~')) path = HOME + path.slice(1);
  else if (!path.startsWith('/')) path = `${cwd}/${path}`;

  const parts = [];
  path.split('/').forEach((seg) => {
    if (!seg || seg === '.') return;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  });
  return `/${parts.join('/')}`;
};

const lookupFile = (path) => {
  const idx = path.lastIndexOf('/');
  const dir = TREE[path.slice(0, idx) || '/'];
  const name = path.slice(idx + 1);
  return dir && Object.prototype.hasOwnProperty.call(dir.files, name) ? dir.files[name] : undefined;
};

/* ---------- Commandes ---------- */

const HELP = [
  ['whoami', 'qui suis-je ?'],
  ['skills', 'compétences techniques'],
  ['experience', 'parcours professionnel'],
  ['projects', 'projets sélectionnés'],
  ['contact', 'me joindre'],
  ['k9s', 'vue du cluster, façon k9s'],
  ['ls / cd / cat / pwd', 'explorer le système de fichiers'],
  ['history', 'historique des commandes'],
  ['clear', "effacer l'écran (ou Ctrl+L)"],
  ['exit', 'revenir au portfolio'],
];

const COMMANDS = {
  help() {
    print({ text: 'Commandes disponibles :', cls: 'c-accent' });
    HELP.forEach(([cmd, desc]) => print('  ', { text: cmd.padEnd(22), cls: 'c-blue' }, desc));
    print({ text: '\nAstuce : Tab pour compléter, ↑/↓ pour l’historique. Il y a aussi quelques commandes cachées…', cls: 'c-muted' });
  },

  whoami() { printLines(FILES['about.txt']); },
  skills() { printLines(FILES['skills.yaml'], 'c-amber'); },
  experience() { printLines(FILES['experience.log']); },

  projects() {
    Object.entries(PROJECTS).forEach(([name, desc]) => {
      print({ text: name.replace('.md', '').padEnd(18), cls: 'c-blue' }, desc);
    });
    print({ text: '\nCode source : ', cls: 'c-muted' }, { text: GITHUB, href: GITHUB });
  },

  contact() {
    print({ text: 'LinkedIn : ', cls: 'c-muted' }, { text: LINKEDIN, href: LINKEDIN });
    print({ text: 'GitHub   : ', cls: 'c-muted' }, { text: GITHUB, href: GITHUB });
  },

  pwd() { print(cwd); },

  ls(args) {
    const target = resolve(args[0] || '.');
    const dir = TREE[target];
    if (!dir) {
      if (lookupFile(target) !== undefined) return print(args[0]);
      return print({ text: `ls: ${args[0]}: aucun fichier ou dossier de ce type`, cls: 'c-err' });
    }
    const line = print();
    dir.dirs.forEach((d) => line.appendChild(segment({ text: `${d}/  `, cls: 'c-blue' })));
    Object.keys(dir.files).forEach((f) => line.appendChild(segment(`${f}  `)));
  },

  cd(args) {
    const target = resolve(args[0] || '~');
    if (!TREE[target]) return print({ text: `cd: ${args[0]}: aucun dossier de ce type`, cls: 'c-err' });
    cwd = target;
  },

  cat(args) {
    if (!args.length) return print({ text: 'cat: opérande manquant', cls: 'c-err' });
    args.forEach((arg) => {
      const path = resolve(arg);
      if (TREE[path]) return print({ text: `cat: ${arg}: est un dossier`, cls: 'c-err' });
      const content = lookupFile(path);
      if (content === undefined) return print({ text: `cat: ${arg}: aucun fichier de ce type`, cls: 'c-err' });
      printLines(content);
    });
  },

  history() {
    history.forEach((cmd, i) => print({ text: String(i + 1).padStart(4), cls: 'c-muted' }, `  ${cmd}`));
  },

  clear() { output.replaceChildren(); },

  date() { print(new Date().toString()); },

  echo(args) { print(args.join(' ')); },

  exit() {
    print({ text: 'logout', cls: 'c-muted' });
    setTimeout(() => { window.location.href = 'index.html'; }, 300);
  },

  /* --- Commandes cachées --- */
  sudo() { print({ text: 'valentin n’est pas dans le fichier sudoers. Cet incident sera signalé. 🙂', cls: 'c-err' }); },

  rm(args) {
    if (args.includes('-rf') || args.includes('-fr')) {
      return print({ text: 'rm: refus catégorique. Les sauvegardes sont testées, mais quand même.', cls: 'c-err' });
    }
    print({ text: 'rm: système de fichiers en lecture seule', cls: 'c-err' });
  },

  kubectl(args) {
    if (args[0] === 'get' && /^(po|pods?)$/.test(args[1] || '')) {
      print({ text: 'NAME                         READY   STATUS    RESTARTS   AGE', cls: 'c-muted' });
      print('portfolio-web-6d9f7c5b8-x2kqp   1/1     ', { text: 'Running', cls: 'c-ok' }, '   0          42d');
      print('curiosity-7b8c9d-m4n5p          1/1     ', { text: 'Running', cls: 'c-ok' }, '   0          ∞');
      return;
    }
    print({ text: 'Essayez : kubectl get pods', cls: 'c-muted' });
  },

  k9s() {
    // Reprend la mise en page de k9s : en-tête (contexte, raccourcis, logo) puis vue des pods.
    const WIDTH = 78;
    const firstLine = output.children.length;
    const info = [
      ['Context', 'night-city'], ['Cluster', 'k3s-homelab'], ['User', 'valentin'],
      ['K9s Rev', 'v0.50.x'], ['K8s Rev', 'v1.33'], ['CPU', '12%'], ['MEM', '38%'],
    ];
    const keys = [['0', 'all'], ['1', 'portfolio'], ['d', 'Describe'], ['l', 'Logs'], ['s', 'Shell'], ['?', 'Help']];
    const logo = [
      ' ____  __.________       ',
      '|    |/ _/   __   \\______',
      '|      < \\____    /  ___/',
      '|    |  \\   /    /\\___ \\ ',
      '|____|__ \\ /____//____  >',
      '        \\/            \\/ ',
      '',
    ];
    info.forEach(([k, v], i) => {
      const key = keys[i];
      print(
        { text: `${k}:`.padEnd(9), cls: 'c-k9s-orange' }, v.padEnd(14),
        ...(key ? [{ text: `<${key[0]}>`.padEnd(5), cls: 'c-blue' }, { text: key[1].padEnd(12), cls: 'c-muted' }] : ['                 ']),
        { text: logo[i], cls: 'c-k9s-orange' },
      );
    });

    const pods = [
      ['portfolio', 'portfolio-web-6d9f7c5b8-x2kqp', '1/1', 'Running', '0', '42d'],
      ['portfolio', 'katakana-rain-7f9b6-m4n5p', '1/1', 'Running', '0', '42d'],
      ['argocd', 'argocd-server-5c8d7-q8w2z', '1/1', 'Running', '0', '90d'],
      ['vault', 'vault-0', '1/1', 'Running', '0', '30d'],
      ['monitoring', 'prometheus-0', '2/2', 'Running', '1', '90d'],
      ['monitoring', 'grafana-6b7c4-z9x4k', '1/1', 'Running', '0', '90d'],
      ['netrunner', 'curiosity-7b8c9d-k2l8f', '1/1', 'Running', '0', '∞'],
    ];
    const cols = [12, 30, 7, 10, 10, 6];
    const row = (cells) => cells.map((c, i) => String(c).padEnd(cols[i])).join('');
    const title = ` Pods(all)[${pods.length}] `;
    const side = Math.floor((WIDTH - 2 - title.length) / 2);

    print('');
    print({ text: `+${'-'.repeat(side)}`, cls: 'c-blue' }, { text: title, cls: 'c-k9s-title' },
      { text: `${'-'.repeat(WIDTH - 2 - side - title.length)}+`, cls: 'c-blue' });
    print({ text: '|', cls: 'c-blue' }, { text: ` ${row(['NAMESPACE', 'NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'])}`.padEnd(WIDTH - 2), cls: 'c-k9s-head' }, { text: '|', cls: 'c-blue' });
    pods.forEach((cells, i) => {
      print({ text: '|', cls: 'c-blue' }, { text: ` ${row(cells)}`.padEnd(WIDTH - 2), cls: i === 0 ? 'c-k9s-selected' : 'c-k9s-row' }, { text: '|', cls: 'c-blue' });
    });
    print({ text: `+${'-'.repeat(WIDTH - 2)}+`, cls: 'c-blue' });
    print({ text: ' <pod> ', cls: 'c-k9s-crumb' });

    // Regroupe la vue dans un bloc défilant : sur mobile, les 78 colonnes ne tiennent pas en largeur.
    const view = document.createElement('div');
    view.className = 'k9s-view';
    view.append(...[...output.children].slice(firstLine));
    output.appendChild(view);
  },

  terraform(args) {
    if (args[0] !== 'plan') return print({ text: 'Essayez : terraform plan', cls: 'c-muted' });
    print('Terraform will perform the following actions:\n');
    print({ text: '  + resource "career" "next_challenge" {', cls: 'c-ok' });
    print({ text: '      + role     = "DevOps / Cloud Engineer"', cls: 'c-ok' });
    print({ text: '      + stack    = ["GCP", "Kubernetes", "Terraform"]', cls: 'c-ok' });
    print({ text: '      + contact  = (known after apply)', cls: 'c-ok' });
    print({ text: '    }', cls: 'c-ok' });
    print('\nPlan: 1 to add, 0 to change, 0 to destroy.');
  },

  neofetch() {
    const logo = ['  ┌──────┐ ', '  │ >_   │ ', '  │      │ ', '  └──────┘ ', '           ', '           '];
    const info = [
      ['valentin@portfolio', ''],
      ['OS', 'Portfolio Linux x86_64'],
      ['Role', 'DevOps & Cloud Engineer'],
      ['Shell', 'bash, python, java'],
      ['Cloud', 'GCP · GKE'],
      ['Uptime', 'depuis 2022'],
    ];
    info.forEach(([k, v], i) => {
      if (!v) return print({ text: logo[i], cls: 'c-accent' }, { text: k, cls: 'c-accent' });
      print({ text: logo[i], cls: 'c-accent' }, { text: `${k}: `, cls: 'c-blue' }, v);
    });
  },
};

COMMANDS.about = COMMANDS.whoami;
COMMANDS.exp = COMMANDS.experience;
COMMANDS.ll = COMMANDS.ls;

/* ---------- Exécution ---------- */

const history = [];
let histPos = 0;

const updatePrompt = () => {
  promptLabel.textContent = `valentin@portfolio:${displayPath(cwd)}$`;
};

const run = (raw) => {
  const line = raw.trim();
  print({ text: `valentin@portfolio:${displayPath(cwd)}$ `, cls: 'c-prompt' }, { text: line, cls: 'c-amber' });
  if (!line) return;

  history.push(line);
  histPos = history.length;

  const [name, ...args] = line.split(/\s+/);
  const command = Object.prototype.hasOwnProperty.call(COMMANDS, name) ? COMMANDS[name] : null;
  if (!command) {
    print({ text: `${name}: commande introuvable. Tapez `, cls: 'c-err' }, { text: 'help', cls: 'c-blue' });
    return;
  }
  command(args);
};

const complete = () => {
  const value = input.value;
  const tokens = value.split(/\s+/);
  const last = tokens.pop();
  let candidates;

  if (!tokens.length) {
    candidates = HELP.flatMap(([c]) => c.split(' / ')).filter((c) => c.startsWith(last));
  } else {
    const slash = last.lastIndexOf('/');
    const base = slash >= 0 ? last.slice(0, slash + 1) : '';
    const dir = TREE[resolve(base || '.')];
    if (!dir) return;
    const prefix = last.slice(slash + 1);
    candidates = [...dir.dirs.map((d) => `${d}/`), ...Object.keys(dir.files)]
      .filter((n) => n.startsWith(prefix))
      .map((n) => base + n);
  }

  if (candidates.length === 1) {
    input.value = [...tokens, candidates[0]].join(' ') + (candidates[0].endsWith('/') ? '' : ' ');
  } else if (candidates.length > 1) {
    print({ text: `valentin@portfolio:${displayPath(cwd)}$ `, cls: 'c-prompt' }, { text: value, cls: 'c-amber' });
    print(candidates.join('   '));
    scrollToBottom();
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  run(input.value);
  input.value = '';
  updatePrompt();
  scrollToBottom();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    complete();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    histPos = Math.max(0, histPos - 1);
    input.value = history[histPos] ?? '';
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    histPos = Math.min(history.length, histPos + 1);
    input.value = history[histPos] ?? '';
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    COMMANDS.clear();
  }
});

// Un clic dans l'écran redonne le focus, sauf si l'utilisateur sélectionne du texte.
screen.addEventListener('click', (e) => {
  if (!window.getSelection().toString() && !e.target.closest('a')) input.focus();
});

/* ---------- Démarrage ---------- */
print({ text: 'Portfolio Linux 6.x (tty1)', cls: 'c-muted' });
print({ text: `Dernière connexion : ${new Date().toLocaleString('fr-FR')}`, cls: 'c-muted' });
print('');
print('Bienvenue ! Tapez ', { text: 'help', cls: 'c-blue' }, ' pour commencer, ou ', { text: 'exit', cls: 'c-blue' }, ' pour revenir au site.');
print('');
updatePrompt();
input.focus();
