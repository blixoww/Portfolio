const output          = document.getElementById('output');
const typing          = document.getElementById('typing');
const finalBreach     = document.getElementById('final-breach');
const shake           = document.getElementById('shake');
const blackout        = document.getElementById('blackout');
const warning         = document.getElementById('arasaka-warning');
const hexDisplay      = document.getElementById('daemon-hex');
const iceParticles    = document.getElementById('ice-particles');
const glyphsContainer = document.getElementById('glyphs');

let cmdIndex = 0;

const goodCmds = [
  "netscan --target arasaka_corpnet --verbose",
  "iceprobe --type blackwall --force",
  "daemon_inject --payload v9.77 --root",
  "flatline --countermeasures all --silent"
];

const badCmds = [null, null, "daemon_injeckt --payloaad v9.77 --root", null];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function type(text, speed = 45) {
  for (let i = 0; i <= text.length; i++) {
    typing.textContent = text.slice(0, i);
    await sleep(speed + Math.random() * 35);
  }
}

async function del() {
  while (typing.textContent.length > 0) {
    typing.textContent = typing.textContent.slice(0, -1);
    await sleep(25 + Math.random() * 25);
  }
}

function log(cmd) {
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> ${cmd}`;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

async function run() {
  if (cmdIndex >= goodCmds.length) {
    startFinalSequence();
    return;
  }

  if (badCmds[cmdIndex]) {
    await type(badCmds[cmdIndex]);
    await sleep(280);
    await del();
    await sleep(180);
  }

  await type(goodCmds[cmdIndex], 38);
  log(goodCmds[cmdIndex]);

  if (cmdIndex === 2) {
    hexDisplay.style.opacity = "0.9";
    setInterval(() => {
      const chars = "0123456789ABCDEF";
      let s = "";
      for (let i = 0; i < 120; i++) s += chars[Math.floor(Math.random() * 16)];
      hexDisplay.textContent = s.match(/.{8}/g).join("  ");
    }, 110);
  }

  cmdIndex++;
  await sleep(500 + Math.random() * 300);
  run();
}

function startFinalSequence() {
  const glyphs = "▓▒░│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αβγΔΘλπΣΩ";
  for (let i = 0; i < 60; i++) {
    const g = document.createElement('div');
    g.className = 'glyph';
    g.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    g.style.left = Math.random() * 100 + "%";
    g.style.top = Math.random() * 100 + "%";
    g.style.animationDelay = Math.random() * 1.5 + "s";
    g.style.animationDuration = (6 + Math.random() * 6) + "s";
    glyphsContainer.appendChild(g);
  }

  iceParticles.style.opacity = "1";
  iceParticles.style.animationPlayState = "running";
  shake.style.animationPlayState = "running";

  setTimeout(() => {
    finalBreach.classList.add("active");
    warning.classList +=" active";

    setTimeout(() => {
      blackout.style.opacity = "1";
      setTimeout(() => location.href = "index.html", 1800); 
    }, 2200); 
  }, 800);
}

// === SKIP INTRO BUTTON ===
document.getElementById('skip-btn').addEventListener('click', () => {
  document.getElementById('blackout').style.opacity = '1';
  setTimeout(() => location.href = "index.html", 800);
});

setTimeout(run, 900);