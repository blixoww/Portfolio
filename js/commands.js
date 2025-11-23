const terminal = document.getElementById('terminal');
let history = [], histPos = -1;

/**
 * Affiche un ASCII art dans le terminal de façon alignée
 * @param {string} asciiText - Le texte ASCII brut
 * @param {string} [colorClass] - Classe CSS optionnelle pour la couleur (ex : 'red')
 */

function printASCII(asciiText, colorClass = '') {
    const lineDiv = document.createElement('div');
    lineDiv.className = `line ${colorClass}`;

    const pre = document.createElement('pre');
    pre.textContent = asciiText;

    lineDiv.appendChild(pre);
    terminal.appendChild(lineDiv);
    terminal.scrollTop = terminal.scrollHeight;
}


const COMMANDS = {
    help: () => printASCII(`
Commandes disponibles :
help         - Affiche la liste des commandes
whoami       - Affiche ton identité agent
skills       - Affiche tes compétences
scan         - Scan réseau / compatibilité recrutement
htop         - Affiche les processus Arasaka OS
ls           - Liste les fichiers / dossiers
cd [dir]     - Navigue dans un répertoire
cat [file]   - Lire un fichier classifié (si non chiffré)
df -h        - Capacité disque Arasaka OS
uname -a     - Version système Arasaka OS 2077
firewall     - Affiche état du firewall
decrypt [file] - Décode un fichier chiffré pour le rendre lisible
sudo         - "Nice try"
rm -rf /     - Non, t’es sérieux ?
exit         - Quitte le terminal
neon         - Affiche un logo stylisé
konami       - Code cheat`, 'cyan'),

    whoami: () => printASCII(`
IDENTITÉ AGENT :
Nom            : Valentin Georges
Grade          : Operative Tier-2
Spécialisation : DevOps / Fullstack Junior
Statut         : Disponible immédiatement`, 'cyan'),

    skills: () => printASCII(String.raw`
COMPÉTENCES TECHNIQUES :
Linux      ██████████
Docker     ████████░░  
CI/CD      ████████░░ 
Kubernetes ██████░░░░ 
Terraform  █████░░░░░ 
Ansible    ████░░░░░░ `, 'red'),

scan: () => {
    return new Promise(resolve => {
        const steps = [
            "[10%] Initialisation des modules de scan...",
            "[25%] Analyse du réseau interne Arasaka...",
            "[40%] Collecte des nœuds actifs...",
            "[55%] Vérification des firewalls et IDS...",
            "[70%] Scan des ports actifs...",
            "[85%] Détection des protocoles internes...",
            "[100%] Compilation du rapport..."
        ];

        let i = 0;

        function nextStep() {
            print(steps[i]);
            i++;
            if (i < steps.length) {
                setTimeout(nextStep, 350);
            } else {
                setTimeout(() => {
                    const result = String.raw`
──────────────────────────────────────────────
Nœuds actifs       : 12
Agents connectés   : 34
IA opérationnelles : 5
Serveurs détectés  : ARASAKA-SRV01, ARASAKA-SRV02, DB-ACCESS
Protocoles         : TCP/443, SSH/22, NETRUN-PROTOCOL
Ports ouverts      : 22, 80, 443, 8080
Firewall           : ACTIF
Menaces            : AUCUNE (0 critique)
──────────────────────────────────────────────
[SCAN TERMINÉ] Accès réseau optimal.`;
                    printASCII(result, 'cyan'); 
                    resolve();
                }, 300);
            }
        }

        nextStep();
    });
},

htop: () => printASCII(String.raw`
PID   USER      CPU   MEM   COMMAND
001   root      14%   22%   cyber-agent
002   root      08%   05%   neural-net
003   root      01%   01%   data-miner
004   root      35%   40%   system-monitor
005   root      50%   10%   ai-core
006   guest     00%   00%   innocuous-task
...    ...       ...   ...   ...`, 'red'),

    neon: () => printASCII(String.raw`
███╗   ██╗███████╗ ██████╗ ███╗   ██╗
████╗  ██║██╔════╝██╔═══██╗████╗  ██║
██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║
██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║
██║ ╚████║███████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝`, 'cyan'),

    ls: () => `[DIR] confidential
[DIR] personnel
[DIR] projects
[FILE] logs.txt
[FILE] access.db
[FILE] secrets.enc`,

    'df -h': () => printASCII(String.raw `Filesystem      Size  Used Avail Use%
ArasakaOS       500G  367G  133G  73%`, 'cyan'),

    'uname -a': () => printASCII(String.raw`ArasakaOS 2077 // Kernel 7.2.1-cyberpunk-x86_64`, 'cyan'),

    firewall: () => printASCII(`Firewall Status: ACTIVE`, 'green'),

    cd: arg => arg ? `Navigation vers '${arg}'... [ACCESS GRANTED]` : `Erreur : dossier non spécifié`,

    cat: arg => arg ? `Lecture du fichier '${arg}'... [CONTENU CLASSIFIÉ]` : `Erreur : fichier non spécifié`,

    decrypt: arg => arg ? `Décodage de '${arg}' en cours... [█▒▒▒▒▒▒▒▒▒] 10%` : `Erreur : fichier non spécifié`,

    sudo: () => `Nice try. Tu crois que root te donne le pouvoir ici ?`,

    'rm -rf /': () => `-rf / ? T'es sérieux ? Non.`,

    konami: () => { alert("↑↑↓↓←→←→BA — haut haut bas bas gauche droite gauche droite B A"); return "Code accepté, cheat activé."; },

    clear: () => { terminal.innerHTML = ''; return ''; },
    reboot: () => location.reload(),
    exit: () => {
        setTimeout(() => {
            location.href = "index.html";
        }, 100);
    },
};

const banner = String.raw`
╔══════════════════════════════════════════════════════════╗
   █████╗ ██████╗  █████╗ ███████╗ █████╗ ██╗  ██╗ █████╗ 
  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██║ ██╔╝██╔══██╗
  ███████║██████╔╝███████║███████╗███████║█████╔╝ ███████║
  ██╔══██║██╔══██╗██╔══██║╚════██║██╔══██║██╔═██╗ ██╔══██║
  ██║  ██║██║  ██║██║  ██║███████║██║  ██║██║  ██╗██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
          C O R P O R A T I O N   //  2 0 7 7
╚══════════════════════════════════════════════════════════╝`;

let currentDir = '/';

const FS = {
    '/': ['confidential', 'personnel', 'logs.txt', 'access.db', 'secrets.enc'],
    '/confidential': ['readme.txt', 'topsecret.txt', 'keys.enc'],
    '/personnel': ['cv.txt']
};

const FILE_CONTENTS = {
    '/personnel/cv.txt': `Valentin Georges - DevOps / Administrateur Système\nExperience: CI/CD, Kubernetes, Terraform\nDisponibilité: Immédiate`,
    '/confidential/readme.txt': `=== Confidential Readme ===\nCe dossier contient fichiers sensibles destinés au personnel autorisé.`,
    '/confidential/topsecret.txt': `TOP SECRET:\nProject ARASAKA infiltration plan - (redacted)\nContact: [REDACTED]`,
    '/logs.txt': `System logs:\n[2025-11-23] Boot sequence OK\n[2025-11-23] NetRunner mode toggled`,
    '/secrets.enc': `ENCRYPTED_DATA_PLACEHOLDER`,
    '/access.db': `ENCRYPTED_DB_PLACEHOLDER`,
    '/confidential/keys.enc': `ENCRYPTED_KEYS_PLACEHOLDER`
};

const ENCRYPTED = new Set(['/secrets.enc', '/access.db', '/confidential/keys.enc']);

COMMANDS.cd = arg => {
    if (!arg) return `Erreur : dossier non spécifié`;
    let target = arg.trim();
    if (target === '.') return `Déjà dans '${currentDir}'`;
    if (target === '..') {
        if (currentDir === '/') return `Déjà à la racine`;
        const parts = currentDir.split('/').filter(Boolean);
        parts.pop();
        currentDir = parts.length ? '/' + parts.join('/') + '/' : '/';
        return `Navigation vers '${currentDir}'... [ACCESS GRANTED]`;
    }

    let newPath = target.startsWith('/') ? target : currentDir + target;
    if (!newPath.endsWith('/')) newPath = newPath + (FS[newPath + '/'] ? '/' : '');

    if (FS[newPath]) {
        currentDir = newPath.endsWith('/') ? newPath : newPath + '/';
        return `Navigation vers '${currentDir}'... [ACCESS GRANTED]`;
    }
    if (FS[newPath + '/']) {
        currentDir = newPath + '/';
        return `Navigation vers '${currentDir}'... [ACCESS GRANTED]`;
    }
    return `Erreur : dossier '${arg}' introuvable`;
};

COMMANDS.cat = arg => {
    if (!arg) return `Erreur : fichier non spécifié`;
    const name = arg.trim();
    const candidates = [];
    if (name.startsWith('/')) candidates.push(name);
    candidates.push(currentDir + name);
    candidates.push('/' + name);

    for (const p of candidates) {
        const normalized = p.replace(/\/+/g, '/');
        // remove trailing slash
        const path = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
        const basename = path.split('/').pop();
        // find in FS
        for (let dir in FS) {
            if (FS[dir].includes(basename) || FS[dir].includes(basename + '/')) {
                const fullPath = (dir === '/' ? '/' + basename : dir + '/' + basename).replace(/\/+/g, '/');
                // If encrypted
                if (ENCRYPTED.has(fullPath)) {
                    return `Fichier chiffré : '${basename}'. Utilisez 'decrypt ${basename}' pour le déverrouiller.`;
                }
                const content = FILE_CONTENTS[fullPath] || `Contenu vide de ${basename}`;
                return `[Lecture ${basename}]\n---\n${content}`;
            }
        }
    }
    return `Erreur : fichier '${arg}' introuvable`;
};

COMMANDS.ls = arg => {
    let dir = currentDir;
    if (arg) {
        const target = arg.trim();
        dir = target.startsWith('/') ? target : (currentDir + target);
        if (!dir.endsWith('/')) dir = dir + '/';
    }
    let dirKey = dir === '/' ? '/' : (dir.endsWith('/') ? dir.slice(0, -1) : dir);
    if (!FS[dirKey]) return `Erreur : dossier introuvable: ${dirKey}`;
    return FS[dirKey].map(item => item.endsWith('/') ? `[DIR] ${item}` : `[FILE] ${item}`).join('\n');
};

COMMANDS.decrypt = arg => {
    if (!arg) return `Erreur : fichier non spécifié`; 
    const name = arg.trim();
    const candidates = [];
    if (name.startsWith('/')) candidates.push(name);
    candidates.push(currentDir + name);
    candidates.push('/' + name);

    for (const p of candidates) {
        const normalized = p.replace(/\/+/g, '/');
        const path = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
        const basename = path.split('/').pop();

        for (let dir in FS) {
            if (FS[dir].includes(basename) || FS[dir].includes(basename + '/')) {
                const fullPath = (dir === '/' ? '/' + basename : dir + '/' + basename).replace(/\/+/g, '/');
                if (!ENCRYPTED.has(fullPath)) return `Le fichier '${basename}' n'est pas chiffré.`;

                return new Promise(resolve => {
                    print(`Lancement du décryptage de '${basename}'...`);
                    const steps = [20, 45, 70, 95, 100];
                    let i = 0;
                    const interval = setInterval(() => {
                        print(`Décryptage ${basename}: [${steps[i]}%]`);
                        i++;
                        if (i >= steps.length) {
                            clearInterval(interval);
                            ENCRYPTED.delete(fullPath);
                            FILE_CONTENTS[fullPath] = `Contenu décrypté de ${basename}`;
                            if (basename === 'access.db') {
                                FILE_CONTENTS[fullPath] += `\n\n=== Personnel Autorisé ===\n- Agent: Valentin Georges\n- Grade: Operative Tier-2\n- Spécialisation: Administrateur / DevOps Junior\n- Statut: Disponible immédiatement`;
                            } else if (basename === 'secrets.enc') {
                                FILE_CONTENTS[fullPath] += `\n\n=== Secrets Décryptés ===\n- Code d'accès au réseau Arasaka: 7X9-Z3Q-P4L\n- Emplacement des serveurs distants: [REDACTED]\n- Protocoles d'infiltration: [REDACTED]`;
                            }
                            print(`Décryptage terminé : '${basename}' est maintenant lisible.`);
                            resolve(); 
                        }
                    }, 600);
                });
            }
        }
    }
    return `Erreur : fichier '${arg}' introuvable`;
};



function print(text) {
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    const threshold = 50; 
    if (terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight < threshold) {
        terminal.scrollTop = terminal.scrollHeight;
    }

}

function createPrompt() {
    document.querySelectorAll('.active').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.cursor')?.remove(); 
    });

    const line = document.createElement('div');
    line.className = 'line input-line active';
    line.innerHTML = `<span class="prompt">arasaka-secure://agent_root${currentDir}$ </span><span class="input" contenteditable="true" spellcheck="false"></span><span class="cursor"></span>`;
    terminal.appendChild(line);

    const input = line.querySelector('.input');
    input.focus();

    input.onkeydown = e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const rawText = input.textContent;
            const tokens = rawText.split(/\s+/);
            const last = tokens.pop() || '';
            const before = tokens.join(' ');

            const matches = new Set();

            const suggestCommands = !before; 
            if (suggestCommands) {
                Object.keys(COMMANDS).forEach(k => {
                    if (k.startsWith(last)) matches.add(k);
                });
            }
            try {
                let dirKey = currentDir; 
                let prefix = last;

                if (last.includes('/')) {
                    const ix = last.lastIndexOf('/');
                    const pathPart = last.slice(0, ix + 1);
                    prefix = last.slice(ix + 1);
                    if (pathPart.startsWith('/')) {
                        dirKey = pathPart.endsWith('/') ? pathPart.slice(0, -1) || '/' : pathPart;
                    } else {
                        dirKey = (currentDir === '/' ? '/' : currentDir) + pathPart;
                        if (dirKey.endsWith('/')) dirKey = dirKey.slice(0, -1) || '/';
                    }
                } else if (before) {
                    dirKey = currentDir === '/' ? '/' : currentDir.slice(0, -1) || '/';
                    prefix = last;
                }

                if (dirKey !== '/' && dirKey.endsWith('/')) dirKey = dirKey.slice(0, -1);

                if (FS[dirKey]) {
                    FS[dirKey].forEach(item => {
                        if (item.startsWith(prefix)) {
                            const possibleDir = (dirKey === '/' ? '/' + item : dirKey + '/' + item).replace(/\/+/, '/');
                            const isDir = !!FS[possibleDir.replace(/\/$/, '')];
                            matches.add((last.includes('/') ? (last.slice(0, last.lastIndexOf('/') + 1)) : '') + (isDir ? item + '/' : item));
                        }
                    });
                }
            } catch (err) {
            }

            const arr = Array.from(matches).sort();
            if (arr.length === 1) {
                const completion = arr[0];
                const newText = (before ? (before + ' ') : '') + completion;
                input.innerText = newText;
                setCaretToEnd(input);
            } else if (arr.length > 1) {
                print(arr.join('    '));
            }
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const raw = input.textContent.trim();

            line.classList.remove('active');
            line.querySelector('.input')?.remove(); 
            line.querySelector('.cursor')?.remove(); 
            line.innerHTML = `<span class="prompt">arasaka-secure://agent_root${currentDir}$ </span>${raw}`;

            history.push(raw);
            histPos = history.length;

            let cmdKey = raw;
            let arg = '';
            if (!COMMANDS[cmdKey]) {
                const parts = raw.split(/\s+/);
                cmdKey = parts[0];
                arg = parts.slice(1).join(' ');
            }

            const handler = COMMANDS[cmdKey];
            if (!handler) {
                print(`Commande inconnue : '${raw}'`);
                setTimeout(createPrompt, 100);
            } else if (typeof handler === 'function') {
                try {
                    const out = handler(arg);
                    if (out && typeof out.then === 'function') {
                        out.then(res => {
                            if (res !== undefined && res !== null && res !== '') print(res);
                            createPrompt();
                        }).catch(err => {
                            print(`Erreur asynchrone: ${err && err.message ? err.message : err}`);
                            console.error(err);
                            createPrompt();
                        });
                    } else {
                        if (out !== undefined && out !== null && out !== '') print(out);
                        setTimeout(createPrompt, 100);
                    }
                } catch (err) {
                    print(`Erreur exécution commande: ${err.message}`);
                    console.error(err);
                    setTimeout(createPrompt, 100);
                }
            } else {
                print(handler);
                setTimeout(createPrompt, 100);
            }
        }

        if (e.key === 'ArrowUp') {
            if (histPos > 0) histPos--;
            else histPos = 0;
            input.innerText = history[histPos] || '';
            setCaretToEnd(input);
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            if (histPos < history.length - 1) histPos++;
            else histPos = history.length;
            input.innerText = history[histPos] || '';
            setCaretToEnd(input);
            e.preventDefault();
        }

        function setCaretToEnd(el) {
            el.focus();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    document.onclick = () => input.focus();
}


// Lancement
printASCII(banner, 'red');
print('[ACCESS GRANTED] Arasaka Secure Personnel Database');
print("Tapez 'help' pour la liste des commandes.\n");
createPrompt();