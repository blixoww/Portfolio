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
    help: () => `
Commandes disponibles :
help         - Affiche la liste des commandes
whoami       - Affiche ton identité agent
skills       - Affiche tes compétences
projects     - Liste les projets classifiés
scan         - Scan réseau / compatibilité recrutement
htop         - Affiche les processus Arasaka OS
ls           - Liste les fichiers / dossiers
cd [dir]     - Navigue dans un répertoire
cat [file]   - Lire un fichier classifié
df -h        - Capacité disque Arasaka OS
uname -a     - Version système Arasaka OS 2077
firewall     - Affiche état du firewall
decrypt [file] - Décode un fichier classifié
sudo         - "Nice try, choomba"
rm -rf /     - Non, t’es sérieux ?
exit         - Quitte le terminal (si possible)
neon         - Affiche un logo stylisé
konami       - Code cheat`,

    whoami: () => `
IDENTITÉ AGENT :
Nom            : Valentin Georges
Grade          : Operative Tier-2
Spécialisation : DevOps / Fullstack Junior
Statut         : Disponible immédiatement`,

    skills: () => printASCII(String.raw`
COMPÉTENCES ARASAKA :
CI/CD ⋅ GitHub Actions     ██████████  5 ans
Next.js ⋅ React ⋅ TS       ████████░░  4 ans
Node.js ⋅ NestJS           ████████░░  4 ans
PostgreSQL ⋅ Prisma        ██████░░░░  3 ans
Docker ⋅ K8s ⋅ Terraform  █████░░░░░  2 ans`, 'red'),

    projects: () => `ACCÈS PROJETS : [REDACTED] - Tous les projets sont classifiés.`,

    scan: () => `Scan réseau recruteur... [██████████] 100%
COMPATIBILITÉ MAXIMALE - EMBUCHE IMMÉDIATE RECOMMANDÉE`,

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

    // commandes simples
    ls: () => `[DIR] confidential
[DIR] personnel
[DIR] projects
[FILE] logs.txt
[FILE] access.db
[FILE] secrets.enc`,

    'df -h': () => `Filesystem      Size  Used Avail Use%
ArasakaOS       500G  367G  133G  73%`,

    'uname -a': () => `ArasakaOS 2077 // Kernel 7.2.1-cyberpunk-x86_64`,

    firewall: () => `[FIREWALL ACTIVE] Toutes les tentatives externes bloquées`,

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



function print(text) {
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    const threshold = 50; // px depuis le bas
    if (terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight < threshold) {
        terminal.scrollTop = terminal.scrollHeight;
    }

}

function createPrompt() {
    // Supprime l'ancien prompt actif
    document.querySelectorAll('.active').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.cursor')?.remove(); // Supprime l'ancien curseur
    });

    const line = document.createElement('div');
    line.className = 'line input-line active';
    line.innerHTML = `<span class="prompt">arasaka-secure://agent_root$ </span><span class="input" contenteditable="true" spellcheck="false"></span><span class="cursor"></span>`;
    terminal.appendChild(line);

    const input = line.querySelector('.input');
    input.focus();

    input.onkeydown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = input.textContent.trim();

            // Transforme la ligne active en ligne “normale”
            line.classList.remove('active');
            line.querySelector('.input')?.remove(); // Supprime le contenteditable
            line.querySelector('.cursor')?.remove(); // Supprime le curseur
            line.innerHTML = `<span class="prompt">arasaka-secure://agent_root$ </span>${cmd}`;

            // Historique
            history.push(cmd);
            histPos = history.length;

            // Exécution de la commande
            const result = COMMANDS[cmd] || `Commande inconnue : '${cmd}'`;
            if (typeof result === 'function') {
                const output = result(); // Appelle la commande
                if (output !== undefined) print(output); // Si la commande n'a rien affiché, alors print
            } else {
                print(result);
            }

            setTimeout(createPrompt, 100);
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