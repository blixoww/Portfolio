const output      = document.getElementById('output');
const typing      = document.getElementById('typing');
const terminal    = document.getElementById('netrunner-terminal');
const hexDisplay  = document.getElementById('daemon-hex');
const blackout    = document.getElementById('blackout');

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
      log("[+] SYSTEM COMPROMISED", true);
      await sleep(400);
      log("ACCESS GRANTED", true);
    
    // Terminal passe au vert
    terminal.classList.add('success');
    hexDisplay.style.opacity = "0.9";
    setInterval(() => {
      const chars = "0123456789ABCDEF";
      let s = ""; for (let i = 0; i < 64; i++) s += chars[Math.floor(Math.random() * 16)];
      hexDisplay.textContent = s.match(/.{8}/g).join("  ");
      hexDisplay.style.color = "#00ff00";
    }, 80);

    await sleep(3200);
    document.getElementById('blackout').style.opacity = "1";
    await sleep(1200);
    location.href = "index.html";
    return;
  }

  await type(commands[cmdIndex], 32);
  log(commands[cmdIndex]);
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