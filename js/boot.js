const output = document.getElementById('output');
const typing = document.getElementById('typing');
const terminal = document.getElementById('netrunner-terminal');
const hexDisplay = document.getElementById('daemon-hex');
const blackout = document.getElementById('blackout');

let cmdIndex = 0;

const commands = [
  "netscan --target arasaka_corpnet --verbose",
  "iceprobe --type blackwall --force",
  "daemon_inject --payload v9.77 --root",
  "flatline --countermeasures all --silent"
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function type(text, speed = 38) {
  for (let i = 0; i <= text.length; i++) {
    typing.textContent = text.slice(0, i);
    await sleep(speed + Math.random() * 25);
  }
}

function log(line, isSuccess = false) {
  const div = document.createElement('div');
  div.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> ${line}`;
  if (isSuccess) div.style.color = "#00ff00";
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

async function run() {
  if (cmdIndex >= commands.length) {
    // Crée un div pour la dernière commande tapée
    if (typing.textContent.trim() !== "") {
      log(typing.textContent); // Ajoute la dernière commande tapée
      typing.textContent = ""; // Vide le champ de typing
    }

    // Ajoute SYSTEM COMPROMISED
    const compromisedDiv = document.createElement('div');
    compromisedDiv.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> [+] SYSTEM COMPROMISED`;
    compromisedDiv.style.color = "#00ff00";
    compromisedDiv.style.textShadow = "0 0 14px #00ff00";
    output.appendChild(compromisedDiv);

    await sleep(400);

    // Ajoute ACCESS GRANTED
    const accessDiv = document.createElement('div');
    accessDiv.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> ACCESS GRANTED`;
    accessDiv.style.color = "#00ff00";
    accessDiv.style.textShadow = "0 0 14px #00ff00";
    output.appendChild(accessDiv);

    // Terminal passe au vert et hex
    terminal.classList.add('success');
    hexDisplay.style.opacity = "0.9";

    // Scroll automatique
    output.scrollTop = output.scrollHeight;

    await sleep(3200);
      blackout.style.opacity = "1";
      await sleep(1200);
      // Vérifie si un paramètre "target" est présent dans l'URL
      const params = new URLSearchParams(window.location.search);
      const target = params.get('target');
      if (target === 'recruteur') {
        location.href = "recruiter.html";
      } else {
        location.href = "index.html";
      }
      return;
  }

  // Typing de la commande
  await type(commands[cmdIndex], 32);
  log(commands[cmdIndex]);  // Crée le div pour la commande
  typing.textContent = "";  // Vide #typing après log

  if (cmdIndex === 2) hexDisplay.style.opacity = "0.7";
  cmdIndex++;
  await sleep(400 + Math.random() * 220);
  run();
}


const skipBtn = document.getElementById('skip-btn');
if (skipBtn) {
  let skipActive = false;
  skipBtn.addEventListener('click', () => {
    if (skipActive) return;
    skipActive = true;
    blackout.style.opacity = '1';
    setTimeout(() => location.href = "index.html", 800);
  });
}

setTimeout(run, 800);